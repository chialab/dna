import { registry } from './registry.js';
import { getNodeComponent, connect } from './dom.js';

/**
 * Instantiate all defined components in a DOM tree.
 * @param {HTMLElement} root The root Node of the tree.
 */
export function bootstrap(root) {
    for (let k in registry.components) {
        let Component = registry.get(k);
        let elements = root.querySelectorAll(`${k}, [is="${k}"]`);
        for (let i = 0, len = elements.length; i < len; i++) {
            if (!getNodeComponent(elements[i])) {
                let component = new Component(elements[i]);
                connect(component);
            }
        }
    }
}
