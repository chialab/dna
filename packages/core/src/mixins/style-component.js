import { define } from '../helpers/obj-define.js';
import { reduceProperty } from '../lib/reduce.js';
import { isString } from '../lib/typeof.js';
import { convertShadowCSS } from '../lib/shadow-css.js';
import { STYLE_SYMBOL } from '../lib/symbols.js';

/**
 * The root document element.
 * @type {DocumentFragment}
 * @private
 */
const ROOT_DOC = document;

/**
 * Get the owner document for a node.
 * @private
 *
 * @param {HTMLElement} node A node.
 * @return {DocumentFragment} The node document parent.
 */
function ownerDocument(node) {
    return node.ownerDocument || ROOT_DOC;
}
/**
 * Create and attach a style element for a component.
 * @private
 *
 * @param {Object} component A component instance.
 * @return {HTMLElement} The created style element.
 */
function createStyle(component) {
    let styleElem = ownerDocument(component.node).createElement('style');
    styleElem.id = `style-${component.is}`;
    return styleElem;
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
    constructor(node) {
        super(node);
        let css = reduceProperty(this, 'css')
            .filter((protoCSS) => isString(protoCSS))
            .join('\n');
        if (css) {
            define(this, 'css', { value: css });
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
                    let style = this[STYLE_SYMBOL] = createStyle(this);
                    style.textContent = this.css;
                    this.shadowRoot.appendChild(style);
                }
            } else if (!this.constructor.hasOwnProperty(STYLE_SYMBOL)) {
                let style = this.constructor[STYLE_SYMBOL] = createStyle(this);
                style.textContent = this.css;
                ownerDocument(this.node).head.appendChild(style);
                convertShadowCSS(style, this.is);
            }
        }
        this.classList.add(this.is);
    }
};
