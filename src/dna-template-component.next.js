/**
 * @see http://www.2ality.com/2015/01/template-strings-html.html
 */

'use strict';

import { DNAComponent } from './dna-component.next.js';

/**
 * Simple Custom Component with template handling using the `template` property.
 * @class DNATemplateComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.next.js
 * ```js
 * import { DNATemplateComponent } from 'dna/component';
 * export class MyComponent extends DNATemplateComponent {
 *   static get template() {
 *     return `<h1>${this.name}</h1>`
 *   }
 *   get name() {
 *     return 'Newton'
 *   }
 * }
 * ```
 * app.next.js
 * ```js
 * import { DNAComponents } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.next.js';
 * var MyElement = DNAComponents.register(MyComponent);
 * var element = new MyElement();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export class DNATemplateComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     */
    static onRegister(...args) {
        // Create render function
        let ctr = this;
        if (this.template) {
            if (typeof ctr.template === 'function') {
                ctr.prototype.render = function() {
                    return ctr.template.call(this);
                }
            } else if (typeof ctr.template == 'string') {
                let template = ctr.template;
                ctr.prototype.render = (function(scope) {
                    return function() {
                        return template;
                    }
                })(this);
            } else if (ctr.template instanceof Node && ctr.template.tagName == 'TEMPLATE') {
                ctr.prototype.render = () => document.importNode(ctr.template.content, true);
            }
        }
    }
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        // Render the template
        let nodes = this.render();
        if (typeof nodes === 'string') {
            this.innerHTML = nodes;
        } else if (nodes instanceof NodeList) {
            for (let i = 0, len = nodes.length; i < len; i++) {
                this.appendChild(nodes[i]);
            }
        } else if (nodes instanceof Node) {
            this.appendChild(nodes);
        }
        DNAComponent.prototype.createdCallback.call(this);
    }
}
