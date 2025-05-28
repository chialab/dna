import type { ClassElement } from './ClassDescriptor';
import {
    type ComponentConstructor,
    type ComponentInstance,
    isComponent,
    isComponentConstructor,
    isInitialized,
} from './Component';
import {
    type Constructor,
    type MemberDecorator,
    defineProperty as _defineProperty,
    createObject,
    getOwnPropertyDescriptor,
    getPrototypeOf,
    hasOwn,
    isArray,
} from './helpers';

/**
 * A Symbol which contains all Property instances of a Component.
 */
const PROPERTIES_SYMBOL: unique symbol = Symbol();

/**
 * A Symbol which contains all Property observers of a Component.
 */
const OBSERVERS_SYMBOL: unique symbol = Symbol();

/**
 * Retrieve properties declarations of a Component.
 */
type PropertiesOf<T extends ComponentInstance> = {
    [P in keyof T]: Property<T, P>;
};

/**
 * Retrieve properties declarations of a Component.
 */
type ObserversOf<T extends ComponentInstance> = {
    [P in keyof T]: PropertyObserver<T[P]>[];
};

/**
 * A prototype with properties.
 */
type WithProperties<T extends ComponentInstance> = T & {
    [PROPERTIES_SYMBOL]?: PropertiesOf<T>;
    [OBSERVERS_SYMBOL]?: ObserversOf<T>;
};

/**
 * The observer signature for properties.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type PropertyObserver<T = unknown> = (oldValue: T | undefined, newValue: T, propertyKey: string) => void;

export type TypeConstructor<T> = T extends number
    ? NumberConstructor
    : T extends string
      ? StringConstructor
      : T extends boolean
        ? BooleanConstructor
        : T extends object
          ? ObjectConstructor
          : T extends symbol
            ? SymbolConstructor
            : T extends bigint
              ? BigIntConstructor
              : T extends Date
                ? DateConstructor
                : T extends RegExp
                  ? RegExpConstructor
                  : Constructor<T>;

/**
 * A state property declaration.
 */
export type PropertyDeclaration<T extends ComponentInstance, P extends keyof T> = PropertyDescriptor & {
    /**
     * The property private symbol.
     */
    symbol?: symbol;
    /**
     * Flag state properties.
     */
    state?: boolean;
    /**
     * The property is bound to an attribute. Also specifies the attribute name if different from the property.
     */
    attribute?: boolean | string;
    /**
     * The event to fire on property change.
     */
    event?: true | string;
    /**
     * Property change should trigger component update.
     */
    update?: boolean;
    /**
     * Convert attribute to property value.
     *
     * @param value The attributue value.
     * @returns The property value.
     */
    fromAttribute?: (value: string | null) => T[P] | undefined;
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @returns The attributue value.
     */
    toAttribute?: (value: T[P]) => string | null | undefined;
    /**
     * The initial value of the property.
     */
    defaultValue?: T[P];
    /**
     * A list of valid property values prototypes.
     */
    type?: TypeConstructor<T[P]> | TypeConstructor<T[P]>[];
    /**
     * Define a property observable.
     */
    observe?: PropertyObserver<T[P]>;
    /**
     * A list of field observables.
     */
    observers?: PropertyObserver<T[P]>[];
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: (value: unknown) => boolean;
    /**
     * Native custom getter for the property.
     */
    get?: PropertyDescriptor['get'];
    /**
     * Native custom setter for the property.
     */
    set?: PropertyDescriptor['set'];
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
     * The initializer function.
     */
    initializer?: () => T[P];
};

/**
 * Property configuration for properties accessor.
 */
export type PropertyConfig<T extends ComponentInstance = ComponentInstance, P extends keyof T = keyof T> =
    | PropertyDeclaration<T, P>
    | Constructor<T[P]>
    | Constructor<T[P]>[];

/**
 * A property instance.
 */
export type Property<T extends ComponentInstance, P extends keyof T> = PropertyDescriptor & {
    /**
     * The property name of the field.
     */
    readonly name: P;
    /**
     * The property has been defined using static getter.
     */
    readonly static: boolean;
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
     * The event to fire on property change.
     */
    event?: string;
    /**
     * Property change should trigger component update.
     */
    update?: boolean;
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
     * @returns The property value.
     */
    fromAttribute?: (value: string | null) => T[P];
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @returns The attributue value.
     */
    toAttribute?: (value: T[P]) => string | null | undefined;
    /**
     * A custom validation function for the property.
     * Property assignement throws when this function returns falsy values.
     */
    validate?: (value: unknown) => boolean;
    /**
     * Native custom getter for the property.
     */
    get?: PropertyDescriptor['get'];
    /**
     * Native custom setter for the property.
     */
    set?: PropertyDescriptor['set'];
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
     * The initializer function.
     */
    initializer?: () => T[P];
};

/**
 * Retrieve all properties descriptors.
 * @param prototype The component prototype.
 * @param chain Should create inheritance chain of properties.
 * @returns A list of property descriptors.
 */
export const getProperties = <T extends ComponentInstance>(prototype: T, chain = false): PropertiesOf<T> => {
    const props = ((prototype as WithProperties<T>)[PROPERTIES_SYMBOL] || {}) as PropertiesOf<T>;
    if (chain && !hasOwn.call(prototype, PROPERTIES_SYMBOL)) {
        const computedProps = createObject(props) as PropertiesOf<T>;
        (prototype as WithProperties<T>)[PROPERTIES_SYMBOL] = computedProps;
        return computedProps;
    }
    return props;
};

/**
 * Retrieve property declaration.
 * @param prototype The component prototype.
 * @param propertyKey The name of the property.
 * @param failIfMissing Should throw an exception if the property is not defined.
 * @returns The property declaration.
 * @throws If the property is not defined and `failIfMissing` is `true`.
 */
export const getProperty = <T extends ComponentInstance, P extends keyof T>(
    prototype: T,
    propertyKey: P,
    failIfMissing = false
) => {
    const property = getProperties(prototype)[propertyKey];
    if (failIfMissing && !property) {
        throw new Error(`Missing property ${String(propertyKey)}`);
    }
    return property as Property<T, P>;
};

/**
 * Define an observed property.
 * @param prototype The component prototype.
 * @param propertyKey The name of the property.
 * @param declaration The property descriptor.
 * @param symbolKey The symbol to use to store property value.
 * @param isStatic The property definition is static.
 * @returns The final descriptor.
 */
export const defineProperty = <T extends ComponentInstance, P extends keyof T>(
    prototype: T,
    propertyKey: P,
    declaration: PropertyDeclaration<T, P>,
    symbolKey: symbol,
    isStatic = false
): PropertyDescriptor => {
    // biome-ignore lint/suspicious/noExplicitAny: We need any to convert the symbol to a unique symbol.
    const symbol: unique symbol = symbolKey as any;
    const hasAttribute = declaration.attribute || (declaration.attribute == null ? !declaration.state : false);
    const declarations = getProperties(prototype, true);
    const attribute = hasAttribute
        ? typeof declaration.attribute === 'string'
            ? declaration.attribute
            : propertyKey
        : undefined;
    const event = declaration.event
        ? declaration.event === true
            ? `${String(propertyKey)}change`
            : declaration.event
        : undefined;
    const state = !!declaration.state;
    const types = (
        isArray(declaration.type) ? declaration.type : declaration.type ? [declaration.type] : []
    ) as TypeConstructor<unknown>[];
    const update = typeof declaration.update === 'boolean' ? declaration.update : true;
    const acceptsBoolean = types.indexOf(Boolean) !== -1;
    const acceptsNumber = types.indexOf(Number) !== -1;
    const acceptsString = types.indexOf(String) !== -1;
    const property = {
        fromAttribute(newValue) {
            if (acceptsBoolean && (!newValue || newValue === attribute)) {
                if (newValue !== 'false' && (newValue === '' || newValue === attribute)) {
                    // if the attribute value is empty or it is equal to the attribute name consider it as a boolean
                    return true;
                }
                return false;
            }
            if (newValue) {
                if (acceptsNumber) {
                    const parsedValue = Number.parseFloat(newValue);
                    if (!Number.isNaN(parsedValue)) {
                        return parsedValue;
                    }
                }
                if (!acceptsString) {
                    try {
                        return JSON.parse(newValue as string);
                    } catch {
                        //
                    }
                }
            }
            return newValue;
        },
        toAttribute(newValue: unknown) {
            if (newValue == null || newValue === false) {
                // a falsy value should remove the attribute
                return null;
            }
            const valueType = typeof newValue;
            if (valueType === 'object' || valueType === 'symbol' || valueType === 'function') {
                // references should be ignored
                return;
            }
            // if the value is `true` should set an empty attribute
            if (newValue === true) {
                return '';
            }
            // otherwise just set the value
            return `${newValue}`;
        },
        ...declaration,
        name: propertyKey,
        symbol,
        state,
        type: types,
        attribute,
        event,
        update,
        static: isStatic,
    } as Property<T, P>;
    declarations[propertyKey] = property;

    const { get, set, getter, setter } = property;

    type E = T & { [symbol]: E[P] };

    const validate = typeof property.validate === 'function' && property.validate;
    const finalDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: true,
        get(this: E) {
            let value = this[symbol];
            if (get) {
                value = get.call(this);
            }
            if (getter) {
                value = getter.call(this, value);
            }
            return value;
        },
        set(this: E, newValue) {
            if (!isComponent(this) || !isInitialized(this)) {
                this[symbol] = newValue;
                return;
            }

            const oldValue = this[symbol];
            let computedNewValue = newValue;
            if (setter) {
                computedNewValue = setter.call(this, computedNewValue);
            }
            if (set) {
                set.call(this, computedNewValue);
                computedNewValue = this[symbol];
            }

            if (oldValue === computedNewValue) {
                // no changes
                return;
            }

            // if types or custom validator has been set, check the value validity
            if (computedNewValue != null && computedNewValue !== false) {
                let valid = true;
                if (types.length) {
                    // check if the value is an instanceof of at least one constructor
                    valid = types.some(
                        (Type) => computedNewValue instanceof Type || computedNewValue.constructor === Type
                    );
                }
                if (valid && validate) {
                    valid = validate.call(this, computedNewValue);
                }
                if (!valid) {
                    throw new TypeError(
                        `Invalid \`${String(computedNewValue)}\` value for \`${String(propertyKey)}\` property`
                    );
                }
            }

            this[symbol] = computedNewValue;

            const observers = getPropertyObservers(this as T, propertyKey);
            for (let i = 0, len = observers.length; i < len; i++) {
                observers[i].call(this, oldValue, computedNewValue, propertyKey as string);
            }

            if (event) {
                this.dispatchEvent(event, {
                    newValue: computedNewValue,
                    oldValue,
                });
            }

            // trigger changes
            if (state) {
                this.stateChangedCallback(propertyKey, oldValue, computedNewValue);
            } else {
                this.propertyChangedCallback(propertyKey, oldValue, computedNewValue);
            }

            if (update && this.shouldUpdate(propertyKey, oldValue, computedNewValue)) {
                this.requestUpdate();
            }
        },
    };

    _defineProperty(prototype, propertyKey, finalDescriptor);

    const observers = [...(declaration.observers || [])];
    if (declaration.observe) {
        observers.unshift(declaration.observe);
    }
    observers.forEach((observer) => {
        addObserver(prototype, propertyKey, observer as PropertyObserver<T[P]>);
    });

    return finalDescriptor;
};

/**
 * Define component constructor properties.
 * @param prototype The component prototype.
 */
export const defineProperties = <T extends ComponentInstance>(prototype: T): void => {
    const handled: { [key: string]: boolean } = {};
    const ctr = prototype.constructor as ComponentConstructor;
    let currentCtr = ctr;
    while (isComponentConstructor(currentCtr)) {
        const propertiesDescriptor = getOwnPropertyDescriptor(currentCtr, 'properties');
        if (propertiesDescriptor) {
            const descriptorProperties = (
                propertiesDescriptor.get ? propertiesDescriptor.get.call(ctr) || {} : propertiesDescriptor.value
            ) as {
                [P in keyof T]: PropertyConfig<T, P>;
            };
            for (const propertyKey in descriptorProperties) {
                if (propertyKey in handled) {
                    continue;
                }
                const config = descriptorProperties[propertyKey as keyof T];
                const declaration = (
                    typeof config === 'function' || isArray(config) ? { type: config } : config
                ) as PropertyDeclaration<T, keyof T>;
                // biome-ignore lint/suspicious/noExplicitAny: We need any to convert the symbol to a unique symbol.
                const symbol: unique symbol = (declaration.symbol as any) || Symbol(propertyKey as string);
                defineProperty(prototype, propertyKey as keyof T, declaration, symbol, true);
                handled[propertyKey] = true;
            }
        }

        currentCtr = getPrototypeOf(currentCtr);
    }
};

/**
 * Get the property bound to the attribute.
 * @param prototype The prototype of the Component.
 * @param attributeName The name of the bound attribute.
 * @returns The property declaration.
 */
export const getPropertyForAttribute = <T extends ComponentInstance>(
    prototype: T,
    attributeName: string
): PropertiesOf<T>[keyof T] | null => {
    const properties = getProperties(prototype);
    for (const propertyKey in properties) {
        const property = properties[propertyKey as keyof T];
        if (property.attribute === attributeName) {
            return property;
        }
    }
    return null;
};

/**
 * Reflect property value to attribute.
 *
 * @param element The node to update.
 * @param propertyName The name of the changed property.
 * @param newValue The new value for the property (undefined if removed).
 */
export const reflectPropertyToAttribute = <T extends ComponentInstance, P extends keyof T>(
    element: T,
    propertyName: P,
    newValue: T[P]
): void => {
    const property = getProperty(element, propertyName, true);
    const { attribute, toAttribute } = property;
    if (attribute && toAttribute) {
        const value = toAttribute.call(element, newValue);
        if (value === null) {
            element.removeAttribute(attribute);
        } else if (value !== undefined && value !== element.getAttribute(attribute)) {
            element.setAttribute(attribute, value as string);
        }
    }
};

/**
 * Populate property declaration using its field descriptor.
 * @param declaration The declaration to update.
 * @param descriptor The field descriptor.
 * @param initializer The property initializer function.
 */
const assignFromDescriptor = <T extends ComponentInstance, P extends keyof T>(
    declaration: PropertyDeclaration<T, P>,
    descriptor: PropertyDescriptor,
    initializer?: () => T[P]
) => {
    declaration.initializer = initializer;
    declaration.get = descriptor.get;
    declaration.set = descriptor.set;
    if (!descriptor.get) {
        declaration.defaultValue = descriptor.value;
    }
};

/**
 * Add a property to a component prototype.
 * @param targetOrClassElement The component prototype.
 * @param declaration The property declaration.
 * @param propertyKey The property name.
 * @param descriptor The native property descriptor.
 * @returns The property descriptor.
 */
export const createProperty = <T extends ComponentInstance, P extends keyof T>(
    targetOrClassElement: T,
    declaration: PropertyDeclaration<T, P>,
    propertyKey?: P,
    descriptor?: PropertyDeclaration<T, P>
): ClassElement<T, T[P]> | PropertyDescriptor => {
    // biome-ignore lint/suspicious/noExplicitAny: We need any to convert the symbol to a unique symbol.
    const symbol: unique symbol = declaration.symbol || (Symbol(propertyKey as string) as any);
    if (propertyKey !== undefined) {
        const computedDescriptor =
            descriptor || (getOwnPropertyDescriptor(targetOrClassElement, propertyKey) as PropertyDeclaration<T, P>);
        if (computedDescriptor) {
            assignFromDescriptor(declaration, computedDescriptor, computedDescriptor.initializer);
        }
        return defineProperty(targetOrClassElement as T, propertyKey, declaration, symbol);
    }

    // spec 2
    const element = targetOrClassElement as unknown as ClassElement<T, T[P]>;
    const key = String(element.key) as P;
    type E = T & {
        [symbol]: E[P];
    };

    if (element.kind !== 'field' || element.placement !== 'own') {
        return element;
    }

    if (element.descriptor) {
        assignFromDescriptor(declaration, element.descriptor, element.initializer);
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
        finisher(ctr: Constructor<T>) {
            defineProperty(ctr.prototype, key, declaration, symbol);
        },
    };
};

/**
 * Add a property observer to a component prototype.
 * @param targetOrClassElement The component prototype.
 * @param propertyKey The property name to watch.
 * @param methodKey The method name.
 * @returns The observer descriptor.
 */
export const createObserver = <T extends ComponentInstance, P extends keyof T, M extends keyof T>(
    targetOrClassElement: T,
    propertyKey: P,
    methodKey?: M
): ClassElement<T, T[P]> | undefined => {
    if (methodKey !== undefined) {
        addObserver(
            targetOrClassElement,
            propertyKey,
            targetOrClassElement[methodKey] as unknown as PropertyObserver<T[P]>
        );
        return;
    }

    const element = targetOrClassElement as unknown as ClassElement<T, T[P]>;
    if (!element.descriptor) {
        return element;
    }
    const observer = element.descriptor.value as PropertyObserver<T[P]>;
    element.finisher = (ctr) => {
        addObserver(ctr.prototype, propertyKey, observer);
    };
    return element;
};

/**
 * Get element properties observers.
 * @param element The node.
 * @returns The map of observers.
 */
export const getObservers = <T extends ComponentInstance>(element: T): ObserversOf<T> => {
    const observers = ((element as WithProperties<T>)[OBSERVERS_SYMBOL] || {}) as ObserversOf<T>;
    if (!hasOwn.call(element, OBSERVERS_SYMBOL)) {
        const result = {} as ObserversOf<T>;
        for (const key in observers) {
            result[key] = observers[key].slice();
        }
        (element as WithProperties<T>)[OBSERVERS_SYMBOL] = result;
        return result;
    }

    return observers;
};

/**
 * Get observers for an element property.
 * @param element The node.
 * @param propertyName The name of the property.
 * @returns A list of observers.
 * @throws If the property is not defined.
 */
export const getPropertyObservers = <T extends ComponentInstance, P extends keyof T>(
    element: T,
    propertyName: P
): ObserversOf<T>[P] => {
    if (!getProperty(element, propertyName)) {
        throw new Error(`Missing property ${String(propertyName)}`);
    }
    const observers = getObservers(element);
    observers[propertyName] = observers[propertyName] || [];
    return observers[propertyName];
};

/**
 * Add an observer for a property.
 * @param element The node context.
 * @param propertyName The name of the property to watch.
 * @param observer The observer function to add.
 */
export const addObserver = <T extends ComponentInstance, P extends keyof T>(
    element: T,
    propertyName: P,
    observer: PropertyObserver<T[P]>
): void => {
    getPropertyObservers(element, propertyName).push(observer);
};

/**
 * Remove an observer for a property.
 * @param element The node context.
 * @param propertyName The name of the watched property.
 * @param observer The observer function to remove.
 */
export const removeObserver = <T extends ComponentInstance, P extends keyof T>(
    element: T,
    propertyName: P,
    observer: PropertyObserver<T[P]>
): void => {
    const observers = getPropertyObservers(element, propertyName);
    const io = observers.indexOf(observer);
    if (io !== -1) {
        observers.splice(io, 1);
    }
};

/**
 * A decorator for property definition.
 * @param declaration The property declaration.
 * @returns The decorator initializer.
 */
export function property<T extends ComponentInstance, P extends keyof T>(
    declaration: PropertyDeclaration<T, P> = {}
): MemberDecorator<T, P> {
    return (targetOrClassElement, propertyKey, descriptor) =>
        createProperty(targetOrClassElement, declaration, propertyKey, descriptor);
}

/**
 * A decorator for state property definition.
 * @param declaration The state property declaration.
 * @returns The decorator initializer.
 */
export function state<T extends ComponentInstance, P extends keyof T>(
    declaration: PropertyDeclaration<T, P> = {}
): MemberDecorator<T, P> {
    return (targetOrClassElement, propertyKey, descriptor) =>
        createProperty(
            targetOrClassElement,
            {
                ...declaration,
                state: true,
            },
            propertyKey,
            descriptor
        );
}

/**
 * A decorator for property observer.
 *
 * @param propertyKey The property key to observe.
 * @returns The decorator initializer.
 */
export function observe<T extends ComponentInstance, P extends keyof T>(propertyKey: string): MemberDecorator<T, P> {
    return (targetOrClassElement, methodKey) =>
        createObserver(targetOrClassElement, propertyKey as keyof PropertiesOf<T>, methodKey);
}
