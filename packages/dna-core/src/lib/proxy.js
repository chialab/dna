import { reduce } from '../lib/reduce.js';
import { isFunction } from '../lib/typeof.js';

/**
 * A list of HTMLElement properties to proxy from the node to the component instance.
 * @type Array
 * @private
 */
const DOM_PROXY = [
    'attributes',
    'classList',
    'getAttribute',
    'hasAttribute',
    'setAttribute',
    'removeAttribute',
    'addEventListener',
    'removeEventListener',
    'dispatchEvent',
    'style',
    'querySelector',
    'querySelectorAll',
    'shadowRoot',
    'attachShadow',
    'createShadowRoot',
];

/**
 * Add a proxy property descriptor to a prototype.
 * @private
 *
 * @param {Object} proto The prototype to update.
 * @param {String} proxy The property name to proxy.
 * @return {Object} The updated prototype.
 */
function proxyProto(proto, proxy) {
    proto[proxy] = {
        configurable: true,
        get() {
            if (!this.node) {
                throw new ReferenceError('The component\'s `node` is undefined.');
            }
            let res = this.node[proxy];
            if (isFunction(res)) {
                return res.bind(this.node);
            }
            return res;
        },
    };
    return proto;
}

export function proxy(Component) {
    Component.prototype = Object.create(
        Component.prototype,
        reduce(DOM_PROXY, (prototype, proxy) =>
            proxyProto(prototype, proxy), {}
        )
    );
    return Component;
}
