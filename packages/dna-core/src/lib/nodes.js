import { isFunction, isString } from './typeof.js';
import { registry } from './registry.js';

const CONNECTED = 'connectedCallback';
const DISCONNECTED = 'disconnectedCallback';
const UPDATED = 'attributeChangedCallback';

export function getComponent(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        let is = node.getAttribute('is') || node.tagName;
        return registry.get(is);
    } else if (isString(node)) {
        return registry.get(node);
    }
    return registry.get(node);
}

export function isComponent(node) {
    let desc = getComponent(node);
    return desc && (node instanceof desc.Ctr);
}

export function connect(node) {
    if (isComponent(node)) {
        node[CONNECTED].call(node);
        return true;
    }
}

export function disconnect(node) {
    if (isComponent(node)) {
        node[DISCONNECTED].call(node);
        return true;
    }
}

export function update(node, name, oldValue, newValue) {
    if (isComponent(node)) {
        node[UPDATED].call(node, name, oldValue, newValue);
        return true;
    }
}

export function bind(node, Ctr) {
    if (!isFunction(Ctr)) {
        let desc = getComponent(node);
        if (desc) {
            Ctr = desc.Ctr;
        }
    }
    if (isFunction(Ctr)) {
        node.__proto__ = Ctr.prototype;
        Object.defineProperty(node, 'constructor', {
            value: Ctr,
            configurable: true,
            writable: true,
        });
        Ctr.call(node);
        return true;
    }
    return false;
}

export function createElement(is) {
    let descriptor = getComponent(is);
    if (descriptor) {
        return new descriptor.Ctr();
    }
}

export function appendChild(parent, node) {
    if (parent !== node.parentNode || parent.lastElementChild !== node) {
        if (node.parentNode) {
            removeChild(node.parentNode, node);
        }
        parent.appendChild(node);
        return connect(node);
    }
    return false;
}

export function removeChild(parent, node) {
    parent.removeChild(node);
    return disconnect(node);
}

export function insertBefore(parent, node, refNode) {
    parent.insertBefore(node, refNode);
    return connect(node);
}

export function replaceChild(parent, node, refNode) {
    parent.replaceChild(node, refNode);
    disconnect(refNode);
    return connect(node);
}

export function setAttribute(node, name, value) {
    let oldValue = node.getAttribute(name);
    node.setAttribute(name, value);
    let attrs = node.constructor.observedAttributes || [];
    if (attrs.indexOf(name) !== -1) {
        update(node, name, oldValue, value);
        return true;
    }
    return false;
}

export function removeAttribute(node, name) {
    let oldValue = node.getAttribute(name);
    node.removeAttribute(name);
    let attrs = node.constructor.observedAttributes || [];
    if (attrs.indexOf(name) !== -1) {
        update(node, name, oldValue, null);
        return true;
    }
    return false;
}
