import { virtualDom } from 'vdom';
import { DNATemplateComponent } from '../dna-template-component.js';

/**
 * Extract node's attributes.
 * @private
 * @param {Node} node The node to parse.
 * @return {Object} A key => value object with node's attributes.
 */
function attributesToProp(node) {
    let res = {};
    Array.prototype.forEach.call(node.attributes || [], (attr) => {
        res[attr.name] = attr.value;
    });
    return res;
}

/**
 * Convert a Node to a VDOM Node.
 * @private
 * @param {Node} node The node to convert.
 * @param {Object} parentOptions The node's parent options (optional).
 * @return {Object} A VDOM Node.
 */
function nodeToVDOM(node, parentOptions) {
    if (node.nodeType === Node.TEXT_NODE) {
        return new virtualDom.VText(node.textContent);
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
    return new virtualDom.VNode(
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
 * Same as DNATemplateComponent, but with VDOM support.
 * This component is available only including /dna\.vdom(\-?.*)\.js/ libraries.
 * @class DNAVDomComponent
 * @extends DNATemplateComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAVDomComponent } from 'dna/component';
 * export class MyComponent extends DNAVDomComponent {
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
export class DNAVDomComponent extends DNATemplateComponent {
    /**
     * Update Component child nodes using VDOM trees.
     */
    updateViewContent() {
        // Render the template
        let html = this.getViewContent();
        if (html !== null) {
            let tmp = document.createElement('div');
            tmp.innerHTML = html;
            let tree = nodeToVDOM(tmp);
            if (!this._vtree) {
                this.innerHTML = html;
            } else {
                let diff = virtualDom.diff(this._vtree, tree);
                virtualDom.patch(this, diff);
            }
            this._vtree = tree;
        }
    }
}
