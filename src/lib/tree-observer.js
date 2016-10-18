import Template from 'skin-template';
import { registry } from './registry.js';
import { bind } from './bind.js';

const HAS_REGISTRY = !!registry.native;

if (!HAS_REGISTRY) {
    const notifications = Template.IDOM.notifications;
    const attributes = Template.IDOM.attributes;
    const symbols = Template.IDOM.symbols;
    let _created = notifications.nodesCreated;
    let _removed = notifications.nodesDeleted;
    let _changed = attributes[symbols.default];

    const getDescriptor = function(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            let is = node.getAttribute('is') || node.tagName;
            return registry.get(is);
        }
        return null;
    };

    const createNode = function(node, desc) {
        desc = desc || getDescriptor(node);
        if (desc) {
            bind(node, desc.Ctr);
            node.connectedCallback();
        }
    };

    notifications.nodesCreated = function(nodes) {
        nodes.forEach((node) => !node.is && createNode(node));
        /* istanbul ignore if */
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
        /* istanbul ignore if */
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
        /* istanbul ignore if */
        if (_changed) {
            _changed(node, attrName, attrValue);
        }
    };
}
