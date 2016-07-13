import { DNAComponent } from './dna-component.js';
import { DNAProperty } from './helpers/dna-property.js';
import { templateRegistry, templateToNodes } from './helpers/template.js';

/**
 * @property {Boolean} autoUpdateView Should the Component auto update own view.
 * @private
 */
const AUTO_UPDATE_VIEW = true;

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
export class DNATemplateComponent extends DNAComponent {
    /**
     * Default `autoUpdateView` conf.
     */
    static get autoUpdateView() {
        return AUTO_UPDATE_VIEW;
    }
    /**
     * Fires when an instance of the element is created.
     */
    connectedCallback() {
        let ctr = this.constructor;
        if (ctr.hasOwnProperty('template')) {
            templateRegistry(this.is, ctr.template);
        }
        if (ctr && ctr.autoUpdateView) {
            DNAProperty.observe(this, function() {
                if (this.templateReady) {
                    this.render();
                }
            });
        }
        this.templateReady = true;
        this.render();
        super.connectedCallback();
    }
    /**
     * Update Component child nodes.
     * @param {*} content Optional result of a `render` of an extended class.
     * @return Promise The render promise.
     */
    render(content) {
        content = content || templateRegistry(this.is);
        content = templateToNodes(this, content);
        if (content !== null && content !== undefined) {
            if (Array.isArray(content)) {
                let oldChildren = DNAProperty.get(this, '__lastNode');
                if (oldChildren) {
                    if (oldChildren instanceof Node) {
                        oldChildren = [oldChildren];
                    }
                    for (let i = 0; i < oldChildren.length; i++) {
                        let oldChild = oldChildren[i];
                        if (oldChild.parentNode === this) {
                            this.removeChild(oldChild);
                        }
                    }
                }
                if (content instanceof Node) {
                    content = [content];
                }
                for (let i = 0; i < content.length; i++) {
                    this.appendChild(content[i]);
                }
                DNAProperty.set(this, '__lastNode', content, false);
            }
            return Promise.resolve();
        }
        return Promise.reject();
    }
}
