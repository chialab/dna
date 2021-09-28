import jsdom from 'jsdom';

let namespace: Window & typeof globalThis & {
    _jsdomReconfigure?: jsdom.JSDOM['reconfigure'];
};
if (typeof window !== 'undefined') {
    // browser
    namespace = window;
} else if (typeof global !== 'undefined') {
    // node
    const jsd = new jsdom.JSDOM();
    namespace = jsd.window as unknown as Window & typeof globalThis;
    namespace._jsdomReconfigure = jsd.reconfigure.bind(jsd);
} else {
    // ¯\_(ツ)_/¯
    const throwPlatform = function() {
        throw new Error('Missing DOM implementation.');
    };
    namespace = {
        Node: throwPlatform,
        HTMLElement: throwPlatform,
        Event: throwPlatform,
        CustomEvent: throwPlatform,
        document: {
            createDocumentFragment: throwPlatform,
            createElement: throwPlatform,
            createElementNS: throwPlatform,
            createTextNode: throwPlatform,
            createComment: throwPlatform,
            addEventListener() { },
        },
    } as unknown as Window & typeof globalThis;
}

export { namespace as window };
