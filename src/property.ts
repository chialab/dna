import { createSymbolKey } from './symbols';
import { ComponentInterface, ComponentConstructorInterface } from './Interfaces';
import { ClassElement } from './ClassElement';

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
 * Convert attribute to property value.
 *
 * @param value The attributue value.
 * @return The property value.
 */
export type ClassFieldAttributeConverter = (value: string|null) => any;

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
    defaultValue?: any;
    /**
     * A list of valid property values prototypes.
     */
    type?: Function | Function[],
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
     * The event to fire on property change.
     */
    event?: true|string;
    /**
     * The property private symbol.
     */
    symbol?: symbol;
}

/**
 * Setup property initialization.
 * @param target The instance element.
 * @param key The property name.
 * @param descriptor The property descriptor.
 * @param symbol The symbol for the private property.
 * @param initializer The initial value.
 */
function initializeProperty(target: ComponentInterface<HTMLElement>, key: string, descriptor: ClassFieldDescriptor, symbol: symbol, initializer?: any) {
    const initialize = target.initialize;
    target.initialize = function(this: ComponentInterface<HTMLElement>, props: { [key: string]: any; }) {
        this.defineProperty(key, descriptor, symbol);
        if (!(key in props)) {
            this.initProperty(key, descriptor, symbol, initializer);
        }
        return initialize.call(this, props);
    };
}

/**
 * A decorator for class fields definition.
 *
 * @param descriptor The class field description.
 * @return The decorator initializer.
 */
export const property = (descriptor: ClassFieldDescriptor = {}) =>
    ((targetOrClassElement: ComponentInterface<HTMLElement>, propertyKey: string, originalDescriptor: PropertyDescriptor) => {
        const symbol = createSymbolKey();
        if (propertyKey !== undefined) {
            // decorators spec 1
            if (originalDescriptor) {
                descriptor.defaultValue = originalDescriptor.value;
            }
            initializeProperty(targetOrClassElement, propertyKey, descriptor, symbol);
            return targetOrClassElement;
        }

        // decorators spec 2
        const element = targetOrClassElement as unknown as ClassElement;
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
            initializer(this: ComponentInterface<HTMLElement>) {
                return (this as any)[symbol];
            },
            finisher(constructor: ComponentConstructorInterface<HTMLElement>) {
                initializeProperty(constructor.prototype, key, descriptor, symbol, element.initializer);
            },
        };
    }) as any;
