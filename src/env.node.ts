import { extend } from '@chialab/quantum';
import JSDOM from 'jsdom';

const jsdom = new JSDOM.JSDOM(undefined, {
    url: 'http://localhost/',
});

export const window = jsdom.window as unknown as Window & typeof globalThis;
export const document = window.document;
export const customElements = window.customElements;
export const Event = window.Event;
export const CustomEvent = window.CustomEvent;
export const Node = window.Node;
export const Element = window.Element;
export const HTMLElement = window.HTMLElement;
export const DOMParser = window.DOMParser;
extend(window);
