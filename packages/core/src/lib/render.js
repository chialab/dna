import { appendChild } from './dom.js';

/**
 * Create and append a new component instance.
 * @method render
 * @memberof DNA
 *
 * @param {HTMLElement} node The parent node.
 * @param {Function} Component The component constructor.
 * @param {Object} props Optional set of properties to set to the component.
 * @return {HTMLElement} The new component instance.
 */
export function render(node, Component, props) {
    let element = new Component();
    for (let k in props) {
        element[k] = props[k];
    }
    appendChild(node, element);
    return element;
}
