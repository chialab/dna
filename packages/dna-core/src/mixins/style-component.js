import { define } from '../helpers/obj-define.js';
import { reduceProperty } from '../lib/reduce.js';
import { isString } from '../lib/typeof.js';
import { STYLE_SYMBOL } from '../lib/symbols.js';

/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /(\:host)(\(([^(]+(\([^)]*\))?)+\))?/g;
/**
 * A regex to match css blocks.
 * @type {RegExp}
 * @private
 */
const CSS_BLOCKS = /(#|\.|\@|\[|[a-zA-Z]|\:)([^{\;\}\/]*)({({(.|\n)*?}|.|\n)*?})/g;
/**
 * A regex to match css rules in block.
 * @type {RegExp}
 * @private
 */
const CSS_RULES = /[^{]*{/;
/**
 * A regex to split css rules.
 * @type {RegExp}
 * @private
 */
const SEPARATOR_REGEX = /\,\s*/;
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
 * Convert a shadowDOM css string into a normal scoped css.
 * @private
 *
 * @param {String} css The css string to convert.
 * @param {String} is The component name for scoping.
 * @return {String} The converted string.
 */
function convertShadowCSS(css, is) {
    const scope = `.${is}`;
    return css
        // split blocks
        .replace(CSS_BLOCKS, (fullMatch) =>
            fullMatch
                // get rules
                .replace(CSS_RULES, (chunk) => {
                    /* istanbul ignore if  */
                    if (chunk[0] === '@') {
                        return chunk;
                    }
                    // split rules
                    return chunk.split(SEPARATOR_REGEX)
                        .map((rule) => {
                            if (rule.indexOf(':host') === 0) {
                                return rule.replace(HOST_REGEX, (fullMatch, host, state) => {
                                    state = state ? state.slice(1, -1) : '';
                                    return `${scope}${state}`;
                                });
                            } else {
                                return `${scope} ${rule}`;
                            }
                        })
                        .join(', ');
                })
        );
}

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @mixin StyleMixin
 * @memberof DNA.MIXINS
 * @static
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
                    this.shadowRoot.appendChild(style);
                    style.textContent = this.css;
                }
            } else if (!this.constructor[STYLE_SYMBOL]) {
                let style = this.constructor[STYLE_SYMBOL] = createStyle(this);
                ownerDocument(this.node).head.appendChild(style);
                style.textContent = convertShadowCSS(this.css, this.is);
            }
        }
        this.classList.add(this.is);
    }
};
