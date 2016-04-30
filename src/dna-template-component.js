import * as Config from './dna-config.js';
import { DNAComponent } from './dna-component.js';
import { wrapDescriptorGet, wrapDescriptorSet } from './dna-helper.js';
import VDOM from './libs/virtual-dom.js';

const TEMPLATE_CACHE = {};

function wrapPrototype(main, currentProto, handled = []) {
    Object.getOwnPropertyNames(currentProto).forEach((prop) => {
        let descriptor = Object.getOwnPropertyDescriptor(currentProto, prop) || {};
        if (
            (typeof descriptor.value === 'undefined' || typeof descriptor.value !== 'function') &&
            handled.indexOf(prop) === -1) {
            handled.push(prop);
            if (descriptor.configurable !== false) {
                Object.defineProperty(main, prop, {
                    configurable: true,
                    get: wrapDescriptorGet(prop, descriptor),
                    set: wrapDescriptorSet(prop, descriptor, function() {
                        if (this.templateReady) {
                            this.updateViewContent();
                        }
                    }),
                });
            }
        }
    });
    let nextProto = currentProto.prototype || Object.getPrototypeOf(currentProto);
    if (nextProto && nextProto !== HTMLElement.prototype) {
        wrapPrototype(main, nextProto, handled);
    }
}

function attributesToProp(node) {
    let res = {};
    Array.prototype.forEach.call(node.attributes || [], (attr) => {
        res[attr.name] = attr.value;
    });
    return res;
}

function nodeToVDOM(node, parentOptions) {
    if (node.nodeType === Node.TEXT_NODE) {
        return new VDOM.VText(node.textContent);
    }
    let options = {};
    for (let k in parentOptions) {
        if (parentOptions.hasOwnProperty(k)) {
            options[k] = parentOptions[k];
        }
    }
    if (node.tagName.toLowerCase() === 'svg') {
        options.namespace = 'http://www.w3.org/2000/svg';
    }
    return new VDOM.VNode(
        node.tagName,
        {
            attributes: attributesToProp(node),
        },
        Array.prototype.map.call(node.childNodes || [], (n) => nodeToVDOM(n, options)),
        undefined,
        options.namespace
    );
}

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
        if (this.autoUpdateView) {
            let proto = this.prototype || Object.getPrototypeOf(this);
            wrapPrototype(proto, proto);
        }
    }
    /**
     * Default `autoUpdateView` conf.
     */
    static autoUpdateView() {
        return Config.autoUpdateView;
    }
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        this.templateReady = true;
        this.updateViewContent();
        super.createdCallback();
    }
    /**
     * Update Component child nodes.
     */
    updateViewContent() {
        // Render the template
        if (typeof this.render === 'function') {
            let html = this.render();
            if (html !== null) {
                if (html instanceof Node || html instanceof DocumentFragment) {
                    let box = document.createElement('div');
                    box.appendChild(html);
                    html = box.innerHTML;
                }
                html = html.replace(/[\n\r\t]/g, '').replace(/\s+/g, ' ');
                if (Config.useVirtualDOM) {
                    let tmp = document.createElement('div');
                    tmp.innerHTML = html;
                    let tree = nodeToVDOM(tmp);
                    if (!this._vtree) {
                        this.innerHTML = html;
                    } else {
                        let diff = VDOM.diff(this._vtree, tree);
                        VDOM.patch(this, diff);
                    }
                    this._vtree = tree;
                } else {
                    this.innerHTML = html;
                }
            }
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
