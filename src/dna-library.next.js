'use strict';

import { DNAHelper } from './dna-helper.next.js';
import { DNABaseComponent } from './dna-base-component.next.js';

/**
 * Create and register a (Web) Component.
 * `document.registerElement`-like interface.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function Create(tagName, config = {}) {
    if (typeof tagName !== 'string') {
        throw 'Missing or bad typed `tagName` property';
    }
    let scope = config.prototype;
    if (typeof scope === 'undefined') {
        throw 'Missing prototype';
    } else if (typeof scope !== 'function') {
        let newScope = function() {};
        newScope.prototype = scope;
        scope = newScope;
    }
    let newScope = extend(scope, DNABaseComponent);
    for (let k in scope.prototype) {
        if (['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'].indexOf(k) !== -1) {
            newScope.prototype[k] = bindFN(newScope.prototype[k], DNABaseComponent.prototype[k]);
        }
    }
    Object.defineProperty(newScope, 'tagName', {
        configurable: true,
        get: function() {
            return tagName;
        }
    });

    config.tagName = tagName;

    return Register(newScope, config);
}

/**
 * Extend a component prototype.
 * @param {function|class|object} superScope The function or the prototype to extend.
 * @param {function|class|object} subScope The function or the prototype to merge.
 * @return {function} A new extended class.
 */
export function Extend(superScope, subScope) {
    superScope = (typeof superScope !== 'function') ? createClass(superScope) : superScope;
    subScope = (typeof subScope !== 'function') ? createClass(subScope) : subScope;
    return extend(subScope, superScope);
}

function createClass(prototype) {
    let fn = function() {};
    fn.prototype = prototype;
    return fn;
}

function getMethods(prototype) {
    let res = [];
    let added = ['name', 'length', 'prototype'];

    function createProp(key) {
        if (added.indexOf(key) === -1) {
            let prop = {
                key: key
            }
            if (typeof prototype[key] === 'function') {
                prop['value'] = prototype[key];
            } else {
                let descriptor = Object.getOwnPropertyDescriptor(prototype, key) || {};
                if (descriptor.get) {
                    prop['get'] = descriptor.get;
                    prop['set'] = descriptor.set;
                } else {
                    prop['value'] = prototype[key];
                }
            }
            added.push(key);
            return prop;
        }
    }

    for (let key in prototype) {
        let prop = createProp(key);
        if (prop) {
            res.push(prop);
        }
    }
    let keys = Object.getOwnPropertyNames(prototype);
    for (let k in keys) {
        let prop = createProp(keys[k]);
        if (prop) {
            res.push(prop);
        }
    }
    return res;
}

function extend(newClass, superClass) {
    let ctr = function() {
        getProtoProp(Object.getPrototypeOf(ctr.prototype), 'constructor', newClass).apply(newClass, arguments)
    }
    inherits(ctr, superClass);
    for (var k in superClass.prototype) {
        let descriptor = Object.getOwnPropertyDescriptor(superClass.prototype, k) || {};
        if (descriptor.get) {
            Object.defineProperty(ctr.prototype, k, {
                get: descriptor.get,
                set: descriptor.set,
                configurable: true
            });
        }
    }
    return createClass(ctr, getMethods(newClass.prototype), getMethods(newClass));
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
    return function() {
        protoFn.apply(this, arguments);
        superFn.apply(this, arguments);
    }
}

function inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(subClass, superClass)
        } else {
            subClass.__proto__ = superClass;
        }
    }
}

function getProtoProp(object, property, receiver) {
    if (object === null) {
        object = Function.prototype;
    }
    let desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        let parent = Object.getPrototypeOf(object);
        if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ('value' in desc) {
        return desc.value;
    } else {
        let getter = desc.get;
        if (getter === undefined) {
            return undefined;
        }
        return getter.call(receiver);
    }
};

/**
 * Wrap the [`DNAHelper.register`]{@link DNAHelper#register} method.
 */
export function Register(...args) {
    return DNAHelper.register(...args);
}
