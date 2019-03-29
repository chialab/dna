import * as registry from './registry';
import { DOM } from './dom';

/**
 * Find and instantiate elements in the page.
 * It is useful to bootstrap or rehydratate components starting from a plain HTML document.
 *
 * @param root The document root to query.
 * @return A list of instantiated elements.
 */
export function bootstrap(root: HTMLElement): HTMLElement[] {
    let elements: HTMLElement[] = [];
    // iterate registry entries in order to retrieve all registered tags
    registry.entries().forEach(({ name, constructor }) => {
        // find all nodes for the current Component configuration
        const nodes = root.querySelectorAll(`${name}, [is="${name}"]`);
        // iterate all nodes found
        nodes.forEach((node) => {
            // check if already instantiated
            if (!(node instanceof constructor)) {
                let elem = new constructor(node as HTMLElement);
                if (elem.isConnected) {
                    DOM.connect(elem);
                }
                elements.push(elem);
            }
        });
    });

    return elements;
}
