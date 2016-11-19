let doc = document;

export function createStyle(id) {
    let styleElem = doc.createElement('style');
    styleElem.type = 'text/css';
    styleElem.setAttribute('id', `style-${id}`);
    let head = doc.head;
    /* istanbul ignore else */
    if (head.firstElementChild) {
        head.insertBefore(styleElem, head.firstElementChild);
    } else {
        head.appendChild(styleElem);
    }
    return styleElem;
}
