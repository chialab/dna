import { registry } from './registry.js';

export function render(node, Component, props = {}) {
    let element = new Component();
    for (let k in props) {
        element[k] = props[k];
    }
    node.appendChild(element);
    if (!registry.native) {
        element.connectedCallback();
    }
}
