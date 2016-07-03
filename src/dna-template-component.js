import * as Config from './dna-config.js';
import { DNAComponent } from './dna-component.js';
import { DNAProperty, registry } from './dna-helper.js';

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
            DNAProperty.observe(this, function() {
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
     * Get the component content.
     * @deprecated
     * @private
     */
    getViewContent() {
        return this.render();
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
            let doc = document.createDocumentFragment();
            let nodes = document.importNode(template.content, true);
            doc.appendChild(nodes);
            return doc.childNodes;
        }
        return null;
    }
    /**
     * Update Component child nodes.
     * @param {*} content Optional result of a `render` of an extended class.
     */
    updateViewContent(content) {
        // Render the template
        content = content || this.render();
        if (typeof content === 'string') {
            content = content.replace(/[\n\r\t]/g, '').replace(/\s+/g, ' ');
            let parser = new DOMParser();
            let doc = parser.parseFromString(
                content,
                'text/html'
            );
            content = doc.body && doc.body.childNodes;
        }
        if (content instanceof Node) {
            content = [content];
        }
        if (content instanceof NodeList) {
            content = Array.prototype.slice.call(content, 0);
        }
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
    }
}
