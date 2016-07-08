/**
 * Convert a Class name into HTML tag.
 * @param {Class} fn Grab the tag name from this class.
 * @return {String} The tag name for the Custom Element.
 */
export function classToElement(fn) {
    let name;
    if (fn.name) {
        name = fn.name
            .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
            .replace(/^\-/, '');
    }
    return name;
}
