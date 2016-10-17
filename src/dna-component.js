import { HTMLElement } from './lib/html-element.js';

/**
 * This is the model to use to create DNA Custom Components.
 * @class Component
 * @extends HTMLElement
 *
 * @example
 * my-component.js
 * ```js
 * import { Component } from 'dna/component';
 * export class MyComponent extends Component {
 *   get constructor() {
 *     console.log('Created a MyComponent instance!!!');
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { define } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent(); // logs "Created a MyComponent instance!!!"
 * ```
 */
export class Component extends HTMLElement {
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
