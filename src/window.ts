let namespace: Window & typeof globalThis;
if (typeof window !== 'undefined') {
    namespace = window;
} else {
    // skip jsdom bundling
    /* eslint-disable quotes */
    const require = module[`require`].bind(module);
    /* eslint-disable-next-line */
    let jsdom = require('jsdom');
    namespace = new jsdom.JSDOM().window as Window & typeof globalThis;
}

export { namespace as window };
