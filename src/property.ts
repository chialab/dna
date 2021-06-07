import type { ClassElement, Constructor } from './types';
import type { ComponentInstance, ComponentConstructor } from './Component';
import { createSymbolKey, HTMLElement, isArray, defineProperty as _defineProperty, getOwnPropertyDescriptor, hasOwnProperty } from './helpers';
import { isConstructed } from './Component';

/**
 * A Symbol which contains all Property instances of a Component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PROPERTIES_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Retrieve properties declarations of a Component.
 */
export type PropertiesOf<T extends ComponentInstance<HTMLElement>> = {
    [P in keyof T]: Property<T, P>;
};

export type WithProperties<T extends ComponentInstance<HTMLElement>> = T & {
    [PROPERTIES_SYMBOL]?: PropertiesOf<T>;
};

/**
 * The observer signature for propertys.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type PropertyObserver<TypeHint = unknown> = (oldValue: TypeHint|undefined, newValue: TypeHint) => void;

/**
 * A validation function for the property.
 *
 * @param value The value to set.
 */
export type PropertyValidator = (value: unknown) => boolean;

/**
 * Convert attribute to property value.
 *
 * @param value The attributue value.
 * @return The property value.
 */
export type PropertyFromAttributeConverter<TypeHint = unknown> = (value: string|null) => TypeHint;

/**
 * Convert property to attribute value.
 *
 * @param value The property value.
 * @return The attributue value.
 */
export type PropertyToAttributeConverter<TypeHint = unknown> = (value: TypeHint) => string|null|undefined;

/**
 * A stateful property declaration.
 */
export type StateDeclaration<TypeHint = unknown> = PropertyDescriptor & {
    /**
     * The initial value of the property.
     */
    defaultValue?: TypeHint;
     /**
      * A list of valid property values prototypes.
      */
    type?: Constructor<TypeHint> | Constructor<TypeHint>[];
    /**
     * Define a property observable.
     * @deprecated Use the `watch` decorator on class method the `observers` static accessor.
     */
    observe?: PropertyObserver<TypeHint>;
    /**
     * A list of field observables.
     * @deprecated Use the `watch` decorator on class method the `observers` static accessor.
     */
    observers?: PropertyObserver<TypeHint>[];
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: PropertyValidator;
    /**
     * Define custom getter for the property.
     * @param value The current property value.
     */
    getter?: (value?: TypeHint) => ReturnType<NonNullable<PropertyDescriptor['get']>>;
    /**
     * Define a custom setter for the property.
     * It runs before property validations.
     * The returned value will be set to the property.
     * @param newValue The value to set.
     */
    setter?: (newValue?: Parameters<NonNullable<PropertyDescriptor['set']>>[0]) => TypeHint;
    /**
     * The event to fire on property change.
     */
    event?: true|string;
    /**
     * The initializer function.
     */
    initializer?: Function;
};

/**
 * A property declaration.
 */
export type PropertyDeclaration<TypeHint = unknown> = StateDeclaration<TypeHint> & {
    /**
     * Flag state properties.
     */
    state?: boolean;
    /**
     * The property is bound to an attribute. Also specifies the attribute name if different from the property.
     */
    attribute?: boolean|string;
    /**
     * Convert attribute to property value.
     */
    fromAttribute?: PropertyFromAttributeConverter<TypeHint>;
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @return The attributue value.
     */
    toAttribute?: PropertyToAttributeConverter<TypeHint>;
}

/**
 * A property instance.
 */
export type Property<T extends ComponentInstance<HTMLElement>, P extends keyof T>= PropertyDescriptor & {
    /**
     * The property name of the field.
     */
    readonly name: P;
    /**
     * The property private symbol.
     */
    symbol: symbol;
    /**
     * Flag state properties.
     */
    state: boolean;
    /**
     * The bound attribute name.
     */
    attribute?: string;
    /**
     * The initial value of the property.
     */
    defaultValue?: T[P];
    /**
     * A list of valid property values prototypes.
     */
    type: Constructor<T[P]>[];
    /**
     * Convert attribute to property value.
     */
    fromAttribute?: PropertyFromAttributeConverter<T[P]>;
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @return The attributue value.
     */
    toAttribute?: PropertyToAttributeConverter<T[P]>;
    /**
     * A list of field observables.
     */
    observers: PropertyObserver<T[P]>[];
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: PropertyValidator;
    /**
     * Define custom getter for the property.
     * @param value The current property value.
     */
    getter?: (value?: T[P]) => ReturnType<NonNullable<PropertyDescriptor['get']>>;
    /**
     * Define a custom setter for the property.
     * It runs before property validations.
     * The returned value will be set to the property.
     * @param newValue The value to set.
     */
    setter?: (newValue?: Parameters<NonNullable<PropertyDescriptor['set']>>[0]) => T[P];
    /**
     * The event to fire on property change.
     */
    event?: string;
    /**
     * The initializer function.
     */
    initializer?: Function;
}

/**
 * Retrieve all properties descriptors.
 * @param prototype The component prototype.
 * @return A list of property descriptors.
 */
export const getProperties = <T extends ComponentInstance<HTMLElement>>(prototype: WithProperties<T>) => {
    const props = (prototype[PROPERTIES_SYMBOL] || {}) as PropertiesOf<T>;

    if (!hasOwnProperty.call(prototype, PROPERTIES_SYMBOL)) {
        return {
            __proto__: props,
        } as unknown as PropertiesOf<T>;
    }

    return props;
};

/**
 * Retrieve property descriptor.
 * @param prototype The component prototype.
 * @param propertyKey The name of the property.
 * @return The property descriptor.
 */
export const getProperty = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(prototype: T, propertyKey: P) => getProperties(prototype)[propertyKey];

/**
 * Get valid constructors for the property.
 * @param decl The property declaration.
 * @return A list of constructors.
 */
const getTypes = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(decl: PropertyDeclaration<T[P]>) => {
    const type = decl.type;
    if (!type) {
        return [];
    }
    if (isArray(type)) {
        return type;
    }

    return [type];
};

/**
 * Get observers for the property.
 * @param decl The property declaration.
 * @return A list of observers.
 */
const getObservers = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(decl: PropertyDeclaration<T[P]>) => {
    const observers = decl.observers || [];
    if (decl.observe) {
        return [decl.observe, ...observers];
    }
    return observers;
};

/**
 * Define an observed property.
 * @param prototype The component prototype.
 * @param propertyKey The name of the property.
 * @param decl The property descriptor.
 * @param symbol The symbol to use to store property value.
 * @param initializer The initializer function.
 * @return The final descriptor.
 */
export const defineProperty = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(prototype: WithProperties<T>, propertyKey: P, decl: PropertyDeclaration<T[P]>, symbolKey?: symbol, initializer?: Function): PropertyDescriptor => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const symbol: unique symbol = symbolKey || createSymbolKey(propertyKey as string) as any;
    const constructor = prototype.constructor as ComponentConstructor<HTMLElement>;
    const declarations = prototype[PROPERTIES_SYMBOL] = getProperties(prototype);
    const property = declarations[propertyKey] = {
        ...decl,
        name: propertyKey,
        symbol,
        state: !!decl.state,
        type: getTypes(decl),
        observers: getObservers(decl),
        initializer,
        attribute: decl.attribute !== false ?
            (typeof decl.attribute === 'string' ? decl.attribute : propertyKey) :
            undefined,
        event: decl.event ?
            (decl.event === true ? `${propertyKey}change` : decl.event) :
            undefined,
    } as Property<T, P>;

    type E = T & {
        [symbol]: E[P];
    };
    const { attribute, type, observers } = property;

    if (attribute) {
        property.fromAttribute = decl.fromAttribute || ((newValue) => {
            if (type.indexOf(Boolean as unknown as Constructor<T[P]>) !== -1 && (!newValue || newValue === attribute)) {
                if (newValue === '' || newValue === attribute) {
                    // if the attribute value is empty or it is equal to the attribute name consider it as a boolean
                    return true;
                }
                return false;
            }
            if (newValue) {
                if (type.indexOf(Number as unknown as Constructor<T[P]>) !== -1 && !isNaN(newValue as unknown as number)) {
                    return parseFloat(newValue);
                }
                if (type.indexOf(String as unknown as Constructor<T[P]>) === -1) {
                    try {
                        return JSON.parse(newValue as string);
                    } catch {
                        //
                    }
                }
            }
            return newValue;
        });
        property.toAttribute = decl.toAttribute || ((newValue: unknown) => {
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

    const validate = typeof property.validate === 'function' && property.validate;
    const finalDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: true,
    };

    const getter = property.getter || ((value) => value);
    const get = function get(this: E) {
        return getter.call(this, this[symbol]);
    };

    finalDescriptor.get = get;
    const setter = property.setter || ((value) => value);
    finalDescriptor.set = function(this: E, newValue) {
        if (!isConstructed(this)) {
            this[symbol] = newValue;
            return;
        }

        const oldValue = this[symbol];
        newValue = setter.call(this, newValue);

        if (oldValue === newValue) {
            // no changes
            return;
        }

        // if types or custom validator has been set, check the value validity
        if (newValue != null && newValue !== false) {
            let valid = true;
            if (type.length) {
                // check if the value is an instanceof of at least one constructor
                valid = type.some((Type) => (newValue instanceof Type || (newValue.constructor === Type)));
            }
            if (valid && validate) {
                valid = validate.call(this, newValue);
            }
            if (!valid) {
                throw new TypeError(`Invalid \`${newValue}\` value for \`${String(property.name)}\` property`);
            }
        }

        this[symbol] = newValue;

        if (observers) {
            for (let i = 0, len = observers.length; i < len; i++) {
                observers[i].call(this, oldValue, newValue);
            }
        }

        // trigger Property changes
        if (property.state) {
            this.stateChangedCallback(property.name, oldValue, newValue);
        } else {
            this.propertyChangedCallback(property.name, oldValue, newValue);
        }
    };

    _defineProperty(constructor.prototype, propertyKey, finalDescriptor);

    return finalDescriptor;
};

/**
 * Add a property to a component prototype.
 * @param targetOrClassElement The component prototype.
 * @param declaration The property declaration.
 * @param propertyKey The property name.
 * @param originalDescriptor The native property descriptor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProperty = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(targetOrClassElement: T, declaration: PropertyDeclaration<T[P]>, propertyKey?: P, originalDescriptor?: PropertyDeclaration<T[P]>): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const symbol: unique symbol = createSymbolKey(propertyKey as string) as any;
    if (propertyKey !== undefined) {
        // spec 1 and typescript
        let initializer: Function|undefined;
        if (originalDescriptor) {
            declaration.defaultValue = originalDescriptor.value;
            initializer = originalDescriptor.initializer;
        }

        return defineProperty(targetOrClassElement as T, propertyKey, declaration, symbol, initializer);
    }

    // spec 2
    const element = targetOrClassElement as unknown as ClassElement;
    const key = String(element.key) as P;
    type E = T & {
        [symbol]: E[P];
    };

    if (element.kind !== 'field' || element.placement !== 'own') {
        return element;
    }

    if (element.descriptor) {
        declaration.defaultValue = element.descriptor.value;
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
        initializer(this: E) {
            return this[symbol];
        },
        finisher(constructor: Constructor<T>) {
            defineProperty(constructor.prototype, key, declaration, symbol, element.initializer);
        },
    };
};

/**
 * A decorator for property definition.
 *
 * @param declaration The property declaration.
 * @return The decorator initializer.
 */
export const property = <TypeHint = unknown>(declaration: PropertyDeclaration<TypeHint> = {}) =>
    <T extends ComponentInstance<HTMLElement>, P extends keyof T>(
        targetOrClassElement: T,
        propertyKey?: P,
        originalDescriptor?: PropertyDeclaration<T[P]>
    ) => createProperty(targetOrClassElement, declaration as PropertyDeclaration<T[P]>, propertyKey, originalDescriptor);

/**
 * A decorator for state property definition.
 *
 * @param declaration The state property declaration.
 * @return The decorator initializer.
 */
export const state = <TypeHint = unknown>(declaration: StateDeclaration<TypeHint> = {}) =>
    <T extends ComponentInstance<HTMLElement>, P extends keyof T>(
        targetOrClassElement: T,
        propertyKey?: P,
        originalDescriptor?: StateDeclaration<T[P]>
    ) => createProperty(targetOrClassElement, { ...(declaration as PropertyDeclaration<T[P]>), state: true, attribute: false }, propertyKey, originalDescriptor);

/**
 * Define component constructor properties.
 * @param prototype The component prototype.
 */
export const defineProperties = <T extends ComponentInstance<HTMLElement>>(prototype: T) => {
    const handled: { [key: string]: boolean } = {};
    const constructor = prototype.constructor as ComponentConstructor<HTMLElement>;
    let ctr = constructor;
    while (ctr && ctr !== HTMLElement) {
        const propertiesDescriptor = getOwnPropertyDescriptor(ctr, 'properties');
        const propertiesGetter = propertiesDescriptor && propertiesDescriptor.get;
        if (propertiesGetter) {
            const descriptorProperties = (propertiesGetter.call(constructor) || {}) as {
                [P in keyof T]: PropertyDeclaration<T[P]> | Function | Function[];
            };
            for (let propertyKey in descriptorProperties) {
                if (propertyKey in handled) {
                    continue;
                }
                let descriptor = descriptorProperties[propertyKey] as PropertyDeclaration<T[typeof propertyKey]>;
                if (typeof descriptor === 'function' || isArray(descriptor)) {
                    descriptor = { type: descriptor };
                }
                defineProperty(prototype, propertyKey, descriptor);
                handled[propertyKey] = true;
            }
        }
        ctr = Object.getPrototypeOf(ctr);
    }
};

/**
 * Get the property bound to the attribute.
 * @param prototype The prototype of the Component.
 * @param attributeName The name of the bound attribute.
 * @return The property declaration.
 */
export const getPropertyForAttribute = <T extends ComponentInstance<HTMLElement>>(prototype: T, attributeName: string) => {
    const properties = getProperties(prototype);
    for (let propertyKey in properties) {
        let prop = properties[propertyKey];
        if (prop.attribute === attributeName) {
            return prop;
        }
    }
    return null;
};
