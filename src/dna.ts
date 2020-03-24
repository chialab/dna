import { registry } from './lib/CustomElementRegistry';

export { CustomElementRegistry } from './lib/CustomElementRegistry';
export { window } from './lib/window';
export { registry as customElements };
export const get = registry.get.bind(registry);
export const define = registry.define.bind(registry);
export const upgrade = registry.upgrade.bind(registry);
export const whenDefined = registry.whenDefined.bind(registry);
export { TemplateItem, TemplateItems, Template, TemplateFilter } from './lib/Template';
export { DOM, connect, disconnect } from './lib/DOM';
export { render } from './lib/render';
export { Fragment } from './lib/Fragment';
export { HyperNode, h } from './lib/HyperNode';
export { html, template, interpolate } from './lib/html';
export { css } from './lib/css';
export { AsyncEvent, DelegatedEventCallback, delegateEventListener, undelegateEventListener, dispatchEvent, dispatchAsyncEvent } from './lib/events';
export { ClassFieldDescriptor, ClassFieldObserver, ClassFieldValidator, ClassFieldAttributeConverter, ClassFieldPropertyConverter, property } from './lib/property';
export { extend, Component } from './lib/Component';
