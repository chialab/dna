import { isUndefined, isFunction, isArray, isObject, isString } from './typeof.js';
import { define } from './obj-define.js';

/**
 * Power to the component's properties.
 * Type checking, validation, callbacks, events and attribute syncing.
 */
export class Property {
    /**
     * Create a Property instance.
     * @param {Function|Array} A single or a list of valid constructors for the property value.
     * @return {Property}
     */
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
            if ((val === null || val === undefined) ||
                this.validateType(val) && this.validator(val)) {
                let oldValue = this.value;
                if (oldValue !== val) {
                    this.value = val;
                    if (this.initialized) {
                        this.changed(val, oldValue);
                    }
                }
            } else {
                // eslint-disable-next-line
                throw new TypeError(
                    `Invalid \`${val}\` value for \`${this.name}\` property for \`${this.scope.is}\`.`
                );
            }
        };
    }
    /**
     * Add a callback when the property changes.
     * @param {Function} callback The callback to trigger.
     * @return {Property} The property instance for chaining.
     */
    observe(callback) {
        if (isFunction(callback) || isString(callback)) {
            this._.push(callback);
        }
        return this;
    }
    /**
     * Remove a callback on property changes.
     * @param {Function} callback The callback to remove.
     * @return {Property} The property instance for chaining.
     */
    unobserve(callback) {
        let io = this._.indexOf(callback);
        if (io !== -1) {
            this._.splice(io, 1);
        }
        return this;
    }
    /**
     * Trigger callbacks after a change.
     * @private
     * @param {*} newValue The current property value.
     * @param {*} oldValue The previous property value.
     */
    changed(newValue, oldValue) {
        for (let i = 0, len = this._.length; i < len; i++) {
            let clb = this._[i];
            if (isString(clb)) {
                this.scope[clb].call(this.scope, this, newValue, oldValue);
            } else {
                clb.call(this.scope, this, newValue, oldValue);
            }
        }
    }
    /**
     * Check if a property accepts a given type as value.
     * @param {Function} Ctr The constructor for the given type.
     * @return {Boolean}
     */
    accepts(Ctr) {
        return this.ctrs.indexOf(Ctr) !== -1;
    }
    /**
     * Set the property name.
     * It also set the attrName if `.attribute` method as been previously
     * invoked without arguments.
     * @param {String} name The property name.
     * @return {Property} The property instance for chaining.
     */
    named(name) {
        this.name = name;
        if (this.attrRequested === true) {
            this.attrName = this.name;
        }
        return this;
    }
    /**
     * Set the property initial value.
     * @param {*} initValue The property initial value.
     * @return {Property} The property instance for chaining.
     */
    default(initValue) {
        this.defaultValue = isObject(initValue) ?
            Object.freeze(initValue) :
            initValue;
        return this;
    }
    /**
     * Set the attribute name to sync.
     * Invoked without arguments, it retrieve the name of the property.
     * @param {String} attrName The attribute name.
     * @return {Property} The property instance for chaining.
     */
    attribute(attrName = true) {
        if (isString(attrName)) {
            this.attrRequested = false;
            this.attrName = attrName;
        } else {
            this.attrRequested = !!attrName;
            this.attrName = this.name;
        }
        return this;
    }
    /**
     * Add a DOM event name to dispatch on changes.
     * @param {String} evName The event name.
     * @return {Property} The property instance for chaining.
     */
    dispatch(evName) {
        this.eventName = evName;
        return this;
    }
    /**
     * Set a getter function for the property.
     * By default, the property value will be return.
     * @param {Function} callback The property getter.
     * @return {Property} The property instance for chaining.
     */
    getter(callback) {
        if (isFunction(callback)) {
            this.getterFn = () => callback(this.value);
        }
        return this;
    }
    /**
     * Set a setter function for the property.
     * By default, the property value will be updated with given value
     * without any modification.
     * @param {Function} callback The property setter.
     * @return {Property} The property instance for chaining.
     */
    setter(callback) {
        if (isFunction(callback)) {
            this._setter = callback;
        }
        return this;
    }
    /**
     * Set the property validator.
     * A validator should return `true` if the value is acceptable
     * or `false` if unaccaptable.
     * @param {Function} callback The property validtor.
     * @return {Property} The property instance for chaining.
     */
    validate(callback) {
        if (isFunction(callback)) {
            this.validator = callback;
        }
        return this;
    }
    /**
     * Check if the given value is a valid type.
     * @private
     * @param {*} val The value to check.
     * @return {Boolean}
     */
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
        return false;
    }
    /**
     * Attach the property to a scope (a component instance).
     * Set the default value if provided.
     * @param {Object} scope The scope which needs to be bound with the property.
     */
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
        this.initialized = true;
    }
}

/**
 * Helper method for Property creation.
 * @method prop
 * @memberof! DNA.
 * @static
 *
 * @property {Property} ANY A property without type validation.
 * @property {Property} STRING A property which accepts only strings.
 * @property {Property} BOOLEAN A property which accepts only booleans.
 * @property {Property} NUMBER A property which accepts only numbers.
 *
 * @param {Function|Array} ctrs A single or a list of valid constructors for the property value.
 * @return {Property} The new property.
 */
export function prop(ctrs) {
    return new Property(ctrs);
}

// Define some helpers for default types
define(prop, 'ANY', { get() { return prop(); } });
define(prop, 'STRING', { get() { return prop(String); } });
define(prop, 'BOOLEAN', { get() { return prop(Boolean); } });
define(prop, 'NUMBER', { get() { return prop(Number); } });
