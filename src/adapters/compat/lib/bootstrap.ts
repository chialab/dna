import { Component, customElements } from '@chialab/dna';

export function bootstrap(root: HTMLElement, callback: (node: Component) => any = () => {}) {
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
                callback(node as Component);
            } else {
                callback(new constructor(node as HTMLElement));
            }
        }
    }
}
