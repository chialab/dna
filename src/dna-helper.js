/**
 * Handle objects private properties using a WeakMap.
 * @class DNAProperty
 *
 * @example
 * ```js
 * let node = document.getElementById('main');
 * DNAProperty.observe(node, 'firstName', () => { console.log('property changed!!!') });
 * DNAProperty.set(node, 'firstName', 'Alan'); // logs 'property changed!!!'
 * DNAProperty.get(node, 'firstName'); // 'Alan'
 * node.firstName // undefined
 * ```
 */
export class DNAProperty {
    /**
     * @private
     */
    static get GENERIC_OBSERVER() {
        return '-1';
    }
    /**
     * Retrieve object property.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @return {*} the property value.
     */
    static get(obj, key) {
        let map = DNAProperty.map.get(obj) || {};
        return map[key];
    }
    /**
     * Set object property.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {*} value The new property value.
     * @param {boolean} trigger Should trigger changed callbacks.
     * @return {*} The property value.
     */
    static set(obj, key, value, trigger = true) {
        let map = DNAProperty.map.get(obj) || {};
        let oldValue = map[key];
        if (oldValue !== value) {
            map[key] = value;
            DNAProperty.map.set(obj, map);
            if (trigger) {
                this.changed(obj, key, oldValue, value);
            }
        }
        return obj[key];
    }
    /**
     * Remove object property.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {boolean} trigger Should trigger changed callbacks.
     */
    static delete(obj, key, trigger = true) {
        let map = DNAProperty.map.get(obj) || {};
        if (map.hasOwnProperty(key)) {
            let oldValue = map[key];
            delete map[key];
            DNAProperty.map.set(obj, map);
            if (trigger) {
                this.changed(obj, key, oldValue, undefined);
            }
        }
    }
    /**
     * Create a listener for the property or for the object.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {Function} callback The callback to fire.
     * @return {Object} An object with `cancel` method.
     */
    static observe(obj, key, callback) {
        if (typeof key === 'function') {
            callback = key;
            key = DNAProperty.GENERIC_OBSERVER;
        }
        let callbacks = DNAProperty.callbacks.get(obj) || {};
        callbacks[key] = callbacks[key] || [];
        callbacks[key].push(callback);
        DNAProperty.callbacks.set(obj, callbacks);
        let index = callbacks[key].length - 1;
        return {
            cancel() {
                callbacks[key] = callbacks[key] || [];
                callbacks[key][index] = null;
                DNAProperty.callbacks.set(obj, callbacks);
            },
        };
    }
    /**
     * Trigger object callbaks.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {*} oldValue The previous property value.
     * @param {*} newValue The current property value.
     */
    static changed(obj, key, oldValue, newValue) {
        let callbacks = DNAProperty.callbacks.get(obj) || {};
        let res = (callbacks[key] || []).some((clb) =>
            typeof clb === 'function' && clb.call(obj, key, oldValue, newValue) === false
        );
        if (!res) {
            (callbacks[DNAProperty.GENERIC_OBSERVER] || []).some((clb) =>
                typeof clb === 'function' && clb.call(obj, key, oldValue, newValue) === false
            );
        }
    }
}

DNAProperty.map = new WeakMap();
DNAProperty.callbacks = new WeakMap();

/**
 * Convert a Class name into HTML tag.
 * @param {Class} fn Grab the tag name from this class.
 * @return {String} The tag name for the Custom Element.
 */
export function classToElement(fn) {
    let name;
    if (fn.name) {
        name = fn.name
            .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
            .replace(/^\-/, '');
    }
    return name;
}
/**
 * Get an element's property descriptor.
 * @param {Function} ctr The element constructor.
 * @param {string} prop The property to analyze.
 * @return {object} The descriptor of the property.
 */
export function getDescriptor(ctr, prop) {
    let res;
    if (ctr) {
        res = Object.getOwnPropertyDescriptor(ctr, prop);
        let proto = Object.getPrototypeOf(ctr);
        if (!res && proto) {
            res = getDescriptor(proto, prop);
        }
    }
    return res;
}
/**
 * Wrap a property descriptor get function or create a new one.
 * @param {string} prop The property to wrap.
 * @param {object} descriptor The property descriptor.
 * @param {*} value The initial value.
 * @return {Function} The descriptor get function wrapped.
 */
export function wrapDescriptorGet(prop, descriptor, value) {
    let hasGetter = typeof descriptor.get === 'function';
    let getter = function() {
        let res;
        if (hasGetter) {
            res = descriptor.get.call(this);
        } else {
            res = DNAProperty.get(this, prop);
        }
        return typeof res !== 'undefined' ? res : value;
    };
    return getter;
}
/**
 * Wrap a property descriptor set function or create a new one.
 * @param {string} prop The property to wrap.
 * @param {object} descriptor The property descriptor.
 * @param {Function} callback An optional callback to trigger on set.
 * @return {Function} The descriptor set function wrapped.
 */
export function wrapDescriptorSet(prop, descriptor, callback) {
    if (descriptor && descriptor.set && descriptor.set.callbacks) {
        descriptor.set.callbacks.push(callback);
        return descriptor.set;
    }
    let setter = function(value) {
        if (descriptor.set) {
            descriptor.set.call(this, value);
        } else {
            DNAProperty.set(this, prop, value);
        }
        let res = this[prop];
        setter.callbacks.forEach((clb) => {
            if (typeof clb === 'function') {
                clb.call(this, prop, res);
            }
        });
        return res;
    };
    setter.callbacks = [callback];
    return setter;
}
/**
 * Convert a string from camelCase to dash-case.
 * @param {string} str The string to convert.
 * @return {string} The converted string.
 */
export function camelToDash(str) {
    return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}
/**
 * Convert a string from dash-case to camelCase.
 * @param {string} str The string to convert.
 * @return {string} The converted string.
 */
export function dashToCamel(str) {
    return str.replace(/\W+(.)/g, (x, chr) => chr.toUpperCase());
}
/**
 * Normalize the `register` method arguments.
 * @param {Function|String} fn The definition or the tag name of the Custom Element.
 * @param {Object|Function} options A set of options or the Component class
                                    for the registration of the Custom Element.
 * @return {Object} A descriptor of the component with `tagName`, `config` and `scope` keys.
 */
export function digest(fn, options = {}) {
    let scope;
    let config = {};
    let tagName;
    if (typeof fn === 'string') {
        tagName = fn;
        if (typeof options === 'function') {
            scope = options;
            config = {};
        } else {
            if (typeof options === 'object') {
                config = options;
            }
            if (typeof config.prototype !== 'undefined') {
                scope = config.prototype;
            }
        }
    } else {
        scope = fn;
        if (typeof options === 'object') {
            config = options;
        }
    }
    if (typeof scope === 'function') {
        tagName = (
            tagName ||
            config.tagName ||
            (scope.hasOwnProperty('tagName') && scope.tagName) ||
            classToElement(scope)
        );
        config.prototype = scope.prototype;
        if (!config.extends && typeof scope.extends === 'string') {
            config.extends = scope.extends;
        }
    } else if (typeof scope === 'object') {
        config.prototype = scope;
        scope = function(...args) {
            config.prototype.constructor.apply(this, args);
        };
        scope.prototype = config.prototype;
    }
    if (config.prototype) {
        config.prototype = Object.create(config.prototype);
    }
    return {
        tagName,
        config,
        scope,
    };
}

/**
 * Wrap prototype properties in top-level element.
 * @param {Object} main The top-level element which needs the prototype properties.
 * @param {Object} currentProto The current prototype to analyze.
 * @param {Boolean} includeFunctions Should deine methods too.
 * @param {Function} callback A setter callback for the property (optional).
 */
export function wrapPrototype(main, currentProto, includeFunctions = true, callback, handled = []) {
    Object.getOwnPropertyNames(currentProto)
        .forEach((prop) => {
            let descriptor = Object.getOwnPropertyDescriptor(currentProto, prop) || {};
            let isFunction = typeof descriptor.value === 'function';
            if (handled.indexOf(prop) === -1) {
                if (typeof descriptor.value === 'undefined' || !isFunction) {
                    handled.push(prop);
                    if (descriptor.configurable !== false) {
                        Object.defineProperty(main, prop, {
                            configurable: true,
                            get: wrapDescriptorGet(prop, descriptor, descriptor.value),
                            set: wrapDescriptorSet(prop, descriptor, callback),
                        });
                    }
                } else if (isFunction && includeFunctions) {
                    handled.push(prop);
                    Object.defineProperty(main, prop, descriptor);
                }
            }
        });
    let nextProto = currentProto.prototype || Object.getPrototypeOf(currentProto);
    if (nextProto && nextProto !== HTMLElement.prototype) {
        wrapPrototype(main, nextProto, includeFunctions, callback, handled);
    }
}

/**
 * A list of registered DNA components.
 * @type {Object}.
 */
const REGISTRY = {};

/**
 * Add/retrieve an entry to/from the DNA registry.
 * @param {String} tagName The tag name of the Component.
 * @param {Function} constructor The Component constructor.
 * @return {Function} The Component constructor.
 */
export function registry(tagName, constructor) {
    if (tagName) {
        let lower = tagName.toLowerCase();
        if (constructor) {
            REGISTRY[lower] = constructor;
        }
        return REGISTRY[lower];
    }
    return null;
}

/**
 * Trigger `onRegister` callbacks.
 * @param {Function|String} tagName The definition or the tag name of the Component.
 * @param {Object} options A set of options for the registration of the Component.
 * @return {Function} The Component constructor.
 */
export function register(fn, options = {}) {
    let pre = digest(fn, options);
    let scope = pre.scope;
    let tagName = pre.tagName;
    let config = pre.config;
    if (typeof scope.onRegister === 'function') {
        scope.onRegister.call(scope, tagName);
    }
    let res = function(element) {
        element = element || document.createElement(config.extends ? config.extends : tagName);
        wrapPrototype(element, scope.prototype);
        Object.defineProperty(element, 'is', {
            configurable: false,
            get: () => tagName,
        });
        element.createdCallback();
        return element;
    };
    Object.defineProperty(res.prototype, 'constructor', {
        configurable: false,
        get: () => scope,
    });
    registry(tagName, scope);
    return res;
}

/**
 * A list of template for DNA components.
 * @type {Object}.
 */
const TEMPLATE_REGISTRY = {};

export function templateRegistry(is, template) {
    if (typeof template !== 'undefined') {
        TEMPLATE_REGISTRY[is] = template;
    }
    return TEMPLATE_REGISTRY[is];
}

export function templateToNodes(scope, content) {
    if (typeof content === 'function') {
        content = content.call(scope);
    }
    if (typeof content === 'string') {
        content = content.replace(/[\n\r\t]/g, '').replace(/\s+/g, ' ');
        let parser = new DOMParser();
        let doc = parser.parseFromString(
            content,
            'text/html'
        );
        content = doc.body && doc.body.childNodes;
    }
    if (content instanceof Node) {
        if (content.tagName === 'TEMPLATE') {
            if (typeof document.importNode !== 'function' ||
                typeof HTMLTemplateElement === 'undefined') {
                throw new Error('Template element is not supported by the browser');
            }
            let doc = document.createDocumentFragment();
            let nodes = document.importNode(content.content, true);
            doc.appendChild(nodes);
            content = doc.childNodes;
        } else {
            content = [content];
        }
    }
    if (content instanceof NodeList) {
        content = Array.prototype.slice.call(content, 0);
    }
    return content;
}
