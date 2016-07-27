export function setAttribute(context, attr, value) {
    let currentAttrValue = context.getAttribute(attr);
    if (currentAttrValue !== value) {
        if (value !== null && value !== undefined && value !== false) {
            let type = typeof value;
            if (type === 'string' || type === 'number') {
                context.setAttribute(attr, value);
            } else if (type === 'boolean') {
                context.setAttribute(attr, '');
            }
        } else if (currentAttrValue || currentAttrValue === '') {
            context.removeAttribute(attr);
        }
    }
}
