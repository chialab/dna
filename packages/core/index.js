/**
 * DNA
 * (c) 2015-2017 Chialab (http://www.chialab.it) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Evolution-based components.
 */

/**
 * @module DNA
 */
export * from './src/core.js';

import { mix } from './src/core.js';
import { MIXINS } from './src/mixins/index.js';
import { registry } from './src/lib/registry.js';
import { proxy } from './src/lib/proxy.js';

export { MIXINS };
export { registry };
export { proxy };
export { bootstrap } from './src/lib/bootstrap.js';
export { define } from './src/lib/define.js';
export { render } from './src/lib/render.js';
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
