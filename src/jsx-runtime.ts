import type { JSXInternal } from './JSX';
export { h, Fragment, jsx, jsxDEV, jsxs } from './JSX';

/**
 * Configure JSX support.
 */
declare global {
    namespace JSX {
        interface Element extends JSXInternal.Element {}
        interface ElementClass extends JSXInternal.ElementClass {}
        interface IntrinsicElements extends JSXInternal.IntrinsicElements {}
        interface IntrinsicAttributes extends JSXInternal.IntrinsicAttributes {}
    }

    interface HTMLElementTagNameMap extends JSXInternal.CustomElements {}
}
