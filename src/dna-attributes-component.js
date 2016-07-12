import { DNAComponent } from './dna-component.js';
import { registry } from './helpers/registry.js';
import { dashToCamel, camelToDash } from './helpers/strings.js';
import {
    getDescriptor, wrapDescriptorGet, wrapDescriptorSet,
} from './helpers/descriptor.js';
import { setAttribute } from './helpers/set-attribute.js';

function getAttributes(Ctr) {
    return (Ctr.observedAttributes || Ctr.attributes || [])
        .map((attr) => dashToCamel(attr));
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
     * On `created` callback, sync attributes with properties.
     */
    createdCallback() {
        super.createdCallback();
        let Ctr = registry(this.is);
        let ctrAttributes = getAttributes(Ctr);
        ctrAttributes.forEach((camelAttr) => {
            let descriptor = getDescriptor(Ctr.prototype, camelAttr) || {};
            Object.defineProperty(this, camelAttr, {
                configurable: true,
                get: wrapDescriptorGet(camelAttr, descriptor),
                set: wrapDescriptorSet(camelAttr, descriptor, function(prop, res) {
                    let dashed = camelToDash(prop);
                    setAttribute(this, dashed, res);
                }),
            });
        });
        let attributes = this.attributes || [];
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            this.attributeChangedCallback(attr.name, undefined, attr.value);
        }
        ctrAttributes.forEach((attr) => {
            setAttribute(this, camelToDash(attr), this[attr]);
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
        let attrs = getAttributes(registry(this.is));
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
