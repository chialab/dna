import * as virtualDom from '../lib/vdom.js';
import { LifeCycleHook } from './vdom-hooks.js';
import { attrsToProps } from './attrs-to-props.js';

/**
 * Convert a Node to a VDOM Node.
 * @private
 * @param {Node} node The node to convert.
 * @param {Object} parentOptions The node's parent options (optional).
 * @return {Object} A VDOM Node.
 */
export function nodeToVDOM(node, parentOptions = {}) {
    if (typeof node === 'undefined' || node.nodeType === Node.COMMENT_NODE) {
        return false;
    } else if (node.nodeType === Node.TEXT_NODE) {
        return new virtualDom.VText(node.textContent);
    }
    let options = {};
    for (let k in parentOptions) {
        if (parentOptions.hasOwnProperty(k)) {
            options[k] = parentOptions[k];
        }
    }
    if (node.tagName && node.tagName.toLowerCase() === 'svg') {
        options.namespace = 'http://www.w3.org/2000/svg';
    }
    let Ctr = node.constructor;
    let useHooks = options.hooks && typeof Ctr === 'function';
    let properties = attrsToProps(node, options, useHooks);
    if (useHooks) {
        properties['life-cycle-hook'] = new LifeCycleHook();
    } else {
        properties = {
            attributes: properties,
        };
    }
    let childNodes = Array.prototype.filter.call(node.childNodes || [], (n) =>
        n && n instanceof Node && n.nodeType !== Node.COMMENT_NODE
    );
    return new virtualDom.VNode(
        node.tagName,
        properties,
        childNodes.map((n) => nodeToVDOM(n, options)),
        undefined,
        options.namespace
    );
}
