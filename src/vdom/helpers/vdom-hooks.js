import { VHook } from '../lib/vdom.js';
import { DNAProperty } from '../../helpers/dna-property.js';

/**
 * A virtualDom hook for life cycle handling.
 * @private
 * @class LifeCycleHook
 */
export class LifeCycleHook extends VHook {
    static get CREATED_PROP() {
        return '__virtualDomCreated';
    }

    static get ATTACHED_PROP() {
        return '__virtualDomAttached';
    }

    hook(node) {
        let created = DNAProperty.get(node, LifeCycleHook.CREATED_PROP);
        if (!created) {
            DNAProperty.set(node, LifeCycleHook.CREATED_PROP, true, false);
        }
        this.isAttached(node);
    }

    isAttached(node) {
        let attached = DNAProperty.get(node, LifeCycleHook.ATTACHED_PROP);
        if (this.parentNode && !attached) {
            DNAProperty.set(node, LifeCycleHook.ATTACHED_PROP, true, false);
            this.trigger('connectedCallback');
        } else if (!this.parentNode && attached) {
            DNAProperty.set(node, LifeCycleHook.ATTACHED_PROP, false, false);
            this.trigger('disconnectedCallback');
        }
    }

    trigger(name, ...args) {
        if (typeof this[name] === 'function') {
            this[name].apply(this, args);
        }
    }
}

/**
 * A virtualDom hook for attributes handling.
 * @private
 * @class AttributeHook
 */
export class AttributeHook extends VHook {
    constructor(value, namespace) {
        super();
        this.value = value;
        this.namespace = namespace;
    }

    hook(node, propertyName, oldValue) {
        let value = this.value;
        let old = oldValue && oldValue.value;
        if (old !== value) {
            if (value !== undefined && value !== null) {
                if (this.namespace) {
                    node.removeAttribute(propertyName);
                    node.setAttributeNS(this.namespace, propertyName, value);
                } else {
                    node.setAttribute(propertyName, value);
                }
            } else if (oldValue) {
                if (this.namespace) {
                    node.removeAttributeNS(this.namespace, propertyName);
                } else {
                    node.removeAttribute(propertyName);
                }
            }
            if (typeof node.attributeChangedCallback === 'function') {
                node.attributeChangedCallback(propertyName, old, value);
            }
        }
    }
}
