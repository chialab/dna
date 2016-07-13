/**
 * Retrieve a list of callbacks that should not be overridden but concatenated.
 * @return {Array} The list.
 */
export const COMPONENT_CALLBACKS = [
    'constructor',
    'connectedCallback',
    'disconnectedCallback',
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

    static normalizeKey(key) {
        return (key === 'constructor') ? '_constructor' : key;
    }

    static getCallbacks(proto, key) {
        let allCallbacks = this.get(proto);
        key = this.normalizeKey(key);
        return allCallbacks[key] || [];
    }

    static setCallbacks(proto, key, clbs) {
        let allCallbacks = this.get(proto);
        key = this.normalizeKey(key);
        allCallbacks[key] = clbs;
        this.set(proto, allCallbacks);
    }

    static pushCallback(proto, key, clb) {
        let callbacks = this.getCallbacks(proto, key);
        callbacks.push(clb);
        this.setCallbacks(proto, key, callbacks);
    }
}
