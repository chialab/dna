import { matches } from './matches.js';

export function delegate(element, evName, selector, callback) {
    element.addEventListener(evName, (event) => {
        let target = event.target;
        while (target && target !== element) {
            if (matches(target, selector)) {
                callback.call(element, event, target);
                return;
            }
            target = target.parentNode;
        }
    });
}
