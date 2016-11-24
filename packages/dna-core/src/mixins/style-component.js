import { isString } from '../lib/typeof.js';
import { createStyle } from '../lib/style.js';

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @mixin StyleMixin
 * @memberof DNA.MIXINS
 * @static
 *
 * @example
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get css() {
 *     return '.my-component p { color: red; }'
 *   }
 * }
 * @example
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * var p = document.createElement('p');
 * p.innerText = 'Paragraph';
 * element.appendChild(p); // text inside `p` gets the red color
 */
export const StyleMixin = (SuperClass) => class extends SuperClass {
    /**
     * Fires when an instance of the element is created.
     */
    constructor() {
        super();
        if (!this.constructor.styleElem) {
            let Ctr = this.constructor;
            Object.defineProperty(Ctr, 'styleElem', {
                value: createStyle(this),
            });
        }
        this.updateCSS();
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add(this.is);
    }

    updateCSS() {
        let style = this.css;
        if (isString(style)) {
            this.constructor.styleElem.textContent = style;
        }
    }
};
