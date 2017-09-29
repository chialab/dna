/**
 * DNA
 * (c) 2015-2017 Chialab (http://www.chialab.it) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Evolution-based components.
 */
import { mix, MIXINS } from './src/core.js';
import { registry } from './src/lib/registry.js';
import { proxy } from './src/lib/proxy.js';

/**
 * @namespace DNA
 */
export * from './src/core.js';
export { registry };
export { proxy };
export { bootstrap } from './src/lib/bootstrap.js';
export { define } from './src/lib/define.js';
export { render } from './src/lib/render.js';

const Component = proxy(class {});

/**
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
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
export class BaseComponent extends mix(Component).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin
) {
    constructor(node) {
        super();
        if (!node) {
            let desc = registry.get(this.is, true);
            let config = desc.config;
            node = document.createElement(
                config.extends ? config.extends : desc.is
            );
            if (config.extends) {
                node.setAttribute('is', desc.is);
            }
        }
        this.node = node;
    }
}
