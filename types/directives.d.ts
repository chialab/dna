import type { Template } from './render';
/**
 * Convert an HTML string to DOM nodes.
 * @param string The HTML string to conver.
 * @return The virtual DOM template function.
 */
export declare const parseDOM: (string: string) => Template;
/**
 * It renders the template when then provided Thenable is in pending status.
 * @param thenable The Promise-like object.
 * @param template The template to render.
 * @return A promise which resolves the template while the Thenable is in pending status.
 */
export declare const until: (thenable: Promise<unknown>, template: Template) => Promise<boolean>;
