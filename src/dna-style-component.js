import { mix } from 'mixwith';
import { DNAComponent } from './dna-component.js';
import { importStyle } from './helpers/style.js';

const IMPORTED_STYLES = new WeakMap();

export const DNAStyleMixin = (SuperClass) => class extends SuperClass {
    /**
     * Fires when an instance of the element is created.
     */
    constructor() {
        super();
        if (this.is) {
            // Add <style>
            let Ctr = this.constructor;
            let style = Ctr.css;
            if (style && !IMPORTED_STYLES.get(Ctr)) {
                importStyle(this.is, style);
                IMPORTED_STYLES.get(Ctr, true);
            }
            // Add scope style class
            this.classList.add(this.is);
        }
    }
};

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @class DNAStyleComponent
 * @extends DNAComponent
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
export class DNAStyleComponent extends mix(DNAComponent).with(DNAStyleMixin) {}
