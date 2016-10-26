import Template from 'skin-template';

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
        let template = this.template;
        if (template && !this.hasOwnProperty('template')) {
            let Ctr = this.constructor;
            if (typeof template === 'string') {
                template = new Template(template);
                Object.defineProperty(Ctr.prototype, 'template', {
                    value: template,
                });
            }
            Object.defineProperty(this, 'template', {
                value: new Template(template).setScope(this),
            });
        }
        if (this.hasOwnProperty('template')) {
            this.render();
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
     * Update Component child nodes.
     */
    render() {
        let tpl = this.template;
        /* istanbul ignore else */
        if (tpl instanceof Template) {
            tpl.render(this);
        } else {
            throw new Error('Invalid template property.');
        }
    }
};
