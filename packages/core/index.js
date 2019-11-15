/**
 * DNA
 * (c) 2015-2019 Chialab (https://www.chialab.it) <dev@chialab.io>
 * http://chialab.io/p/dna
 *
 * Evolution-based components.
 */

import { mix } from '@chialab/proteins';
import { MIXINS } from './src/mixins/index.js';
import { registry } from './src/lib/registry.js';
import { proxy } from './src/lib/proxy.js';

/**
 * @module DNA
 */

export { mix, MIXINS, registry, proxy };
export { DNA_SYMBOL, COMPONENT_SYMBOL, NODE_SYMBOL, STYLE_SYMBOL, CONNECTED_SYMBOL } from './src/lib/symbols.js';
export { default as DOM } from './src/lib/dom.js';
export { namespace } from './src/lib/namespace.js';
export { prop } from './src/lib/property.js';
export { render } from './src/lib/render.js';
export { bootstrap } from './src/lib/bootstrap.js';
export { define } from './src/lib/define.js';
export { scopeStyle } from './src/lib/scope-style.js';

/**
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
 * @memberof DNA
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
export class BaseComponent extends mix(proxy(class {})).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin
) {}
