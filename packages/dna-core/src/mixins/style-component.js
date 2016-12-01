import { define } from '../lib/obj-define.js';
import { reduceProperty } from '../lib/reduce.js';
import { isString } from '../lib/typeof.js';
import { STYLE_SYMBOL } from '../lib/symbols.js';

const HOST_REGEX = /(\:host)(\([^)]*\))?/g;
const CSS_RULES_REGEX = /(#|\.|\@|\[|[a-zA-Z]|\:)([^{\;\}]*){/g;
const SEPARATOR_REGEX = /\,\s*/;
const rootDoc = document;

/**
 * Get the owner document for a node.
 * @private
 *
 * @param {HTMLElement} node A node.
 * @return {DocumentFragment} The node document parent.
 */
function ownerDocument(node) {
    return node.ownerDocument || rootDoc;
}

/**
 * Create and attach a style element for a component.
 * @private
 *
 * @param {HTMLElement} node A component instance.
 * @return {HTMLElement} The created style element.
 */
function createStyle(node) {
    let styleElem = ownerDocument(node).createElement('style');
    styleElem.id = `style-${node.is}`;
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
        .replace(CSS_RULES_REGEX, (fullMatch) => {
            let rules = fullMatch
                .slice(0, -1)
                .split(SEPARATOR_REGEX)
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
            return `${rules}{`;
        });
}

function updateCSS(element) {
    let style = element.css;
    if (isString(style)) {
        if (element.node.shadowRoot) {
            element[STYLE_SYMBOL].textContent = style;
        } else {
            element.constructor[STYLE_SYMBOL].textContent = convertShadowCSS(style, element.is);
        }
    }
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
    connectedCallback() {
        super.connectedCallback();
        let css = reduceProperty(this, 'css')
            .filter((protoCSS) => isString(protoCSS))
            .join('\n');
        define(this, 'css', { value: css });
        if (css) {
            if (this.node.shadowRoot) {
                if (!this[STYLE_SYMBOL]) {
                    let style = this[STYLE_SYMBOL] = createStyle(this.node);
                    this.node.shadowRoot.appendChild(style);
                }
                updateCSS(this);
            } else if (!this.constructor[STYLE_SYMBOL]) {
                let style = this.constructor[STYLE_SYMBOL] = createStyle(this.node);
                ownerDocument(this.node).head.appendChild(style);
                updateCSS(this);
            }
        }
        this.node.classList.add(this.is);
    }
};
