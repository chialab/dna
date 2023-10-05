import './polyfill';
import '@chialab/quantum';

const global = window;

export { global as window };
export const document = window.document;
export const customElements = window.customElements;
export const Event = window.Event;
export const CustomEvent = window.CustomEvent;
export const Node = window.Node;
export const Element = window.Element;
export const HTMLElement = window.HTMLElement;
