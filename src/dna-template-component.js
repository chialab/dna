import { mix } from 'mixwith';
import { Template } from 'skin-template/src/template.js';
import { Component } from './dna-component.js';

export const TemplateMixin = (SuperClass) => class extends SuperClass {
    constructor() {
        super();
        if (this.template) {
            this.observeProperties(() => {
                this.render();
            });
            this.render();
        }
    }
    /**
     * Update Component child nodes.
     * @return Promise The render promise.
     */
    render() {
        let tpl = this.template;
        if (tpl instanceof Template) {
            tpl.render(this);
        } else {
            throw new Error('Invalid template property.');
        }
    }
};

/**
 * Simple Custom Component with template handling using the `template` property.
 * @class TemplateComponent
 * @extends Component
 *
 * @example
 * my-component.js
 * ```js
 * import { TemplateComponent } from 'dna/component';
 * export class MyComponent extends TemplateComponent {
 *   static get template() {
 *     return `<h1>${this.name}</h1>`;
 *   }
 *   get name() {
 *     return 'Newton';
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = register('my-component', MyComponent);
 * var element = new MyElement();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export class TemplateComponent extends mix(Component).with(TemplateMixin) {}
