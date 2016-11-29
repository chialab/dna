const rootDoc = document;
/**
 * Create and attach a style element for a component.
 * @private
 *
 * @param {HTMLElement} node A component instance.
 * @return {HTMLElement} The created style element.
 */
export function createStyle(node) {
    let doc = node.ownerDocument || rootDoc;
    let styleElem = doc.createElement('style');
    styleElem.id = `style-${node.is}`;
    doc.head.appendChild(styleElem);
    return styleElem;
}
