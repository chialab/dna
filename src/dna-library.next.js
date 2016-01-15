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
        let newScope = function () {}
        newScope.prototype = scope;
        scope = newScope;
    }

    let inheritPrototype = Object.create(DNABaseComponent.prototype, {
        constructor: {
            value: scope,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    function bindFN(proto, k) {
        return function() {
            proto[k].apply(this, arguments);
            DNABaseComponent.prototype[k].apply(this, arguments);
        }
    }

    let proto = scope.prototype;
    Object.setPrototypeOf(scope, DNABaseComponent);
    scope.prototype = inheritPrototype;
    for (var k in proto) {
        if (['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'].indexOf(k) !== -1) {
            scope.prototype[k] = bindFN(proto, k);
        } else if (typeof proto[k] !== 'function') {
            let descriptor = Object.getOwnPropertyDescriptor(proto, k) || {};
            if (descriptor.get) {
                Object.defineProperty(scope.prototype, k, {
                    get: descriptor.get,
                    set: descriptor.set,
                    configurable: true
                });
            } else {
                scope.prototype[k] = proto[k];
            }
        } else {
            scope.prototype[k] = proto[k];
        }
    }

    Object.defineProperty(scope, 'tagName', {
        get: function () {
            return tagName
        }
    });

    config.tagName = tagName;

    return this.Register(scope, config);
}

/**
 * Wrap the [`DNAHelper.register`]{@link DNAHelper#register} method.
 */
export function Register(...args) {
    return DNAHelper.register(...args);
}
