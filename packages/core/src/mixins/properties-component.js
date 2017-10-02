import { define } from '../helpers/obj-define.js';
import { reduceObjectProperty } from '../lib/reduce.js';
import { isFalsy, isUndefined } from '../lib/typeof.js';
import { dispatch } from '../lib/dispatch.js';
import { prop, Property } from '../lib/property.js';

/**
 * Try to parse attribute value checking the property validation types.
 * @private
 *
 * @param {Property} property The property to update.
 * @param {String} attrVal The attribute value.
 * @return {*} The parsed value.
 */
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
 * Set an attribute value checking its type.
 * @private
 *
 * @param {Object} component The component to update.
 * @param {String} attr The attribute name to update.
 * @param {*} value The value to set.
 */
function setAttribute(context, attr, value) {
    let currentAttrValue = context.getAttribute(attr);
    if (currentAttrValue !== value) {
        if (!isFalsy(value)) {
            if (typeof value === 'boolean') {
                value = '';
            }
            context.setAttribute(attr, value);
        } else if (currentAttrValue !== null) {
            context.removeAttribute(attr);
        }
    }
}

/**
 * Simple Custom Component for properties initialization via attributes.
 * @mixin PropertiesMixin
 * @memberof DNA.MIXINS
 *
 * @param {Function} SuperClass The class to extend.
 * @return {Function} The extended class.
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get properties() {
 *     return { name: String };
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var temp = document.createElement('div');
 * temp.innerHTML = '<my-component name="Albert"></my-component>';
 * var element = temp.firstChild;
 * console.log(element.name); // logs "Albert"
 * ```
 */
export const PropertiesMixin = (SuperClass) => class extends SuperClass {
    /**
     * Attach properties on component creation.
     * @method constructor
     * @memberof DNA.MIXINS.PropertiesMixin
     * @instance
     */
    constructor(node) {
        super(node);
        let props = reduceObjectProperty(this, 'properties');
        for (let k in props) {
            if (!(props[k] instanceof Property)) {
                props[k] = prop(props[k]);
            }
        }
        define(this, 'properties', { value: props });
        let observed = this.constructor.observedAttributes || [];
        for (let k in props) {
            let prop = props[k];
            prop.named(k)
                .observe((prop, newValue, oldValue) =>
                    this.propertyChangedCallback(prop.name, oldValue, newValue)
                )
                .init(this);
            let { attrName, eventName } = prop;
            if (!attrName && observed.indexOf(k) !== -1) {
                prop.attribute();
                attrName = k;
            }
            if (attrName || eventName) {
                prop.observe((changedProp, newValue, oldValue) => {
                    if (attrName) {
                        setAttribute(this, attrName, this[prop.name]);
                    }
                    if (eventName) {
                        dispatch(this, eventName, {
                            component: this,
                            property: changedProp.name,
                            newValue,
                            oldValue,
                        });
                    }
                });
            }
        }
    }
    /**
     * Sync initial attributes with properties.
     * @method connectedCallback
     * @memberof DNA.MIXINS.PropertiesMixin
     * @instance
     */
    connectedCallback() {
        super.connectedCallback();
        let props = this.properties;
        for (let k in props) {
            let prop = props[k];
            let { attrName, name } = prop;
            if (isUndefined(this[name]) || prop.defaultSet) {
                if (this.hasAttribute(attrName || name)) {
                    this[name] = getValue(prop, this.getAttribute(attrName || name));
                } else if (!isUndefined(this.node[name])) {
                    this[name] = this.node[name];
                }
            }
            if (attrName) {
                setAttribute(this, attrName, this[name]);
            }
        }
    }
    /**
     * Sync attributes with properties.
     * @method attributeChangedCallback
     * @memberof DNA.MIXINS.PropertiesMixin
     * @instance
     *
     * @param {String} attrName The changed attribute name.
     * @param {String} oldVal The value of the attribute before the change.
     * @param {String} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        let props = this.properties;
        for (let k in props) {
            let prop = props[k];
            if (prop.attrName === attr) {
                this[prop.name] = getValue(prop, newVal);
                return;
            }
        }
    }
    /**
     * Callback for property changes.
     * - Just define the callback, do nothing.
     * @method propertyChangedCallback
     * @memberof DNA.MIXINS.PropertiesMixin
     * @instance
     *
     * @param {String} propName The changed property name.
     * @param {String} oldVal The value of the property before the change.
     * @param {String} newVal The value of the property after the change.
     */
    propertyChangedCallback() {}
    /**
     * Create a listener for node's property changes.
     * @method observeProperty
     * @memberof DNA.MIXINS.PropertiesMixin
     * @instance
     *
     * @param {string} propName The property name to observe.
     * @param {Function} callback The callback to fire.
     * @return {Object} An object with `cancel` method.
     */
    observeProperty(propName, callback) {
        return this.properties[propName].observe(callback);
    }
    /**
     * Remove a listener for node's property changes.
     * @method unobserveProperty
     * @memberof DNA.MIXINS.PropertiesMixin
     * @instance
     *
     * @param {string} propName The property name to unobserve.
     * @param {Function} callback The callback to remove.
     */
    unobserveProperty(propName, callback) {
        this.properties[propName].unobserve(callback);
    }
};
