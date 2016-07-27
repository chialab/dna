import { matches } from './matches.js';

export function delegate(element, evName, selector, callback) {
    element.addEventListener(evName, (event) => {
        let target = event.target;
        while (target && target !== element) {
            if (matches(target, selector)) {
                if (callback.call(element, event, target) === false) {
                    return;
                }
            }
            target = target.parentNode;
        }
    });
}
