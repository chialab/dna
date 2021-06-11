import type { ClassElement, Constructor, MethodsOf, Replace } from './types';
import type { ComponentInstance, ComponentConstructor } from './Component';
import { createSymbolKey, HTMLElement, isArray, defineProperty as _defineProperty, getOwnPropertyDescriptor, hasOwnProperty } from './helpers';
import { isConstructed } from './Component';

/**
 * A Symbol which contains all Property instances of a Component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PROPERTIES_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * A Symbol which contains all Property observers of a Component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OBSERVERS_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Retrieve properties declarations of a Component.
 */
export type PropertiesOf<T extends ComponentInstance<HTMLElement>> = {
    [P in keyof T]: Property<T, P>;
};

/**
 * Retrieve properties declarations of a Component.
 */
export type ObserversOf<T extends ComponentInstance<HTMLElement>> = {
    [P in keyof T]: PropertyObserver<T[P]>[];
};

/**
 * A prototype with properties.
 */
export type WithProperties<T extends ComponentInstance<HTMLElement>> = T & {
    [PROPERTIES_SYMBOL]?: PropertiesOf<T>;
};

/**
 * A prototype with observers.
 */
export type WithObservers<T extends ComponentInstance<HTMLElement>> = T & {
    [OBSERVERS_SYMBOL]?: ObserversOf<T>;
};

/**
 * The observer signature for propertys.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type PropertyObserver<TypeHint = unknown> = (oldValue: TypeHint | undefined, newValue: TypeHint) => void;

/**
 * Convert constructor types to their normalised instance types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConvertConstructorTypes<C extends Constructor<unknown>> = Replace<Replace<Replace<Replace<Replace<InstanceType<C>, Number, number>, String, string>, Boolean, boolean>, unknown[], any[]>, Object, any>;

/**
 * A stateful property declaration.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropertyDeclaration<TypeConstructorHint extends Constructor<any> = Constructor<any>> = PropertyDescriptor & {
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
     *
     * @param value The attributue value.
     * @return The property value.
     */
    fromAttribute?: (value: string | null) => ConvertConstructorTypes<TypeConstructorHint> | undefined;
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @return The attributue value.
     */
    toAttribute?: (value: ConvertConstructorTypes<TypeConstructorHint>) => string|null|undefined;
    /**
     * The initial value of the property.
     */
    defaultValue?: ConvertConstructorTypes<TypeConstructorHint>;
     /**
      * A list of valid property values prototypes.
      */
    type?: TypeConstructorHint | TypeConstructorHint[];
    /**
     * Define a property observable.
     */
    observe?: PropertyObserver<ConvertConstructorTypes<TypeConstructorHint>>;
    /**
     * A list of field observables.
     */
    observers?: PropertyObserver<ConvertConstructorTypes<TypeConstructorHint>>[];
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: (value: unknown) => boolean;
    /**
     * Define custom getter for the property.
     * @param value The current property value.
     */
    getter?: (value?: ConvertConstructorTypes<TypeConstructorHint>) => ReturnType<NonNullable<PropertyDescriptor['get']>>;
    /**
     * Define a custom setter for the property.
     * It runs before property validations.
     * The returned value will be set to the property.
     * @param newValue The value to set.
     */
    setter?: (newValue?: Parameters<NonNullable<PropertyDescriptor['set']>>[0]) => ConvertConstructorTypes<TypeConstructorHint>;
    /**
     * The event to fire on property change.
     */
    event?: true | string;
    /**
     * The initializer function.
     */
    initializer?: Function;
};

/**
 * Property confgiration in properties accessor.
 */
export type PropertyConfig<TypeConstructorHint extends Constructor<unknown> = Constructor<unknown>> = PropertyDeclaration<TypeConstructorHint> | TypeConstructorHint | TypeConstructorHint[];

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
     *
     * @param value The attributue value.
     * @return The property value.
     */
    fromAttribute?: (value: string|null) => T[P];
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @return The attributue value.
     */
    toAttribute?: (value: T[P]) => string|null|undefined;
    /**
     * A list of field observables.
     */
    observers: PropertyObserver<T[P]>[];
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: (value: unknown) => boolean;
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
 * @param declaration The property declaration.
 * @return A list of constructors.
 */
const extractTypes = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(declaration: PropertyDeclaration<Constructor<T[P]>>) => {
    const type = declaration.type;
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
 * @param declaration The property declaration.
 * @return A list of observers.
 */
const extractObservers = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(declaration: PropertyDeclaration<Constructor<T[P]>>) => {
    const observers = declaration.observers || [];
    if (declaration.observe) {
        return [declaration.observe, ...observers];
    }
    return observers;
};

/**
 * Define an observed property.
 * @param prototype The component prototype.
 * @param propertyKey The name of the property.
 * @param declaration The property descriptor.
 * @param symbol The symbol to use to store property value.
 * @return The final descriptor.
 */
export const defineProperty = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(prototype: WithProperties<T>, propertyKey: P, declaration: PropertyDeclaration<Constructor<T[P]>>, symbolKey?: symbol): PropertyDescriptor => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const symbol: unique symbol = symbolKey || createSymbolKey(propertyKey as string) as any;
    const constructor = prototype.constructor as ComponentConstructor<HTMLElement>;
    const hasAttribute = declaration.attribute || (declaration.attribute == null ? !declaration.state : false);
    const declarations = prototype[PROPERTIES_SYMBOL] = getProperties(prototype);
    const property = declarations[propertyKey] = {
        ...declaration,
        name: propertyKey,
        symbol,
        state: !!declaration.state,
        type: extractTypes(declaration),
        observers: extractObservers(declaration),
        attribute: hasAttribute ?
            (typeof declaration.attribute === 'string' ? declaration.attribute : propertyKey) :
            undefined,
        event: declaration.event ?
            (declaration.event === true ? `${propertyKey}change` : declaration.event) :
            undefined,
    } as Property<T, P>;

    type E = T & {
        [symbol]: E[P];
    };
    const { attribute, type } = property;

    if (attribute) {
        property.fromAttribute = declaration.fromAttribute || ((newValue) => {
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
        property.toAttribute = (declaration.toAttribute || ((newValue: unknown) => {
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
        })) as typeof property.toAttribute;
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

        const observers = getPropertyObservers(this, property.name);
        for (let i = 0, len = observers.length; i < len; i++) {
            observers[i].call(this, oldValue, newValue);
        }

        const attrName = property.attribute;
        if (attrName && property.toAttribute) {
            const value = property.toAttribute.call(this, newValue);
            if (value === null) {
                this.removeAttribute(attrName);
            } else if (value !== undefined && value !== this.getAttribute(attrName)) {
                this.setAttribute(attrName, value as string);
            }
        }

        if (property.event) {
            this.dispatchEvent(property.event, {
                newValue,
                oldValue,
            });
        }

        // trigger Property changes
        if (property.state) {
            this.stateChangedCallback(property.name, oldValue, newValue);
        } else {
            this.propertyChangedCallback(property.name, oldValue, newValue);
        }

        if (this.isConnected) {
            this.forceUpdate();
        }
    };

    _defineProperty(constructor.prototype, propertyKey, finalDescriptor);

    return finalDescriptor;
};

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
        if (propertiesDescriptor) {
            const descriptorProperties = (propertiesDescriptor.get ? (propertiesDescriptor.get.call(constructor) || {}) : propertiesDescriptor.value) as {
                [P in keyof T]: PropertyConfig<Constructor<T[P]>>;
            };
            for (const propertyKey in descriptorProperties) {
                if (propertyKey in handled) {
                    continue;
                }
                let descriptor = descriptorProperties[propertyKey] as PropertyDeclaration<Constructor<T[typeof propertyKey]>>;
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
    for (const propertyKey in properties) {
        const property = properties[propertyKey];
        if (property.attribute === attributeName) {
            return property;
        }
    }
    return null;
};

/**
 * Populate property declaration using its field descriptor.
 * @param declaration The declaration to update.
 * @param descriptor The field descriptor.
 */
const assignFromDescriptor = (declaration: PropertyDeclaration, descriptor: PropertyDescriptor & { initializer?: Function }) => {
    declaration.getter = declaration.getter || descriptor.get;
    declaration.setter = declaration.setter || descriptor.set as typeof declaration.setter;
    declaration.defaultValue = descriptor.value;
    declaration.initializer = descriptor.initializer || descriptor.get;
};

/**
 * Add a property to a component prototype.
 * @param targetOrClassElement The component prototype.
 * @param declaration The property declaration.
 * @param propertyKey The property name.
 * @param descriptor The native property descriptor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProperty = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(targetOrClassElement: T, declaration: PropertyDeclaration<Constructor<T[P]>>, propertyKey?: P, descriptor?: PropertyDeclaration<Constructor<T[P]>>): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const symbol: unique symbol = createSymbolKey(propertyKey as string) as any;
    if (propertyKey !== undefined) {
        if (descriptor) {
            assignFromDescriptor(declaration, descriptor);
        }
        return defineProperty(targetOrClassElement as T, propertyKey, declaration, symbol);
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
        assignFromDescriptor(declaration, {
            ...element.descriptor,
            initializer: element.initializer,
        });
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
            defineProperty(constructor.prototype, key, declaration, symbol);
        },
    };
};

/**
 * Add a property observer to a component prototype.
 * @param targetOrClassElement The component prototype.
 * @param propertyKey The property name to watch.
 * @param methodKey The method name.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createObserver = <T extends ComponentInstance<HTMLElement>, P extends keyof T, M extends keyof T>(targetOrClassElement: T, propertyKey: P, methodKey?: M): any => {
    const property = getProperty(targetOrClassElement, propertyKey);
    if (!property) {
        throw new Error(`Missing property ${propertyKey}`);
    }

    if (methodKey !== undefined) {
        property.observers.push(targetOrClassElement[methodKey] as unknown as PropertyObserver<T[P]>);
        return;
    }

    const element = targetOrClassElement as unknown as ClassElement;
    if (!element.descriptor) {
        return element;
    }
    property.observers.push(element.descriptor.value as PropertyObserver<T[P]>);
    return element;
};

/**
 * Get element properties observers.
 * @param element The node.
 * @return The map of observers.
 */
export const getObservers = <T extends ComponentInstance<HTMLElement>>(element: WithObservers<T>) => element[OBSERVERS_SYMBOL] = element[OBSERVERS_SYMBOL] || {} as ObserversOf<T>;

/**
 * Get observers for an element property.
 * @param element The node.
 * @param propertyName The name of the property.
 * @return A list of observers.
 */
export const getPropertyObservers = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(element: WithObservers<T>, propertyName: P) => {
    if (!getProperty(element, propertyName)) {
        throw new Error(`Missing property ${propertyName}`);
    }
    const observers = getObservers(element);
    return observers[propertyName] = observers[propertyName] || [];
};

/**
 * Add an observer for a property.
 * @param element The node context.
 * @param propertyName The name of the property to watch.
 * @param observer The observer function to add.
 */
export const addObserver = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(element: WithObservers<T>, propertyName: P, observer: PropertyObserver<T[P]>) => {
    getPropertyObservers(element, propertyName).push(observer);
};

/**
 * Remove an observer for a property.
 * @param element The node context.
 * @param propertyName The name of the watched property.
 * @param observer The observer function to remove.
 */
export const removeObserver = <T extends ComponentInstance<HTMLElement>, P extends keyof T>(element: WithObservers<T>, propertyName: P, observer: PropertyObserver<T[P]>) => {
    const observers = getPropertyObservers(element, propertyName);
    const io = observers.indexOf(observer);
    if (io !== -1) {
        observers.splice(io, 1);
    }
};

/**
 * A decorator for property definition.
 *
 * @param declaration The property declaration.
 * @return The decorator initializer.
 */
export function property<TypeConstructorHint extends Constructor<unknown> = Constructor<unknown>>(declaration: PropertyDeclaration<TypeConstructorHint> = {}) {
    return <T extends ComponentInstance<HTMLElement>, P extends keyof T>(
        targetOrClassElement: T,
        propertyKey?: P,
        descriptor?: PropertyDeclaration<Constructor<T[P]>>
    ) => createProperty(targetOrClassElement, declaration as PropertyDeclaration<Constructor<T[P]>>, propertyKey, descriptor);
}

/**
 * A decorator for state property definition.
 *
 * @param declaration The state property declaration.
 * @return The decorator initializer.
 */
export function state<TypeConstructorHint extends Constructor<unknown> = Constructor<unknown>>(declaration: PropertyDeclaration<TypeConstructorHint> = {}) {
    return <T extends ComponentInstance<HTMLElement>, P extends keyof T>(
        targetOrClassElement: T,
        propertyKey?: P,
        descriptor?: PropertyDeclaration<Constructor<T[P]>>
    ) => createProperty(targetOrClassElement, { ...(declaration as PropertyDeclaration<Constructor<T[P]>>), state: true }, propertyKey, descriptor);
}

/**
 * A decorator for property observer.
 *
 * @param propertyKey The property key to observe.
 * @return The decorator initializer.
 */
export function observe(propertyKey: string): Function {
    return <T extends ComponentInstance<HTMLElement>, P extends MethodsOf<T>>(
        targetOrClassElement: T,
        methodKey?: P
    ) => createObserver(targetOrClassElement, propertyKey as keyof T, methodKey);
}
