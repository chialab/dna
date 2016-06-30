import * as Config from './dna-config.js';
import { DNAComponent } from './dna-component.js';
import { wrapPrototype, registry } from './dna-helper.js';

const TEMPLATE_CACHE = {};

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
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = Register(MyComponent);
 * var element = new MyElement();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export class DNATemplateComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     * @param {String} id The element definition name.
     */
    static onRegister(is) {
        if (this.hasOwnProperty('template')) {
            TEMPLATE_CACHE[is] = this.template;
        }
    }
    /**
     * Default `autoUpdateView` conf.
     */
    static get autoUpdateView() {
        return Config.autoUpdateView;
    }
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        let ctr = registry(this.is);
        if (ctr && ctr.autoUpdateView) {
            let proto = ctr.prototype;
            wrapPrototype(this, proto, false, function() {
                if (this.templateReady) {
                    this.updateViewContent();
                }
            });
        }
        super.createdCallback();
        this.templateReady = true;
        this.updateViewContent();
    }
    /**
     * Generate view content.
     */
    getViewContent(html) {
        if (typeof this.render === 'function') {
            html = html || this.render();
            if (html !== null && html !== undefined) {
                if (html instanceof Node || html instanceof DocumentFragment) {
                    let box = document.createElement('div');
                    box.appendChild(html);
                    html = box.innerHTML;
                }
                html = html.replace(/[\n\r\t]/g, '').replace(/\s+/g, ' ');
            }
        }
        return html || null;
    }
    /**
     * Update Component child nodes.
     */
    updateViewContent() {
        // Render the template
        let html = this.getViewContent();
        if (html !== null) {
            this.innerHTML = html;
        }
    }
    /**
     * Generate HTML or Nodes.
     * @return {String|Node|DocumentFragment} The generated content.
     */
    render() {
        let template = TEMPLATE_CACHE[this.is];
        if (typeof template === 'function') {
            return template.call(this);
        } else if (typeof template === 'string') {
            return template;
        } else if (template instanceof Node && template.tagName === 'TEMPLATE') {
            if (typeof document.importNode !== 'function' ||
                typeof HTMLTemplateElement === 'undefined') {
                throw new Error('Template element is not supported by the browser');
            }
            return document.importNode(template.content, true);
        }
        return null;
    }
}
