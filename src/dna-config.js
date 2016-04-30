/**
 * @property {Boolean} useVirtualDOM Should use [`virtual-dom`](https://github.com/Matt-Esch/virtual-dom) for template render.
 */
export const useVirtualDOM = (
    typeof window !== 'undefined' &&
    typeof window.virtualDom !== 'undefined'
);

/**
 * @property {Boolean} autoUpdateView Should the Component auto update own view.
 */
export const autoUpdateView = true;
