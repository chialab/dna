export function delegate(element, evName, selector, callback) {
    element.addEventListener(evName, (event) => {
        let target = event.target;
        while (target && target !== element) {
            if (target.matches(selector)) {
                if (callback.call(element, event, target) === false) {
                    return;
                }
            }
            target = target.parentNode;
        }
    });
}
