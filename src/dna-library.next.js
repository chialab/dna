import { DNAHelper } from './dna-helper.next.js';
import { DNABaseComponent } from './dna-base-component.next.js';

function createFunctionClass(prototype) {
    let fn = function() {};
    fn.prototype = prototype;
    return fn;
}

function defineProperties(target, props) {
    let blacklistProps = ['arguments', 'caller'];
    for (let i = 0; i < props.length; i++) {
        let descriptor = props[i];
        if (blacklistProps.indexOf(descriptor.key) === -1) {
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) {
                descriptor.writable = true;
            }
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
}

function createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        defineProperties(Constructor.prototype, protoProps);
    }
    if (staticProps) {
        defineProperties(Constructor, staticProps);
    }
    return Constructor;
}

function bindFN(protoFn, superFn) {
    return function(...args) {
        protoFn.apply(this, args);
        superFn.apply(this, args);
    };
}

function inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError(
            `Super expression must either be null or a function, not ${typeof superClass}`
        );
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true,
        },
    });
    if (superClass) {
        Object.setPrototypeOf(subClass, superClass);
    }
}

function getMethods(prototype) {
    let res = [];
    let added = ['name', 'length', 'prototype', 'arguments', 'caller'];
    function createProp(propKey) {
        if (added.indexOf(propKey) === -1) {
            let prop = {
                key: propKey,
            };
            if (typeof prototype[propKey] === 'function') {
                prop.value = prototype[propKey];
            } else {
                let descriptor = Object.getOwnPropertyDescriptor(prototype, propKey) || {};
                if (descriptor.get) {
                    prop.get = descriptor.get;
                    prop.set = descriptor.set;
                } else {
                    prop.value = prototype[propKey];
                }
            }
            added.push(propKey);
            return prop;
        }
        return false;
    }
    for (let key in prototype) {
        if (Object.hasOwnProperty.call(prototype, key)) {
            let prop = createProp(key);
            if (prop) {
                res.push(prop);
            }
        }
    }
    let keys = Object.getOwnPropertyNames(prototype);
    for (let k in keys) {
        if (Object.hasOwnProperty.call(keys, k)) {
            let prop = createProp(keys[k]);
            if (prop) {
                res.push(prop);
            }
        }
    }
    return res;
}

function extend(newClass, superClass) {
    let _superClass = (typeof superClass !== 'function') ?
        createFunctionClass(superClass) :
        superClass;
    let _newClass = (typeof newClass !== 'function') ?
        createFunctionClass(newClass) :
        newClass;
    let ctr = function() {};
    inherits(ctr, _superClass);
    for (let k in _superClass.prototype) {
        if (Object.hasOwnProperty.call(superClass.prototype, k)) {
            let descriptor = Object.getOwnPropertyDescriptor(_superClass.prototype, k) || {};
            if (descriptor.get) {
                Object.defineProperty(ctr.prototype, k, {
                    get: descriptor.get,
                    set: descriptor.set,
                    configurable: true,
                });
            }
        }
    }
    return createClass(ctr, getMethods(_newClass.prototype), getMethods(newClass));
}

/**
 * Create and register a (Web) Component.
 * `document.registerElement`-like interface.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function Create(tagName, config = {}) {
    if (typeof tagName !== 'string') {
        throw new Error('Missing or bad typed `tagName` property');
    }
    let scope = config.prototype;
    if (typeof scope === 'undefined') {
        throw new Error('Missing prototype');
    }
    let newScope = extend(scope, DNABaseComponent);
    for (let k in scope.prototype) {
        if (Object.hasOwnProperty.call(scope.prototype, k)) {
            let callbacks = [
                'createdCallback',
                'attachedCallback',
                'detachedCallback',
                'attributeChangedCallback',
            ];
            if (callbacks.indexOf(k) !== -1) {
                newScope.prototype[k] = bindFN(
                    newScope.prototype[k],
                    DNABaseComponent.prototype[k]
                );
            }
        }
    }
    config.prototype = newScope;
    return DNAHelper.register(tagName, config);
}

/**
 * Extend a component prototype.
 * @param {function|class|object} superScope The function or the prototype to extend.
 * @param {function|class|object} subScope The function or the prototype to merge.
 * @return {function} A new extended class.
 */
export function Extend(superScope, subScope) {
    return extend(subScope, superScope);
}

/**
 * Wrap the [`DNAHelper.register`]{@link DNAHelper#register} method.
 */
export function Register(...args) {
    return DNAHelper.register(...args);
}
