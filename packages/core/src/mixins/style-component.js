import { isString } from '@chialab/proteins';
import DOM from '../lib/dom.js';
import { reduceProperty } from '../lib/reduce.js';
import { scopeStyle, HOST_REGEX } from '../lib/scope-style.js';
import { STYLE_SYMBOL } from '../lib/symbols.js';

/**
 * Get the owner document for a node.
 * @private
 *
 * @param {HTMLElement} node A node.
 * @return {DocumentFragment} The node document parent.
 */
function ownerDocument(node) {
    return node.ownerDocument || document;
}

const doc = document.implementation.createHTMLDocument('');

/**
 * Convert a shadowDOM style CSS string into a normal scoped css.
 * @private
 *
 * @param {String} css The style CSS to convert.
 * @param {String} is The component name for scoping.
 * @return {HTMLStyleElement} The scoped css.
 */
function convertShadowCSS(css, is) {
    let style = doc.createElement('style');
    let scope = `.${is}`;
    style.textContent = css.replace(HOST_REGEX, (fullMatch, mod) => `${scope}${(mod || '').slice(1, -1)}`);
    doc.body.appendChild(style);
    scopeStyle(style, scope);
    doc.body.removeChild(style);
    return style;
}

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @mixin StyleMixin
 * @memberof DNA.MIXINS
 *
 * @param {Function} SuperClass The class to extend.
 * @return {Function} The extended class.
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get css() {
 *     return 'p { color: red; }'
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * var p = document.createElement('p');
 * p.innerText = 'Paragraph';
 * element.appendChild(p); // text inside `p` gets the red color
 * ```
 */
export const StyleMixin = (SuperClass) => class extends SuperClass {
    /**
     * Inherit all css properties.
     * @method constructor
     * @memberof DNA.MIXINS.StyleMixin
     * @instance
     */
    constructor(...args) {
        super(...args);
        let css = reduceProperty(this, 'css')
            .filter((protoCSS) => isString(protoCSS))
            .join('\n');
        if (css) {
            Object.defineProperty(this, 'css', { value: css });
        }
    }
    /**
     * Create or update a style element for a component.
     * @method connectedCallback
     * @memberof DNA.MIXINS.StyleMixin
     * @instance
     */
    connectedCallback() {
        super.connectedCallback();
        if (isString(this.css)) {
            if (this.shadowRoot) {
                if (!this[STYLE_SYMBOL]) {
                    let style = this[STYLE_SYMBOL] = DOM.createElement('style');
                    style.textContent = this.css;
                    this.shadowRoot.appendChild(style);
                }
            } else if (!this.constructor.hasOwnProperty(STYLE_SYMBOL)) {
                let style = convertShadowCSS(this.css, this.is);
                style.id = `style-${this.is}`;
                this.constructor[STYLE_SYMBOL] = style;
                ownerDocument(this.node).head.appendChild(style);
            }
        }
        this.classList.add(this.is);
    }
};
