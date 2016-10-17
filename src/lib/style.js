let doc = document;

export function createStyle(id) {
    let styleElem = doc.createElement('style');
    styleElem.type = 'text/css';
    styleElem.setAttribute('id', `style-${id}`);
    let head = doc.head;
    if (head.firstElementChild) {
        head.insertBefore(styleElem, head.firstElementChild);
    } else {
        head.appendChild(styleElem);
    }
    return styleElem;
}

/**
 * Add `<style>` tag for the component.
 * @param {String} styleElem The CSS style element.
 * @param {String} style A CSS string.
 * @return {HTMLStyleElement} the style tag created.
 */
export function importStyle(styleElem, style) {
    if (style !== styleElem.textContent) {
        styleElem.textContent = style;
        return true;
    }
    return false;
}
