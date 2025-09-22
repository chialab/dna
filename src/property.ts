import { type ComponentConstructor, type ComponentInstance, isComponent, isInitialized } from './Component';
import {
    defineProperty as _defineProperty,
    type ClassElement,
    type Constructor,
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
 * WeakMap containing all properties metadata.
 */
const PROPERTIES_METADATA = new WeakMap<object, Map<string, PropertyDeclaration>>();

/**
 * WeakMap containing all observers metadata.
 */
const OBSERVERS_METADATA = new WeakMap<object, Set<[PropertyKey, PropertyKey | PropertyObserver]>>();

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
type WithProperties<T extends ComponentInstance> = ComponentConstructor<T> & {
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
        : // biome-ignore lint/suspicious/noExplicitAny: Check any type of array.
          T extends any[]
          ? ArrayConstructor
          : T extends symbol
            ? SymbolConstructor
            : T extends bigint
              ? BigIntConstructor
              : T extends Date
                ? DateConstructor
                : T extends RegExp
                  ? RegExpConstructor
                  : T extends object
                    ? ObjectConstructor
                    : Constructor<T>;

/**
 * A state property declaration.
 */
// biome-ignore lint/suspicious/noExplicitAny: Properties can be of any type.
export type PropertyDeclaration<T = any> = PropertyDescriptor & {
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
    event?: boolean | string;
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
    fromAttribute?: (value: string | null) => T | undefined;
    /**
     * Convert property to attribute value.
     * @param value The property value.
     * @returns The attributue value.
     */
    toAttribute?: (value: T) => string | null | undefined;
    /**
     * The initial value of the property.
     */
    defaultValue?: T;
    /**
     * A list of valid property values prototypes.
     */
    type?: TypeConstructor<T> | TypeConstructor<T>[];
    /**
     * Define a property observable.
     */
    observe?: PropertyObserver<T>;
    /**
     * A list of field observables.
     */
    observers?: PropertyObserver<T>[];
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
    getter?: (value?: T) => ReturnType<NonNullable<PropertyDescriptor['get']>>;
    /**
     * Define a custom setter for the property.
     * It runs before property validations.
     * The returned value will be set to the property.
     * @param newValue The value to set.
     */
    setter?: (newValue?: Parameters<NonNullable<PropertyDescriptor['set']>>[0]) => T;
    /**
     * The initializer function.
     */
    initializer?: () => T;
};

/**
 * Property configuration for properties accessor.
 */
// biome-ignore lint/suspicious/noExplicitAny: Properties can be of any type.
export type PropertyConfig<T = any> = PropertyDeclaration<T> | TypeConstructor<T> | TypeConstructor<T>[];

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
 * @returns A list of property descriptors.
 */
export const getProperties = <T extends ComponentInstance>(prototype: T): PropertiesOf<T> => {
    const ctr = prototype.constructor as WithProperties<T>;
    if (!hasOwn.call(ctr, PROPERTIES_SYMBOL) || !ctr[PROPERTIES_SYMBOL]) {
        ctr[PROPERTIES_SYMBOL] = {} as PropertiesOf<T>;
    }
    return ctr[PROPERTIES_SYMBOL];
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
 * Create a property object from a declaration.
 * @param propertyKey The name of the property.
 * @param declaration The property descriptor.
 * @param symbolKey The symbol to use to store property value.
 * @param isStatic The property definition is static.
 * @returns The final descriptor.
 */
const createProperty = <T extends ComponentInstance, P extends keyof T>(
    propertyKey: P,
    declaration: PropertyDeclaration<T[P]>,
    symbolKey?: symbol,
    isStatic = false
): Property<T, P> => {
    // biome-ignore lint/suspicious/noExplicitAny: We need any to convert the symbol to a unique symbol.
    const symbol: unique symbol = (symbolKey as any) || Symbol(propertyKey as string);
    const hasAttribute = declaration.attribute || (declaration.attribute == null ? !declaration.state : false);
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

    return {
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
};

/**
 * Create property accessors.
 * @param property The property declaration.
 * @returns The property accessors.
 */
const createPropertyDescriptor = <T extends ComponentInstance, P extends keyof T>(
    property: Property<T, P>
): PropertyDescriptor => {
    const { name, get, set, getter, setter, symbol: symbolKey, state, event, update, type, validate } = property;
    // biome-ignore lint/suspicious/noExplicitAny: We need any to convert the symbol to a unique symbol.
    const symbol: unique symbol = symbolKey as any;
    type E = T & { [symbol]: E[P] };

    return {
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
        set(this: E, newValue: Parameters<NonNullable<PropertyDescriptor['set']>>[0]) {
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
                if (type.length) {
                    // check if the value is an instanceof of at least one constructor
                    valid = type.some(
                        (Type) => computedNewValue instanceof Type || computedNewValue.constructor === Type
                    );
                }
                if (valid && validate) {
                    valid = validate.call(this, computedNewValue);
                }
                if (!valid) {
                    throw new TypeError(
                        `Invalid \`${String(computedNewValue)}\` value for \`${String(name)}\` property`
                    );
                }
            }

            this[symbol] = computedNewValue;

            // trigger changes
            if (state) {
                this.stateChangedCallback(name, oldValue, newValue);
            } else {
                this.propertyChangedCallback(name, oldValue, newValue);
            }

            const observers = getPropertyObservers(this as T, name);
            for (let i = 0, len = observers.length; i < len; i++) {
                observers[i].call(this, oldValue, computedNewValue, name as string);
            }

            if (event) {
                this.dispatchEvent(event, {
                    newValue: computedNewValue,
                    oldValue,
                });
            }

            if (update && this.shouldUpdate(name, oldValue, computedNewValue)) {
                this.requestUpdate();
            }
        },
    };
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
    declaration: PropertyDeclaration<T[P]>,
    symbolKey?: symbol,
    isStatic = false
): PropertyDescriptor => {
    const property = createProperty(propertyKey, declaration, symbolKey, isStatic);
    const properties = getProperties(prototype);
    properties[propertyKey] = property;
    const finalDescriptor = createPropertyDescriptor(property);
    _defineProperty(prototype, propertyKey, finalDescriptor);

    if (declaration.observe) {
        defineObserver(prototype, propertyKey, declaration.observe);
    }
    declaration.observers?.forEach((observer) => {
        defineObserver(prototype, propertyKey, observer);
    });

    return finalDescriptor;
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
 * Iterate over static properties declarations.
 * @param ctr The component constructor.
 * @yields Tuples of property key and declaration.
 */
export function* staticPropertiesDeclarations<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    ctr: C
): Iterable<[keyof T, PropertyDeclaration]> {
    const propertiesDescriptor = getOwnPropertyDescriptor(ctr, 'properties');
    if (propertiesDescriptor) {
        const descriptorProperties = (
            propertiesDescriptor.get ? propertiesDescriptor.get.call(ctr) || {} : propertiesDescriptor.value
        ) as {
            [P in keyof T]: PropertyConfig<T[P]>;
        };
        for (const propertyKey in descriptorProperties) {
            const config = descriptorProperties[propertyKey as keyof T];
            yield [
                propertyKey,
                (typeof config === 'function' || isArray(config) ? { type: config } : config) as PropertyDeclaration,
            ];
        }
    }
}

/**
 * Iterate over decorated properties declarations.
 * @param ctr The component constructor.
 * @yields Tuples of property key and declaration.
 */
export function* decoratedPropertiesDeclarations<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    ctr: C
): Iterable<[keyof T, PropertyDeclaration]> {
    const descriptorProperties = hasOwn.call(ctr, Symbol.metadata)
        ? PROPERTIES_METADATA.get(ctr[Symbol.metadata] as object)
        : PROPERTIES_METADATA.get(ctr);
    if (descriptorProperties) {
        const prototype = ctr.prototype as T;
        for (const propertyKey of descriptorProperties.keys()) {
            const declaration = {
                ...descriptorProperties.get(propertyKey),
            } as PropertyDeclaration<T[keyof T]>;
            const descriptor = getOwnPropertyDescriptor(getPrototypeOf(prototype), propertyKey);
            if (descriptor) {
                declaration.get = descriptor.get;
                declaration.set = descriptor.set;
                if (!descriptor.get) {
                    declaration.defaultValue = descriptor.value;
                }
            }
            yield [propertyKey as keyof T, declaration];
        }
    }
}

/**
 * Iterate over all properties declarations.
 * @param ctr The component constructor.
 * @yields Tuples of property key and declaration.
 */
export function* decoratedObservers<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    ctr: C
): Iterable<[keyof T, PropertyObserver]> {
    const observers = hasOwn.call(ctr, Symbol.metadata)
        ? OBSERVERS_METADATA.get(ctr[Symbol.metadata] as object)
        : OBSERVERS_METADATA.get(ctr);
    if (observers) {
        const prototype = ctr.prototype as T;
        for (const [propertyKey, observer] of observers) {
            if (typeof observer === 'function') {
                yield [propertyKey as keyof T, observer as PropertyObserver];
            } else {
                yield [propertyKey as keyof T, prototype[observer as keyof T] as unknown as PropertyObserver];
            }
        }
    }
}

/**
 * Get component properties observers.
 * @param element The node.
 * @returns The map of observers.
 */
export const getObservers = <T extends ComponentInstance>(element: T): ObserversOf<T> => {
    const ctr = element.constructor as WithProperties<T>;
    if (!hasOwn.call(ctr, OBSERVERS_SYMBOL) || !ctr[OBSERVERS_SYMBOL]) {
        ctr[OBSERVERS_SYMBOL] = {} as ObserversOf<T>;
    }
    return ctr[OBSERVERS_SYMBOL];
};

/**
 * Define an observer for a property.
 * @param element The node context.
 * @param propertyKey The name of the property to watch.
 * @param observer The observer function to add.
 */
export const defineObserver = <T extends ComponentInstance, P extends keyof T>(
    element: T,
    propertyKey: P,
    observer: PropertyObserver<T[P]>
): void => {
    const observers = getObservers(element);
    if (!observers[propertyKey]) {
        observers[propertyKey] = [];
    }
    observers[propertyKey].push(observer);
};

/**
 * Get observers for an element property.
 * @param element The node.
 * @param propertyName The name of the property.
 * @returns A list of observers.
 * @throws If the property is not defined.
 */
const getPropertyObservers = <T extends ComponentInstance, P extends keyof T>(
    element: T & { [OBSERVERS_SYMBOL]?: ObserversOf<T> },
    propertyName: P
): ObserversOf<T>[P] => {
    getProperty(element, propertyName, true);

    const observers = element[OBSERVERS_SYMBOL] || ({} as ObserversOf<T>);
    element[OBSERVERS_SYMBOL] = observers;
    if (!observers[propertyName]) {
        observers[propertyName] = [];
    }
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
 * Add property metadata to a context.
 * @param key The decorator symbol context.
 * @param propertyKey The property name.
 * @param declaration The property declaration.
 */
const addPropertyMetadata = (key: object, propertyKey: PropertyKey, declaration: PropertyDeclaration) => {
    const properties = PROPERTIES_METADATA.get(key) ?? new Map();
    PROPERTIES_METADATA.set(key, properties);
    if (properties.has(propertyKey)) {
        throw new Error(`Duplicated @property decorator for ${String(propertyKey)}`);
    }
    properties.set(propertyKey, declaration);
};

/**
 * Standard decorator for property definition.
 * @param context The decorator context.
 * @param declaration The property declaration.
 * @returns The decorator initializer.
 */
const standardPropertyDecorator = <T extends ComponentInstance, P extends keyof T>(
    context: ClassFieldDecoratorContext,
    declaration: PropertyDeclaration<T[P]>
) => {
    if (
        context.kind !== 'field' &&
        context.kind !== 'accessor' &&
        context.kind !== 'getter' &&
        context.kind !== 'setter'
    ) {
        throw new TypeError('The @property decorator can be used only on class fields or accessors');
    }

    addPropertyMetadata(context.metadata, context.name, declaration);
};

/**
 * Old spec 2 decorator for property definition.
 * @param classElement The class element descriptor.
 * @param declaration The property declaration.
 * @returns The decorator initializer.
 */
const legacyPropertyDecorator = <T extends ComponentInstance, P extends keyof T>(
    classElement: ClassElement<T, T[P]>,
    declaration: PropertyDeclaration<T[P]>
) => {
    if (classElement.kind !== 'field') {
        throw new TypeError('Only class fields can be decorated with @property');
    }
    if (classElement.placement !== 'own') {
        throw new TypeError('A @property decorator can only be used on a class field');
    }

    return {
        ...classElement,
        finisher(ctr: Constructor<T>) {
            addPropertyMetadata(ctr, classElement.key, {
                ...declaration,
                initializer: classElement.initializer,
            });
        },
    };
};

/**
 * Add a property to a component prototype.
 * @param target The component prototype.
 * @param declaration The property declaration.
 * @param propertyKey The property name.
 * @param descriptor The native property descriptor.
 * @returns The property descriptor.
 */
const typescriptPropertyDecorator = <T extends ComponentInstance, P extends keyof T>(
    target: T,
    propertyKey: P,
    descriptor: PropertyDeclaration<T[P]>,
    declaration: PropertyDeclaration<T[P]>
): PropertyDescriptor => {
    const ctr = target.constructor as ComponentConstructor<T>;
    addPropertyMetadata(ctr, propertyKey, declaration);

    return descriptor;
};

/**
 * A decorator for property definition.
 * @param declaration The property declaration.
 * @returns The decorator initializer.
 */
// biome-ignore lint/suspicious/noExplicitAny: In order to support both TS and Babel decorators, we need to allow any type here.
export function property(declaration: PropertyDeclaration = {}): any {
    return <T extends ComponentInstance, P extends keyof T>(
        targetOrClassElement: T,
        propertyKey: P,
        descriptor: PropertyDescriptor
    ) => {
        if (typeof propertyKey === 'object') {
            return standardPropertyDecorator(
                propertyKey as ClassFieldDecoratorContext,
                declaration as PropertyDeclaration<T[P]>
            );
        }

        if (typeof propertyKey === 'string' || typeof propertyKey === 'symbol') {
            return typescriptPropertyDecorator(
                targetOrClassElement,
                propertyKey,
                descriptor,
                declaration as PropertyDeclaration<T[P]>
            );
        }

        return legacyPropertyDecorator(
            targetOrClassElement as unknown as ClassElement<T, T[P]>,
            declaration as PropertyDeclaration<T[P]>
        );
    };
}

/**
 * A decorator for state property definition.
 * @param declaration The state property declaration.
 * @returns The decorator initializer.
 */
// biome-ignore lint/suspicious/noExplicitAny: In order to support both TS and Babel decorators, we need to allow any type here.
export function state(declaration: PropertyDeclaration = {}): any {
    return <T extends ComponentInstance, P extends keyof T>(
        targetOrClassElement: T,
        propertyKey: P,
        descriptor: PropertyDescriptor
    ) => {
        if (typeof propertyKey === 'object') {
            return standardPropertyDecorator(
                propertyKey as ClassFieldDecoratorContext,
                {
                    ...declaration,
                    state: true,
                } as PropertyDeclaration<T[P]>
            );
        }

        if (typeof propertyKey === 'string' || typeof propertyKey === 'symbol') {
            return typescriptPropertyDecorator(targetOrClassElement, propertyKey, descriptor, {
                ...declaration,
                state: true,
            } as PropertyDeclaration<T[P]>);
        }

        return legacyPropertyDecorator(
            targetOrClassElement as unknown as ClassElement<T, T[P]>,
            {
                ...declaration,
                state: true,
            } as PropertyDeclaration<T[P]>
        );
    };
}

/**
 * Add observer metadata to a context.
 * @param key The decorator symbol context.
 * @param propertyKey The property name.
 * @param observer The observer function or method name.
 */
const addObserverMetadata = (key: object, propertyKey: PropertyKey, observer: PropertyKey | PropertyObserver) => {
    const observers = OBSERVERS_METADATA.get(key) ?? new Set();
    OBSERVERS_METADATA.set(key, observers);
    observers.add([propertyKey, observer]);
};

/**
 * A decorator for property observer.
 *
 * @param propertyKey The property key to observe.
 * @returns The decorator initializer.
 */
// biome-ignore lint/suspicious/noExplicitAny: In order to support both TS and Babel decorators, we need to allow any type here.
export function observe(propertyKey: string): any {
    return <T extends ComponentInstance, M extends keyof T>(targetOrClassElement: T, methodKey: M) => {
        if (typeof methodKey === 'object') {
            const context = methodKey as ClassMethodDecoratorContext;
            addObserverMetadata(context.metadata, propertyKey, context.name);
            return;
        }

        if (methodKey !== undefined) {
            addObserverMetadata(targetOrClassElement.constructor, propertyKey, methodKey);
            return;
        }

        const classElement = targetOrClassElement as unknown as ClassElement<T, T[M]>;
        return {
            ...classElement,
            finisher(ctr: Constructor<T>) {
                addObserverMetadata(ctr, propertyKey, classElement.key);
            },
        };
    };
}
