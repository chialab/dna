import { DNAConfig } from './dna-config.next.js';
import { DNAComponent } from './dna-component.next.js';
import { DNAHelper } from './dna-helper.next.js';
import VDOM from './libs/virtual-dom.next.js';

function wrapPrototype(main, currentProto, handled = []) {
    Object.getOwnPropertyNames(currentProto).forEach((prop) => {
        if (typeof currentProto[prop] !== 'function' && handled.indexOf(prop) === -1) {
            handled.push(prop);
            let descriptor = Object.getOwnPropertyDescriptor(currentProto, prop) || {};
            if (descriptor.configurable !== false) {
                Object.defineProperty(main, prop, {
                    configurable: true,
                    get: DNAHelper.wrapDescriptorGet(prop, descriptor),
                    set: DNAHelper.wrapDescriptorSet(prop, descriptor, function() {
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

function nodeToVDOM(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        return new VDOM.VText(node.textContent);
    }
    return new VDOM.VNode(node.tagName, {
        attributes: attributesToProp(node),
    }, Array.prototype.map.call(node.childNodes || [], nodeToVDOM));
}

/**
 * Simple Custom Component with template handling using the `template` property.
 * @class DNATemplateComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.next.js
 * ```js
 * import { DNATemplateComponent } from 'dna/component';
 * export class MyComponent extends DNATemplateComponent {
 *   static get template() {
 *     return `<h1>${this.name}</h1>`
 *   }
 *   get name() {
 *     return 'Newton'
 *   }
 * }
 * ```
 * app.next.js
 * ```js
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.next.js';
 * var MyElement = Register(MyComponent);
 * var element = new MyElement();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export class DNATemplateComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     */
    static onRegister() {
        // Create render function
        let ctr = this;
        if (this.template) {
            ctr.prototype.render = ((template) => {
                if (typeof template === 'function') {
                    return function() {
                        return template.call(this);
                    };
                } else if (typeof template === 'string') {
                    return () => template;
                } else if (template instanceof Node && template.tagName === 'TEMPLATE') {
                    return () => document.importNode(template.content, true);
                }
                return '';
            })(ctr.template);
            if (DNAConfig.autoUpdateView) {
                let proto = this.prototype || Object.getPrototypeOf(this);
                wrapPrototype(proto, proto);
            }
        }
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
            let nodes = this.render();
            let html = nodes;
            if (nodes instanceof Node || nodes instanceof DocumentFragment) {
                let box = document.createElement('div');
                box.appendChild(nodes);
                html = box.innerHTML;
            }
            html = html.replace(/[\n\r\t]/g, '').replace(/\s+/g, ' ');
            if (DNAConfig.useVirtualDOM) {
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
