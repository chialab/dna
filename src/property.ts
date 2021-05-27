import type { ComponentInstance, ComponentConstructor } from './Component';
import type { ClassElement } from './ClassElement';
import { createSymbolKey } from './symbols';
import { HTMLElement, isArray, defineProperty as _defineProperty, getOwnPropertyDescriptor, hasOwnProperty } from './helpers';
import { isConstructed } from './Component';

/**
 * A Symbol which contains all Property instances of a Component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PROPERTIES_SYMBOL: unique symbol = createSymbolKey() as any;

type WithProperties<T> = T & {
    [PROPERTIES_SYMBOL]?: {
        [propertyKey: string]: ClassFieldDescriptor;
    };
};

/**
 * The observer signature for class fields.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type ClassFieldObserver = (oldValue: unknown, newValue: unknown) => unknown;

/**
 * A validation function for the class field.
 *
 * @param value The value to set.
 */
export type ClassFieldValidator = (value: unknown) => boolean;

/**
 * Convert attribute to property value.
 *
 * @param value The attributue value.
 * @return The property value.
 */
export type ClassFieldAttributeConverter = (value: string|null) => unknown;

/**
 * Convert property to attribute value.
 *
 * @param value The property value.
 * @return The attributue value.
 */
export type ClassFieldPropertyConverter = (value: any) => string|null|undefined;

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
    attribute?: true|string;
    /**
     * The initial value of the property.
     */
    defaultValue?: unknown;
    /**
     * A list of valid property values prototypes.
     */
    type?: Function | Function[];
    /**
     * Convert attribute to property value.
     */
    fromAttribute?: ClassFieldAttributeConverter;
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @return The attributue value.
     */
    toAttribute?: ClassFieldPropertyConverter;
    /**
     * Define a property observable.
     */
    observe?: ClassFieldObserver;
    /**
     * A list of field observables.
     */
    observers?: ClassFieldObserver[];
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: ClassFieldValidator;
    /**
     * Define custom getter for the property.
     * @param value The current property value.
     */
    getter?: (value?: any) => any;
    /**
     * Define a custom setter for the property.
     * It runs before property validations.
     * The returned value will be set to the property.
     * @param newValue The value to set.
     */
    setter?: (newValue?: any) => any;
    /**
     * The event to fire on property change.
     */
    event?: true|string;
    /**
     * The property private symbol.
     */
    symbol?: symbol;
    /**
     * The initializer function.
     */
    initializer?: Function;
}

/**
 * Retrieve all properties descriptors.
 * @param constructor The component constructor.
 * @return A list of class field descriptors.
 */
export const getProperties = (constructor: WithProperties<ComponentConstructor<HTMLElement>>) => {
    const props = (constructor[PROPERTIES_SYMBOL] || {}) as {
        [propertyKey: string]: ClassFieldDescriptor;
    };

    if (!hasOwnProperty.call(constructor, PROPERTIES_SYMBOL)) {
        return {
            __proto__: props,
        } as {
            [propertyKey: string]: ClassFieldDescriptor;
        };
    }

    return props;
};

/**
 * Retrieve property descriptor.
 * @param constructor The component constructor.
 * @param propertyKey The name of the property.
 * @return The class field descriptor.
 */
export const getProperty = (constructor: ComponentConstructor<HTMLElement>, propertyKey: string) => getProperties(constructor)[propertyKey];

const getTypes = (descriptor: ClassFieldDescriptor) => {
    const type = descriptor.type;
    if (!type) {
        return [];
    }
    if (isArray(type)) {
        return type;
    }

    return [type];
};

const getObservers = (descriptor: ClassFieldDescriptor) => {
    const observers = descriptor.observers || [];
    if (descriptor.observe) {
        return [descriptor.observe, ...observers];
    }
    return observers;
};

/**
 * Define an observed property.
 * @param constructor The component constructor.
 * @param propertyKey The name of the class field.
 * @param descriptor The property descriptor.
 * @param symbol The symbol to use to store property value.
 * @param initializer The initializer function.
 * @return The final descriptor.
 */
export const defineProperty = (constructor: WithProperties<ComponentConstructor<HTMLElement>>, propertyKey: string, descriptor: ClassFieldDescriptor, symbolKey?: symbol, initializer?: Function): PropertyDescriptor => {
    const symbol = symbolKey || createSymbolKey(propertyKey);
    const observedAttributes = constructor.observedAttributes;
    const descriptors = constructor[PROPERTIES_SYMBOL] = getProperties(constructor);
    descriptors[propertyKey] = descriptor;
    (descriptor as any).__proto__ = null;
    descriptor.name = propertyKey;
    descriptor.symbol = symbol;
    descriptor.initializer = initializer;

    const hasAttribute = descriptor.attribute || (observedAttributes && observedAttributes.indexOf(propertyKey) !== -1);
    const attribute = descriptor.attribute = hasAttribute === true ? propertyKey : hasAttribute as string;
    const type = descriptor.type = getTypes(descriptor);
    const observers = descriptor.observers = getObservers(descriptor);

    if (attribute) {
        descriptor.fromAttribute = descriptor.fromAttribute || ((newValue) => {
            if (type.indexOf(Boolean) !== -1 && (!newValue || newValue === attribute)) {
                if (newValue === '' || newValue === attribute) {
                    // if the attribute value is empty or it is equal to the attribute name consider it as a boolean
                    return true;
                }
                return false;
            }
            if (newValue) {
                if (type.indexOf(Number) !== -1 && !isNaN(newValue as unknown as number)) {
                    return parseFloat(newValue);
                }
                if (type.indexOf(String) === -1) {
                    try {
                        return JSON.parse(newValue as string);
                    } catch {
                        //
                    }
                }
            }
            return newValue;
        });
        descriptor.toAttribute = descriptor.toAttribute || ((newValue) => {
            if (newValue == null || newValue === false) {
                // a falsy value should remove the attribute
                return null;
            }
            if (typeof newValue === 'object') {
                // objects should be ignored
                return;
            }
            // if the value is `true` should set an empty attribute
            if (newValue === true) {
                return '';
            }
            // otherwise just set the value
            return `${newValue}`;
        });
    }

    const validate = typeof descriptor.validate === 'function' && descriptor.validate;
    const finalDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: true,
    };

    const getter = descriptor.getter || ((value) => value);
    const get = function get(this: any) {
        return getter.call(this, this[symbol]);
    };

    const setter = descriptor.setter || ((value) => value);
    const set = function set(this: any, value: unknown) {
        return setter.call(this, value);
    };

    finalDescriptor.get = get;
    finalDescriptor.set = function(this: ComponentInstance<HTMLElement>, newValue: unknown) {
        if (!isConstructed(this)) {
            (this as any)[symbol] = newValue;
            return;
        }

        const oldValue = (this as any)[symbol];
        newValue = set.call(this, newValue);

        if (oldValue === newValue) {
            // no changes
            return;
        }

        // if types or custom validator has been set, check the value validity
        if (newValue != null && newValue !== false) {
            let valid = true;
            if (type.length) {
                // check if the value is an instanceof of at least one constructor
                valid = type.some((Type) => (newValue instanceof Type || ((newValue as any).constructor === Type)));
            }
            if (valid && validate) {
                valid = validate.call(this, newValue);
            }
            if (!valid) {
                throw new TypeError(`Invalid \`${newValue}\` value for \`${String(descriptor.name)}\` property`);
            }
        }

        (this as any)[symbol] = newValue;

        if (observers) {
            for (let i = 0, len = observers.length; i < len; i++) {
                observers[i].call(this, oldValue, newValue);
            }
        }

        // trigger Property changes
        this.propertyChangedCallback(descriptor.name as string, oldValue, newValue);
    };

    _defineProperty(constructor.prototype, propertyKey, finalDescriptor);

    return finalDescriptor;
};

/**
 * A decorator for class fields definition.
 *
 * @param descriptor The class field description.
 * @return The decorator initializer.
 */
export const property = (descriptor: ClassFieldDescriptor = {}) =>
    // TypeScript complains about return type because we handle babel output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((targetOrClassElement: ComponentInstance<HTMLElement>|ClassElement, propertyKey: string, originalDescriptor?: ClassFieldDescriptor): any => {
        const symbol = createSymbolKey(propertyKey);
        if (propertyKey !== undefined) {
            // spec 1 and typescript
            const constructor = (targetOrClassElement as ComponentInstance<HTMLElement>).constructor as ComponentConstructor<HTMLElement>;
            let initializer: Function|undefined;
            if (originalDescriptor) {
                descriptor.defaultValue = originalDescriptor.value;
                initializer = originalDescriptor.initializer;
            }

            return defineProperty(constructor, propertyKey, descriptor, symbol, initializer);
        }

        // spec 2
        const element = targetOrClassElement as ClassElement;
        const key = String(element.key);

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
            initializer(this: ComponentInstance<HTMLElement>) {
                return (this as any)[symbol];
            },
            finisher(constructor: ComponentConstructor<HTMLElement>) {
                defineProperty(constructor, key, descriptor, symbol, element.initializer);
            },
        };
    });

/**
 * Define component constructor properties.
 * @param constructor The component constructor.
 */
export const defineProperties = (constructor: ComponentConstructor<HTMLElement>) => {
    const handled: { [key: string]: boolean } = {};
    let ctr = constructor;
    while (ctr && ctr !== HTMLElement) {
        const propertiesDescriptor = getOwnPropertyDescriptor(ctr, 'properties');
        const propertiesGetter = propertiesDescriptor && propertiesDescriptor.get;
        if (propertiesGetter) {
            const descriptorProperties = (propertiesGetter.call(constructor) || {}) as {
                [key: string]: ClassFieldDescriptor | Function | Function[];
            };
            for (let propertyKey in descriptorProperties) {
                if (propertyKey in handled) {
                    continue;
                }
                let descriptor = descriptorProperties[propertyKey];
                if (typeof descriptor === 'function' || isArray(descriptor)) {
                    descriptor = { type: descriptor };
                }
                defineProperty(constructor, propertyKey, descriptor);
                handled[propertyKey] = true;
            }
        }
        ctr = Object.getPrototypeOf(ctr);
    }
};
