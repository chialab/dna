import { DOM } from './dom';

/**
 * A Symbol which contains all Property instances of a Component.
 */
const PROPERTIES_SYMBOL = Symbol();

type WithProperties = {
    [PROPERTIES_SYMBOL]?: { [key: string]: AccessorDescriptor };
}

export type AccessorObserver = (oldValue: any, newValue: any) => any;

export type AccessorDescriptor = PropertyDescriptor & {
    name?: string;
    attribute?: string | boolean;
    defaultValue?: any;
    types?: Function | Function[],
    observers?: AccessorObserver[],
    validate?: (value: any) => boolean;
    observe?: (callback: AccessorObserver) => void;
    getter?: (this: HTMLElement, value?: any) => any;
    setter?: (this: HTMLElement, newValue?: any) => any;
}

export type AccessorDescriptors = {
    [key: string]: AccessorDescriptor;
}

function accessorToProperty(descriptor: AccessorDescriptor): PropertyDescriptor {
    let finalDescriptor: PropertyDescriptor = {
        enumerable: true,
    };

    let value = descriptor.value;
    if ('defaultValue' in descriptor) {
        value = descriptor.defaultValue;
    }

    let get = function(this: HTMLElement) {
        return value;
    };
    if (descriptor.getter) {
        let getter = descriptor.getter;
        get = function(this: HTMLElement) {
            return getter.call(this, value);
        };
    }

    let set = function(this: HTMLElement, val: any) {
        return val;
    };
    if (descriptor.setter) {
        let setter = descriptor.setter;
        set = function(this: HTMLElement, val) {
            return setter.call(this, val);
        };
    }

    let computedTypes: Function[] = [];
    if (Array.isArray(descriptor.types)) {
        computedTypes = descriptor.types;
    } else if (descriptor.types) {
        computedTypes = [descriptor.types];
    }

    let computedAttribute = descriptor.attribute as string;

    finalDescriptor.get = get;
    finalDescriptor.set = function(this: HTMLElement, newValue: any) {
        let oldValue = value;
        newValue = set.call(this, newValue);
        if (oldValue !== newValue) {
            let falsy = newValue == null || newValue === false;
            // if types or custom validator has been set, check the value validity
            if (!falsy) {
                let valid = true;
                if (computedTypes.length) {
                    // check if the value is an instanceof of at least one constructor
                    valid = computedTypes.some((Type) => (value instanceof Type || (value.constructor && value.constructor === Type)));
                }
                if (valid && descriptor.validate) {
                    valid = descriptor.validate(value);
                }
                if (!valid) {
                    throw new TypeError(`Invalid \`${value}\` value for \`${descriptor.name}\` property`);
                }
            }
            value = newValue;
            if (descriptor.attribute) {
                // update the bound attribute
                if (falsy) {
                    // a falsy value should remove the attribute
                    this.removeAttribute(computedAttribute);
                } else if (typeof value !== 'object') {
                    // if the value is `true` should set an empty attribute, otherwise just set the value
                    this.setAttribute(computedAttribute, value === true ? '' : value);
                }
            }
            // trigger Property changes
            if (DOM.isCustomElement(this)) {
                this.propertyChangedCallback(descriptor.name as string, oldValue, value);
            }
        }
    };

    return finalDescriptor;
}

export function defineProperty(target: HTMLElement, propertyKey: string, descriptor: AccessorDescriptor): void {
    const targetElement: HTMLElement & WithProperties = target;
    const descriptors = targetElement[PROPERTIES_SYMBOL] || {};
    descriptors[propertyKey] = descriptor;
    targetElement[PROPERTIES_SYMBOL] = descriptors;
    descriptor.name = propertyKey;
    if (descriptor.attribute === true) {
        descriptor.attribute = propertyKey;
    }
    if (descriptor.observe) {
        descriptor.observers = [descriptor.observe];
    }
    Object.defineProperty(target, propertyKey, accessorToProperty(descriptor));
}

export function getProperties(target: HTMLElement): { [key: string]: AccessorDescriptor } {
    const targetElement: HTMLElement & WithProperties = target;
    return targetElement[PROPERTIES_SYMBOL] || {};
}

export function property(descriptor: AccessorDescriptor = {}) {
    return (target: HTMLElement, propertyKey: string, originalDescriptor: PropertyDescriptor) => {
        descriptor.defaultValue = originalDescriptor.value;
        defineProperty(target, propertyKey, descriptor);
    };
}
