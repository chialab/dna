import { DOM, customElements, defineProperties, defineListeners, isComponentConstructor } from '@chialab/dna';
import { warnCode } from './deprecations';

Object.defineProperty(customElements, 'components', {
    configurable: false,
    get() {
        return customElements.registry;
    },
});

customElements.get = function(tagName: string) {
    return customElements.registry[tagName];
};

customElements.define = function(name, constructor, options) {
    if (typeof constructor !== 'function') {
        throw new TypeError('The referenced constructor must be a constructor');
    }

    if (customElements.registry[name]) {
        throw new Error('The registry already contains an entry with the same name');
    }

    if (isComponentConstructor(constructor)) {
        defineProperties(constructor);
        defineListeners(constructor);
    }

    try {
        Object.defineProperty(constructor.prototype, 'is', {
            writable: false,
            configurable: false,
            value: name,
        });
    } catch {
        throw new Error('The registry already contains an entry with the constructor (or is otherwise already defined)');
    }

    let tagName = options && options.extends || name;
    if (tagName !== name && !(constructor.prototype instanceof DOM.createElement(tagName).constructor)) {
        warnCode('EXTEND_BUILTIN');
    }
    customElements.registry[name] = constructor;
    customElements.tagNames[name] = tagName.toLowerCase();

    const queue = customElements.queue;
    if (queue[name]) {
        queue[name].forEach((resolve) => resolve());
    }
};

export const registry = customElements;

export const get = (tagName: string) => {
    warnCode('USE_REGISTRY');
    return registry.get(tagName);
};

export const define = (tagName: string, constructor: any, options: ElementDefinitionOptions) => {
    warnCode('USE_REGISTRY');
    return registry.define(tagName, constructor, options);
};
