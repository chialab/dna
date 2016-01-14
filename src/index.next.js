/**
 * Copyright (c) 2015 Chialab s.r.l. & Channelweb s.r.l.
 * All rights reserved.
 *
 * Write your set of (Web) Components using ES2015, templates and (optionally) Sass.
 */

import 'dna/polyfills';

import { DNAHelper } from './dna-helper.next.js';
export * from './dna-component.next.js';
export * from './dna-attributes-component.next.js';
export * from './dna-event-component.next.js';
export * from './dna-mixed-component.next.js';
export * from './dna-style-component.next.js';
export * from './dna-template-component.next.js';
import { DNABaseComponent } from './dna-base-component.next.js';
import { DNAConfig as Config } from './dna-config.next.js';

export function Create(tagName, options = {}) {
    if (typeof tagName !== 'string') {
        throw 'Missing or bad typed `tagName` property';
    }
    let scope = options.prototype;
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
        } else if (typeof k !== 'function') {
            let descriptor = Object.getOwnPropertyDescriptor(proto, k);
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

    return this.Register(scope, { tagName: tagName });
}

export function Register(...args) {
    return DNAHelper.register(...args);
}

export { Config, DNABaseComponent };
