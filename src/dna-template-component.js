import { mix } from 'mixwith';
import { DNAComponent } from './dna-component.js';
import { DNAProperty } from './helpers/dna-property.js';

const READY_COMPONENTS = new WeakMap();

export const DNATemplateMixin = (SuperClass) => class extends SuperClass {
    constructor() {
        super();
        let Ctr = this.constructor;
        if (Ctr && Ctr.hasOwnProperty('template')) {
            DNAProperty.observe(this, () => {
                if (READY_COMPONENTS.get(Ctr)) {
                    this.render();
                }
            });
            READY_COMPONENTS.set(Ctr, true);
            this.render();
        }
    }
    /**
     * Update Component child nodes.
     * @param {*} content Optional result of a `render` of an extended class.
     * @return Promise The render promise.
     */
    render(content) {
        content = content || this.constructor.template;
        if (typeof content === 'function') {
            content = content.call(this);
        }
        if (typeof content === 'string') {
            this.innerHTML = content;
            return Promise.resolve();
        }
        return Promise.reject();
    }
};

/**
 * Simple Custom Component with template handling using the `template` property.
 * @class DNATemplateComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { DNATemplateComponent } from 'dna/component';
 * export class MyComponent extends DNATemplateComponent {
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
export class DNATemplateComponent extends mix(DNAComponent).with(DNATemplateMixin) {}
