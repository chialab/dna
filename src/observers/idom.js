import Template from 'skin-template';
import { getComponent, create, disconnect, update } from '../lib/nodes.js';

const notifications = Template.IDOM.notifications;
const attributes = Template.IDOM.attributes;
const symbols = Template.IDOM.symbols;
let _created = notifications.nodesCreated;
let _removed = notifications.nodesDeleted;
let _changed = attributes[symbols.default];

notifications.nodesCreated = function(nodes) {
    nodes.forEach((node) => !node.is && create(node));
    /* istanbul ignore if */
    if (_created) {
        _created(nodes);
    }
};

notifications.nodesDeleted = function(nodes) {
    nodes.forEach((node) => disconnect(node));
    /* istanbul ignore if */
    if (_removed) {
        _removed(nodes);
    }
};

attributes[symbols.default] = function(node, attrName, attrValue) {
    let desc = getComponent(node);
    if (desc) {
        if (!node.is) {
            create(node, desc);
        }
        let oldValue = node.getAttribute(attrName);
        let attrs = desc.Ctr.observedAttributes || [];
        if (attrs.indexOf(attrName) !== -1) {
            update(node, attrName, oldValue, attrValue);
        }
    }
    /* istanbul ignore if */
    if (_changed) {
        _changed(node, attrName, attrValue);
    }
};
