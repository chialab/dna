import { isUndefined, isFunction, isArray, isObject, isString } from './typeof.js';

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

    scoped(scope) {
        this.scope = scope;
        define(scope, this.name, {
            get: this.getter.bind(this),
            set: this.setter.bind(this),
            configurable: true,
        });
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

    init(value) {
        value = isUndefined(value) ? this.defaultValue : value;
        if (!isUndefined(value)) {
            if (!this.setter(value)) {
                if (this.required) {
                    throw new Error(
                        `"${this.name}" property is required${this.scope ? ` for ${this.scope.is}` : ''}.`
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
                let p = property[k];
                if (!(p instanceof Property)) {
                    p = new Property(p);
                }
                p.named(k);
                this.add(p);
            }
        }
    }

    get(name, attr = false) {
        let key = attr ? 'attrName' : 'name';
        for (let i = 0, len = this.props.length; i < len; i++) {
            let prop = this.props[i];
            if (prop[key] === name) {
                return prop;
            }
        }
        return null;
    }

    iterate(callback) {
        for (let i = 0, len = this.props.length; i < len; i++) {
            callback(this.props[i]);
        }
    }
}

export function prop(ctrs) {
    return new Property(ctrs);
}

define(prop, 'ANY', { get() { return prop(); } });
define(prop, 'STRING', { get() { return prop(String); } });
define(prop, 'BOOLEAN', { get() { return prop(Boolean); } });
define(prop, 'NUMBER', { get() { return prop(Number); } });
