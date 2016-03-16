import { DNAComponent } from './dna-component.next.js';
import { DNAHelper } from './dna-helper.next.js';

function camelToDash(str) {
    return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

function dashToCamel(str) {
    return str.replace(/\W+(.)/g, (x, chr) => chr.toUpperCase());
}

/**
 * Simple Custom Component with attributes watching and reflecting.
 * @class DNAAttributesComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.next.js
 * ```js
 * import { DNAAttributesComponent } from 'dna/component';
 * export class MyComponent extends DNAAttributesComponent {
 *   get attributes() {
 *     return ['name'];
 *   }
 * }
 * ```
 * app.next.js
 * ```js
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.next.js';
 * var MyElement = Register(MyComponent);
 * var element = new MyElement();
 * element.setAttribute('name', 'Newton');
 * console.log(element.name); // logs "Newton"
 * ```
 */
export class DNAAttributesComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     */
    static onRegister() {
        let attributesToWatch = this.attributes || [];
        this.normalizedAttributes = attributesToWatch.map((attr) => {
            let camelAttr = dashToCamel(attr);
            let descriptor = DNAHelper.getDescriptor(this.prototype, camelAttr) || {};
            Object.defineProperty(this.prototype, camelAttr, {
                configurable: true,
                get: DNAHelper.wrapDescriptorGet(camelAttr, descriptor),
                set: DNAHelper.wrapDescriptorSet(camelAttr, descriptor, function(prop, res) {
                    let dashed = camelToDash(prop);
                    if (res !== null && res !== undefined && res !== false) {
                        if (
                            (typeof res === 'string' || typeof res === 'number')
                            && this.getAttribute(prop) !== res) {
                            this.setAttribute(dashed, res);
                        } else if (typeof res === 'boolean') {
                            this.setAttribute(dashed, dashed);
                        }
                    } else if (this.getAttribute(dashed)) {
                        this.removeAttribute(dashed);
                    }
                }),
            });
            return camelAttr;
        });
    }
    /**
     * On `created` callback, sync attributes with properties.
     */
    createdCallback() {
        super.createdCallback();
        let attributes = this.attributes || [];
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            if (attr.value === '') {
                // boolean attributes
                if (this.getAttribute(attr.name) !== null) {
                    this.attributeChangedCallback(attr.name, undefined, true);
                }
                continue;
            }
            this.attributeChangedCallback(attr.name, undefined, attr.value);
        }
        let ctrAttributes = this.constructor.normalizedAttributes || [];
        ctrAttributes.forEach((attr) => {
            if (this[attr] !== null && this[attr] !== undefined && this[attr] !== false) {
                this.setAttribute(camelToDash(attr), this[attr]);
            }
        });
    }
    /**
     * On `attributeChanged` callback, sync attributes with properties.
     * @private
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        let cl = this.constructor;
        if (cl && cl.normalizedAttributes && Array.isArray(cl.normalizedAttributes)) {
            let camelAttr = dashToCamel(attr);
            if (cl.normalizedAttributes.indexOf(camelAttr) !== -1) {
                this[camelAttr] = newVal;
            }
        }
    }
}
