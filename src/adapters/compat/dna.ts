import { registry } from './lib/registry';
import './lib/DOM';
import * as IDOM from './lib/IDOM';

export const get = registry.get.bind(registry);
export const define = registry.define.bind(registry);
export {
    CustomElementRegistry,
    window,
    customElements,
    TemplateItem,
    TemplateItems,
    Template,
    TemplateFilter,
    DOM,
    connect,
    disconnect,
    Fragment,
    HyperNode,
    h,
    html,
    template,
    interpolate,
    css,
    AsyncEvent,
    DelegatedEventCallback,
    delegateEventListener,
    undelegateEventListener,
    dispatchEvent,
    dispatchAsyncEvent,
    ClassFieldDescriptor,
    ClassFieldObserver,
    ClassFieldValidator,
    ClassFieldAttributeConverter,
    ClassFieldPropertyConverter,
    property,
    extend,
    Component,
} from '@chialab/dna';
export { IDOM, registry };
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
