import { createSymbolKey } from './symbols';
import { CustomElement } from './CustomElement';
import { ClassElement } from './ClassElement';

/**
 * The observer signature for class fields.
 *
 * @param oldValue The previous value of the property.
 * @param newValue The current value of the property.
 */
export type ClassFieldObserver = (this: CustomElement, oldValue: any, newValue: any) => any;

/**
 * A validation function for the class field.
 *
 * @param value The value to set.
 */
export type ClassFieldValidator = (this: CustomElement, value: any) => boolean;

/**
 * Convert attribute to property value.
 *
 * @param value The attributue value.
 * @return The property value.
 */
export type ClassFieldAttributeConverter = (this: CustomElement, value: string|null) => any;

/**
 * Convert property to attribute value.
 *
 * @param value The property value.
 * @return The attributue value.
 */
export type ClassFieldPropertyConverter = (this: CustomElement, value: any) => string|null|undefined;

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
    types?: Function | Function[],
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
            targetOrClassElement.defineProperty(propertyKey, descriptor, symbol);
            targetOrClassElement.initProperty(propertyKey, symbol, descriptor);
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
                return this.initProperty(String(element.key), symbol, descriptor, element.initializer);
            },
            finisher(constructor: Function) {
                constructor.prototype.defineProperty(String(element.key), descriptor, symbol);
            },
        };
    }) as any;
