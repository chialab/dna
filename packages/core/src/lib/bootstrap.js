import { registry } from './registry.js';
import DOM from './dom.js';
import { isFunction } from '@chialab/proteins';

/**
 * Instantiate all defined components in a DOM tree.
 * @memberof DNA
 *
 * @param {HTMLElement} root The root Node of the tree.
 * @param {Function} beforeConnectCallback A callback called before connecting every component
 * @return {void}
 */
export function bootstrap(root, beforeConnectCallback) {
    for (let k in registry.components) {
        let Component = registry.get(k);
        let elements = root.querySelectorAll(`${k}, [is="${k}"]`);
        for (let i = 0, len = elements.length; i < len; i++) {
            if (!DOM.getNodeComponent(elements[i])) {
                let component = new Component(elements[i]);
                if (beforeConnectCallback && isFunction(beforeConnectCallback)) {
                    beforeConnectCallback(component, elements[i]);
                }
                DOM.connect(component);
            }
        }
    }
}
