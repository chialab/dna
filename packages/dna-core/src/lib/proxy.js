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
 * Reference to Element prototype.
 * @type Object
 * @private
 */
const ELEMENT_PROTOTYPE = Element.prototype;

/**
 * Reference to Node prototype.
 * @type Object
 * @private
 */
function checkNode() {
    if (!this.node) {
        throw new ReferenceError('The component\'s `node` is undefined.');
    }
}

/**
 * Add a proxy property descriptor to a prototype.
 * @private
 *
 * @param {Object} proto The prototype to update.
 * @param {String} property The property name to proxy.
 */
function proxyProperty(proto, property) {
    let desc = {};
    let propDescriptor = Object.getOwnPropertyDescriptor(ELEMENT_PROTOTYPE, property);
    let hasProp = !!propDescriptor;
    let isFn = hasProp && isFunction(propDescriptor.value);
    if (isFn || (!hasProp && isFunction(ELEMENT_PROTOTYPE[property]))) {
        desc.value = function(...args) {
            checkNode.call(this);
            return this.node[property].call(this.node, ...args);
        };
    } else if (hasProp) {
        desc.get = function() {
            checkNode.call(this);
            return this.node[property];
        };
        desc.set = function(val) {
            checkNode.call(this);
            return this.node[property] = val;
        };
    }
    Object.defineProperty(proto, property, desc);
}

/**
 * Add HTMLElement properties and methods proxies to a prototype.
 * @method proxy
 * @memberof DNA
 *
 * @param {Function} Component The component class to proxy.
 * @return {Function} The updated class.
 */
export function proxy(Component) {
    DOM_PROXY.forEach((prop) => {
        proxyProperty(Component.prototype, prop);
    });
    return Component;
}
