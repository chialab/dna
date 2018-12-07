export function render(node, Component, props = {}) {
    let element = new Component(props);
    node.appendChild(element);
    return element;
}
