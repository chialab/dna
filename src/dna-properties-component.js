import { camelToDash, dashToCamel } from './helpers/strings.js';
import { setAttribute } from './helpers/set-attribute.js';
import { PropertyList } from './helpers/property.js';
import { isArray } from './helpers/typeof.js';

function getValue(property, attrVal) {
    if (attrVal === '' && property.accepts(Boolean)) {
        return true;
    }
    if (!property.accepts(String)) {
        try {
            return JSON.parse(attrVal);
        } catch (ex) {
            //
        }
    }
    return attrVal;
}

/**
 * Simple Custom Component for properties initialization via attributes.
 *
 * @example
 * my-component.js
 * ```js
 * import { Component, PropertiesMixin, mix } from 'dna/component';
 * export class MyComponent extends mix(Component).with(PropertiesMixin) {
 *   get properties() {
 *     return { name: String };
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { define } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * define('my-component', MyComponent);
 * var temp = document.createElement('div');
 * temp.innerHTML = '<my-component name="Albert"></my-component>';
 * var element = temp.firstChild;
 * console.log(element.name); // logs "Albert"
 * ```
 */
export const PropertiesMixin = (SuperClass) => class extends SuperClass {
    /**
     * On `created` callback, apply attributes to properties.
     */
    constructor() {
        super();
        let props = this.properties || new PropertyList();
        if (!(props instanceof PropertyList)) {
            let list = new PropertyList();
            if (!isArray(props)) {
                props = [props];
            }
            props.forEach((partialProps) => {
                list.add(partialProps);
            });
            props = list;
        }
        Object.defineProperty(this, 'properties', {
            value: props,
        });

        let attributes = Array.prototype.slice.call(this.attributes, 0);
        let initProps = {};
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            let propName = dashToCamel(attr.name);
            if (props.has(propName)) {
                initProps[propName] = getValue(props.get(propName), attr.value);
            }
        }
        props.iterate((prop) => {
            let attrName = camelToDash(prop.name);
            prop.scoped(this);
            prop.observe((newValue) => {
                setAttribute(this, attrName, newValue);
            });
            prop.init(initProps[prop.name]);
        });
    }
    /**
     * On `attributeChanged` callback, sync attributes with properties.
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        let propName = dashToCamel(attr);
        if (this.properties.has(propName)) {
            this[propName] = getValue(this.properties.get(propName), newVal);
        }
    }
    /**
     * Create a listener for node's property changes.
     * @param {string} propName The property name to observe.
     * @param {Function} callback The callback to fire.
     * @return {Object} An object with `cancel` method.
     */
    observeProperty(propName, callback) {
        this.properties.get(propName).observe(callback);
    }
    /**
     * Create a listener for node's properties changes.
     * @param {Function} callback The callback to fire.
     * @return {Object} An object with `cancel` method.
     */
    observeProperties(callback) {
        return this.properties.observe(callback);
    }
};
