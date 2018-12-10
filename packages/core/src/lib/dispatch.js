import DOM from './dom.js';

/**
 * @deprecated 2.9.0
 * Use DOM.dispatchEvent instead.
 */
export const dispatch = DOM.dispatchEvent;

// eslint-disable-next-line
console.warn('do not import this file, use DOM.dispatchEvent instead.');
