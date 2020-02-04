import { createSymbolKey } from './symbols';
import { isCustomElement } from './CustomElement';

/**
 * A Symbol which contains all Property instances of a Component.
 */
const PROPERTIES_SYMBOL = createSymbolKey();

/**
 * Decorator class element descriptor.
 */
export interface ClassElement {
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
     * Define a property observable.
     */
    observe?: ClassFieldObserver;
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
    /**
     * The property private symbol.
     */
    symbol?: symbol;
}

/**
 * Transform a class field descriptor to the native property descriptor.
 *
 * @param descriptor The class field descriptor.
 * @return The native property descriptor.
 */
function classFieldToProperty(descriptor: ClassFieldDescriptor, symbol: symbol): PropertyDescriptor {
    const finalDescriptor: PropertyDescriptor = {
        enumerable: true,
    };

    const getter = descriptor.getter || ((value) => value);
    const get = function get(this: any) {
        return getter.call(this, this[symbol]);
    };

    const setter = descriptor.setter || ((value) => value);
    const set = function set(this: any, value: any) {
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
    finalDescriptor.set = function(this: any, newValue: any) {
        const oldValue = this[symbol];
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

        this[symbol] = newValue;

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

        if (descriptor.observers) {
            descriptor.observers.forEach((observer) => observer(oldValue, newValue));
        }

        // trigger Property changes
        if (isCustomElement(this)) {
            this.propertyChangedCallback(descriptor.name as string, oldValue, newValue);
            this.forceUpdate();
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
 * @return The property symbol.
 */
export function defineProperty(target: Object, propertyKey: PropertyKey, descriptor: ClassFieldDescriptor, symbol: symbol = createSymbolKey()): symbol {
    const constructor = target.constructor;
    const descriptors: { [key: string]: ClassFieldDescriptor } = (constructor as any)[PROPERTIES_SYMBOL] = (constructor as any)[PROPERTIES_SYMBOL] || {};

    if (propertyKey in descriptors) {
        return descriptors[String(propertyKey)].symbol as symbol;
    }

    descriptors[String(propertyKey)] = descriptor;
    descriptor.name = propertyKey;
    descriptor.symbol = symbol;
    if (descriptor.attribute === true) {
        descriptor.attribute = String(propertyKey);
    }
    if (descriptor.observe) {
        descriptor.observers = [descriptor.observe, ...(descriptor.observers || [])];
    }
    Object.defineProperty(constructor.prototype, propertyKey, classFieldToProperty(descriptor, symbol));

    return symbol;
}

/**
 * Get a list of class field descriptors for a target.
 *
 * @param constructor The class constructor.
 * @return A list of class field descriptors keyed by property names.
 */
export function getProperties(constructor: Function): { [key: string]: ClassFieldDescriptor } {
    return (constructor as any)[PROPERTIES_SYMBOL] || {};
}

/**
 * Initialize instance property.
 *
 * @param target The class instance.
 * @param symbol The property symbolic key.
 * @param descriptor The property descriptor.
 * @param initializer The initializer function of the decorator.
 * @return The current property value.
 */
export function initProperty(target: any, symbol: symbol, descriptor: ClassFieldDescriptor, initializer?: Function): any {
    if (typeof target[symbol] !== 'undefined') {
        return target[symbol];
    }
    if (typeof initializer === 'function') {
        target[symbol] = initializer.call(target);
    } else if ('value' in descriptor) {
        target[symbol] = descriptor.value;
    } else if ('defaultValue' in descriptor) {
        target[symbol] = descriptor.defaultValue;
    }
    return target[symbol];
}

/**
 * A decorator for class fields definition.
 *
 * @param descriptor The class field description.
 * @return The decorator initializer.
 */
export function property(descriptor: ClassFieldDescriptor = {}) {
    return (targetOrClassElement: Object | ClassElement, propertyKey: PropertyKey, originalDescriptor: PropertyDescriptor) => {
        const symbol = createSymbolKey();

        let element: ClassElement;
        if (propertyKey !== undefined) {
            descriptor.defaultValue = originalDescriptor.value;
            defineProperty(targetOrClassElement, propertyKey, descriptor, symbol);
            initProperty(targetOrClassElement, symbol, descriptor);
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

        return {
            kind: 'field',
            key: symbol,
            placement: 'own',
            descriptor: {
                configurable: false,
                writable: true,
                enumerable: false,
            },
            initializer(this: any) {
                return initProperty(this, symbol, descriptor, element.initializer);
            },
            finisher(constructor: Function) {
                defineProperty(constructor.prototype, element.key, descriptor, symbol);
            },
        } as ClassElement;
    };
}
