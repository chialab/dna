import { notifications, attributes, symbols } from 'google/incremental-dom';
import { registry } from './registry.js';

const customElements = self.customElements;
const hasRegistry = typeof customElements !== 'undefined';
const _created = notifications.nodesCreated;
const _removed = notifications.nodesDeleted;
const _changed = attributes[symbols.default];

notifications.nodesCreated = function(nodes) {
    nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            let is = node.getAttribute('is') || node.tagName;
            if (!hasRegistry || !customElements.get(is)) {
                let desc = registry.get(is);
                if (desc) {
                    node.__proto__ = desc.Ctr.prototype;
                    Object.defineProperty(node, 'constructor', {
                        value: desc.Ctr,
                        configurable: true,
                        writable: true,
                    });
                    desc.Ctr.prototype.constructor.call(node);
                    node.connectedCallback();
                }
            }
        }
    });
    if (_created) {
        _created(nodes);
    }
};

notifications.nodesDeleted = function(nodes) {
    nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            let is = node.getAttribute('is') || node.tagName;
            if (!hasRegistry || !customElements.get(is)) {
                let Ctr = registry.get(is);
                if (Ctr) {
                    node.disconnectedCallback();
                }
            }
        }
    });
    if (_removed) {
        _removed(nodes);
    }
};

attributes[symbols.default] = function(node, attrName, attrValue) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        let is = node.getAttribute('is') || node.tagName;
        if (!hasRegistry || !customElements.get(is)) {
            let desc = registry.get(is);
            if (desc) {
                let oldValue = node.getAttribute(attrName);
                node.attributeChangedCallback(attrName, oldValue, attrValue);
            }
        }
    }
    if (_changed) {
        _changed(node, attrName, attrValue);
    }
};
