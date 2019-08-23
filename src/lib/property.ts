import { createSymbolKey } from './symbols';
import { isCustomElement } from './CustomElement';

/**
 * A Symbol which contains all Property instances of a Component.
 */
const PROPERTIES_SYMBOL = createSymbolKey();

/**
 * The observer signature for accessors.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type AccessorObserver = (oldValue: any, newValue: any) => any;

/**
 * A list of properties for an accessor description.
 */
export type AccessorDescriptor = PropertyDescriptor & {
    /**
     * The name of the property accessor.
     */
    name?: string;
    /**
     * The property is bound to an attribute. Also specifies the attribute name if different from the property.
     */
    attribute?: string | boolean;
    /**
     * The initial value of the property.
     */
    defaultValue?: any;
    /**
     * A list of valid property values prototypes.
     */
    types?: Function | Function[],
    /**
     * A list of accessor observables.
     */
    observers?: AccessorObserver[],
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: (value: any) => boolean;
    /**
     * Define a property observable.
     */
    observe?: (callback: AccessorObserver) => void;
    /**
     * Define custom getter for the property.
     * @param value The current property value.
     */
    getter?: (this: Element, value?: any) => any;
    /**
     * Define a custom setter for the property.
     * It runs before property validations.
     * The returned value will be set to the property.
     * @param newValue The value to set.
     */
    setter?: (this: Element, newValue?: any) => any;
}

/**
 * Transform an accessor descriptor to the native property descriptor.
 *
 * @param descriptor The accessor descriptor.
 * @return The native property descriptor.
 */
function accessorToProperty(descriptor: AccessorDescriptor): PropertyDescriptor {
    let finalDescriptor: PropertyDescriptor = {
        enumerable: true,
    };

    let value = descriptor.value;
    if ('defaultValue' in descriptor) {
        value = descriptor.defaultValue;
    }

    let get = function(this: Element) {
        return value;
    };
    if (descriptor.getter) {
        let getter = descriptor.getter;
        get = function(this: Element) {
            return getter.call(this, value);
        };
    }

    let set = function(this: Element, val: any) {
        return val;
    };
    if (descriptor.setter) {
        let setter = descriptor.setter;
        set = function(this: Element, val) {
            return setter.call(this, val);
        };
    }

    let computedTypes: Function[] = [];
    if (Array.isArray(descriptor.types)) {
        computedTypes = descriptor.types;
    } else if (descriptor.types) {
        computedTypes = [descriptor.types];
    }

    let computedAttribute = descriptor.attribute as string;

    finalDescriptor.get = get;
    finalDescriptor.set = function(this: Element, newValue: any) {
        let oldValue = value;
        newValue = set.call(this, newValue);
        if (oldValue !== newValue) {
            let falsy = newValue == null || newValue === false;
            // if types or custom validator has been set, check the value validity
            if (!falsy) {
                let valid = true;
                if (computedTypes.length) {
                    // check if the value is an instanceof of at least one constructor
                    valid = computedTypes.some((Type) => (value instanceof Type || (value.constructor && value.constructor === Type)));
                }
                if (valid && descriptor.validate) {
                    valid = descriptor.validate(value);
                }
                if (!valid) {
                    throw new TypeError(`Invalid \`${value}\` value for \`${descriptor.name}\` property`);
                }
            }
            value = newValue;
            if (descriptor.attribute) {
                // update the bound attribute
                if (falsy) {
                    // a falsy value should remove the attribute
                    this.removeAttribute(computedAttribute);
                } else if (typeof value !== 'object') {
                    // if the value is `true` should set an empty attribute, otherwise just set the value
                    this.setAttribute(computedAttribute, value === true ? '' : value);
                }
            }
            // trigger Property changes
            if (isCustomElement(this)) {
                this.propertyChangedCallback(descriptor.name as string, oldValue, value);
            }
        }
    };

    return finalDescriptor;
}

/**
 * Define a property on a target.
 *
 * @param target The target element of the definition.
 * @param propertyKey The name of the property.
 * @param descriptor The accessor descriptor.
 */
export function defineProperty(target: Element, propertyKey: string, descriptor: AccessorDescriptor): void {
    const descriptors = (target as any)[PROPERTIES_SYMBOL] || {};
    descriptors[propertyKey] = descriptor;
    (target as any)[PROPERTIES_SYMBOL] = descriptors;
    descriptor.name = propertyKey;
    if (descriptor.attribute === true) {
        descriptor.attribute = propertyKey;
    }
    if (descriptor.observe) {
        descriptor.observers = [descriptor.observe];
    }
    Object.defineProperty(target, propertyKey, accessorToProperty(descriptor));
}

/**
 * Get a list of accessor descriptors for a target.
 *
 * @param target The target element.
 * @return A list of accessor descriptors keyed by property names.
 */
export function getProperties(target: Element): { [key: string]: AccessorDescriptor } {
    return (target as any)[PROPERTIES_SYMBOL] || {};
}

/**
 * A decorator for accessors definition.
 *
 * @param descriptor The accessor description.
 * @return The decorator initializer.
 */
export function property(descriptor: AccessorDescriptor = {}) {
    return (target: Element, propertyKey: string, originalDescriptor: PropertyDescriptor) => {
        descriptor.defaultValue = originalDescriptor.value;
        defineProperty(target, propertyKey, descriptor);
    };
}
