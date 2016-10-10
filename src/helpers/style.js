import { isFunction } from './typeof.js';

let doc = document;

function createStyle(id) {
    let styleElem = doc.createElement('style');
    styleElem.type = 'text/css';
    styleElem.setAttribute('id', id);
    return styleElem;
}

/**
 * Add `<style>` tag for the component.
 * @param {String} id The CSS element unique id.
 * @param {Array|Function|String}
 * style An array of styles or a css generator function or a CSS string.
 * @return {HTMLStyleElement} the style tag created.
 */
export function importStyle(id, styles) {
    let styleElem = doc.getElementById(id);
    if (!styleElem) {
        let css = '';
        if (!Array.isArray(styles)) {
            styles = [styles];
        }
        styles.forEach((style) => {
            if (isFunction(style)) {
                style = style();
            }
            css += style;
        });
        id = `style-${id}`;
        styleElem = createStyle(id);
        styleElem.textContent = css;
        if (!styleElem.parentNode) {
            let head = doc.head;
            if (head.firstElementChild) {
                head.insertBefore(styleElem, head.firstElementChild);
            } else {
                head.appendChild(styleElem);
            }
        }
    }
    return styleElem;
}
