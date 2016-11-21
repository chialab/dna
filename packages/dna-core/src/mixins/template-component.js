import { isFunction, isString } from '../lib/typeof.js';

/**
 * Simple Custom Component with template handling using the `template` property.
 *
 * @example
 * my-component.js
 * ```js
 * import { Component, TemplateMixin, mix } from 'dna/component';
 * export class MyComponent extends mix(Component).with(TemplateMixin) {
 *   get template() {
 *     return '<h1>${this.name}</h1>';
 *   }
 *   get name() {
 *     return 'Newton';
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { define } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export const TemplateMixin = (SuperClass) => class extends SuperClass {
    constructor() {
        super();
        if (this.template) {
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
    connectedCallback() {
        super.connectedCallback();
        let proto = this.constructor.prototype;
        if (this.template) {
            this.render();
        }
    }
    /**
     * Update Component child nodes.
     */
    render(tpl) {
        tpl = tpl || this.template;
        /* istanbul ignore else */
        if (isFunction(tpl)) {
            tpl();
        } else if (isString(tpl)) {
            this.innerHTML = tpl;
        } else {
            throw new Error('Invalid template property.');
        }
    }
};
