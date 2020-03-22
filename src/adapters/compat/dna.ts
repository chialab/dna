import './lib/DOM';
import * as IDOM from './lib/IDOM';

export {
    window,
    customElements,
    CustomElementRegistry,
    get,
    define,
    upgrade,
    whenDefined,
    DOM,
    connect,
    disconnect,
    Fragment,
    h,
    html,
    template,
    interpolate,
    css,
    AsyncEvent,
    delegateEventListener,
    undelegateEventListener,
    dispatchEvent,
    dispatchAsyncEvent,
    property,
    extend,
    Component,
} from '@chialab/dna';
export { IDOM };
export * from './lib/registry';
export * from './lib/mix';
export * from './lib/bootstrap';
export * from './lib/prop';
export * from './lib/trust';
export * from './lib/BaseComponent';
export * from './lib/render';
export * from './lib/namespace';
export * from './lib/mixins';
export * from './lib/symbols';
export * from './lib/proxy';
export * from './lib/css';
