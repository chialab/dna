import jsdom from 'jsdom';

let namespace: Window & typeof globalThis;
if (typeof window !== 'undefined') {
    namespace = window;
} else {
    namespace = new jsdom.JSDOM().window as unknown as Window & typeof globalThis;
}

export { namespace as window };
