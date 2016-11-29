/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements specs.
 */
import { mix, DOM, MIXINS } from './src/core.js';
import { registry } from './src/lib/registry.js';

/**
 * @namespace DNA
 */
export * from './src/core.js';
export { registry };

/**
 * Register a new component.
 * @method define
 * @memberof! DNA.
 * @static
 *
 * @param {String} name The id of the component.
 * @param {Function} Ctr The component constructor.
 * @param {Object} config Optional component configuration.
 */
export function define(tagName, Component, config) {
    Object.defineProperty(Component.prototype, 'is', {
        get: () => tagName,
    });
    return registry.define(tagName, Component, config);
}
/**
 * Create and append a new component instance.
 * @method render
 * @memberof! DNA.
 * @static
 *
 * @param {HTMLElement} node The parent node.
 * @param {Function} Component The component constructor.
 * @param {Object} props Optional set of properties to set to the component.
 * @return {HTMLElement} The new component instance.
 */
export function render(node, Component, props) {
    let element = new Component();
    for (let k in props) {
        element[k] = props[k];
    }
    DOM.appendChild(node, element);
    return element;
}

/**
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
 * @extends HTMLElement
 * @memberof DNA.
 * @static
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   static get observedAttributes() {
 *     return ['...', '...'];
 *   }
 *   get css() {
 *     return '...';
 *   }
 *   get events() {
 *     return {
 *       '...': '...'
 *     };
 *   }
 *   get template() {
 *     return '...';
 *   }
 *   get properties() {
 *     return { ... };
 *   }
 * }
 * ```
 */
export class BaseComponent extends mix().with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin
) {
    constructor() {
        super();
        let desc = registry.getDescriptor(this.constructor);
        let config = desc.config;
        this.node = document.createElement(
            config.extends ? config.extends : desc.is
        );
        if (config.extends) {
            this.node.setAttribute('is', desc.is);
        }
    }
}
