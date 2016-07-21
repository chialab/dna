export function templateToNodes(scope, content) {
    if (typeof content === 'function') {
        content = content.call(scope);
    }
    if (typeof content === 'string') {
        content = content.replace(/[\n\r\t]/g, '').replace(/\s+/g, ' ');
        let parser = new DOMParser();
        let doc = parser.parseFromString(
            content,
            'text/html'
        );
        content = doc.body && doc.body.childNodes;
    }
    if (content instanceof Node) {
        if (content.tagName === 'TEMPLATE') {
            if (typeof document.importNode !== 'function' ||
                typeof HTMLTemplateElement === 'undefined') {
                throw new Error('Template element is not supported by the browser');
            }
            let doc = document.createDocumentFragment();
            let nodes = document.importNode(content.content, true);
            doc.appendChild(nodes);
            content = doc.childNodes;
        } else {
            content = [content];
        }
    }
    if (content instanceof NodeList) {
        content = Array.prototype.slice.call(content, 0);
    }
    return content;
}
