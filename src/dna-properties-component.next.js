import { DNAComponent } from './dna-component.next.js';
import { DNAHelper } from './dna-helper.next.js';

/**
 * Simple Custom Component for properties initialization via attributes.
 * @class DNAPropertiesComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.next.js
 * ```js
 * import { DNAPropertiesComponent } from 'dna/component';
 * export class MyComponent extends DNAPropertiesComponent {
 *   get properties() {
 *     return ['name'];
 *   }
 * }
 * ```
 * app.next.js
 * ```js
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.next.js';
 * var MyElement = Register('my-component', { prototype: MyComponent });
 * var temp = document.createElement('div');
 * temp.innerHTML = '<my-component name="Albert"></my-component>';
 * var element = temp.firstChild;
 * console.log(element.name); // logs "Albert"
 * ```
 */
export class DNAPropertiesComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     */
    static onRegister() {
        let propertiesToWatch = this.properties || [];
        propertiesToWatch.forEach((prop) => {
            let descriptor = DNAHelper.getDescriptor(this.prototype, prop) || {};
            Object.defineProperty(this.prototype, prop, {
                configurable: true,
                get: DNAHelper.wrapDescriptorGet(prop, descriptor),
                set: DNAHelper.wrapDescriptorSet(prop, descriptor),
            });
        });
    }
    /**
     * On `created` callback, apply attributes to properties.
     */
    createdCallback() {
        super.createdCallback();
        let attributes = Array.prototype.slice.call(this.attributes || [], 0);
        let properties = this.constructor.properties;
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            let key = DNAHelper.dashToCamel(attr.name);
            if (properties.indexOf(key) !== -1) {
                let value = attr.value;
                this.removeAttribute(attr.name);
                if (value === '') {
                    this[key] = true;
                } else {
                    try {
                        this[key] = JSON.parse(value);
                    } catch (ex) {
                        this[key] = value;
                    }
                }
            }
        }
    }
}
