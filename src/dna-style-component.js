import { mix } from './helpers/mixins.js'
import { Component } from './dna-component.js';
import { importStyle } from './helpers/style.js';

export const StyleMixin = (SuperClass) => class extends SuperClass {
    /**
     * Fires when an instance of the element is created.
     */
    constructor() {
        super();
        if (this.is) {
            // Add <style>
            let Ctr = this.constructor;
            let style = Ctr.css;
            if (style) {
                importStyle(this.is, style);
            }
            // Add scope style class
            this.classList.add(this.is);
        }
    }
};

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @class StyleComponent
 * @extends Component
 *
 * @example
 * my-component.js
 * ```js
 * import { StyleComponent } from 'dna/component';
 * export class MyComponent extends StyleComponent {
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
export class StyleComponent extends mix(Component).with(StyleMixin) {}
