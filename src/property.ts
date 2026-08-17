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
import { batch, Computed, type ReadonlySignal, State, untrack } from './Signal';

/**
 * The symbol that holds the object handed out by the `signals` accessor.
 */
const SIGNALS_SYMBOL: unique symbol = Symbol();

/**
 * An instance seen as the signal slots of its properties.
 */
type WithSignalSlots = {
    // biome-ignore lint/suspicious/noExplicitAny: a slot holds the signal of any property.
    [key: symbol]: State<any> | Computed<any> | undefined;
};

/**
 * An instance seen as the object that hands out its signals.
 */
type WithSignalsAccessor<T> = {
    [SIGNALS_SYMBOL]?: PropertySignals<T>;
};

/**
 * The signals that hold the properties of a component, one per declared property.
 * A property that is not declared has no signal, and reading it here gives `undefined`.
 */
export type PropertySignals<T> = {
    // the accessor itself is left out, since mapping it would recur into itself. Nothing else
    // is filtered: telling a method from a property means resolving `T[K]`, which defers the
    // whole type when `T` is the `this` of a component — and reading `this.signals.PROP` from
    // inside the component is what this is for.
    readonly [K in Exclude<keyof T, 'signals'>]: ReadonlySignal<T[K]>;
};

/**
 * Get (or create) the signal a property keeps at its own symbol slot on the instance.
 *
 * The signal is the property: the accessor reads and writes it, so reading the property inside
 * a computation depends on it, and assigning the property runs what depends on it. The value is
 * compared with `===`, which is how a property has always decided whether it changed.
 *
 * The slot is a symbol on the instance rather than an entry of a map on the side, the same way
 * the value used to be kept: a property is read and written more than anything else in a
 * component, and this is one lookup instead of two. It also dies with the element, with nothing
 * else holding on to it.
 * @param element The component instance.
 * @param signalSymbol The symbol of the slot.
 * @returns The signal of the property.
 */
const signalAt = <T>(element: object, signalSymbol: symbol): State<T> => {
    const target = element as WithSignalSlots;
    // the slot is looked for on the instance alone: an ordinary read would walk the prototype
    // chain, and one made with the prototype as the target — a probe of the class, a feature
    // detection — would install the slot there and have every instance share a single signal
    let signal = (hasOwn.call(target, signalSymbol) ? target[signalSymbol] : undefined) as State<T> | undefined;
    if (!signal) {
        signal = new State<T>(undefined as T, {
            equals: (previousValue, newValue) => previousValue === newValue,
        });
        target[signalSymbol] = signal;
    }

    return signal;
};

/**
 * Get (or create) the derived signal of a computed property.
 * The computation runs with the element as its `this`, so it reads the other properties the
 * way the component would, and depends on the ones it touches.
 * @param element The component instance.
 * @param signalSymbol The symbol of the slot.
 * @param compute The computation of the property.
 * @returns The signal of the property.
 */
const computedAt = <T>(element: object, signalSymbol: symbol, compute: () => T): Computed<T> => {
    const target = element as WithSignalSlots;
    // read from the instance alone, for the reason given in `signalAt`
    let signal = (hasOwn.call(target, signalSymbol) ? target[signalSymbol] : undefined) as Computed<T> | undefined;
    if (!signal) {
        signal = new Computed<T>(() => compute.call(element));
        target[signalSymbol] = signal;
    }

    return signal;
};

/**
 * Get the signal of a property, derived when the property is computed.
 * @param element The component instance.
 * @param property The property declaration.
 * @returns The signal of the property.
 */
const propertySignal = <T extends ComponentInstance, P extends keyof T>(
    element: T,
    property: Property<T, P>
): ReadonlySignal<T[P]> =>
    property.compute
        ? computedAt<T[P]>(element, property.signalSymbol, property.compute)
        : signalAt<T[P]>(element, property.signalSymbol);

/**
 * Get the signal that holds the value of a property.
 * @param element The component instance.
 * @param propertyKey The name of the property.
 * @returns The signal of the property.
 * @throws If the property is not defined.
 */
export const getPropertySignal = <T extends ComponentInstance, P extends keyof T>(
    element: T,
    propertyKey: P
): ReadonlySignal<T[P]> => propertySignal(element, getProperty(element, propertyKey, true));

/**
 * Get the signals of the properties of a component instance.
 * @param element The component instance.
 * @returns An object with a signal for each declared property.
 * @throws If the component has not been finalized.
 */
export const getPropertySignals = <T extends ComponentInstance>(element: T): PropertySignals<T> => {
    const target = element as T & WithSignalsAccessor<T>;
    let accessor = target[SIGNALS_SYMBOL];
    if (!accessor) {
        accessor = {} as PropertySignals<T>;
        const properties = getProperties(element);
        for (const propertyKey in properties) {
            const property = properties[propertyKey as keyof T];
            _defineProperty(accessor, propertyKey, {
                enumerable: true,
                get: () => propertySignal(element, property),
            });
        }
        target[SIGNALS_SYMBOL] = accessor;
    }

    return accessor;
};

/**
 * A map of all properties of a Component.
 */
const PROPERTIES_REGISTRY: Map<string, PropertiesOf<ComponentInstance>> = new Map();

/**
 * A map of all observers of a Component.
 */
const OBSERVERS_REGISTRY: Map<string, ObserversOf<ComponentInstance>> = new Map();

/**
 * WeakMap containing all observers for each component instance.
 */
const OBSERVERS: WeakMap<ComponentInstance, ObserversOf<ComponentInstance>> = new WeakMap();

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
     * Derive the value from the other signals the computation reads, instead of holding one.
     * The computation runs with the component as its `this`, is memoized, and runs again only
     * when one of the properties or signals it read has changed. The property is read-only.
     */
    compute?: () => T;
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
     * The symbol of the slot where the instance keeps the signal of the property.
     */
    signalSymbol: symbol;
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
     * Derive the value from the other signals the computation reads, instead of holding one.
     */
    compute?: () => T[P];
    /**
     * The initializer function.
     */
    initializer?: () => T[P];
};

/**
 * Retrieve all properties descriptors.
 * @param prototype The component prototype.
 * @returns A list of property descriptors.
 * @throws If the component has not been finalized.
 */
export const getProperties = <T extends ComponentInstance>(prototype: T): PropertiesOf<T> => {
    if (!prototype.is) {
        throw new Error('Component has not been finalized');
    }
    if (!PROPERTIES_REGISTRY.has(prototype.is)) {
        PROPERTIES_REGISTRY.set(prototype.is, {} as PropertiesOf<ComponentInstance>);
    }
    return PROPERTIES_REGISTRY.get(prototype.is) as PropertiesOf<T>;
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
        signalSymbol: Symbol(`${String(propertyKey)} signal`),
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

    if (property.compute) {
        const { signalSymbol, compute } = property;

        return {
            configurable: true,
            enumerable: true,
            get(this: T) {
                return computedAt<T[P]>(this, signalSymbol, compute).get();
            },
            set() {
                throw new TypeError(`The \`${String(name)}\` property is computed and cannot be assigned`);
            },
        };
    }

    // biome-ignore lint/suspicious/noExplicitAny: We need any to convert the symbol to a unique symbol.
    const symbol: unique symbol = symbolKey as any;
    type E = T & { [symbol]: E[P] };

    const { signalSymbol } = property;

    return {
        configurable: true,
        enumerable: true,
        get(this: E) {
            // a property declared `update: false` says that changing it drives nothing, so
            // reading it does not depend on it. Its signal is still there for whoever wants
            // to follow it on purpose, through `signals`.
            let value = update === false ? signalAt<E[P]>(this, signalSymbol).peek() : this[symbol];
            if (get) {
                value = get.call(this);
            }
            if (getter) {
                value = getter.call(this, value);
            }
            return value;
        },
        set(this: E, newValue: Parameters<NonNullable<PropertyDescriptor['set']>>[0]) {
            // the assignment is untracked: it reads the current value to compare it, and a
            // computation that writes a property would otherwise end up depending on the very
            // value it is about to change. It is also batched, so that the render the write
            // causes lands after the callbacks, the observers and the event, where it has
            // always been.
            untrack(() =>
                batch(() => {
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
                        this.stateChangedCallback(name, oldValue, computedNewValue);
                    } else {
                        this.propertyChangedCallback(name, oldValue, computedNewValue);
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
                })
            );
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
    let finalDeclaration = declaration;
    if (declaration.compute) {
        // everything below needs a write to hang off: a computed property has none, and giving
        // it one would mean keeping an effect alive for a value nobody may ever read
        const conflict = (
            ['attribute', 'event', 'observe', 'observers', 'defaultValue', 'setter', 'set', 'validate'] as const
        ).find((key) => declaration[key] != null && declaration[key] !== false);
        if (conflict) {
            throw new TypeError(
                `The \`${String(propertyKey)}\` property is computed and cannot declare \`${conflict}\``
            );
        }
        finalDeclaration = { ...declaration, attribute: false, update: false };
    }

    const property = createProperty(propertyKey, finalDeclaration, symbolKey, isStatic);
    const properties = getProperties(prototype);
    properties[propertyKey] = property;
    const finalDescriptor = createPropertyDescriptor(property);
    _defineProperty(prototype, propertyKey, finalDescriptor);

    // the slot the accessor reads and writes is the signal of the property. Everything that
    // used to reach the value through the symbol — the accessor itself, a custom getter or
    // setter, `getInnerPropertyValue` — goes through the signal without knowing it.
    // The symbol of the slot is closed over, so neither reading nor writing a property looks
    // its declaration up.
    if (!property.compute) {
        const { signalSymbol } = property;
        _defineProperty(prototype, property.symbol, {
            configurable: true,
            get(this: T) {
                return signalAt<T[P]>(this, signalSymbol).get();
            },
            set(this: T, value: T[P]) {
                signalAt<T[P]>(this, signalSymbol).set(value);
            },
        });
    }

    if (finalDeclaration.observe) {
        defineObserver(prototype, propertyKey, finalDeclaration.observe);
    }
    finalDeclaration.observers?.forEach((observer) => {
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
    const hasMetadata = hasOwn.call(ctr, Symbol.metadata);
    const descriptorProperties = hasMetadata
        ? PROPERTIES_METADATA.get(ctr[Symbol.metadata] as object)
        : PROPERTIES_METADATA.get(ctr.prototype);
    if (descriptorProperties) {
        const prototype = ctr.prototype as T;
        for (const propertyKey of descriptorProperties.keys()) {
            const declaration = {
                ...descriptorProperties.get(propertyKey),
            } as PropertyDeclaration<T[keyof T]>;
            const descriptor = getOwnPropertyDescriptor(
                hasMetadata ? getPrototypeOf(prototype) : prototype,
                propertyKey
            );
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
        : OBSERVERS_METADATA.get(ctr.prototype);
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
 * @param prototype The component prototype.
 * @returns The map of observers.
 * @throws If the component has not been finalized.
 */
export const getObservers = <T extends ComponentInstance>(prototype: T): ObserversOf<T> => {
    if (!prototype.is) {
        throw new Error('Component has not been finalized');
    }
    if (!OBSERVERS_REGISTRY.has(prototype.is)) {
        OBSERVERS_REGISTRY.set(prototype.is, {} as ObserversOf<ComponentInstance>);
    }
    return OBSERVERS_REGISTRY.get(prototype.is) as ObserversOf<T>;
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
    element: T,
    propertyName: P
): ObserversOf<T>[P] => {
    getProperty(element, propertyName, true);

    if (!OBSERVERS.has(element)) {
        OBSERVERS.set(element, {} as ObserversOf<ComponentInstance>);
    }
    const observers = OBSERVERS.get(element) as ObserversOf<T>;
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
            const context = propertyKey as ClassFieldDecoratorContext;
            if (
                context.kind !== 'field' &&
                context.kind !== 'accessor' &&
                context.kind !== 'getter' &&
                context.kind !== 'setter'
            ) {
                throw new TypeError('The @property decorator can be used only on class fields or accessors');
            }
            addPropertyMetadata(context.metadata, context.name, declaration);
            return;
        }

        if (typeof propertyKey === 'string' || typeof propertyKey === 'symbol') {
            addPropertyMetadata(targetOrClassElement, propertyKey, declaration);
            return descriptor;
        }

        const classElement = targetOrClassElement as unknown as ClassElement<T, T[P]>;
        if (classElement.kind !== 'field' || classElement.placement !== 'own') {
            throw new TypeError('The @property decorator can be used only on class fields or accessors');
        }

        return {
            ...classElement,
            finisher(ctr: Constructor<T>) {
                addPropertyMetadata(ctr.prototype, classElement.key, {
                    ...declaration,
                    initializer: classElement.initializer,
                });
            },
        };
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
            const context = propertyKey as ClassFieldDecoratorContext;
            if (
                context.kind !== 'field' &&
                context.kind !== 'accessor' &&
                context.kind !== 'getter' &&
                context.kind !== 'setter'
            ) {
                throw new TypeError('The @property decorator can be used only on class fields or accessors');
            }
            addPropertyMetadata(context.metadata, context.name, {
                ...declaration,
                state: true,
            });
            return;
        }

        if (typeof propertyKey === 'string' || typeof propertyKey === 'symbol') {
            addPropertyMetadata(targetOrClassElement, propertyKey, {
                ...declaration,
                state: true,
            } as PropertyDeclaration<T[P]>);
            return descriptor;
        }

        const classElement = targetOrClassElement as unknown as ClassElement<T, T[P]>;
        if (classElement.kind !== 'field' || classElement.placement !== 'own') {
            throw new TypeError('The @property decorator can be used only on class fields or accessors');
        }

        return {
            ...classElement,
            finisher(ctr: Constructor<T>) {
                addPropertyMetadata(ctr.prototype, classElement.key, {
                    ...declaration,
                    state: true,
                    initializer: classElement.initializer,
                });
            },
        };
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
            addObserverMetadata(targetOrClassElement, propertyKey, methodKey);
            return;
        }

        const classElement = targetOrClassElement as unknown as ClassElement<T, T[M]>;
        return {
            ...classElement,
            finisher(ctr: Constructor<T>) {
                addObserverMetadata(ctr.prototype, propertyKey, classElement.key);
            },
        };
    };
}
