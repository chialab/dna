import { DNAComponent } from './dna-component.js';

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
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = Register(MyComponent);
 * var element = new MyElement();
 * var p = document.createElement('p');
 * p.innerText = 'Paragraph';
 * element.appendChild(p); // text inside `p` gets the red color
 * ```
 */
export class DNAStyleComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     * @param {String} id The element definition name.
     */
    static onRegister(id) {
        // Create css function
        if (this.css) {
            this.addCss(id, this.css);
        }
    }
    /**
     * Add `<style>` tag for the component.
     * @param {String} id The CSS element unique id.
     * @param {String} style The CSS content.
     * @return {HTMLStyleElement} the style tag created.
     */
    static addCss(id, style) {
        let css = style;
        if (typeof style === 'function') {
            css = style();
        }
        css = css.replace(/\:host/g, `.${id}`);
        id = `style-${id}`;
        let styleElem = document.getElementById(id) || document.createElement('style');
        styleElem.type = 'text/css';
        styleElem.setAttribute('id', id);
        styleElem.innerHTML = '';
        styleElem.appendChild(document.createTextNode(css));
        if (!styleElem.parentNode) {
            let head = document.head;
            if (head.firstElementChild) {
                head.insertBefore(styleElem, head.firstElementChild);
            } else {
                head.appendChild(styleElem);
            }
        }
        return styleElem;
    }
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        super.createdCallback();
        // Add scope style class
        let is = this.is || this.getAttribute('is') || this.tagName.toLowerCase();
        if (is) {
            this.classList.add(is);
        }
    }
}
