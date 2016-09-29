import { polyfillElement } from './helpers/polyfill-element.js';

const Element = polyfillElement('HTMLElement');

/**
 * This is the model to use to create DNA Custom Components.
 * @class DNAComponent
 * @extends HTMLElement
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAComponent } from 'dna/component';
 * export class MyComponent extends DNAComponent {
 *   get constructor() {
 *     console.log('Created a MyComponent instance!!!');
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = register('my-component', MyComponent);
 * var element = new MyElement(); // logs "Created a MyComponent instance!!!"
 * ```
 */
export class DNAComponent extends Element {
    /**
     * Fires when an instance was inserted into the document.
     */
    connectedCallback() {}
    /**
     * Fires when an instance was detached from the document.
     */
    disconnectedCallback() {}
    /**
     * Fires when an attribute was added, removed, or updated.
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback() {}
}
