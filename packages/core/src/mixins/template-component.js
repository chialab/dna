import { isUndefined, isFunction, isFalsy } from '@chialab/proteins';

/**
 * Simple Custom Component with template handling using the `template` property.
 * @memberof DNA.MIXINS
 * @mixin TemplateMixin
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
     * Render the component when connected.
     * @method connectedCallback
     * @memberof DNA.MIXINS.TemplateMixin
     * @instance
     */
    connectedCallback() {
        super.connectedCallback();
        if (!isFalsy(this.template)) {
            this.render();
        }
    }
    /**
     * Trigger rerender on property changes.
     * @method propertyChangedCallback
     * @memberof DNA.MIXINS.TemplateMixin
     * @instance
     */
    propertyChangedCallback(propName, oldValue, newValue) {
        super.propertyChangedCallback(propName, oldValue, newValue);
        if (!isFalsy(this.template)) {
            this.render();
        }
    }
    /**
     * Update Component child nodes.
     * @method render
     * @memberof DNA.MIXINS.TemplateMixin
     * @instance
     *
     * @param {Function|*} tpl A template to use instead of `this.template`.
     */
    render(tpl) {
        tpl = tpl || this.template;
        if (isFunction(tpl)) {
            return tpl.call(this);
        }
        let root = this.shadowRoot || this;
        if (isUndefined(this.__innerHTML)) {
            this.__innerHTML = root.innerHTML;
        }
        root.innerHTML = `${this.__innerHTML}${tpl}`;
    }
};
