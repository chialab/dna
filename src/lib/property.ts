import { createSymbolKey } from './symbols';
import { CustomElement } from './CustomElement';
import { ClassElement } from './ClassElement';

/**
 * A Symbol which contains all Property instances of a Component.
 */
const PROPERTIES_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * The observer signature for class fields.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type ClassFieldObserver = (oldValue: any, newValue: any) => any;

/**
 * A validation function for the class field.
 *
 * @param value The value to set.
 */
export type ClassFieldValidator = (value: any) => boolean;

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
    attribute?: string;
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
    validate?: ClassFieldValidator;
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
const classFieldToProperty = (descriptor: ClassFieldDescriptor, symbol: symbol): PropertyDescriptor => {
    const computedTypes = descriptor.types as Function[];
    const validate = typeof descriptor.validate === 'function' && descriptor.validate;
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
            if (valid && validate) {
                valid = validate(newValue);
            }
            if (!valid) {
                throw new TypeError(`Invalid \`${newValue}\` value for \`${String(descriptor.name)}\` property`);
            }
        }

        this[symbol] = newValue;

        if (descriptor.observers) {
            descriptor.observers.forEach((observer) => observer.call(this, oldValue, newValue));
        }

        // trigger Property changes
        if (typeof this.propertyChangedCallback === 'function') {
            this.propertyChangedCallback(descriptor.name as string, oldValue, newValue);
            this.forceUpdate();
        }
    };

    return finalDescriptor;
};

/**
 * Define a property on a target.
 *
 * @param target The target element of the definition.
 * @param propertyKey The name of the property.
 * @param descriptor The class field descriptor.
 * @return The property symbol.
 */
export const defineProperty = (target: Object, propertyKey: string, descriptor: ClassFieldDescriptor, symbol: symbol = createSymbolKey()): symbol => {
    const constructor = target.constructor as Function & {
        [PROPERTIES_SYMBOL]?: {
            [key: string]: ClassFieldDescriptor;
        }
    };
    const descriptors = constructor[PROPERTIES_SYMBOL] = constructor[PROPERTIES_SYMBOL] || {};

    if (Object.prototype.hasOwnProperty.call(descriptors, propertyKey)) {
        return descriptors[propertyKey].symbol as symbol;
    }

    descriptors[propertyKey] = descriptor;
    descriptor.name = propertyKey;
    descriptor.symbol = symbol;

    let types = descriptor.types || [];
    if (!Array.isArray(types)) {
        types = [types];
    }
    descriptor.types = types;

    let observers = descriptor.observers || [];
    if (descriptor.observe) {
        observers = [descriptor.observe, ...observers];
    }
    descriptor.observers = observers;
    (descriptor as any).__proto__ = null;

    Object.defineProperty(constructor.prototype, propertyKey, classFieldToProperty(descriptor, symbol));

    return symbol;
};

/**
 * Get a list of class field descriptors for a target.
 *
 * @param constructor The class constructor.
 * @return A list of class field descriptors keyed by property names.
 */
export const getProperties = (constructor: Function): { [key: string]: ClassFieldDescriptor } => (constructor as any)[PROPERTIES_SYMBOL] || {};

/**
 * Initialize instance property.
 *
 * @param target The class instance.
 * @param symbol The property symbolic key.
 * @param descriptor The property descriptor.
 * @param initializer The initializer function of the decorator.
 * @return The current property value.
 */
export const initProperty = (target: any, symbol: symbol, descriptor: ClassFieldDescriptor, initializer?: Function): any => {
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
};

/**
 * A decorator for class fields definition.
 *
 * @param descriptor The class field description.
 * @return The decorator initializer.
 */
export const property = (descriptor: ClassFieldDescriptor = {}) =>
    ((targetOrClassElement: CustomElement, propertyKey: string, originalDescriptor: PropertyDescriptor) => {
        const symbol = createSymbolKey();
        if (propertyKey !== undefined) {
            // decorators spec 1
            if (originalDescriptor) {
                descriptor.defaultValue = originalDescriptor.value;
            }
            defineProperty(targetOrClassElement, propertyKey, descriptor, symbol);
            initProperty(targetOrClassElement, symbol, descriptor);
            return targetOrClassElement;
        }

        // decorators spec 2
        const element = targetOrClassElement as unknown as  ClassElement;

        if (element.kind !== 'field' || element.placement !== 'own') {
            return element;
        }

        if (element.descriptor) {
            descriptor.defaultValue = element.descriptor.value;
        }

        return {
            kind: element.kind,
            key: symbol,
            placement: element.placement,
            descriptor: {
                configurable: false,
                writable: true,
                enumerable: false,
            },
            initializer(this: CustomElement) {
                // remove old prototype property definition Chrome < 40
                delete (this as any)[element.key];
                return initProperty(this, symbol, descriptor, element.initializer);
            },
            finisher(constructor: Function) {
                defineProperty(constructor.prototype, String(element.key), descriptor, symbol);
            },
        };
    }) as any;
