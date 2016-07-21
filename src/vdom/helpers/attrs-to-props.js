import { AttributeHook } from './vdom-hooks.js';

/**
 * Extract node's attributes.
 * @private
 * @param {Node} node The node to parse.
 * @return {Object} A key => value object with node's attributes.
 */
export function attrsToProps(node, options = {}, hooks = true) {
    let res = {};
    Array.prototype.forEach.call(node.attributes || [], (attr) => {
        if (hooks && attr.name !== 'is') {
            res[attr.name] = new AttributeHook(attr.value, options.namespace);
        } else {
            res.attributes = res.attributes || {};
            res.attributes.is = attr.value;
        }
    });
    return res;
}
