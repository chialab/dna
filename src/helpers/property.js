import { isUndefined, isFunction, isArray, isObject } from './typeof.js';

const define = Object.defineProperty;

class ObserverMixin {
    constructor() {
        this._ = [];
    }

    observe(fn) {
        if (isFunction(fn)) {
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
            this._[i](newValue, oldValue);
        }
    }
}

class Property extends ObserverMixin {
    constructor(ctrs) {
        super();
        ctrs = ctrs || [];
        if (!isArray(ctrs)) {
            ctrs = [ctrs];
        }
        this.ctrs = ctrs;
        this.required = false;
        this.validator = () => true;
        this.beforeSet = (val) => val;
        this.getter = () => this.value;
        this.setter = (val) => {
            val = this.beforeSet(val);
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

    accepts(Ctr) {
        return this.ctrs.indexOf(Ctr) !== -1;
    }

    default(initValue) {
        this.value = Object.freeze(initValue);
        return this;
    }

    scoped(scope) {
        this.scope = scope;
        define(scope, this.name, {
            get: this.getter.bind(this),
            set: this.setter.bind(this),
            configurable: true,
        });
        return this;
    }


    require() {
        this.required = true;
        return this;
    }

    before(callback) {
        if (isFunction(callback)) {
            this.beforeSet = callback;
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
            `Invalid "${val}" value for "${this.name}" property for ${this.scope.is} components.`
        );
    }

    init(value) {
        if (!isUndefined(value)) {
            if (!this.setter(value)) {
                if (this.required) {
                    throw new Error(
                        `"${this.name}" property is required for ${this.scope.is} components.`
                    );
                }
            }
        }
    }
}

export class PropertyList extends ObserverMixin {
    constructor(props) {
        super();
        this.props = [];
        this.add(props);
    }

    add(property) {
        if (property instanceof Property) {
            this.props.push(
                property.observe((newValue, oldValue) =>
                    this.changed(newValue, oldValue)
                )
            );
        } else if (isObject(property)) {
            for (let k in property) {
                if (property.hasOwnProperty(k)) {
                    let p = property[k];
                    if (!(p instanceof Property)) {
                        p = new Property(p);
                    }
                    p.name = k;
                    this.add(p);
                }
            }
        }
    }

    has(name) {
        return !!this.iterate((property) => {
            if (property.name === name) {
                return true;
            }
            return undefined;
        });
    }

    get(name) {
        let res = this.iterate((property) => {
            if (property.name === name) {
                return property;
            }
            return undefined;
        });
        if (res) {
            return res;
        }
        throw new Error('Property not found.');
    }

    iterate(callback) {
        for (let i = 0, len = this.props.length; i < len; i++) {
            let res = callback(this.props[i]);
            if (!isUndefined(res)) {
                return res;
            }
        }
        return false;
    }
}

export function prop(ctrs) {
    return new Property(ctrs);
}

define(prop, 'ANY', { get() { return prop(); } });
define(prop, 'STRING', { get() { return prop(String); } });
define(prop, 'BOOLEAN', { get() { return prop(Boolean); } });
define(prop, 'NUMBER', { get() { return prop(Number); } });
