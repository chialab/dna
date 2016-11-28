import { symbols, attributes, notifications } from 'incremental-dom/index.js';
import { COMPONENT_SYMBOL, DOM } from '@dnajs/core/src/core.js';

let _created = notifications.nodesCreated;
let _removed = notifications.nodesDeleted;
let _changed = attributes[symbols.default];

notifications.nodesCreated = function(nodes) {
    nodes.forEach((node) => {
        let Ctr = DOM.getComponent(node);
        if (Ctr) {
            let elem = new Ctr();
            elem.node = node;
            DOM.connect(elem);
        }
    });
    /* istanbul ignore if */
    if (_created) {
        _created(nodes);
    }
};

notifications.nodesDeleted = function(nodes) {
    nodes.forEach((node) => {
        if (node[COMPONENT_SYMBOL]) {
            DOM.disconnect(node[COMPONENT_SYMBOL]);
        }
    });
    /* istanbul ignore if */
    if (_removed) {
        _removed(nodes);
    }
};

attributes[symbols.default] = function(node, attrName, attrValue) {
    let oldValue = node.getAttribute(attrName);
    /* istanbul ignore if */
    if (_changed) {
        _changed(node, attrName, attrValue);
    }
    let elem = node[COMPONENT_SYMBOL];
    if (elem) {
        let attrs = elem.constructor.observedAttributes || [];
        if (attrs.indexOf(attrName) !== -1) {
            attrValue = (attrValue === undefined) ? null : attrValue;
            DOM.update(elem, attrName, oldValue, attrValue);
        }
    }
};
