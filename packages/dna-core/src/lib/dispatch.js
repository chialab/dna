import { isString } from './typeof.js';
import { CustomEvent } from '../polyfills/custom-event.js';

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
