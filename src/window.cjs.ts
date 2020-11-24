// eslint-disable-next-line
const namespace = typeof window !== 'undefined' ? window : (new (require('jsdom').JSDOM)()).window as Window & typeof globalThis;
export { namespace as window };
