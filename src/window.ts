const namespace = ((): Window & typeof globalThis => {
    if (typeof window !== 'undefined') {
        // browser environment
        return window;
    }

    // node environment
    const jsdom = require('jsdom');
    const dom = new jsdom.JSDOM();
    return dom.window;
})();

export { namespace as window };
