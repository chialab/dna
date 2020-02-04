import { createSymbolKey } from './symbols';
import { isCustomElement } from './CustomElement';

/**
 * A Symbol which contains all Property instances of a Component.
 */
const PROPERTIES_SYMBOL = createSymbolKey();

/**
 * Decorator class element descriptor.
 */
interface ClassElement {
    /**
     * The kind of the class element.
     */
    kind: 'field' | 'method';
    /**
     * The name of the element.
     */
    key: PropertyKey;
    /**
     * The type of the element.
     */
    placement: 'static' | 'prototype' | 'own';
    /**
     * An initializer function.
     */
    initializer?: Function;
    /**
     * The element property descriptor.
     */
    descriptor?: PropertyDescriptor;
}

/**
 * The observer signature for class fields.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type ClassFieldObserver = (oldValue: any, newValue: any) => any;

/**
 * A list of properties for an class field description.
 */
export type ClassFieldDescriptor = PropertyDescriptor & {
    /**
     * The property name of the field.
     */
    name?: PropertyKey;
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
     * A list of field observables.
     */
    observers?: ClassFieldObserver[],
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: (value: any) => boolean;
    /**
     * Define a property observable.
     */
    observe?: (callback: ClassFieldObserver) => void;
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
 * Transform a class field descriptor to the native property descriptor.
 *
 * @param descriptor The class field descriptor.
 * @return The native property descriptor.
 */
function classFieldToProperty(descriptor: ClassFieldDescriptor, symbol: symbol = createSymbolKey()): PropertyDescriptor {
    const finalDescriptor: PropertyDescriptor = {
        enumerable: true,
    };

    const innerValue = function(this: Element) {
        if (symbol in this) {
            return (this as any)[symbol];
        }
        if ('value' in descriptor) {
            return descriptor.value;
        }
        if ('defaultValue' in descriptor) {
            return descriptor.defaultValue;
        }
        return;
    };

    const getter = descriptor.getter || ((value) => value);
    const get = function get(this: Element) {
        return getter.call(this, innerValue.call(this));
    };

    const setter = descriptor.setter || ((value) => value);
    const set = function(this: Element, value: any) {
        return setter.call(this, value);
    };

    let computedTypes: Function[] = [];
    if (Array.isArray(descriptor.types)) {
        computedTypes = descriptor.types;
    } else if (descriptor.types) {
        computedTypes = [descriptor.types];
    }

    const computedAttribute = descriptor.attribute as string;

    finalDescriptor.get = get;
    finalDescriptor.set = function(this: Element, newValue: any) {
        const oldValue = innerValue.call(this);
        newValue = set.call(this, newValue);

        if (oldValue === newValue) {
            // no changes
            return;
        }

        const falsy = newValue == null || newValue === false;
        // if types or custom validator has been set, check the value validity
        if (!falsy) {
            let valid = true;
            if (computedTypes.length) {
                // check if the value is an instanceof of at least one constructor
                valid = computedTypes.some((Type) => (newValue instanceof Type || (newValue.constructor && newValue.constructor === Type)));
            }
            if (valid && typeof descriptor.validate === 'function') {
                valid = descriptor.validate(newValue);
            }
            if (!valid) {
                throw new TypeError(`Invalid \`${newValue}\` value for \`${String(descriptor.name)}\` property`);
            }
        }

        (this as any)[symbol] = newValue;

        if (descriptor.attribute) {
            // update the bound attribute
            if (falsy) {
                // a falsy value should remove the attribute
                this.removeAttribute(computedAttribute);
            } else if (typeof newValue !== 'object') {
                // if the value is `true` should set an empty attribute, otherwise just set the value
                this.setAttribute(computedAttribute, newValue === true ? '' : newValue);
            }
        }
        // trigger Property changes
        if (isCustomElement(this)) {
            this.propertyChangedCallback(descriptor.name as string, oldValue, newValue);
        }
    };

    return finalDescriptor;
}

/**
 * Define a property on a target.
 *
 * @param target The target element of the definition.
 * @param propertyKey The name of the property.
 * @param descriptor The class field descriptor.
 */
export function defineProperty(target: Object, propertyKey: PropertyKey, descriptor: ClassFieldDescriptor, symbol?: symbol): void {
    const constructor = target.constructor;
    const descriptors = (constructor as any)[PROPERTIES_SYMBOL] = (constructor as any)[PROPERTIES_SYMBOL] || {};
    descriptors[propertyKey] = descriptor;
    descriptor.name = propertyKey;
    if (descriptor.attribute === true) {
        descriptor.attribute = String(propertyKey);
    }
    if (descriptor.observe) {
        descriptor.observers = [descriptor.observe];
    }
    Object.defineProperty(target, propertyKey, classFieldToProperty(descriptor, symbol));
}

/**
 * Get a list of class field descriptors for a target.
 *
 * @param target The class constructor.
 * @return A list of class field descriptors keyed by property names.
 */
export function getProperties(target: Function): { [key: string]: ClassFieldDescriptor } {
    return (target as any)[PROPERTIES_SYMBOL] || {};
}

/**
 * A decorator for class fields definition.
 *
 * @param descriptor The class field description.
 * @return The decorator initializer.
 */
export function property(descriptor: ClassFieldDescriptor = {}) {
    return (targetOrClassElement: Object | ClassElement, propertyKey: PropertyKey, originalDescriptor: PropertyDescriptor) => {
        let element: ClassElement;
        if (propertyKey !== undefined) {
            if (propertyKey in getProperties(targetOrClassElement.constructor)) {
                // already defined
                return;
            }
            descriptor.defaultValue = originalDescriptor.value;
            const prototype = Object.getPrototypeOf(targetOrClassElement);
            defineProperty(prototype, propertyKey, descriptor);
            return;
        } else {
            element = targetOrClassElement as ClassElement;
        }

        if (element.kind !== 'field' || element.placement !== 'own') {
            return element;
        }

        if (element.descriptor) {
            descriptor.defaultValue = element.descriptor.value;
        }

        const symbol = createSymbolKey();
        return {
            kind: 'field',
            key: symbol,
            placement: 'own',
            descriptor: {
                writable: true,
            },
            initializer(this: Object) {
                if (symbol in this) {
                    // already initialized
                    return;
                }
                if (typeof element.initializer === 'function') {
                    (this as any)[element.key] = element.initializer.call(this);
                }
            },
            finisher(Constructor: Function) {
                defineProperty(Constructor.prototype, element.key, descriptor, symbol);
            },
        } as ClassElement;
    };
}
