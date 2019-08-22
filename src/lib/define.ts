import { CustomElement } from './CustomElement';
import { DOM } from './dom';
import { has, set } from './registry';

/**
 * Define a new Custom Element.
 *
 * @param name The tag name for the element.
 * @param constructor The Custom Element constructor.
 * @param options A set of definition options, like `extends` for native tag extension.
 */
export function define(name: string, constructor: CustomElement, options: { extends?: string; } = {}) {
    if (typeof name !== 'string') {
        throw new TypeError('the name provided is not a string');
    }

    if (typeof constructor !== 'function') {
        throw new TypeError('the constructor provided is not a class');
    }

    name = name.toLowerCase();

    if (has(name)) {
        throw new Error(`"${name}" tag has already been defined`);
    }

    if (!(constructor.prototype instanceof DOM.HTMLElement)) {
        throw new TypeError('constructor does not extends HTMLElement');
    }

    try {
        Object.defineProperty(constructor.prototype, 'is', {
            writable: false,
            configurable: false,
            value: name,
        });
    } catch {
        throw new Error('constructor has already been defined');
    }

    set(name, constructor, {
        extends: options.extends && options.extends.toLowerCase(),
    });
}
