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
    styleElem.type = 'text/css';
    styleElem.setAttribute('id', `style-${node.is}`);
    let head = doc.head;
    /* istanbul ignore else */
    if (head.firstElementChild) {
        head.insertBefore(styleElem, head.firstElementChild);
    } else {
        head.appendChild(styleElem);
    }
    return styleElem;
}
