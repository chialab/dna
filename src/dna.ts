import { registry } from './lib/CustomElementRegistry';

export const get = registry.get.bind(registry);
export const define = registry.define.bind(registry);
export const upgrade = registry.upgrade.bind(registry);
export const whenDefined = registry.whenDefined.bind(registry);
export { DOM } from './lib/DOM';
export { isCustomElement } from './lib/CustomElement';
export { CustomElementRegistry } from './lib/CustomElementRegistry';
export { render } from './lib/render';
export { Fragment, h } from './lib/h';
export { html } from './lib/html';
export { css } from './lib/css';
export { compile } from './lib/InterpolationFunction';
export { delegateEventListener, undelegateEventListener, undelegateAllEventListeners } from './lib/listener';
export { property } from './lib/property';
export { mixin, Component } from './lib/Component';
