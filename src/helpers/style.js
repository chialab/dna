export function hostReplace(style, replace) {
    return style.replace(/\:host[^\{]*/g, (fullRule) =>
        fullRule.split(',').map((rule) => {
            rule = rule.trim();
            if (rule.match(/\:host\(/)) {
                rule = rule.replace(/\:host[^\s]*/, (hostRule) =>
                    hostRule.trim().replace(':host(', ':host').replace(/\)$/, '')
                );
            }
            return rule.replace(/\:host/, `.${replace}`);
        }).join(', ')
    );
}

/**
 * Add `<style>` tag for the component.
 * @param {String} id The CSS element unique id.
 * @param {Array|Function|String}
 * style An array of styles or a css generator function or a CSS string.
 * @return {HTMLStyleElement} the style tag created.
 */
export function importStyle(id, styles) {
    let css = '';
    if (!Array.isArray(styles)) {
        styles = [styles];
    }
    styles.forEach((style) => {
        if (typeof style === 'function') {
            style = style();
        }
        css += hostReplace(style, id);
    });
    id = `style-${id}`;
    let styleElem = document.getElementById(id) || document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.setAttribute('id', id);
    styleElem.innerHTML = '';
    styleElem.appendChild(document.createTextNode(css));
    if (!styleElem.parentNode) {
        let head = document.head;
        if (head.firstElementChild) {
            head.insertBefore(styleElem, head.firstElementChild);
        } else {
            head.appendChild(styleElem);
        }
    }
    return styleElem;
}
