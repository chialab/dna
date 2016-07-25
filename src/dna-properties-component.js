import { mix } from 'mixwith';
import { DNAProperty } from './helpers/dna-property.js';
import { dashToCamel } from './helpers/strings.js';
import {
    getDescriptor, wrapDescriptorGet, wrapDescriptorSet,
} from './helpers/descriptor.js';

export const DNAPropertiesMixin = (SuperClass) => class extends SuperClass {
    /**
     * On `created` callback, apply attributes to properties.
     */
    constructor() {
        super();
        let Ctr = this.constructor;
        let properties = Ctr.observedProperties || [];
        properties.forEach((prop) => {
            let descriptor = getDescriptor(Ctr.prototype, prop) || {};
            Object.defineProperty(this, prop, {
                configurable: true,
                get: wrapDescriptorGet(prop, descriptor),
                set: wrapDescriptorSet(prop, descriptor, (propKey, value) => {
                    DNAProperty.set(this, propKey, value);
                }),
            });
        });
        let attributes = Array.prototype.slice.call(this.attributes || [], 0);
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            let key = dashToCamel(attr.name);
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
    /**
     * Create a listener for node's property changes.
     * @param {string} propName The property name to observe.
     * @param {Function} callback The callback to fire.
     * @return {Object} An object with `cancel` method.
     */
    observeProperty(propName, callback) {
        return DNAProperty.observe(this, propName, callback);
    }
    /**
     * Create a listener for node's properties changes.
     * @param {Function} callback The callback to fire.
     * @return {Object} An object with `cancel` method.
     */
    observeProperties(callback) {
        return DNAProperty.observe(this, callback);
    }
};

/**
 * Simple Custom Component for properties initialization via attributes.
 * @class DNAPropertiesComponent
 * @extends HTMLElement
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAPropertiesComponent } from 'dna/component';
 * export class MyComponent extends DNAPropertiesComponent {
 *   static get observedProperties() {
 *     return ['name'];
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = register('my-component', MyComponent);
 * var temp = document.createElement('div');
 * temp.innerHTML = '<my-component name="Albert"></my-component>';
 * var element = temp.firstChild;
 * console.log(element.name); // logs "Albert"
 * ```
 */
export class DNAPropertiesComponent extends mix(HTMLElement).with(DNAPropertiesMixin) {}
