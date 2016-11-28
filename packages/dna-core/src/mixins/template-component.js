import { isUndefined, isFunction, isString } from '../lib/typeof.js';

/**
 * Simple Custom Component with template handling using the `template` property.
 * @memberof DNA.MIXINS
 * @mixin TemplateMixin
 * @static
 *
 * @param {Function} SuperClass The class to extend.
 * @return {Function} The extended class.
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get template() {
 *     return `<h1>${this.name}</h1>`;
 *   }
 *   get name() {
 *     return 'Newton';
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export const TemplateMixin = (SuperClass) => class extends SuperClass {
    /**
     * @property {Boolean} autoRender Should the component re-render on properties changes.
     * @name autoRender
     * @type {Boolean}
     * @memberof DNA.MIXINS.TemplateMixin
     * @instance
     */
    get autoRender() {
        return true;
    }
    /**
     * Attach properties observers in order to update children.
     * @method constructor
     * @memberof DNA.MIXINS.TemplateMixin
     * @instance
     */
    constructor() {
        super();
        if (this.autoRender && !isUndefined(this.template)) {
            let props = this.properties;
            if (props) {
                let callback = () => {
                    this.render();
                };
                for (let k in props) {
                    props[k].observe(callback);
                }
            }
        }
    }
    /**
     * Render the component when connected.
     * @method connectedCallback
     * @memberof DNA.MIXINS.TemplateMixin
     * @instance
     */
    connectedCallback() {
        super.connectedCallback();
        if (!isUndefined(this.template)) {
            this.render();
        }
    }
    /**
     * Update Component child nodes.
     * @method render
     * @memberof DNA.MIXINS.TemplateMixin
     * @instance
     *
     * @param {Function|string} tpl A template to use instead of `this.template`.
     *
     * @throws {TypeError} Will throw if the template type is not supported.
     */
    render(tpl) {
        tpl = tpl || this.template;
        if (isFunction(tpl)) {
            tpl.call(this);
        } else if (isString(tpl)) {
            (this.shadowRoot || this.node).innerHTML = tpl;
        } else {
            throw new TypeError('Invalid template property.');
        }
    }
};
