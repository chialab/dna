import jsdom from 'jsdom';

export type GlobalNamespace = Window & typeof globalThis & {
    _jsdom?: jsdom.JSDOM;
};

let namespace: GlobalNamespace;
if (typeof window !== 'undefined') {
    // browser
    namespace = window;
} else if (typeof global !== 'undefined') {
    // node
    const jsd = new jsdom.JSDOM();
    namespace = jsd.window as unknown as GlobalNamespace;
    namespace._jsdom = jsd;
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
    } as unknown as GlobalNamespace;
}

export { namespace as window };
