'use strict';

import { DNAConfig } from './dna-config.next.js';
import { DNAComponent } from './dna-component.next.js';
import VDOM from './libs/virtual-dom.js';

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
    static onRegister(...args) {
        // Create render function
        let ctr = this;
        if (this.template) {
            if (typeof ctr.template === 'function') {
                ctr.prototype.render = function() {
                    return ctr.template.call(this);
                }
            } else if (typeof ctr.template == 'string') {
                let template = ctr.template;
                ctr.prototype.render = (function(scope) {
                    return function() {
                        return template;
                    }
                })(this);
            } else if (ctr.template instanceof Node && ctr.template.tagName == 'TEMPLATE') {
                ctr.prototype.render = () => document.importNode(ctr.template.content, true);
            }
        }
    }
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        this.updateViewContent();
        DNAComponent.prototype.createdCallback.call(this);
    }
    /**
     * Update Component child nodes.
     */
    updateViewContent() {
        // Render the template
        if (typeof this.render === 'function') {
            let nodes = this.render();
            let html = nodes;
            if (nodes instanceof NodeList) {
                html = '';
                for (let i = 0, len = nodes.length; i < len; i++) {
                    html += nodes[i].outerHTML;
                }
            } else if (nodes instanceof Node) {
                html = nodes.outerHTML;
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

function attributesToProp (node) {
    var res = {};
    Array.prototype.forEach.call(node.attributes || [], function (attr) {
        res[attr.name === 'class' ? 'className' : attr.name] = attr.value;
    });
    return res;
}

function nodeToVDOM (node) {
    if (node.nodeType === Node.TEXT_NODE) {
        return new VDOM.VText(node.textContent);
    } else {
        return new VDOM.VNode(node.tagName, attributesToProp(node), Array.prototype.map.call(node.childNodes || [], nodeToVDOM));
    }
};
