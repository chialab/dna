export default ((): Window & typeof globalThis => {
    if (typeof window !== 'undefined') {
        // browser environment
        return window;
    }

    // node environment
    const jsdom = require(/* do not bundle */eval('\'jsdom\''));
    const dom = new jsdom.JSDOM();
    return dom.window;
})();
