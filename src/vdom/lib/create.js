import { applyProperties } from './properties.js';
import { VirtualNode } from './node.js';
import { VirtualText } from './text.js';

export function create(vnode) {
    let doc = document;
    if (vnode instanceof VirtualText) {
        return doc.createTextNode(vnode.text);
    } else if (!(vnode instanceof VirtualNode)) {
        return null;
    }
    let props = vnode.properties || {};
    let type = props.attributes && props.attributes.is;
    let node;
    if (vnode.namespace === null) {
        node = type ?
            doc.createElement(vnode.tagName, type) :
            doc.createElement(vnode.tagName);
    } else {
        node = type ?
            doc.createElementNS(vnode.namespace, vnode.tagName, type) :
            doc.createElementNS(vnode.namespace, vnode.tagName);
    }

    applyProperties(node, props);

    let children = vnode.children;
    for (let i = 0; i < children.length; i++) {
        let childNode = create(children[i]);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}
