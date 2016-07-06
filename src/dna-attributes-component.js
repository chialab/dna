import { DNAComponent } from './dna-component.js';
import {
    registry,
    dashToCamel,
    camelToDash,
    getDescriptor,
    wrapDescriptorGet,
    wrapDescriptorSet,
} from './dna-helper.js';

const ATTRIBUTES_CACHE = {};

function setValue(context, attr, value) {
    let currentAttrValue = context.getAttribute(attr);
    if (value !== null && value !== undefined && value !== false) {
        if (
            (typeof value === 'string' || typeof value === 'number')
            && currentAttrValue !== value) {
            context.setAttribute(attr, value);
        } else if (typeof value === 'boolean' && currentAttrValue !== '') {
            context.setAttribute(attr, '');
        }
    } else if (currentAttrValue || currentAttrValue === '') {
        context.removeAttribute(attr);
    }
}

/**
 * Simple Custom Component with attributes watching and reflecting.
 * @class DNAAttributesComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAAttributesComponent } from 'dna/component';
 * export class MyComponent extends DNAAttributesComponent {
 *   static get observedAttributes() {
 *     return ['name'];
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = register('my-component', MyComponent);
 * var element = new MyElement();
 * element.setAttribute('name', 'Newton');
 * console.log(element.name); // logs "Newton"
 * ```
 */
export class DNAAttributesComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     * @param {String} id The element definition name.
     */
    static onRegister(is) {
        let attributesToWatch = this.observedAttributes || this.attributes || [];
        ATTRIBUTES_CACHE[is] = attributesToWatch.map((attr) => dashToCamel(attr));
    }
    /**
     * On `created` callback, sync attributes with properties.
     */
    createdCallback() {
        super.createdCallback();
        let Ctr = registry(this.is);
        let ctrAttributes = ATTRIBUTES_CACHE[this.is] || [];
        ctrAttributes.forEach((camelAttr) => {
            let descriptor = getDescriptor(Ctr.prototype, camelAttr) || {};
            Object.defineProperty(this, camelAttr, {
                configurable: true,
                get: wrapDescriptorGet(camelAttr, descriptor),
                set: wrapDescriptorSet(camelAttr, descriptor, function(prop, res) {
                    let dashed = camelToDash(prop);
                    setValue(this, dashed, res);
                }),
            });
        });
        let attributes = this.attributes || [];
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            this.attributeChangedCallback(attr.name, undefined, attr.value);
        }
        ctrAttributes.forEach((attr) => {
            setValue(this, camelToDash(attr), this[attr]);
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
        let attrs = ATTRIBUTES_CACHE[this.is];
        if (attrs && Array.isArray(attrs)) {
            let camelAttr = dashToCamel(attr);
            if (attrs.indexOf(camelAttr) !== -1) {
                if (newVal === '') {
                    newVal = true;
                }
                if (newVal !== this[camelAttr]) {
                    this[camelAttr] = newVal;
                }
            }
        }
    }
}
