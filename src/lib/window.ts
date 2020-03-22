declare const __DNA_NS__: Window & typeof globalThis;

let namespace = {} as Window & typeof globalThis;

if (typeof __DNA_NS__ !== 'undefined') {
    namespace = __DNA_NS__;
} else if (typeof globalThis !== 'undefined') {
    namespace = globalThis as Window & typeof globalThis;
} else if (typeof self !== 'undefined') {
    namespace = self;
} else if (typeof window !== 'undefined') {
    namespace = window;
} else if (typeof global !== 'undefined') {
    namespace = global as unknown as Window & typeof globalThis;
} else if (typeof this !== 'undefined') {
    namespace = this as unknown as Window & typeof globalThis;
}

export { namespace as window };
