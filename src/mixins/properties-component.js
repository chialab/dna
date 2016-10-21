import { PropertyList } from './lib/property.js';
import { isArray } from './lib/typeof.js';
import { dispatch } from './lib/dispatch.js';
import { isUndefined } from './lib/typeof.js';

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

function setAttribute(context, attr, value) {
    let currentAttrValue = context.getAttribute(attr);
    if (currentAttrValue !== value) {
        if (value !== null && value !== undefined && value !== false) {
            switch (typeof value) {
            case 'string':
            case 'number':
                context.setAttribute(attr, value);
                break;
            case 'boolean':
                context.setAttribute(attr, '');
            }
        } else if (currentAttrValue !== null) {
            context.removeAttribute(attr);
        }
    }
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
        let props = this.properties;
        let list = new PropertyList();
        if (!isArray(props)) {
            props = [props];
        }
        props.forEach((partialProps) => {
            list.add(partialProps);
        });
        props = list;
        Object.defineProperty(this, 'properties', {
            value: props,
            writable: false,
            configurable: true,
        });
        props.iterate((prop) => {
            prop.scoped(this).init();
        });
        props.iterate((prop) => {
            let { attrName, eventName } = prop;
            if (attrName || eventName) {
                prop.observe(() => {
                    if (attrName) {
                        setAttribute(this, attrName, this[prop.name]);
                    }
                    if (eventName) {
                        dispatch(this, eventName);
                    }
                });
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        let props = this.properties;
        props.iterate((prop) => {
            let { attrName } = prop;
            if (attrName) {
                if (isUndefined(this[prop.name])) {
                    if (this.hasAttribute(attrName)) {
                        this[prop.name] = getValue(prop, this.getAttribute(attrName));
                    }
                } else {
                    setAttribute(this, attrName, this[prop.name]);
                }
            }
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
        let prop = this.properties.get(attr, true);
        if (prop) {
            this[prop.name] = getValue(prop, newVal);
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
