import Template from 'skin-template';
import { isUndefined } from './typeof.js';
import { registry } from './registry.js';

const notifications = Template.IDOM.notifications;
const attributes = Template.IDOM.attributes;
const symbols = Template.IDOM.symbols;
const CUSTOM_ELEMENTS = self.customElements;
const HAS_REGISTRY = !isUndefined(CUSTOM_ELEMENTS);
let _created = notifications.nodesCreated;
let _removed = notifications.nodesDeleted;
let _changed = attributes[symbols.default];

function getDescriptor(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        let is = node.getAttribute('is') || node.tagName;
        if (!HAS_REGISTRY || !CUSTOM_ELEMENTS.get(is)) {
            let desc = registry.get(is);
            if (desc) {
                return desc;
            }
        }
    }
    return null;
}

function createNode(node, desc) {
    desc = desc || getDescriptor(node);
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

notifications.nodesCreated = function(nodes) {
    nodes.forEach((node) => createNode(node));
    if (_created) {
        _created(nodes);
    }
};

notifications.nodesDeleted = function(nodes) {
    nodes.forEach((node) => {
        let desc = getDescriptor(node);
        if (desc) {
            node.disconnectedCallback();
        }
    });
    if (_removed) {
        _removed(nodes);
    }
};

attributes[symbols.default] = function(node, attrName, attrValue) {
    let desc = getDescriptor(node);
    if (desc) {
        if (!node.is) {
            createNode(node, desc);
        }
        let oldValue = node.getAttribute(attrName);
        let attrs = desc.Ctr.observedAttributes || [];
        if (attrs.indexOf(attrName) !== -1) {
            node.attributeChangedCallback(attrName, oldValue, attrValue);
        }
    }
    if (_changed) {
        _changed(node, attrName, attrValue);
    }
};
