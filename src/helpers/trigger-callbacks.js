import { DNACallbacks } from './callbacks.js';

/**
 * Iterate and fire a list of callbacks.
 * @private
 * @param {DNAComponent} ctx The context to apply.
 * @param {String} callbackKey The key to use to retrieve the right callback list.
 * @param {Array} args A list of arguments to apply to the callback.
 */
export function triggerCallbacks(ctx, callbackKey, args) {
    let ctr = ctx;
    if (typeof ctr !== 'function') {
        ctr = ctr.constructor;
    }
    if (!ctr) {
        return false;
    }
    let callbacks = DNACallbacks.getCallbacks(ctr, callbackKey);
    if (callbacks && Array.isArray(callbacks)) {
        for (let i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(ctx, args);
        }
    }
    return true;
}
