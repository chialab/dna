import { symbols, attributes, notifications } from 'incremental-dom/index.js';
import { COMPONENT_SYMBOL, DOM } from '@dnajs/core/src/core.js';
import { registry } from '@dnajs/core/src/lib/registry.js';
import { isFalsy } from '@dnajs/core/src/lib/typeof.js';

let _created = notifications.nodesCreated;
let _removed = notifications.nodesDeleted;
let _changed = attributes[symbols.default];

notifications.nodesCreated = function(nodes) {
    nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            let Ctr = registry.get(node.getAttribute('is') || node.tagName);
            if (Ctr) {
                let elem = new Ctr();
                elem.node = node;
                DOM.connect(elem);
            }
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
            attrValue = (isFalsy(attrValue)) ? null : attrValue;
            DOM.update(elem, attrName, oldValue, attrValue);
        } else if (elem.properties && elem.properties.hasOwnProperty(attrName)) {
            elem[attrName] = attrValue;
        }
    }
};
