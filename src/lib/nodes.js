import { isFunction } from './typeof.js';
import { registry } from './registry.js';

const CONNECTED = 'connectedCallback';
const DISCONNECTED = 'disconnectedCallback';
const UPDATED = 'attributeChangedCallback';

export function getComponent(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        let is = node.getAttribute('is') || node.tagName;
        return registry.get(is);
    }
    return null;
}

export function connect(node) {
    if (isFunction(node[CONNECTED])) {
        node[CONNECTED]();
    }
}

export function disconnect(node) {
    if (isFunction(node[DISCONNECTED])) {
        node[DISCONNECTED]();
    }
}

export function update(node, name, oldValue, newValue) {
    if (isFunction(node[UPDATED]) && name !== 'is') {
        node[UPDATED](name, oldValue, newValue);
    }
}

export function bind(node, Ctr) {
    node.__proto__ = Ctr.prototype;
    Object.defineProperty(node, 'constructor', {
        value: Ctr,
        configurable: true,
        writable: true,
    });
    Ctr.prototype.constructor.call(node);
}

export function create(node, descriptor) {
    descriptor = descriptor || getComponent(node);
    if (descriptor) {
        bind(node, descriptor.Ctr);
        connect(node);
    }
}

export function appendChild(parent, node) {
    if (parent !== node.parentNode || parent.lastElementChild !== node) {
        if (node.parentNode) {
            removeChild(node.parentNode, node);
        }
        parent.appendChild(node);
        connect(node);
    }
}

export function removeChild(parent, node) {
    parent.removeChild(node);
    disconnect(node);
}

export function render(node, Component, props = {}) {
    let element = new Component();
    for (let k in props) {
        element[k] = props[k];
    }
    node.appendChild(element);
    connect(element);
}
