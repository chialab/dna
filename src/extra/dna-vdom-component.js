import { virtualDom } from 'vdom';
import { DNATemplateComponent } from '../dna-template-component.js';

function attributesToProp(node) {
    let res = {};
    Array.prototype.forEach.call(node.attributes || [], (attr) => {
        res[attr.name] = attr.value;
    });
    return res;
}

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

export class DNAVDomComponent extends DNATemplateComponent {
    /**
     * Update Component child nodes.
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
