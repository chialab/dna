import { ClassFieldObserver, ClassFieldValidator } from '@chialab/dna';
import { warnCode } from './deprecations';

/**
 * Compatibility proxy to properties descriptors.
 * @deprecated since version 3.0
 */
class CompatibilityPropertyProxy {
    name?: string;
    type?: Function[];
    defaultValue?: any;
    observers?: ClassFieldObserver[];

    constructor(type?: Function[]) {
        if (type) {
            this.type = type;
        }
    }

    /**
     * Set the default value.
     * @param defaultValue The value to set.
     */
    default(defaultValue: any) {
        this.defaultValue = defaultValue;
        return this;
    }

    /**
     * Set the property validator.
     * A validator should return `true` if the value is acceptable
     * or `false` if unaccaptable.
     *
     * @param validate The property validtor.
     * @return The property instance for chaining.
     */
    validate(validate: ClassFieldValidator) {
        (this as any).validate = validate;
        return this;
    }

    /**
     * Set the attribute name to sync.
     * Invoked without arguments, it retrieve the name of the property.
     *
     * @param attributeName The attribute name.
     * @return The property instance for chaining.
     */
    attribute(attributeName: string|boolean = true) {
        (this as any).attribute = attributeName;
        return this;
    }

    /**
     * Set a getter function for the property.
     * By default, the property value will be return.
     *
     * @param getter The property getter.
     * @return The property instance for chaining.
     */
    getter(getter: Function) {
        (this as any).getter = getter;
        return this;
    }

    /**
     * Set a setter function for the property.
     * By default, the property value will be updated with given value
     * without any modification.
     *
     * @param setter The property setter.
     * @return The property instance for chaining.
     */
    setter(setter: Function) {
        (this as any).setter = setter;
        return this;
    }

    /**
     * Add a callback when the property changes.
     *
     * @param observer The callback to trigger.
     * @return The property instance for chaining.
     */
    observe(observer: ClassFieldObserver|string) {
        this.observers = this.observers || [];
        if (typeof observer === 'string') {
            let methodKey = observer;
            observer = function(this: any, oldValue: any, newValue: any) {
                return this[methodKey](oldValue, newValue);
            };
        }
        this.observers.push(observer);
        return this;
    }

    /**
     * Add a DOM event name to dispatch on changes.
     *
     * @param eventName The event name.
     * @return The property instance for chaining.
     */
    dispatch(eventName: string) {
        let prop = this;
        this.observers = this.observers || [];
        this.observers.push(function(this: any, oldValue: any, newValue: any) {
            return this.dispatchEvent(eventName, {
                component: this,
                property: prop.name,
                newValue,
                oldValue,
            });
        });
        return this;
    }
}

type PropertyConstructor = ((type: Function | Function[]) => CompatibilityPropertyProxy) & {
    readonly STRING: CompatibilityPropertyProxy,
    readonly NUMBER: CompatibilityPropertyProxy,
    readonly BOOLEAN: CompatibilityPropertyProxy,
    readonly ANY: CompatibilityPropertyProxy,
};

/**
 * Helper method for property definition.
 * @deprecated since version 3.0
 * @param type A single or a list of valid constructors for the property value.
 * @return A compatibility property proxy.
 */
export const prop = ((type: Function | Function[]) => {
    warnCode('PREFER_PROPERTY_DESCRIPTOR');

    if (!Array.isArray(type)) {
        return new CompatibilityPropertyProxy([type]);
    }
    return new CompatibilityPropertyProxy(type);
}) as PropertyConstructor;

Object.defineProperty(prop, 'STRING', {
    get() {
        return new CompatibilityPropertyProxy([String]);
    },
});

Object.defineProperty(prop, 'NUMBER', {
    get() {
        return new CompatibilityPropertyProxy([Number]);
    },
});

Object.defineProperty(prop, 'BOOLEAN', {
    get() {
        return new CompatibilityPropertyProxy([Boolean]);
    },
});

Object.defineProperty(prop, 'ANY', {
    get() {
        return new CompatibilityPropertyProxy();
    },
});
