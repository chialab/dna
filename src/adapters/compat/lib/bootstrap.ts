import { ComponentInterface, customElements } from '@chialab/dna';

/**
 * Instantiate all defined components in a DOM tree.
 * @deprecated since version 3.0
 * @param root The root Node of the tree.
 * @param callback A callback called on upgraded components.
 */
export function bootstrap(root: HTMLElement, callback: (node: ComponentInterface<any>) => any = () => {}) {
    const registry = customElements.registry;
    // iterate registry entries in order to retrieve all registered tags
    for (let key in registry) {
        const constructor = registry[key];
        // find all nodes for the current Component configuration
        const nodes = root.querySelectorAll(`${key}, [is="${key}"]`);
        // iterate all nodes found
        for (let i = 0, len = nodes.length; i < len; i++) {
            const node = nodes[i];
            // check if already instantiated
            if (node instanceof constructor) {
                callback(node as ComponentInterface<any>);
            } else {
                customElements.upgrade(node as HTMLElement);
                callback(node as ComponentInterface<any>);
            }
        }
    }
}
