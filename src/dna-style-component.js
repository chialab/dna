import { importStyle } from './lib/style.js';

/**
 * Simple Custom Component with css style handling using the `css` property.
 *
 * @example
 * my-component.js
 * ```js
 * import { StyleMixin, Component, mix } from 'dna/component';
 * export class MyComponent extends mix(Component).with(StyleMixin) {
 *   static get css() {
 *     return '.my-component p { color: red; }'
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { define } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * var p = document.createElement('p');
 * p.innerText = 'Paragraph';
 * element.appendChild(p); // text inside `p` gets the red color
 * ```
 */
export const StyleMixin = (SuperClass) => class extends SuperClass {
    /**
     * Fires when an instance of the element is created.
     */
    constructor() {
        super();
        let Ctr = this.constructor;
        let style = Ctr.css;
        if (style) {
            importStyle(this.is, style);
        }
        this.classList.add(this.is);
    }
};
