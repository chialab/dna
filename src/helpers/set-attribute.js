export function setAttribute(context, attr, value) {
    let currentAttrValue = context.getAttribute(attr);
    if (value !== null && value !== undefined && value !== false) {
        if (
            (typeof value === 'string' || typeof value === 'number')
            && currentAttrValue !== value) {
            context.setAttribute(attr, value);
        } else if (typeof value === 'boolean' && currentAttrValue !== '') {
            context.setAttribute(attr, '');
        }
    } else if (currentAttrValue || currentAttrValue === '') {
        context.removeAttribute(attr);
    }
}
