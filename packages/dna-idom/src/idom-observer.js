import * as IDOM from 'incremental-dom';
import { DOM } from 'dna-components';

const notifications = IDOM.notifications;
const attributes = IDOM.attributes;
const symbols = IDOM.symbols;
let _created = notifications.nodesCreated;
let _removed = notifications.nodesDeleted;
let _changed = attributes[symbols.default];

notifications.nodesCreated = function(nodes) {
    nodes.forEach((node) => !node.is && DOM.create(node));
    /* istanbul ignore if */
    if (_created) {
        _created(nodes);
    }
};

notifications.nodesDeleted = function(nodes) {
    nodes.forEach((node) => DOM.disconnect(node));
    /* istanbul ignore if */
    if (_removed) {
        _removed(nodes);
    }
};

attributes[symbols.default] = function(node, attrName, attrValue) {
    let desc = DOM.getComponent(node);
    if (desc) {
        if (!node.is) {
            if (DOM.create(node, desc)) {
                DOM.connect(node);
            }
        }
        let oldValue = node.getAttribute(attrName);
        let attrs = desc.Ctr.observedAttributes || [];
        if (attrs.indexOf(attrName) !== -1) {
            DOM.update(node, attrName, oldValue, attrValue);
        }
    }
    /* istanbul ignore if */
    if (_changed) {
        _changed(node, attrName, attrValue);
    }
};
