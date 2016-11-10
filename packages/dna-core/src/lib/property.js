import { isUndefined, isFunction, isArray, isObject, isString } from './typeof.js';

const define = Object.defineProperty;

class Property {
    constructor(ctrs) {
        this._ = [];
        ctrs = ctrs || [];
        if (!isArray(ctrs)) {
            ctrs = [ctrs];
        }
        this.ctrs = ctrs;
        this.validator = () => true;
        this._setter = (val) => val;
        this.getterFn = () => this.value;
        this.setterFn = (val) => {
            val = this._setter(val);
            if (this.validateType(val)) {
                if (this.validator(val)) {
                    let oldValue = this.value;
                    if (oldValue !== val) {
                        this.value = val;
                        this.changed(val, oldValue);
                    }
                    return true;
                }
            }
            return false;
        };
    }

    observe(fn) {
        if (isFunction(fn) || isString(fn)) {
            this._.push(fn);
        }
        return this;
    }

    unobserve(fn) {
        let io = this._.indexOf(fn);
        if (io !== -1) {
            this._.splice(io, 1);
        }
        return this;
    }

    changed(newValue, oldValue) {
        for (let i = 0, len = this._.length; i < len; i++) {
            let clb = this._[i];
            if (isString(clb)) {
                this.scope[clb].call(this.scope, this, newValue, oldValue);
            } else {
                clb(this, newValue, oldValue);
            }
        }
    }

    accepts(Ctr) {
        return this.ctrs.indexOf(Ctr) !== -1;
    }

    named(name) {
        this.name = name;
        if (this.attrRequested === true) {
            this.attrName = this.name;
        }
        return this;
    }

    default(initValue) {
        this.defaultValue = isObject(initValue) ?
            Object.freeze(initValue) :
            initValue;
        return this;
    }

    attribute(attrName = true) {
        if (isString(attrName)) {
            this.attrRequested = false;
            this.attrName = attrName;
        } else {
            this.attrRequested = !!attrName;
        }
        return this;
    }

    dispatch(evName) {
        this.eventName = evName;
        return this;
    }

    getter(callback) {
        if (isFunction(callback)) {
            this.getterFn = () => callback(this.value);
        }
        return this;
    }

    setter(callback) {
        if (isFunction(callback)) {
            this._setter = callback;
        }
        return this;
    }

    validate(callback) {
        if (isFunction(callback)) {
            this.validator = callback;
        }
        return this;
    }

    validateType(val) {
        if (val === null || val === undefined) {
            return true;
        }
        let i = 0;
        let ctrs = this.ctrs;
        if (ctrs.length === 0) {
            return true;
        }
        while (i < ctrs.length) {
            if (val instanceof ctrs[i] || (
                val.constructor && val.constructor === ctrs[i]
            )) {
                return true;
            }
            i++;
        }
        // eslint-disable-next-line
        throw new TypeError(
            `Invalid \`${val}\` value for "${this.name}" property${this.scope ? ` for ${this.scope.is}` : ''}.`
        );
    }

    init(scope) {
        this.scope = scope;
        define(scope, this.name, {
            get: this.getterFn.bind(this),
            set: this.setterFn.bind(this),
            configurable: true,
        });
        if (!isUndefined(this.defaultValue)) {
            scope[this.name] = this.defaultValue;
        }
    }
}

export function prop(ctrs) {
    if (ctrs instanceof Property) {
        return ctrs;
    }
    return new Property(ctrs);
}

define(prop, 'ANY', { get() { return prop(); } });
define(prop, 'STRING', { get() { return prop(String); } });
define(prop, 'BOOLEAN', { get() { return prop(Boolean); } });
define(prop, 'NUMBER', { get() { return prop(Number); } });
