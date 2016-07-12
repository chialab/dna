/**
 * Retrieve a list of callbacks that should not be overridden but concatenated.
 * @return {Array} The list.
 */
export const COMPONENT_CALLBACKS = [
    'onRegister',
    'createdCallback',
    'attachedCallback',
    'detachedCallback',
    'attributeChangedCallback',
];

const map = new WeakMap();

/**
 * Handle DNA callbacks.
 * @class DNACallbacks.
 */
export class DNACallbacks {
    static get(proto) {
        return map.get(proto) || {};
    }

    static set(proto, value) {
        return map.set(proto, value);
    }

    static getCallbacks(proto, key) {
        let allCallbacks = this.get(proto);
        return allCallbacks[key] || [];
    }

    static setCallbacks(proto, key, clbs) {
        let allCallbacks = this.get(proto);
        allCallbacks[key] = clbs;
        this.set(proto, allCallbacks);
    }

    static pushCallback(proto, key, clb) {
        let callbacks = this.getCallbacks(proto, key);
        callbacks.push(clb);
        this.setCallbacks(proto, key, callbacks);
    }
}
