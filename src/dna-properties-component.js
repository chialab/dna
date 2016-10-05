import { mix } from 'mixwith';
import { DNAComponent } from './dna-component.js';
import { DNAProperty } from './helpers/dna-property.js';
import { camelToDash, dashToCamel } from './helpers/strings.js';
import { setAttribute } from './helpers/set-attribute.js';
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
        let ctrProperties = (Ctr.observedProperties || [])
            .map((prop) => dashToCamel(prop));
        let ctrAttributes = Ctr.observedAttributes || [];
        ctrProperties.forEach((prop) => {
            let descriptor = getDescriptor(Ctr.prototype, prop) || {};
            Object.defineProperty(this, prop, {
                configurable: true,
                get: wrapDescriptorGet(prop, descriptor, (propKey) =>
                    this.getProperty(propKey)
                ),
                set: wrapDescriptorSet(prop, descriptor, (propKey, value) =>
                    this.setProperty(propKey, value)
                ),
            });
            let attrName = camelToDash(prop);
            if (ctrAttributes.indexOf(attrName) !== -1) {
                this.observeProperty(prop, (key, oldValue, newValue) =>
                    setAttribute(this, attrName, newValue)
                );
            }
        });
        let attributes = Array.prototype.slice.call(this.attributes || [], 0);
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            this.attributeChangedCallback(attr.name, undefined, attr.value);
        }
    }
    /**
     * On `attributeChanged` callback, sync attributes with properties.
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        let Ctr = this.constructor;
        let ctrProperties = Ctr.observedProperties || [];
        let propName = dashToCamel(attr);
        if (ctrProperties.indexOf(propName) !== -1 ||
            ctrProperties.indexOf(attr) !== -1) {
            newVal = (newVal === '') || newVal;
            try {
                this[propName] = (newVal === '') || JSON.parse(newVal);
            } catch (ex) {
                this[propName] = newVal;
            }
        }
    }
    /**
     * Get a property of a component.
     * @param {string} propName The property name to observe.
     * @return {*} The property value.
     */
    getProperty(propName) {
        return DNAProperty.get(this, propName);
    }
    /**
     * Set a property of a component.
     * @param {string} propName The property name to observe.
     * @param {*} propValue The property value.
     */
    setProperty(propName, propValue) {
        return DNAProperty.set(this, propName, propValue);
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
 * @extends DNAComponent
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
export class DNAPropertiesComponent extends mix(DNAComponent).with(DNAPropertiesMixin) {}
