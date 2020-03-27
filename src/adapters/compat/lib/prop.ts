import { ClassFieldObserver, ClassFieldValidator } from '@chialab/dna';
import { warnCode } from './deprecations';

class CompatProperty {
    name?: string;
    type?: Function[];
    defaultValue?: any;
    observers?: ClassFieldObserver[];

    constructor(type?: Function[]) {
        if (type) {
            this.type = type;
        }
    }

    default(defaultValue: any) {
        this.defaultValue = defaultValue;
        return this;
    }

    validate(validate: ClassFieldValidator) {
        (this as any).validate = validate;
        return this;
    }

    attribute(attributeName: string|boolean) {
        if (attributeName === undefined) {
            attributeName = true;
        }
        (this as any).attribute = attributeName;
        return this;
    }

    getter(getter: Function) {
        (this as any).getter = getter;
        return this;
    }

    setter(setter: Function) {
        (this as any).setter = setter;
        return this;
    }

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

export function prop(type: Function | Function[]) {
    warnCode('PREFER_PROPERTY_DESCRIPTOR');

    if (!Array.isArray(type)) {
        return new CompatProperty([type]);
    }
    return new CompatProperty(type);
}

Object.defineProperty(prop, 'STRING', {
    get() {
        return new CompatProperty([String]);
    },
});

Object.defineProperty(prop, 'NUMBER', {
    get() {
        return new CompatProperty([Number]);
    },
});

Object.defineProperty(prop, 'BOOLEAN', {
    get() {
        return new CompatProperty([Boolean]);
    },
});

Object.defineProperty(prop, 'ANY', {
    get() {
        return new CompatProperty();
    },
});
