/**
 * A list of HTMLElement properties to proxy from the node to the component instance.
 * @type Array
 * @private
 */
const DOM_PROXY = {
    attributes: 1,
    classList: 1,
    getAttribute: 0,
    hasAttribute: 0,
    setAttribute: 0,
    removeAttribute: 0,
    addEventListener: 0,
    removeEventListener: 0,
    dispatchEvent: 0,
    style: 1,
    querySelector: 0,
    querySelectorAll: 0,
    shadowRoot: 1,
    attachShadow: 0,
    createShadowRoot: 0,
    innerText: 2,
    innerHTML: 2,
};

/**
 * Reference to Node prototype.
 * @type Object
 * @private
 */
function checkNode() {
    /* istanbul ignore if  */
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
 * @param {Number} type The property type (0: function, 1: getter, 2: setter).
 */
function proxyProperty(proto, property, type) {
    let desc = {};
    if (type === 0) {
        desc.value = function(...args) {
            checkNode.call(this);
            return this.node[property].call(this.node, ...args);
        };
    } else if (type > 0) {
        desc.get = function() {
            checkNode.call(this);
            return this.node[property];
        };
        if (type > 1) {
            desc.set = function(val) {
                checkNode.call(this);
                return this.node[property] = val;
            };
        }
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
    for (let k in DOM_PROXY) {
        proxyProperty(Component.prototype, k, DOM_PROXY[k]);
    }
    return Component;
}
