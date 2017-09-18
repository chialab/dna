import { symbols, attributes, notifications } from 'incremental-dom/index.js';
import { DOM } from '@dnajs/core/src/core.js';
import { registry } from '@dnajs/core/src/lib/registry.js';
import { isFalsy } from '@dnajs/core/src/lib/typeof.js';
import { patch } from './idom.js';

const _created = notifications.nodesCreated;
const _removed = notifications.nodesDeleted;
const _changed = attributes[symbols.default];

notifications.nodesCreated = function(nodes) {
    patch.current.after(() => {
        nodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                let Ctr = registry.get(node.getAttribute('is') || node.tagName);
                let component = DOM.getNodeComponent(node) || (Ctr && new Ctr(node));
                if (component) {
                    DOM.connect(component);
                }
            }
        });
    });
    /* istanbul ignore if */
    if (_created) {
        _created(nodes);
    }
};

notifications.nodesDeleted = function(nodes) {
    nodes.forEach((node) => {
        DOM.disconnect(node);
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
    let elem = DOM.getNodeComponent(node);
    if (elem) {
        patch.current.after(() => {
            let attrs = elem.constructor.observedAttributes || [];
            if (attrs.indexOf(attrName) !== -1) {
                attrValue = (isFalsy(attrValue)) ? null : attrValue;
                DOM.update(elem, attrName, oldValue, attrValue);
            } else if (elem.properties && elem.properties.hasOwnProperty(attrName)) {
                elem[attrName] = attrValue;
            }
        });
    }
};
