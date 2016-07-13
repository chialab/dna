import { DNACallbacks } from './callbacks.js';

/**
 * Iterate and fire a list of callbacks.
 * @private
 * @param {DNAComponent} ctx The context to apply.
 * @param {String} key The key to use to retrieve the right callback list.
 * @param {Array} args A list of arguments to apply to the callback.
 */
export function triggerCallbacks(ctx, key, args) {
    let callbacks = DNACallbacks.getCallbacks(ctx, key);
    if (callbacks && Array.isArray(callbacks)) {
        for (let i = 0, len = callbacks.length; i < len; i++) {
            if (key === 'constructor') {
                callbacks[i].constructor.apply(ctx, args);
            } else {
                callbacks[i].apply(ctx, args);
            }
        }
    }
    return true;
}
