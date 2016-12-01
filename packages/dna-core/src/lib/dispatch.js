import { isString } from './typeof.js';
import { CustomEvent } from './custom-event.js';

/**
 * Trigger a custom DOM Event.
 * @private
 *
 * @param {Node} node The event target.
 * @param {String} evName The custom event name.
 * @param {Object} data Extra data to pass to the event.
 * @param {Boolean} bubbles Enable event bubbling.
 * @param {Boolean} cancelable Make event cancelable.
 * @return {Boolean} True if event propagation has not be stopped.
 */
export function dispatch(node, evName, data, bubbles = true, cancelable = true) {
    if (!isString(evName)) {
        throw new TypeError('Event name is undefined');
    }
    let ev = new CustomEvent(evName, {
        detail: data,
        bubbles,
        cancelable,
    });
    return node.dispatchEvent(ev);
}
