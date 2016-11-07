import Template from 'skin-template';
import { DOM } from '@dnajs/core/src/library-helpers.js';

const IDOM = Template.IDOM;
const notifications = IDOM.notifications;
const attributes = IDOM.attributes;
const symbols = IDOM.symbols;
let _removed = notifications.nodesDeleted;
let _changed = attributes[symbols.default];

IDOM.afterElementOpen((node) => {
    if (node.is || DOM.create(node)) {
        if (node.template) {
            IDOM.skip();
            return false;
        }
    }
});

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
