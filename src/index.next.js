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

export function Create(options = {}) {
    let proto = options.prototype || {};
    if (typeof options.tagName !== 'string') {
        throw 'Missing or bad typed `tagName` property';
    }
    let scope = function () {};
    scope.prototype = Object.create(DNABaseComponent.prototype, {
        constructor: {
            value: scope,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    Object.setPrototypeOf(scope, DNABaseComponent);
    for (var k in proto) {
        scope.prototype[k] = proto[k];
    }
    return this.register(scope, { tagName: options.tagName });
}

export function Register(...args) {
    return DNAHelper.register(...args);
}

export { DNABaseComponent };
