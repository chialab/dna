import { DNAComponent } from './dna-component.next.js';

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @class DNAStyleComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.next.js
 * ```js
 * import { DNAStyleComponent } from 'dna/component';
 * export class MyComponent extends DNAStyleComponent {
 *   static get css() {
 *     return '.my-component p { color: red; }'
 *   }
 * }
 * ```
 * app.next.js
 * ```js
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.next.js';
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
     */
    static onRegister() {
        // Create css function
        if (this.css) {
            this.addCss(this.css);
        }
    }
    /**
     * Add `<style>` tag for the component.
     * @param {String} style The CSS content.
     * @return {HTMLStyleElement} the style tag created.
     */
    static addCss(style) {
        let css = style;
        if (typeof style === 'function') {
            css = style();
        }
        let id = `style-${this.tagName}`;
        let styleElem = document.getElementById(id) || document.createElement('style');
        styleElem.type = 'text/css';
        styleElem.setAttribute('id', id);
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = css;
        } else {
            styleElem.innerHTML = '';
            styleElem.appendChild(document.createTextNode(css));
        }
        if (!styleElem.parentNode) {
            let head = document.head || document.getElementsByTagName('head')[0];
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
        if (this.is) {
            this.classList.add(this.is);
        }
    }
}
