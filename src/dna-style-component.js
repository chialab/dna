import { mix } from 'mixwith';
import { importStyle } from './helpers/style.js';

export const DNAStyleMixin = (SuperClass) => class extends SuperClass {
    /**
     * Fires when an instance of the element is created.
     */
    constructor() {
        super();
        if (this.is) {
            // Add <style>
            let style = this.constructor.css;
            if (style) {
                // @TODO
                importStyle(this.is, style);
            }
            // Add scope style class
            this.classList.add(this.is);
        }
    }
};

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @class DNAStyleComponent
 * @extends HTMLElement
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAStyleComponent } from 'dna/component';
 * export class MyComponent extends DNAStyleComponent {
 *   static get css() {
 *     return '.my-component p { color: red; }'
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = register('my-component', MyComponent);
 * var element = new MyElement();
 * var p = document.createElement('p');
 * p.innerText = 'Paragraph';
 * element.appendChild(p); // text inside `p` gets the red color
 * ```
 */
export class DNAStyleComponent extends mix(HTMLElement).with(DNAStyleMixin) {}
