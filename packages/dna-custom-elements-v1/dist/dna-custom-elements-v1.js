(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.DNA = global.DNA || {})));
}(this, (function (exports) { 'use strict';

/**
 * Check if an value is a function.
 * @method isFunction
 * @memberof! DNA.
 * @static
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
function isFunction(obj) {
  return typeof obj === 'function';
}
/**
 * Check if an value is a string.
 * @method isString
 * @memberof! DNA.
 * @static
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
function isString(obj) {
  return typeof obj === 'string';
}
/**
 * Check if an value is an object.
 * @method isObject
 * @memberof! DNA.
 * @static
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * Check if an value is undefined.
 * @method isUndefined
 * @memberof! DNA.
 * @static
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
function isUndefined(obj) {
  return typeof obj === 'undefined';
}
/**
 * Check if an value is an array.
 * @method isArray
 * @memberof! DNA.
 * @static
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
function isArray(obj) {
  return Array.isArray(obj);
}

/**
 * A custom components registry.
 * It replicates the [CustomElementRegistry interface](https://www.w3.org/TR/custom-elements/#custom-elements-api).
 * @name registry
 * @namespace registry
 * @memberof! DNA.
 * @static
 */
var registry$1 = {
    /**
     * The list of defined components.
     * @type {Object}
     */
    components: {},
    /**
     * Register a new component.
     * @param {String} name The id of the component.
     * @param {Function} Ctr The component constructor.
     * @param {Object} config Optional component configuration.
     */
    define: function define(name, Ctr) {
        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        this.components[name.toLowerCase()] = {
            is: name,
            Ctr: Ctr,
            config: config
        };
    },

    /**
     * Retrieve a component descriptor by id.
     * @private
     * @param {String} name The component id.
     * @return {Object} The component descriptor.
     */
    getDescriptor: function getDescriptor(name) {
        if (isString(name)) {
            return this.components[name.toLowerCase()];
        } else if (isFunction(name)) {
            for (var k in this.components) {
                var desc = this.components[k];
                if (desc.Ctr === name) {
                    return desc;
                }
            }
        }
    },

    /**
     * Retrieve a component constructor by id.
     * @param {String} name The component id.
     * @return {Function} The component constructor.
     */
    get: function get(name) {
        var desc = this.getDescriptor(name);
        if (desc) {
            return desc.Ctr;
        }
    }
};

var COMPONENT_SYMBOL = '__component';

/**
 * Retrieve a component constructor from an Element or from a tag name.
 * @method getComponent
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component|String} element The element or the tag name.
 * @param {Boolean} full Retrieve full component information.
 * @return {Function} The component constructor for the given param.
 */
function getComponent(element) {
    var full = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (element.node) {
        element = element.node;
    }
    if (element.nodeType === Node.ELEMENT_NODE) {
        element = element.getAttribute('is') || element.tagName;
    }
    return full ? registry$1.getDescriptor(element) : registry$1.get(element);
}
/**
 * Check if a node is an instance of a component.
 * @method isComponent
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The element to check.
 * @return {Boolean}
 */

/**
 * An helper for dynamically trigger the `connectedCallback` reaction on components.
 * @method connect
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The attached node.
 * @return {Boolean} The callback has been triggered.
 */

/**
 * An helper for dynamically trigger the `disconnectedCallback` reaction on components.
 * @method disconnect
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The detached node.
 * @return {Boolean} The callback has been triggered.
 */

/**
 * An helper for dynamically trigger the `attributeChangedCallback` reaction on components.
 * @method update
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The updated element.
 * @return {Boolean} The callback has been triggered.
 */

/**
 * Attach a component prototype to an already instantiated HTMLElement.
 * @method bind
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} node The node to update.
 * @param {Function} Ctr The component class to use (leave empty for auto detect).
 * @return {Boolean} The prototype has been attached.
 */

/**
 * Create a component instance.
 * @method createElement
 * @memberof DNA.DOM
 * @static
 *
 * @param {String} is The component tag name.
 * @return {HTMLElement} The component instance.
 */

/**
 * Dynamically append a node and call the `connectedCallback`.
 * - disconnect the node if already in the tree
 * - connect the node after the insertion
 * @method appendChild
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} parent The parent element.
 * @param {Component} element The element to append.
 * @return {Boolean} The node has been appended.
 */

/**
 * Dynamically remove a node and call the `disconnectedCallback`.
 * @method removeChild
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} parent The parent element.
 * @param {Component} element The element to remove.
 * @return {Boolean} The node has been removed.
 */

/**
 * Dynamically insert a node before another and call all the reactions.
 * - disconnect the node if already in the tree
 * - connect the node after the insertion
 * @method insertBefore
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} parent The parent element.
 * @param {Component} element The element to insert.
 * @param {HTMLElement} refNode The node for positioning.
 * @return {Boolean} The node has been appended.
 */

/**
 * Dynamically replace a node with another and call all the reactions.
 * - disconnect the node if already in the tree
 * - disconnect the replaced node
 * - connect the first node after the insertion
 * @method replaceChild
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} parent The parent element.
 * @param {Component} element The element to insert.
 * @param {HTMLElement} refNode The node to replace.
 * @return {Boolean} The node has been appended.
 */

/**
 * Dynamically update a node attribute and call all the reactions.
 * @method setAttribute
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The element to update.
 * @param {String} name The attribute name.
 * @param {String} value The attribute value.
 * @return {Boolean} The node has been updated.
 */

/**
 * Dynamically remove a node attribute and call all the reactions.
 * @method removeAttribute
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The element to update.
 * @param {String} name The attribute name.
 * @return {Boolean} The node has been updated.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * THe base custom component mixins. Just add life cycles callback and `is` getter.
 * @mixin ComponentMixin
 * @memberof DNA.MIXINS
 * @static
 */
var ComponentMixin = function ComponentMixin(SuperClass) {
  return function (_SuperClass) {
    inherits(_class, _SuperClass);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, _SuperClass.apply(this, arguments));
    }

    /**
     * Fires when an instance was inserted into the document.
     * @method connectedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */
    _class.prototype.connectedCallback = function connectedCallback() {
      this.node[COMPONENT_SYMBOL] = this;
    };
    /**
     * Fires when an instance was detached from the document.
     * @method disconnectedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */


    _class.prototype.disconnectedCallback = function disconnectedCallback() {};
    /**
     * Fires when an attribute was added, removed, or updated.
     * @method attributeChangedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     *
     * @param {String} attrName The changed attribute name.
     * @param {String} oldVal The value of the attribute before the change.
     * @param {String} newVal The value of the attribute after the change.
     */


    _class.prototype.attributeChangedCallback = function attributeChangedCallback() {};

    createClass(_class, [{
      key: 'is',

      /**
       * @property {String} is Get component id.
       * @name is
       * @type {String}
       * @memberof DNA.MIXINS.ComponentMixin
       * @instance
       */
      get: function get() {
        return (this.getAttribute('is') || this.localName).toLowerCase();
      }
    }, {
      key: 'node',
      get: function get() {
        return this;
      }
    }]);
    return _class;
  }(SuperClass);
};

var CustomEvent = void 0;

try {
    // eslint-disable-next-line
    var ev = new self.CustomEvent('test');
    CustomEvent = self.CustomEvent;
} catch (ex) {
    CustomEvent = function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = self.CustomEvent.prototype;
}

/**
 * Trigger a custom DOM Event.
 * @private
 *
 * @param {Node} node The event target.
 * @param {String} evName The custom event name.
 * @param {Object} data Extra data to pass to the event.
 * @param {Boolean} bubbles Enable event bubbling.
 * @param {Boolean} cancelable Make event cancelable.
 * @return {Boolean} True if event propagation has not be stopped.
 */
function dispatch$1(node, evName, data) {
    var bubbles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var cancelable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    if (!isString(evName)) {
        throw new TypeError('Event name is undefined');
    }
    var ev = new CustomEvent(evName, {
        detail: data,
        bubbles: bubbles,
        cancelable: cancelable
    });
    return node.dispatchEvent(ev);
}

/**
 * Shortcut to `Object.defineProperty`.
 * @type {Function}
 * @private
 */
var define$2 = Object.defineProperty;

/**
 * Power to the component's properties.
 * Type checking, validation, callbacks, events and attribute syncing.
 * @private
 */

var Property = function () {
    /**
     * Create a Property instance.
     * @param {Function|Array} A single or a list of valid constructors for the property value.
     * @return {Property}
     */
    function Property(ctrs) {
        var _this = this;

        classCallCheck(this, Property);

        this._ = [];
        ctrs = ctrs || [];
        if (!isArray(ctrs)) {
            ctrs = [ctrs];
        }
        this.ctrs = ctrs;
        this.validator = function () {
            return true;
        };
        this._setter = function (val) {
            return val;
        };
        this.getterFn = function () {
            return _this.value;
        };
        this.setterFn = function (val) {
            val = _this._setter(val);
            if (val === null || val === undefined || _this.validateType(val) && _this.validator(val)) {
                var oldValue = _this.value;
                if (oldValue !== val) {
                    _this.value = val;
                    _this.changed(val, oldValue);
                }
            } else {
                // eslint-disable-next-line
                throw new TypeError('Invalid `' + val + '` value for `' + _this.name + '` property for `' + _this.scope.is + '`.');
            }
        };
    }
    /**
     * Add a callback when the property changes.
     * @param {Function} callback The callback to trigger.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.observe = function observe(callback) {
        if (isFunction(callback) || isString(callback)) {
            this._.push(callback);
        }
        return this;
    };
    /**
     * Remove a callback on property changes.
     * @param {Function} callback The callback to remove.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.unobserve = function unobserve(callback) {
        var io = this._.indexOf(callback);
        if (io !== -1) {
            this._.splice(io, 1);
        }
        return this;
    };
    /**
     * Trigger callbacks after a change.
     * @private
     * @param {*} newValue The current property value.
     * @param {*} oldValue The previous property value.
     */


    Property.prototype.changed = function changed(newValue, oldValue) {
        for (var i = 0, len = this._.length; i < len; i++) {
            var clb = this._[i];
            if (isString(clb)) {
                this.scope[clb].call(this.scope, this, newValue, oldValue);
            } else {
                clb(this, newValue, oldValue);
            }
        }
    };
    /**
     * Check if a property accepts a given type as value.
     * @param {Function} Ctr The constructor for the given type.
     * @return {Boolean}
     */


    Property.prototype.accepts = function accepts(Ctr) {
        return this.ctrs.indexOf(Ctr) !== -1;
    };
    /**
     * Set the property name.
     * It also set the attrName if `.attribute` method as been previously
     * invoked without arguments.
     * @param {String} name The property name.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.named = function named(name) {
        this.name = name;
        if (this.attrRequested === true) {
            this.attrName = this.name;
        }
        return this;
    };
    /**
     * Set the property initial value.
     * @param {*} initValue The property initial value.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.default = function _default(initValue) {
        this.defaultValue = isObject(initValue) ? Object.freeze(initValue) : initValue;
        return this;
    };
    /**
     * Set the attribute name to sync.
     * Invoked without arguments, it retrieve the name of the property.
     * @param {String} attrName The attribute name.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.attribute = function attribute() {
        var attrName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (isString(attrName)) {
            this.attrRequested = false;
            this.attrName = attrName;
        } else {
            this.attrRequested = !!attrName;
            this.attrName = this.name;
        }
        return this;
    };
    /**
     * Add a DOM event name to dispatch on changes.
     * @param {String} evName The event name.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.dispatch = function dispatch(evName) {
        this.eventName = evName;
        return this;
    };
    /**
     * Set a getter function for the property.
     * By default, the property value will be return.
     * @param {Function} callback The property getter.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.getter = function getter(callback) {
        var _this2 = this;

        if (isFunction(callback)) {
            this.getterFn = function () {
                return callback(_this2.value);
            };
        }
        return this;
    };
    /**
     * Set a setter function for the property.
     * By default, the property value will be updated with given value
     * without any modification.
     * @param {Function} callback The property setter.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.setter = function setter(callback) {
        if (isFunction(callback)) {
            this._setter = callback;
        }
        return this;
    };
    /**
     * Set the property validator.
     * A validator should return `true` if the value is acceptable
     * or `false` if unaccaptable.
     * @param {Function} callback The property validtor.
     * @return {Property} The property instance for chaining.
     */


    Property.prototype.validate = function validate(callback) {
        if (isFunction(callback)) {
            this.validator = callback;
        }
        return this;
    };
    /**
     * Check if the given value is a valid type.
     * @private
     * @param {*} val The value to check.
     * @return {Boolean}
     */


    Property.prototype.validateType = function validateType(val) {
        var i = 0;
        var ctrs = this.ctrs;
        if (ctrs.length === 0) {
            return true;
        }
        while (i < ctrs.length) {
            if (val instanceof ctrs[i] || val.constructor && val.constructor === ctrs[i]) {
                return true;
            }
            i++;
        }
        return false;
    };
    /**
     * Attach the property to a scope (a component instance).
     * Set the default value if provided.
     * @param {Object} scope The scope which needs to be bound with the property.
     */


    Property.prototype.init = function init(scope) {
        this.scope = scope;
        define$2(scope, this.name, {
            get: this.getterFn.bind(this),
            set: this.setterFn.bind(this),
            configurable: true
        });
        if (!isUndefined(this.defaultValue)) {
            scope[this.name] = this.defaultValue;
        }
    };

    return Property;
}();

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
 * @param {Property|Function|Array} ctrs A Property to clone or a single or a list of valid constructors for the property value.
 * @return {Property} The new property.
 */


function prop(ctrs) {
    if (ctrs instanceof Property) {
        return ctrs;
    }
    return new Property(ctrs);
}

// Define some helpers for default types
define$2(prop, 'ANY', {
    get: function get() {
        return prop();
    }
});
define$2(prop, 'STRING', {
    get: function get() {
        return prop(String);
    }
});
define$2(prop, 'BOOLEAN', {
    get: function get() {
        return prop(Boolean);
    }
});
define$2(prop, 'NUMBER', {
    get: function get() {
        return prop(Number);
    }
});

/**
 * Try to parse attribute value checking the property validation types.
 * @private
 *
 * @param {Property} property The property to update.
 * @param {String} attrVal The attribute value.
 * @return {*} The parsed value.
 */
function getValue(property, attrVal) {
    if (attrVal === '' && property.accepts(Boolean)) {
        return true;
    }
    if (!property.accepts(String)) {
        try {
            return JSON.parse(attrVal);
        } catch (ex) {
            //
        }
    }
    return attrVal;
}

/**
 * Set an attribute value checking its type.
 * @private
 *
 * @param {HTMLElement} context The node to update.
 * @param {String} attr The attribute name to update.
 * @param {*} value The value to set.
 */
function setAttribute$1(context, attr, value) {
    var currentAttrValue = context.getAttribute(attr);
    if (currentAttrValue !== value) {
        if (value !== null && value !== undefined && value !== false) {
            switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
                case 'string':
                case 'number':
                    context.setAttribute(attr, value);
                    break;
                case 'boolean':
                    context.setAttribute(attr, '');
            }
        } else if (currentAttrValue !== null) {
            context.removeAttribute(attr);
        }
    }
}

/**
 * Simple Custom Component for properties initialization via attributes.
 * @mixin PropertiesMixin
 * @memberof DNA.MIXINS
 * @static
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get properties() {
 *     return { name: String };
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var temp = document.createElement('div');
 * temp.innerHTML = '<my-component name="Albert"></my-component>';
 * var element = temp.firstChild;
 * console.log(element.name); // logs "Albert"
 * ```
 */
var PropertiesMixin = function PropertiesMixin(SuperClass) {
    return function (_SuperClass) {
        inherits(_class, _SuperClass);

        /**
         * Attach properties on component creation.
         * @method constructor
         * @memberof DNA.MIXINS.PropertiesMixin
         * @instance
         */
        function _class() {
            classCallCheck(this, _class);

            var _this = possibleConstructorReturn(this, _SuperClass.call(this));

            var props = _this.properties;
            if (props) {
                if (!isArray(props)) {
                    props = [props];
                }
                props = props.reduce(function (res, partialProps) {
                    for (var k in partialProps) {
                        res[k] = prop(partialProps[k]);
                    }
                    return res;
                }, {});
            } else {
                props = {};
            }
            Object.defineProperty(_this, 'properties', {
                value: props,
                writable: false,
                configurable: true
            });
            var observed = _this.constructor.observedAttributes || [];

            var _loop = function _loop(k) {
                var prop$$1 = props[k];
                prop$$1.named(k).init(_this);
                var attrName = prop$$1.attrName,
                    eventName = prop$$1.eventName;

                if (!attrName && observed.indexOf(k) !== -1) {
                    prop$$1.attribute();
                    attrName = k;
                }
                if (attrName || eventName) {
                    prop$$1.observe(function () {
                        if (attrName) {
                            setAttribute$1(_this.node, attrName, _this[prop$$1.name]);
                        }
                        if (eventName) {
                            dispatch$1(_this.node, eventName);
                        }
                    });
                }
            };

            for (var k in props) {
                _loop(k);
            }
            return _this;
        }
        /**
         * Sync initial attributes with properties.
         * @method connectedCallback
         * @memberof DNA.MIXINS.PropertiesMixin
         * @instance
         */


        _class.prototype.connectedCallback = function connectedCallback() {
            _SuperClass.prototype.connectedCallback.call(this);
            var props = this.properties;
            for (var k in props) {
                var _prop = props[k];
                var _attrName = _prop.attrName;

                if (_attrName) {
                    if (isUndefined(this[_prop.name])) {
                        if (this.node.hasAttribute(_attrName)) {
                            this[_prop.name] = getValue(_prop, this.node.getAttribute(_attrName));
                        }
                    } else {
                        setAttribute$1(this.node, _attrName, this[_prop.name]);
                    }
                }
            }
        };
        /**
         * Sync attributes with properties.
         * @method attributeChangedCallback
         * @memberof DNA.MIXINS.PropertiesMixin
         * @instance
         *
         * @param {String} attrName The changed attribute name.
         * @param {String} oldVal The value of the attribute before the change.
         * @param {String} newVal The value of the attribute after the change.
         */


        _class.prototype.attributeChangedCallback = function attributeChangedCallback(attr, oldVal, newVal) {
            _SuperClass.prototype.attributeChangedCallback.call(this, attr, oldVal, newVal);
            var props = this.properties;
            for (var k in props) {
                var _prop2 = props[k];
                if (_prop2.attrName === attr) {
                    this[_prop2.name] = getValue(_prop2, newVal);
                    return;
                }
            }
        };
        /**
         * Create a listener for node's property changes.
         * @method observeProperty
         * @memberof DNA.MIXINS.PropertiesMixin
         * @instance
         *
         * @param {string} propName The property name to observe.
         * @param {Function} callback The callback to fire.
         * @return {Object} An object with `cancel` method.
         */


        _class.prototype.observeProperty = function observeProperty(propName, callback) {
            return this.properties[propName].observe(callback);
        };
        /**
         * Remove a listener for node's property changes.
         * @method unobserveProperty
         * @memberof DNA.MIXINS.PropertiesMixin
         * @instance
         *
         * @param {string} propName The property name to unobserve.
         * @param {Function} callback The callback to remove.
         */


        _class.prototype.unobserveProperty = function unobserveProperty(propName, callback) {
            this.properties[propName].unobserve(callback);
        };

        return _class;
    }(SuperClass);
};

var ELEM_PROTO = Element.prototype;

var matches = ELEM_PROTO.matches || ELEM_PROTO.matchesSelector || ELEM_PROTO.mozMatchesSelector || ELEM_PROTO.msMatchesSelector || ELEM_PROTO.oMatchesSelector || ELEM_PROTO.webkitMatchesSelector;

var SPLIT_SELECTOR = /([^\s]+)(.*)?/;

/**
 * Simple Custom Component with events delegation,
 * It also implement a `dispatchEvent` wrapper named `trigger`.
 * @mixin EventsMixin
 * @memberof DNA.MIXINS.
 * @static
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get events() {
 *     return {
 *       'click button': 'onButtonClick'
 *     }
 *   }
 *   onButtonClick() {
 *     console.log('button clicked');
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * var button = document.createElement('button');
 * button.innerText = 'Click me';
 * element.appendChild(button);
 * button.click(); // logs "button clicked"
 * ```
 */
var EventsMixin = function EventsMixin(SuperClass) {
    return function (_SuperClass) {
        inherits(_class, _SuperClass);

        /**
         * Attach and delegate events to the component.
         * @method constructor
         * @memberof DNA.MIXINS.EventsMixin
         * @instance
         */
        function _class() {
            classCallCheck(this, _class);

            // bind events
            var _this = possibleConstructorReturn(this, _SuperClass.call(this));

            var events = _this.events || {};

            var _loop = function _loop(k) {
                var callback = isString(events[k]) ? _this[events[k]] : events[k];
                if (isFunction(callback)) {
                    var rule = k.match(SPLIT_SELECTOR);
                    var evName = rule[1];
                    var selector = (rule[2] || '').trim();
                    if (selector) {
                        _this.delegate(evName, selector, callback);
                    } else {
                        _this.node.addEventListener(evName, function (ev) {
                            callback.call(_this, ev, _this);
                        });
                    }
                } else {
                    throw new TypeError('Invalid callback for event.');
                }
            };

            for (var k in events) {
                _loop(k);
            }
            return _this;
        }
        /**
         * Delegate events to the component descendents.
         * @method delegate
         * @memberof DNA.MIXINS.EventsMixin
         * @instance
         *
         * @param {String} evName The name of the event to delegate.
         * @param {String} selector A CSS selector for descendents.
         * @param {Function} callback The callback to fire when the event fires.
         */


        _class.prototype.delegate = function delegate(evName, selector, callback) {
            var _this2 = this;

            this.node.addEventListener(evName, function (event) {
                var target = event.target;
                while (target && target !== _this2) {
                    if (matches.call(target, selector)) {
                        callback.call(_this2, event, target);
                    }
                    target = target.parentNode;
                }
            });
        };
        /**
         * `Node.prototype.dispatchEvent` wrapper.
         * @method trigger
         * @memberof DNA.MIXINS.EventsMixin
         * @instance
         *
         * @param {String} evName The name of the event to fire.
         * @param {Object} data A set of custom data to pass to the event.
         * @param {Boolean} bubbles Should the event bubble throw the DOM tree.
         * @param {Boolean} cancelable Can be the event cancel by a callback.
         * @return {Boolean} True if event propagation has not be stopped.
         */


        _class.prototype.trigger = function trigger(evName, data) {
            var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

            return dispatch$1(this, evName, data, bubbles, cancelable);
        };

        return _class;
    }(SuperClass);
};

var rootDoc = document;
/**
 * Create and attach a style element for a component.
 * @private
 *
 * @param {HTMLElement} node A component instance.
 * @return {HTMLElement} The created style element.
 */
function createStyle(node) {
    var doc = node.ownerDocument || rootDoc;
    var styleElem = doc.createElement('style');
    styleElem.type = 'text/css';
    styleElem.setAttribute('id', 'style-' + node.is);
    var head = doc.head;
    /* istanbul ignore else */
    if (head.firstElementChild) {
        head.insertBefore(styleElem, head.firstElementChild);
    } else {
        head.appendChild(styleElem);
    }
    return styleElem;
}

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @mixin StyleMixin
 * @memberof DNA.MIXINS
 * @static
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get css() {
 *     return '.my-component p { color: red; }'
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * var p = document.createElement('p');
 * p.innerText = 'Paragraph';
 * element.appendChild(p); // text inside `p` gets the red color
 * ```
 */
var StyleMixin = function StyleMixin(SuperClass) {
    return function (_SuperClass) {
        inherits(_class, _SuperClass);

        /**
         * Fires when an instance of the element is created.
         */
        function _class() {
            classCallCheck(this, _class);

            var _this = possibleConstructorReturn(this, _SuperClass.call(this));

            if (!_this.constructor.styleElem) {
                var Ctr = _this.constructor;
                Object.defineProperty(Ctr, 'styleElem', {
                    value: createStyle(_this)
                });
            }
            _this.updateCSS();
            return _this;
        }

        _class.prototype.connectedCallback = function connectedCallback() {
            _SuperClass.prototype.connectedCallback.call(this);
            this.node.classList.add(this.is);
        };

        _class.prototype.updateCSS = function updateCSS() {
            var style = this.css;
            if (isString(style)) {
                this.constructor.styleElem.textContent = style;
            }
        };

        return _class;
    }(SuperClass);
};

/**
 * Simple Custom Component with template handling using the `template` property.
 * @memberof DNA.MIXINS
 * @mixin TemplateMixin
 * @static
 *
 * @param {Function} SuperClass The class to extend.
 * @return {Function} The extended class.
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get template() {
 *     return `<h1>${this.name}</h1>`;
 *   }
 *   get name() {
 *     return 'Newton';
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
var TemplateMixin = function TemplateMixin(SuperClass) {
    return function (_SuperClass) {
        inherits(_class, _SuperClass);
        createClass(_class, [{
            key: 'autoRender',
            get: function get() {
                return true;
            }
            /**
             * Attach properties observers in order to update children.
             * @method constructor
             * @memberof DNA.MIXINS.TemplateMixin
             * @instance
             */

        }]);

        function _class() {
            classCallCheck(this, _class);

            var _this = possibleConstructorReturn(this, _SuperClass.call(this));

            if (_this.autoRender && !isUndefined(_this.template)) {
                var props = _this.properties;
                if (props) {
                    var callback = function callback() {
                        _this.render();
                    };
                    for (var k in props) {
                        props[k].observe(callback);
                    }
                }
            }
            return _this;
        }
        /**
         * Render the component when connected.
         * @method connectedCallback
         * @memberof DNA.MIXINS.TemplateMixin
         * @instance
         */


        _class.prototype.connectedCallback = function connectedCallback() {
            _SuperClass.prototype.connectedCallback.call(this);
            if (!isUndefined(this.template)) {
                this.render();
            }
        };
        /**
         * Update Component child nodes.
         * @method render
         * @memberof DNA.MIXINS.TemplateMixin
         * @instance
         *
         * @param {Function|string} tpl A template to use instead of `this.template`.
         *
         * @throws {TypeError} Will throw if the template type is not supported.
         */


        _class.prototype.render = function render(tpl) {
            tpl = tpl || this.template;
            /* istanbul ignore else */
            if (isFunction(tpl)) {
                tpl.call(this);
            } else if (isString(tpl)) {
                this.node.innerHTML = tpl;
            } else {
                throw new TypeError('Invalid template property.');
            }
        };

        return _class;
    }(SuperClass);
};

/* eslint-disable prefer-rest-params */
var reduce = Array.prototype.reduce || function (callback /*, initialValue*/) {
    'use strict';

    var t = this;
    var len = t.length;
    var k = 0;
    var value = void 0;
    if (arguments.length === 2) {
        value = arguments[1];
    } else {
        while (k < len && !(k in t)) {
            k++;
        }
        value = t[k++];
    }
    for (; k < len; k++) {
        if (k in t) {
            value = callback(value, t[k], k, t);
        }
    }
    return value;
};

/**
 * @author Justin Fagnani
 * @see https://github.com/justinfagnani/mixwith.js
 */
/**
 * Mix a class with a mixin.
 * @method mix(...).with(...)
 * @memberof! DNA.
 * @static
 *
 * @param {Function} superClass The class to extend.
 * @return {Function} A mixed class.
 *
 * @example
 * ```js
 * // my-super.js
 * export class MySuperClass {
 *     constructor() {
 *         // do something
 *     }
 * }
 * ```
 * ```js
 * // mixin.js
 * export const Mixin = (superClass) => class extend superClass {
 *     constructor() {
 *         super();
 *         // do something else
 *     }
 * };
 * ```
 * ```js
 * import { mix } from '@dnajs/core';
 * import { MySuperClass } from './my-super.js';
 * import { Mixin } from './mixin.js';
 *
 * export class MixedClass extends mix(MySuperClass).with(Mixin) {
 *     ...
 * }
 * ```
 */

/**
 * A Mixin helper class.
 * @ignore
 */

var Mixin = function () {
  /**
   * Create a mixable class.
   * @param {Function} superClass The class to extend.
   */
  function Mixin(superclass) {
    classCallCheck(this, Mixin);

    superclass = superclass || function () {
      function _class() {
        classCallCheck(this, _class);
      }

      return _class;
    }();
    this.superclass = superclass;
  }
  /**
   * Mix the super class with a list of mixins.
   * @param {...Function} mixins *N* mixin functions.
   * @return {Function} The extended class.
   */


  Mixin.prototype.with = function _with() {
    // eslint-disable-next-line
    var args = [].slice.call(arguments, 0);
    return reduce.call(args, function (c, mixin) {
      return mixin(c);
    }, this.superclass);
  };

  return Mixin;
}();

/**
 * Create a Mixin instance.
 * @ignore
 */


var mix = function mix(superClass) {
  return new Mixin(superClass);
};

/**
 * Check if a node is already instantiated HTMLElement for programmatically `constructor` calls.
 * @private
 * @param {HTMLElement} node The node to check.
 * @return {Boolean} The node should be instantiated.
 */
function isNew(node) {
    try {
        return !isString(node.outerHTML);
    } catch (ex) {
        return true;
    }
}

/**
 * Shim original Element constructors in order to be used with `new`.
 * @method shim
 * @memberof! DNA.
 * @static
 *
 * @param {Function} Original The original constructor to shim.
 * @return {Function} The shimmed constructor.
 *
 * @example
 * ```js
 * // shim audio element
 * import { shim } from '@dnajs/core';
 *
 * class MyAudio extends shim(HTMLAudioElement) {
 *     ...
 * }
 *
 * let audio = new MyAudio();
 * ```
 */

/**
 * A set of DOM helpers for callbacks trigger when Custom Elements
 * are not supported by the browser.
 * @name DOM
 * @namespace DOM
 * @memberof! DNA.
 * @static
 */

/**
 * A set of core mixins.
 * @name MIXINS
 * @namespace MIXINS
 * @memberof! DNA.
 * @static
 */
var MIXINS = {
  ComponentMixin: ComponentMixin,
  PropertiesMixin: PropertiesMixin,
  EventsMixin: EventsMixin,
  StyleMixin: StyleMixin,
  TemplateMixin: TemplateMixin
};

function shim$1(Elem) {
    var ShimElement = function ShimElement() {
        return Reflect.construct(Elem, [], this.constructor);
    };

    ShimElement.prototype = Object.create(Elem.prototype, {
        constructor: {
            value: ShimElement,
            configurable: true,
            writable: true
        }
    });

    return ShimElement;
}

/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements spec.
 */
var registry = self.customElements;
function define$1() {
    return registry.define.apply(registry, arguments);
}
function render$1(node, Component) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var element = new Component();
    for (var k in props) {
        element[k] = props[k];
    }
    node.appendChild(element);
    return element;
}

var BaseComponent = function (_mix$with) {
    inherits(BaseComponent, _mix$with);

    function BaseComponent() {
        classCallCheck(this, BaseComponent);
        return possibleConstructorReturn(this, _mix$with.apply(this, arguments));
    }

    return BaseComponent;
}(mix(shim$1(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin, MIXINS.StyleMixin, MIXINS.EventsMixin, MIXINS.TemplateMixin));

exports.shim = shim$1;
exports.mix = mix;
exports.MIXINS = MIXINS;
exports.registry = registry;
exports.define = define$1;
exports.render = render$1;
exports.BaseComponent = BaseComponent;
exports.prop = prop;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvdHlwZW9mLmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9yZWdpc3RyeS5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3ltYm9scy5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvZG9tLmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL21peGlucy9jb21wb25lbnQuanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvZGlzcGF0Y2guanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbGliL3Byb3BlcnR5LmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL21peGlucy9wcm9wZXJ0aWVzLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9wb2x5ZmlsbHMvbWF0Y2hlcy5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvZXZlbnRzLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3R5bGUuanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbWl4aW5zL3N0eWxlLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvdGVtcGxhdGUtY29tcG9uZW50LmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL3BvbHlmaWxscy9yZWR1Y2UuanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbGliL21peGlucy5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc2hpbS5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9jb3JlLmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9wYWNrYWdlcy9kbmEtY3VzdG9tLWVsZW1lbnRzLXYxL3NyYy9saWIvc2hpbS5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvcGFja2FnZXMvZG5hLWN1c3RvbS1lbGVtZW50cy12MS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGEgZnVuY3Rpb24uXG4gKiBAbWV0aG9kIGlzRnVuY3Rpb25cbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhbiB2YWx1ZSBpcyBhIHN0cmluZy5cbiAqIEBtZXRob2QgaXNTdHJpbmdcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZyc7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGFuIG9iamVjdC5cbiAqIEBtZXRob2QgaXNPYmplY3RcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhbiB2YWx1ZSBpcyB1bmRlZmluZWQuXG4gKiBAbWV0aG9kIGlzVW5kZWZpbmVkXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0geyp9IG9iaiBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhbiB2YWx1ZSBpcyBhbiBhcnJheS5cbiAqIEBtZXRob2QgaXNBcnJheVxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbn1cbiIsImltcG9ydCB7IGlzRnVuY3Rpb24sIGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuXG4vKipcbiAqIEEgY3VzdG9tIGNvbXBvbmVudHMgcmVnaXN0cnkuXG4gKiBJdCByZXBsaWNhdGVzIHRoZSBbQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5IGludGVyZmFjZV0oaHR0cHM6Ly93d3cudzMub3JnL1RSL2N1c3RvbS1lbGVtZW50cy8jY3VzdG9tLWVsZW1lbnRzLWFwaSkuXG4gKiBAbmFtZSByZWdpc3RyeVxuICogQG5hbWVzcGFjZSByZWdpc3RyeVxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKi9cbmV4cG9ydCBjb25zdCByZWdpc3RyeSA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBkZWZpbmVkIGNvbXBvbmVudHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb21wb25lbnRzOiB7fSxcbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhIG5ldyBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGlkIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RyIFRoZSBjb21wb25lbnQgY29uc3RydWN0b3IuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBPcHRpb25hbCBjb21wb25lbnQgY29uZmlndXJhdGlvbi5cbiAgICAgKi9cbiAgICBkZWZpbmUobmFtZSwgQ3RyLCBjb25maWcgPSB7fSkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IHtcbiAgICAgICAgICAgIGlzOiBuYW1lLFxuICAgICAgICAgICAgQ3RyLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSBjb21wb25lbnQgZGVzY3JpcHRvciBieSBpZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBjb21wb25lbnQgaWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY29tcG9uZW50IGRlc2NyaXB0b3IuXG4gICAgICovXG4gICAgZ2V0RGVzY3JpcHRvcihuYW1lKSB7XG4gICAgICAgIGlmIChpc1N0cmluZyhuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50c1tuYW1lLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24obmFtZSkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5jb21wb25lbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRlc2MgPSB0aGlzLmNvbXBvbmVudHNba107XG4gICAgICAgICAgICAgICAgaWYgKGRlc2MuQ3RyID09PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSBjb21wb25lbnQgY29uc3RydWN0b3IgYnkgaWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGNvbXBvbmVudCBpZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGNvbXBvbmVudCBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBnZXQobmFtZSkge1xuICAgICAgICBsZXQgZGVzYyA9IHRoaXMuZ2V0RGVzY3JpcHRvcihuYW1lKTtcbiAgICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXNjLkN0cjtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuIiwiZXhwb3J0IGNvbnN0IENPTVBPTkVOVF9TWU1CT0wgPSAnX19jb21wb25lbnQnO1xuIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdHlwZW9mLmpzJztcbmltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBDT01QT05FTlRfU1lNQk9MIH0gZnJvbSAnLi9zeW1ib2xzLmpzJztcblxuLyoqXG4gKiBUaGUgYGNvbm5lY3RlZENhbGxiYWNrYCBuYW1lLlxuICogQHByaXZhdGVcbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHNlZSBbVzNDIHNwZWNdKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jdXN0b20tZWxlbWVudHMvI2N1c3RvbS1lbGVtZW50LXJlYWN0aW9ucylcbiAqL1xuY29uc3QgQ09OTkVDVEVEID0gJ2Nvbm5lY3RlZENhbGxiYWNrJztcbi8qKlxuICogVGhlIGBkaXNjb25uZWN0ZWRDYWxsYmFja2AgbmFtZS5cbiAqIEBwcml2YXRlXG4gKlxuICogQHR5cGUge1N0cmluZ31cbiAqIEBzZWUgW1czQyBzcGVjXShodHRwczovL3d3dy53My5vcmcvVFIvY3VzdG9tLWVsZW1lbnRzLyNjdXN0b20tZWxlbWVudC1yZWFjdGlvbnMpXG4gKi9cbmNvbnN0IERJU0NPTk5FQ1RFRCA9ICdkaXNjb25uZWN0ZWRDYWxsYmFjayc7XG4vKipcbiAqIFRoZSBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYCBuYW1lLlxuICogQHByaXZhdGVcbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHNlZSBbVzNDIHNwZWNdKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jdXN0b20tZWxlbWVudHMvI2N1c3RvbS1lbGVtZW50LXJlYWN0aW9ucylcbiAqL1xuY29uc3QgVVBEQVRFRCA9ICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snO1xuLyoqXG4gKiBSZXRyaWV2ZSBhIGNvbXBvbmVudCBjb25zdHJ1Y3RvciBmcm9tIGFuIEVsZW1lbnQgb3IgZnJvbSBhIHRhZyBuYW1lLlxuICogQG1ldGhvZCBnZXRDb21wb25lbnRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR8U3RyaW5nfSBlbGVtZW50IFRoZSBlbGVtZW50IG9yIHRoZSB0YWcgbmFtZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZnVsbCBSZXRyaWV2ZSBmdWxsIGNvbXBvbmVudCBpbmZvcm1hdGlvbi5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY29tcG9uZW50IGNvbnN0cnVjdG9yIGZvciB0aGUgZ2l2ZW4gcGFyYW0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnQoZWxlbWVudCwgZnVsbCA9IGZhbHNlKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5ub2RlO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpIHx8IGVsZW1lbnQudGFnTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bGwgPyByZWdpc3RyeS5nZXREZXNjcmlwdG9yKGVsZW1lbnQpIDogcmVnaXN0cnkuZ2V0KGVsZW1lbnQpO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhIG5vZGUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBjb21wb25lbnQuXG4gKiBAbWV0aG9kIGlzQ29tcG9uZW50XG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcG9uZW50KGVsZW1lbnQpIHtcbiAgICBsZXQgQ3RyID0gZ2V0Q29tcG9uZW50KGVsZW1lbnQpO1xuICAgIHJldHVybiBDdHIgJiYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdHIpO1xufVxuLyoqXG4gKiBBbiBoZWxwZXIgZm9yIGR5bmFtaWNhbGx5IHRyaWdnZXIgdGhlIGBjb25uZWN0ZWRDYWxsYmFja2AgcmVhY3Rpb24gb24gY29tcG9uZW50cy5cbiAqIEBtZXRob2QgY29ubmVjdFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgYXR0YWNoZWQgbm9kZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBjYWxsYmFjayBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KGVsZW1lbnQpIHtcbiAgICBpZiAoaXNDb21wb25lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudFtDT05ORUNURURdLmNhbGwoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbi8qKlxuICogQW4gaGVscGVyIGZvciBkeW5hbWljYWxseSB0cmlnZ2VyIHRoZSBgZGlzY29ubmVjdGVkQ2FsbGJhY2tgIHJlYWN0aW9uIG9uIGNvbXBvbmVudHMuXG4gKiBAbWV0aG9kIGRpc2Nvbm5lY3RcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGRldGFjaGVkIG5vZGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgY2FsbGJhY2sgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzY29ubmVjdChlbGVtZW50KSB7XG4gICAgaWYgKGlzQ29tcG9uZW50KGVsZW1lbnQpKSB7XG4gICAgICAgIGVsZW1lbnRbRElTQ09OTkVDVEVEXS5jYWxsKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4vKipcbiAqIEFuIGhlbHBlciBmb3IgZHluYW1pY2FsbHkgdHJpZ2dlciB0aGUgYGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja2AgcmVhY3Rpb24gb24gY29tcG9uZW50cy5cbiAqIEBtZXRob2QgdXBkYXRlXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSB1cGRhdGVkIGVsZW1lbnQuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgY2FsbGJhY2sgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKGVsZW1lbnQsIG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIGlmIChpc0NvbXBvbmVudChlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50W1VQREFURURdLmNhbGwoZWxlbWVudCwgbmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuLyoqXG4gKiBBdHRhY2ggYSBjb21wb25lbnQgcHJvdG90eXBlIHRvIGFuIGFscmVhZHkgaW5zdGFudGlhdGVkIEhUTUxFbGVtZW50LlxuICogQG1ldGhvZCBiaW5kXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgVGhlIG5vZGUgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RyIFRoZSBjb21wb25lbnQgY2xhc3MgdG8gdXNlIChsZWF2ZSBlbXB0eSBmb3IgYXV0byBkZXRlY3QpLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIHByb3RvdHlwZSBoYXMgYmVlbiBhdHRhY2hlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmQobm9kZSwgQ3RyKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKEN0cikpIHtcbiAgICAgICAgQ3RyID0gZ2V0Q29tcG9uZW50KG5vZGUpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdGlvbihDdHIpKSB7XG4gICAgICAgIG5vZGUuX19wcm90b19fID0gQ3RyLnByb3RvdHlwZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgICAgICAgIHZhbHVlOiBDdHIsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIEN0ci5jYWxsKG5vZGUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBDcmVhdGUgYSBjb21wb25lbnQgaW5zdGFuY2UuXG4gKiBAbWV0aG9kIGNyZWF0ZUVsZW1lbnRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlzIFRoZSBjb21wb25lbnQgdGFnIG5hbWUuXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gVGhlIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoaXMpIHtcbiAgICBsZXQgQ3RyID0gZ2V0Q29tcG9uZW50KGlzKTtcbiAgICBpZiAoQ3RyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3RyKCk7XG4gICAgfVxufVxuLyoqXG4gKiBEeW5hbWljYWxseSBhcHBlbmQgYSBub2RlIGFuZCBjYWxsIHRoZSBgY29ubmVjdGVkQ2FsbGJhY2tgLlxuICogLSBkaXNjb25uZWN0IHRoZSBub2RlIGlmIGFscmVhZHkgaW4gdGhlIHRyZWVcbiAqIC0gY29ubmVjdCB0aGUgbm9kZSBhZnRlciB0aGUgaW5zZXJ0aW9uXG4gKiBAbWV0aG9kIGFwcGVuZENoaWxkXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBhcHBlbmQuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiBhcHBlbmRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZENoaWxkKHBhcmVudCwgZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50Lm5vZGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlbGVtZW50Lm5vZGU7XG4gICAgICAgIGlmIChwYXJlbnQgIT09IG5vZGUucGFyZW50Tm9kZSB8fCBwYXJlbnQubGFzdEVsZW1lbnRDaGlsZCAhPT0gbm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUNoaWxkKG5vZGUucGFyZW50Tm9kZSwgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHJlbW92ZSBhIG5vZGUgYW5kIGNhbGwgdGhlIGBkaXNjb25uZWN0ZWRDYWxsYmFja2AuXG4gKiBAbWV0aG9kIHJlbW92ZUNoaWxkXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byByZW1vdmUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQ2hpbGQocGFyZW50LCBlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5ub2RlKTtcbiAgICAgICAgcmV0dXJuIGRpc2Nvbm5lY3QoZWxlbWVudCk7XG4gICAgfVxufVxuLyoqXG4gKiBEeW5hbWljYWxseSBpbnNlcnQgYSBub2RlIGJlZm9yZSBhbm90aGVyIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogLSBkaXNjb25uZWN0IHRoZSBub2RlIGlmIGFscmVhZHkgaW4gdGhlIHRyZWVcbiAqIC0gY29ubmVjdCB0aGUgbm9kZSBhZnRlciB0aGUgaW5zZXJ0aW9uXG4gKiBAbWV0aG9kIGluc2VydEJlZm9yZVxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnQgVGhlIHBhcmVudCBlbGVtZW50LlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmTm9kZSBUaGUgbm9kZSBmb3IgcG9zaXRpb25pbmcuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiBhcHBlbmRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEJlZm9yZShwYXJlbnQsIGVsZW1lbnQsIHJlZk5vZGUpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGxldCBub2RlID0gZWxlbWVudC5ub2RlO1xuICAgICAgICBpZiAobm9kZS5uZXh0U2libGluZyAhPT0gcmVmTm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGRpc2Nvbm5lY3QoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHJlZk5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbm5lY3QoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHJlcGxhY2UgYSBub2RlIHdpdGggYW5vdGhlciBhbmQgY2FsbCBhbGwgdGhlIHJlYWN0aW9ucy5cbiAqIC0gZGlzY29ubmVjdCB0aGUgbm9kZSBpZiBhbHJlYWR5IGluIHRoZSB0cmVlXG4gKiAtIGRpc2Nvbm5lY3QgdGhlIHJlcGxhY2VkIG5vZGVcbiAqIC0gY29ubmVjdCB0aGUgZmlyc3Qgbm9kZSBhZnRlciB0aGUgaW5zZXJ0aW9uXG4gKiBAbWV0aG9kIHJlcGxhY2VDaGlsZFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnQgVGhlIHBhcmVudCBlbGVtZW50LlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmTm9kZSBUaGUgbm9kZSB0byByZXBsYWNlLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIG5vZGUgaGFzIGJlZW4gYXBwZW5kZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlQ2hpbGQocGFyZW50LCBlbGVtZW50LCByZWZOb2RlKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgZGlzY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKG5vZGUsIHJlZk5vZGUpO1xuICAgICAgICBpZiAocmVmTm9kZVtDT01QT05FTlRfU1lNQk9MXSkge1xuICAgICAgICAgICAgZGlzY29ubmVjdChyZWZOb2RlW0NPTVBPTkVOVF9TWU1CT0xdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ubmVjdChub2RlKTtcbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHVwZGF0ZSBhIG5vZGUgYXR0cmlidXRlIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogQG1ldGhvZCBzZXRBdHRyaWJ1dGVcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGF0dHJpYnV0ZSBuYW1lLlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiB1cGRhdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0QXR0cmlidXRlKGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgbGV0IGF0dHJzID0gZWxlbWVudC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGlmIChhdHRycy5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShlbGVtZW50LCBuYW1lLCBvbGRWYWx1ZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBEeW5hbWljYWxseSByZW1vdmUgYSBub2RlIGF0dHJpYnV0ZSBhbmQgY2FsbCBhbGwgdGhlIHJlYWN0aW9ucy5cbiAqIEBtZXRob2QgcmVtb3ZlQXR0cmlidXRlXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBhdHRyaWJ1dGUgbmFtZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIHVwZGF0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBdHRyaWJ1dGUoZWxlbWVudCwgbmFtZSkge1xuICAgIGlmIChlbGVtZW50Lm5vZGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlbGVtZW50Lm5vZGU7XG4gICAgICAgIGxldCBvbGRWYWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgbGV0IGF0dHJzID0gZWxlbWVudC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGlmIChhdHRycy5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShlbGVtZW50LCBuYW1lLCBvbGRWYWx1ZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDT01QT05FTlRfU1lNQk9MIH0gZnJvbSAnLi4vbGliL3N5bWJvbHMuanMnO1xuXG4vKipcbiAqIFRIZSBiYXNlIGN1c3RvbSBjb21wb25lbnQgbWl4aW5zLiBKdXN0IGFkZCBsaWZlIGN5Y2xlcyBjYWxsYmFjayBhbmQgYGlzYCBnZXR0ZXIuXG4gKiBAbWl4aW4gQ29tcG9uZW50TWl4aW5cbiAqIEBtZW1iZXJvZiBETkEuTUlYSU5TXG4gKiBAc3RhdGljXG4gKi9cbmV4cG9ydCBjb25zdCBDb21wb25lbnRNaXhpbiA9IChTdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpcyBHZXQgY29tcG9uZW50IGlkLlxuICAgICAqIEBuYW1lIGlzXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Db21wb25lbnRNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGdldCBpcygpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmdldEF0dHJpYnV0ZSgnaXMnKSB8fCB0aGlzLmxvY2FsTmFtZSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgZ2V0IG5vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIGFuIGluc3RhbmNlIHdhcyBpbnNlcnRlZCBpbnRvIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAbWV0aG9kIGNvbm5lY3RlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuQ29tcG9uZW50TWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5ub2RlW0NPTVBPTkVOVF9TWU1CT0xdID0gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiBhbiBpbnN0YW5jZSB3YXMgZGV0YWNoZWQgZnJvbSB0aGUgZG9jdW1lbnQuXG4gICAgICogQG1ldGhvZCBkaXNjb25uZWN0ZWRDYWxsYmFja1xuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkNvbXBvbmVudE1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gYW4gYXR0cmlidXRlIHdhcyBhZGRlZCwgcmVtb3ZlZCwgb3IgdXBkYXRlZC5cbiAgICAgKiBAbWV0aG9kIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1xuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkNvbXBvbmVudE1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ck5hbWUgVGhlIGNoYW5nZWQgYXR0cmlidXRlIG5hbWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9sZFZhbCBUaGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBiZWZvcmUgdGhlIGNoYW5nZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3VmFsIFRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGFmdGVyIHRoZSBjaGFuZ2UuXG4gICAgICovXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKCkge31cbn07XG4iLCJsZXQgQ3VzdG9tRXZlbnQ7XG5cbnRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgbGV0IGV2ID0gbmV3IHNlbGYuQ3VzdG9tRXZlbnQoJ3Rlc3QnKTtcbiAgICBDdXN0b21FdmVudCA9IHNlbGYuQ3VzdG9tRXZlbnQ7XG59IGNhdGNoKGV4KSB7XG4gICAgQ3VzdG9tRXZlbnQgPSBmdW5jdGlvbihldmVudCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7XG4gICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZGV0YWlsOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgICAgICAgcmV0dXJuIGV2dDtcbiAgICB9O1xuICAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHNlbGYuQ3VzdG9tRXZlbnQucHJvdG90eXBlO1xufVxuXG5leHBvcnQgeyBDdXN0b21FdmVudCB9O1xuIiwiaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuL3R5cGVvZi5qcyc7XG5pbXBvcnQgeyBDdXN0b21FdmVudCB9IGZyb20gJy4uL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMnO1xuXG4vKipcbiAqIFRyaWdnZXIgYSBjdXN0b20gRE9NIEV2ZW50LlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgVGhlIGV2ZW50IHRhcmdldC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBldk5hbWUgVGhlIGN1c3RvbSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgRXh0cmEgZGF0YSB0byBwYXNzIHRvIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYnViYmxlcyBFbmFibGUgZXZlbnQgYnViYmxpbmcuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhbmNlbGFibGUgTWFrZSBldmVudCBjYW5jZWxhYmxlLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiBldmVudCBwcm9wYWdhdGlvbiBoYXMgbm90IGJlIHN0b3BwZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaChub2RlLCBldk5hbWUsIGRhdGEsIGJ1YmJsZXMgPSB0cnVlLCBjYW5jZWxhYmxlID0gdHJ1ZSkge1xuICAgIGlmICghaXNTdHJpbmcoZXZOYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFdmVudCBuYW1lIGlzIHVuZGVmaW5lZCcpO1xuICAgIH1cbiAgICBsZXQgZXYgPSBuZXcgQ3VzdG9tRXZlbnQoZXZOYW1lLCB7XG4gICAgICAgIGRldGFpbDogZGF0YSxcbiAgICAgICAgYnViYmxlcyxcbiAgICAgICAgY2FuY2VsYWJsZSxcbiAgICB9KTtcbiAgICByZXR1cm4gbm9kZS5kaXNwYXRjaEV2ZW50KGV2KTtcbn1cbiIsImltcG9ydCB7IGlzVW5kZWZpbmVkLCBpc0Z1bmN0aW9uLCBpc0FycmF5LCBpc09iamVjdCwgaXNTdHJpbmcgfSBmcm9tICcuL3R5cGVvZi5qcyc7XG5cbi8qKlxuICogU2hvcnRjdXQgdG8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAuXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBkZWZpbmUgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbi8qKlxuICogUG93ZXIgdG8gdGhlIGNvbXBvbmVudCdzIHByb3BlcnRpZXMuXG4gKiBUeXBlIGNoZWNraW5nLCB2YWxpZGF0aW9uLCBjYWxsYmFja3MsIGV2ZW50cyBhbmQgYXR0cmlidXRlIHN5bmNpbmcuXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQcm9wZXJ0eSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgUHJvcGVydHkgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxBcnJheX0gQSBzaW5nbGUgb3IgYSBsaXN0IG9mIHZhbGlkIGNvbnN0cnVjdG9ycyBmb3IgdGhlIHByb3BlcnR5IHZhbHVlLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGN0cnMpIHtcbiAgICAgICAgdGhpcy5fID0gW107XG4gICAgICAgIGN0cnMgPSBjdHJzIHx8IFtdO1xuICAgICAgICBpZiAoIWlzQXJyYXkoY3RycykpIHtcbiAgICAgICAgICAgIGN0cnMgPSBbY3Ryc107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHJzID0gY3RycztcbiAgICAgICAgdGhpcy52YWxpZGF0b3IgPSAoKSA9PiB0cnVlO1xuICAgICAgICB0aGlzLl9zZXR0ZXIgPSAodmFsKSA9PiB2YWw7XG4gICAgICAgIHRoaXMuZ2V0dGVyRm4gPSAoKSA9PiB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLnNldHRlckZuID0gKHZhbCkgPT4ge1xuICAgICAgICAgICAgdmFsID0gdGhpcy5fc2V0dGVyKHZhbCk7XG4gICAgICAgICAgICBpZiAoKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlVHlwZSh2YWwpICYmIHRoaXMudmFsaWRhdG9yKHZhbCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZCh2YWwsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBJbnZhbGlkIFxcYCR7dmFsfVxcYCB2YWx1ZSBmb3IgXFxgJHt0aGlzLm5hbWV9XFxgIHByb3BlcnR5IGZvciBcXGAke3RoaXMuc2NvcGUuaXN9XFxgLmBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjYWxsYmFjayB3aGVuIHRoZSBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byB0cmlnZ2VyLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIG9ic2VydmUoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spIHx8IGlzU3RyaW5nKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy5fLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBjYWxsYmFjayBvbiBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgdW5vYnNlcnZlKGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBpbyA9IHRoaXMuXy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgaWYgKGlvICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fLnNwbGljZShpbywgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgY2FsbGJhY2tzIGFmdGVyIGEgY2hhbmdlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSBuZXdWYWx1ZSBUaGUgY3VycmVudCBwcm9wZXJ0eSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geyp9IG9sZFZhbHVlIFRoZSBwcmV2aW91cyBwcm9wZXJ0eSB2YWx1ZS5cbiAgICAgKi9cbiAgICBjaGFuZ2VkKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5fLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2xiID0gdGhpcy5fW2ldO1xuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKGNsYikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlW2NsYl0uY2FsbCh0aGlzLnNjb3BlLCB0aGlzLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbGIodGhpcywgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBhIHByb3BlcnR5IGFjY2VwdHMgYSBnaXZlbiB0eXBlIGFzIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IEN0ciBUaGUgY29uc3RydWN0b3IgZm9yIHRoZSBnaXZlbiB0eXBlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgYWNjZXB0cyhDdHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Rycy5pbmRleE9mKEN0cikgIT09IC0xO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHByb3BlcnR5IG5hbWUuXG4gICAgICogSXQgYWxzbyBzZXQgdGhlIGF0dHJOYW1lIGlmIGAuYXR0cmlidXRlYCBtZXRob2QgYXMgYmVlbiBwcmV2aW91c2x5XG4gICAgICogaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgcHJvcGVydHkgbmFtZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBuYW1lZChuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIGlmICh0aGlzLmF0dHJSZXF1ZXN0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0ck5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcHJvcGVydHkgaW5pdGlhbCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geyp9IGluaXRWYWx1ZSBUaGUgcHJvcGVydHkgaW5pdGlhbCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBkZWZhdWx0KGluaXRWYWx1ZSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGlzT2JqZWN0KGluaXRWYWx1ZSkgP1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShpbml0VmFsdWUpIDpcbiAgICAgICAgICAgIGluaXRWYWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgYXR0cmlidXRlIG5hbWUgdG8gc3luYy5cbiAgICAgKiBJbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBpdCByZXRyaWV2ZSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJOYW1lIFRoZSBhdHRyaWJ1dGUgbmFtZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBhdHRyaWJ1dGUoYXR0ck5hbWUgPSB0cnVlKSB7XG4gICAgICAgIGlmIChpc1N0cmluZyhhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0clJlcXVlc3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hdHRyTmFtZSA9IGF0dHJOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hdHRyUmVxdWVzdGVkID0gISFhdHRyTmFtZTtcbiAgICAgICAgICAgIHRoaXMuYXR0ck5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIERPTSBldmVudCBuYW1lIHRvIGRpc3BhdGNoIG9uIGNoYW5nZXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2TmFtZSBUaGUgZXZlbnQgbmFtZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBkaXNwYXRjaChldk5hbWUpIHtcbiAgICAgICAgdGhpcy5ldmVudE5hbWUgPSBldk5hbWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgYSBnZXR0ZXIgZnVuY3Rpb24gZm9yIHRoZSBwcm9wZXJ0eS5cbiAgICAgKiBCeSBkZWZhdWx0LCB0aGUgcHJvcGVydHkgdmFsdWUgd2lsbCBiZSByZXR1cm4uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIHByb3BlcnR5IGdldHRlci5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBnZXR0ZXIoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICB0aGlzLmdldHRlckZuID0gKCkgPT4gY2FsbGJhY2sodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhIHNldHRlciBmdW5jdGlvbiBmb3IgdGhlIHByb3BlcnR5LlxuICAgICAqIEJ5IGRlZmF1bHQsIHRoZSBwcm9wZXJ0eSB2YWx1ZSB3aWxsIGJlIHVwZGF0ZWQgd2l0aCBnaXZlbiB2YWx1ZVxuICAgICAqIHdpdGhvdXQgYW55IG1vZGlmaWNhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgcHJvcGVydHkgc2V0dGVyLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHNldHRlcihjYWxsYmFjaykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldHRlciA9IGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHByb3BlcnR5IHZhbGlkYXRvci5cbiAgICAgKiBBIHZhbGlkYXRvciBzaG91bGQgcmV0dXJuIGB0cnVlYCBpZiB0aGUgdmFsdWUgaXMgYWNjZXB0YWJsZVxuICAgICAqIG9yIGBmYWxzZWAgaWYgdW5hY2NhcHRhYmxlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBwcm9wZXJ0eSB2YWxpZHRvci5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICB2YWxpZGF0ZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdG9yID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhIHZhbGlkIHR5cGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB2YWxpZGF0ZVR5cGUodmFsKSB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGN0cnMgPSB0aGlzLmN0cnM7XG4gICAgICAgIGlmIChjdHJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGkgPCBjdHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIGN0cnNbaV0gfHwgKFxuICAgICAgICAgICAgICAgIHZhbC5jb25zdHJ1Y3RvciAmJiB2YWwuY29uc3RydWN0b3IgPT09IGN0cnNbaV1cbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaCB0aGUgcHJvcGVydHkgdG8gYSBzY29wZSAoYSBjb21wb25lbnQgaW5zdGFuY2UpLlxuICAgICAqIFNldCB0aGUgZGVmYXVsdCB2YWx1ZSBpZiBwcm92aWRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2NvcGUgVGhlIHNjb3BlIHdoaWNoIG5lZWRzIHRvIGJlIGJvdW5kIHdpdGggdGhlIHByb3BlcnR5LlxuICAgICAqL1xuICAgIGluaXQoc2NvcGUpIHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgICAgICBkZWZpbmUoc2NvcGUsIHRoaXMubmFtZSwge1xuICAgICAgICAgICAgZ2V0OiB0aGlzLmdldHRlckZuLmJpbmQodGhpcyksXG4gICAgICAgICAgICBzZXQ6IHRoaXMuc2V0dGVyRm4uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgICBzY29wZVt0aGlzLm5hbWVdID0gdGhpcy5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgUHJvcGVydHkgY3JlYXRpb24uXG4gKiBAbWV0aG9kIHByb3BcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwcm9wZXJ0eSB7UHJvcGVydHl9IEFOWSBBIHByb3BlcnR5IHdpdGhvdXQgdHlwZSB2YWxpZGF0aW9uLlxuICogQHByb3BlcnR5IHtQcm9wZXJ0eX0gU1RSSU5HIEEgcHJvcGVydHkgd2hpY2ggYWNjZXB0cyBvbmx5IHN0cmluZ3MuXG4gKiBAcHJvcGVydHkge1Byb3BlcnR5fSBCT09MRUFOIEEgcHJvcGVydHkgd2hpY2ggYWNjZXB0cyBvbmx5IGJvb2xlYW5zLlxuICogQHByb3BlcnR5IHtQcm9wZXJ0eX0gTlVNQkVSIEEgcHJvcGVydHkgd2hpY2ggYWNjZXB0cyBvbmx5IG51bWJlcnMuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eXxGdW5jdGlvbnxBcnJheX0gY3RycyBBIFByb3BlcnR5IHRvIGNsb25lIG9yIGEgc2luZ2xlIG9yIGEgbGlzdCBvZiB2YWxpZCBjb25zdHJ1Y3RvcnMgZm9yIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgbmV3IHByb3BlcnR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvcChjdHJzKSB7XG4gICAgaWYgKGN0cnMgaW5zdGFuY2VvZiBQcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gY3RycztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9wZXJ0eShjdHJzKTtcbn1cblxuLy8gRGVmaW5lIHNvbWUgaGVscGVycyBmb3IgZGVmYXVsdCB0eXBlc1xuZGVmaW5lKHByb3AsICdBTlknLCB7IGdldCgpIHsgcmV0dXJuIHByb3AoKTsgfSB9KTtcbmRlZmluZShwcm9wLCAnU1RSSU5HJywgeyBnZXQoKSB7IHJldHVybiBwcm9wKFN0cmluZyk7IH0gfSk7XG5kZWZpbmUocHJvcCwgJ0JPT0xFQU4nLCB7IGdldCgpIHsgcmV0dXJuIHByb3AoQm9vbGVhbik7IH0gfSk7XG5kZWZpbmUocHJvcCwgJ05VTUJFUicsIHsgZ2V0KCkgeyByZXR1cm4gcHJvcChOdW1iZXIpOyB9IH0pO1xuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL2xpYi90eXBlb2YuanMnO1xuaW1wb3J0IHsgZGlzcGF0Y2ggfSBmcm9tICcuLi9saWIvZGlzcGF0Y2guanMnO1xuaW1wb3J0IHsgaXNVbmRlZmluZWQgfSBmcm9tICcuLi9saWIvdHlwZW9mLmpzJztcbmltcG9ydCB7IHByb3AgfSBmcm9tICcuLi9saWIvcHJvcGVydHkuanMnO1xuXG4vKipcbiAqIFRyeSB0byBwYXJzZSBhdHRyaWJ1dGUgdmFsdWUgY2hlY2tpbmcgdGhlIHByb3BlcnR5IHZhbGlkYXRpb24gdHlwZXMuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0clZhbCBUaGUgYXR0cmlidXRlIHZhbHVlLlxuICogQHJldHVybiB7Kn0gVGhlIHBhcnNlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUocHJvcGVydHksIGF0dHJWYWwpIHtcbiAgICBpZiAoYXR0clZhbCA9PT0gJycgJiYgcHJvcGVydHkuYWNjZXB0cyhCb29sZWFuKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFwcm9wZXJ0eS5hY2NlcHRzKFN0cmluZykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF0dHJWYWwpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXR0clZhbDtcbn1cblxuLyoqXG4gKiBTZXQgYW4gYXR0cmlidXRlIHZhbHVlIGNoZWNraW5nIGl0cyB0eXBlLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZXh0IFRoZSBub2RlIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byB1cGRhdGUuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZShjb250ZXh0LCBhdHRyLCB2YWx1ZSkge1xuICAgIGxldCBjdXJyZW50QXR0clZhbHVlID0gY29udGV4dC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgaWYgKGN1cnJlbnRBdHRyVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2V0QXR0cmlidXRlKGF0dHIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2V0QXR0cmlidXRlKGF0dHIsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50QXR0clZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBTaW1wbGUgQ3VzdG9tIENvbXBvbmVudCBmb3IgcHJvcGVydGllcyBpbml0aWFsaXphdGlvbiB2aWEgYXR0cmlidXRlcy5cbiAqIEBtaXhpbiBQcm9wZXJ0aWVzTWl4aW5cbiAqIEBtZW1iZXJvZiBETkEuTUlYSU5TXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAvLyBteS1jb21wb25lbnQuanNcbiAqIGltcG9ydCB7IEJhc2VDb21wb25lbnQgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAqICAgZ2V0IHByb3BlcnRpZXMoKSB7XG4gKiAgICAgcmV0dXJuIHsgbmFtZTogU3RyaW5nIH07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICogYGBganNcbiAqIC8vIGFwcC5qc1xuICogaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogaW1wb3J0IHsgTXlDb21wb25lbnQgfSBmcm9tICcuL215LWNvbXBvbmVudC5qcyc7XG4gKiBkZWZpbmUoJ215LWNvbXBvbmVudCcsIE15Q29tcG9uZW50KTtcbiAqIHZhciB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gKiB0ZW1wLmlubmVySFRNTCA9ICc8bXktY29tcG9uZW50IG5hbWU9XCJBbGJlcnRcIj48L215LWNvbXBvbmVudD4nO1xuICogdmFyIGVsZW1lbnQgPSB0ZW1wLmZpcnN0Q2hpbGQ7XG4gKiBjb25zb2xlLmxvZyhlbGVtZW50Lm5hbWUpOyAvLyBsb2dzIFwiQWxiZXJ0XCJcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgUHJvcGVydGllc01peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgLyoqXG4gICAgICogQXR0YWNoIHByb3BlcnRpZXMgb24gY29tcG9uZW50IGNyZWF0aW9uLlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Qcm9wZXJ0aWVzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgIGlmICghaXNBcnJheShwcm9wcykpIHtcbiAgICAgICAgICAgICAgICBwcm9wcyA9IFtwcm9wc107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wcyA9IHByb3BzLnJlZHVjZSgocmVzLCBwYXJ0aWFsUHJvcHMpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrIGluIHBhcnRpYWxQcm9wcykge1xuICAgICAgICAgICAgICAgICAgICByZXNba10gPSBwcm9wKHBhcnRpYWxQcm9wc1trXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wcyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncHJvcGVydGllcycsIHtcbiAgICAgICAgICAgIHZhbHVlOiBwcm9wcyxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBvYnNlcnZlZCA9IHRoaXMuY29uc3RydWN0b3Iub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgICBmb3IgKGxldCBrIGluIHByb3BzKSB7XG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BzW2tdO1xuICAgICAgICAgICAgcHJvcC5uYW1lZChrKS5pbml0KHRoaXMpO1xuICAgICAgICAgICAgbGV0IHsgYXR0ck5hbWUsIGV2ZW50TmFtZSB9ID0gcHJvcDtcbiAgICAgICAgICAgIGlmICghYXR0ck5hbWUgJiYgb2JzZXJ2ZWQuaW5kZXhPZihrKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwcm9wLmF0dHJpYnV0ZSgpO1xuICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdHRyTmFtZSB8fCBldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wLm9ic2VydmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0ck5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEF0dHJpYnV0ZSh0aGlzLm5vZGUsIGF0dHJOYW1lLCB0aGlzW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKHRoaXMubm9kZSwgZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN5bmMgaW5pdGlhbCBhdHRyaWJ1dGVzIHdpdGggcHJvcGVydGllcy5cbiAgICAgKiBAbWV0aG9kIGNvbm5lY3RlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuUHJvcGVydGllc01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMucHJvcGVydGllcztcbiAgICAgICAgZm9yIChsZXQgayBpbiBwcm9wcykge1xuICAgICAgICAgICAgbGV0IHByb3AgPSBwcm9wc1trXTtcbiAgICAgICAgICAgIGxldCB7IGF0dHJOYW1lIH0gPSBwcm9wO1xuICAgICAgICAgICAgaWYgKGF0dHJOYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKHRoaXNbcHJvcC5uYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3AubmFtZV0gPSBnZXRWYWx1ZShwcm9wLCB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRBdHRyaWJ1dGUodGhpcy5ub2RlLCBhdHRyTmFtZSwgdGhpc1twcm9wLm5hbWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU3luYyBhdHRyaWJ1dGVzIHdpdGggcHJvcGVydGllcy5cbiAgICAgKiBAbWV0aG9kIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1xuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlByb3BlcnRpZXNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJOYW1lIFRoZSBjaGFuZ2VkIGF0dHJpYnV0ZSBuYW1lLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvbGRWYWwgVGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgYmVmb3JlIHRoZSBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5ld1ZhbCBUaGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBhZnRlciB0aGUgY2hhbmdlLlxuICAgICAqL1xuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBvbGRWYWwsIG5ld1ZhbCkge1xuICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgb2xkVmFsLCBuZXdWYWwpO1xuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgICAgIGZvciAobGV0IGsgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gcHJvcHNba107XG4gICAgICAgICAgICBpZiAocHJvcC5hdHRyTmFtZSA9PT0gYXR0cikge1xuICAgICAgICAgICAgICAgIHRoaXNbcHJvcC5uYW1lXSA9IGdldFZhbHVlKHByb3AsIG5ld1ZhbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGxpc3RlbmVyIGZvciBub2RlJ3MgcHJvcGVydHkgY2hhbmdlcy5cbiAgICAgKiBAbWV0aG9kIG9ic2VydmVQcm9wZXJ0eVxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlByb3BlcnRpZXNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BOYW1lIFRoZSBwcm9wZXJ0eSBuYW1lIHRvIG9ic2VydmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGZpcmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCBgY2FuY2VsYCBtZXRob2QuXG4gICAgICovXG4gICAgb2JzZXJ2ZVByb3BlcnR5KHByb3BOYW1lLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW3Byb3BOYW1lXS5vYnNlcnZlKGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZm9yIG5vZGUncyBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqIEBtZXRob2QgdW5vYnNlcnZlUHJvcGVydHlcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Qcm9wZXJ0aWVzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wTmFtZSBUaGUgcHJvcGVydHkgbmFtZSB0byB1bm9ic2VydmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICAgKi9cbiAgICB1bm9ic2VydmVQcm9wZXJ0eShwcm9wTmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW3Byb3BOYW1lXS51bm9ic2VydmUoY2FsbGJhY2spO1xuICAgIH1cbn07XG4iLCJjb25zdCBFTEVNX1BST1RPID0gRWxlbWVudC5wcm90b3R5cGU7XG5cbmV4cG9ydCBjb25zdCBtYXRjaGVzID0gRUxFTV9QUk9UTy5tYXRjaGVzIHx8XG4gICAgRUxFTV9QUk9UTy5tYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBFTEVNX1BST1RPLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBFTEVNX1BST1RPLm9NYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBFTEVNX1BST1RPLndlYmtpdE1hdGNoZXNTZWxlY3RvcjtcbiIsImltcG9ydCB7IGlzU3RyaW5nLCBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vbGliL3R5cGVvZi5qcyc7XG5pbXBvcnQgeyBtYXRjaGVzIH0gZnJvbSAnLi4vcG9seWZpbGxzL21hdGNoZXMuanMnO1xuaW1wb3J0IHsgZGlzcGF0Y2ggfSBmcm9tICcuLi9saWIvZGlzcGF0Y2guanMnO1xuXG5jb25zdCBTUExJVF9TRUxFQ1RPUiA9IC8oW15cXHNdKykoLiopPy87XG5cbi8qKlxuICogU2ltcGxlIEN1c3RvbSBDb21wb25lbnQgd2l0aCBldmVudHMgZGVsZWdhdGlvbixcbiAqIEl0IGFsc28gaW1wbGVtZW50IGEgYGRpc3BhdGNoRXZlbnRgIHdyYXBwZXIgbmFtZWQgYHRyaWdnZXJgLlxuICogQG1peGluIEV2ZW50c01peGluXG4gKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIG15LWNvbXBvbmVudC5qc1xuICogaW1wb3J0IHsgQmFzZUNvbXBvbmVudCB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICogICBnZXQgZXZlbnRzKCkge1xuICogICAgIHJldHVybiB7XG4gKiAgICAgICAnY2xpY2sgYnV0dG9uJzogJ29uQnV0dG9uQ2xpY2snXG4gKiAgICAgfVxuICogICB9XG4gKiAgIG9uQnV0dG9uQ2xpY2soKSB7XG4gKiAgICAgY29uc29sZS5sb2coJ2J1dHRvbiBjbGlja2VkJyk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICogYGBganNcbiAqIC8vIGFwcC5qc1xuICogaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogaW1wb3J0IHsgTXlDb21wb25lbnQgfSBmcm9tICcuL215LWNvbXBvbmVudC5qcyc7XG4gKiBkZWZpbmUoJ215LWNvbXBvbmVudCcsIE15Q29tcG9uZW50KTtcbiAqIHZhciBlbGVtZW50ID0gbmV3IE15Q29tcG9uZW50KCk7XG4gKiB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gKiBidXR0b24uaW5uZXJUZXh0ID0gJ0NsaWNrIG1lJztcbiAqIGVsZW1lbnQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAqIGJ1dHRvbi5jbGljaygpOyAvLyBsb2dzIFwiYnV0dG9uIGNsaWNrZWRcIlxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBFdmVudHNNaXhpbiA9IChTdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIEF0dGFjaCBhbmQgZGVsZWdhdGUgZXZlbnRzIHRvIHRoZSBjb21wb25lbnQuXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkV2ZW50c01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vIGJpbmQgZXZlbnRzXG4gICAgICAgIGxldCBldmVudHMgPSB0aGlzLmV2ZW50cyB8fCB7fTtcbiAgICAgICAgZm9yIChsZXQgayBpbiBldmVudHMpIHtcbiAgICAgICAgICAgIGxldCBjYWxsYmFjayA9IGlzU3RyaW5nKGV2ZW50c1trXSkgP1xuICAgICAgICAgICAgICAgIHRoaXNbZXZlbnRzW2tdXSA6XG4gICAgICAgICAgICAgICAgZXZlbnRzW2tdO1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJ1bGUgPSBrLm1hdGNoKFNQTElUX1NFTEVDVE9SKTtcbiAgICAgICAgICAgICAgICBsZXQgZXZOYW1lID0gcnVsZVsxXTtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0b3IgPSAocnVsZVsyXSB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGVnYXRlKGV2TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldk5hbWUsIChldikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjYWxsYmFjayBmb3IgZXZlbnQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVsZWdhdGUgZXZlbnRzIHRvIHRoZSBjb21wb25lbnQgZGVzY2VuZGVudHMuXG4gICAgICogQG1ldGhvZCBkZWxlZ2F0ZVxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkV2ZW50c01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZOYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBkZWxlZ2F0ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgQSBDU1Mgc2VsZWN0b3IgZm9yIGRlc2NlbmRlbnRzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBmaXJlIHdoZW4gdGhlIGV2ZW50IGZpcmVzLlxuICAgICAqL1xuICAgIGRlbGVnYXRlKGV2TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKGV2TmFtZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlcy5jYWxsKHRhcmdldCwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZlbnQsIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYE5vZGUucHJvdG90eXBlLmRpc3BhdGNoRXZlbnRgIHdyYXBwZXIuXG4gICAgICogQG1ldGhvZCB0cmlnZ2VyXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuRXZlbnRzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldk5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGZpcmUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQSBzZXQgb2YgY3VzdG9tIGRhdGEgdG8gcGFzcyB0byB0aGUgZXZlbnQuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBidWJibGVzIFNob3VsZCB0aGUgZXZlbnQgYnViYmxlIHRocm93IHRoZSBET00gdHJlZS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGNhbmNlbGFibGUgQ2FuIGJlIHRoZSBldmVudCBjYW5jZWwgYnkgYSBjYWxsYmFjay5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIGV2ZW50IHByb3BhZ2F0aW9uIGhhcyBub3QgYmUgc3RvcHBlZC5cbiAgICAgKi9cbiAgICB0cmlnZ2VyKGV2TmFtZSwgZGF0YSwgYnViYmxlcyA9IHRydWUsIGNhbmNlbGFibGUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh0aGlzLCBldk5hbWUsIGRhdGEsIGJ1YmJsZXMsIGNhbmNlbGFibGUpO1xuICAgIH1cbn07XG4iLCJjb25zdCByb290RG9jID0gZG9jdW1lbnQ7XG4vKipcbiAqIENyZWF0ZSBhbmQgYXR0YWNoIGEgc3R5bGUgZWxlbWVudCBmb3IgYSBjb21wb25lbnQuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgQSBjb21wb25lbnQgaW5zdGFuY2UuXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gVGhlIGNyZWF0ZWQgc3R5bGUgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlKG5vZGUpIHtcbiAgICBsZXQgZG9jID0gbm9kZS5vd25lckRvY3VtZW50IHx8IHJvb3REb2M7XG4gICAgbGV0IHN0eWxlRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbS50eXBlID0gJ3RleHQvY3NzJztcbiAgICBzdHlsZUVsZW0uc2V0QXR0cmlidXRlKCdpZCcsIGBzdHlsZS0ke25vZGUuaXN9YCk7XG4gICAgbGV0IGhlYWQgPSBkb2MuaGVhZDtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChoZWFkLmZpcnN0RWxlbWVudENoaWxkKSB7XG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbSwgaGVhZC5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gc3R5bGVFbGVtO1xufVxuIiwiaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuLi9saWIvdHlwZW9mLmpzJztcbmltcG9ydCB7IGNyZWF0ZVN0eWxlIH0gZnJvbSAnLi4vbGliL3N0eWxlLmpzJztcblxuLyoqXG4gKiBTaW1wbGUgQ3VzdG9tIENvbXBvbmVudCB3aXRoIGNzcyBzdHlsZSBoYW5kbGluZyB1c2luZyB0aGUgYGNzc2AgcHJvcGVydHkuXG4gKiBAbWl4aW4gU3R5bGVNaXhpblxuICogQG1lbWJlcm9mIEROQS5NSVhJTlNcbiAqIEBzdGF0aWNcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIG15LWNvbXBvbmVudC5qc1xuICogaW1wb3J0IHsgQmFzZUNvbXBvbmVudCB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICogICBnZXQgY3NzKCkge1xuICogICAgIHJldHVybiAnLm15LWNvbXBvbmVudCBwIHsgY29sb3I6IHJlZDsgfSdcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gYXBwLmpzXG4gKiBpbXBvcnQgeyBkZWZpbmUgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gJy4vbXktY29tcG9uZW50LmpzJztcbiAqIGRlZmluZSgnbXktY29tcG9uZW50JywgTXlDb21wb25lbnQpO1xuICogdmFyIGVsZW1lbnQgPSBuZXcgTXlDb21wb25lbnQoKTtcbiAqIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICogcC5pbm5lclRleHQgPSAnUGFyYWdyYXBoJztcbiAqIGVsZW1lbnQuYXBwZW5kQ2hpbGQocCk7IC8vIHRleHQgaW5zaWRlIGBwYCBnZXRzIHRoZSByZWQgY29sb3JcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgU3R5bGVNaXhpbiA9IChTdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gYW4gaW5zdGFuY2Ugb2YgdGhlIGVsZW1lbnQgaXMgY3JlYXRlZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnN0cnVjdG9yLnN0eWxlRWxlbSkge1xuICAgICAgICAgICAgbGV0IEN0ciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ3RyLCAnc3R5bGVFbGVtJywge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBjcmVhdGVTdHlsZSh0aGlzKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQ1NTKCk7XG4gICAgfVxuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICAgIHRoaXMubm9kZS5jbGFzc0xpc3QuYWRkKHRoaXMuaXMpO1xuICAgIH1cblxuICAgIHVwZGF0ZUNTUygpIHtcbiAgICAgICAgbGV0IHN0eWxlID0gdGhpcy5jc3M7XG4gICAgICAgIGlmIChpc1N0cmluZyhzdHlsZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3R5bGVFbGVtLnRleHRDb250ZW50ID0gc3R5bGU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgaXNVbmRlZmluZWQsIGlzRnVuY3Rpb24sIGlzU3RyaW5nIH0gZnJvbSAnLi4vbGliL3R5cGVvZi5qcyc7XG5cbi8qKlxuICogU2ltcGxlIEN1c3RvbSBDb21wb25lbnQgd2l0aCB0ZW1wbGF0ZSBoYW5kbGluZyB1c2luZyB0aGUgYHRlbXBsYXRlYCBwcm9wZXJ0eS5cbiAqIEBtZW1iZXJvZiBETkEuTUlYSU5TXG4gKiBAbWl4aW4gVGVtcGxhdGVNaXhpblxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFN1cGVyQ2xhc3MgVGhlIGNsYXNzIHRvIGV4dGVuZC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZXh0ZW5kZWQgY2xhc3MuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAvLyBteS1jb21wb25lbnQuanNcbiAqIGltcG9ydCB7IEJhc2VDb21wb25lbnQgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAqICAgZ2V0IHRlbXBsYXRlKCkge1xuICogICAgIHJldHVybiBgPGgxPiR7dGhpcy5uYW1lfTwvaDE+YDtcbiAqICAgfVxuICogICBnZXQgbmFtZSgpIHtcbiAqICAgICByZXR1cm4gJ05ld3Rvbic7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICogYGBganNcbiAqIC8vIGFwcC5qc1xuICogaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogaW1wb3J0IHsgTXlDb21wb25lbnQgfSBmcm9tICcuL215LWNvbXBvbmVudC5qcyc7XG4gKiBkZWZpbmUoJ215LWNvbXBvbmVudCcsIE15Q29tcG9uZW50KTtcbiAqIHZhciBlbGVtZW50ID0gbmV3IE15Q29tcG9uZW50KCk7XG4gKiBjb25zb2xlLmxvZyhlbGVtZW50LmlubmVySFRNTCk7IC8vIGxvZ3MgXCI8aDE+TmV3dG9uPC9oMT5cIlxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBUZW1wbGF0ZU1peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgZ2V0IGF1dG9SZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggcHJvcGVydGllcyBvYnNlcnZlcnMgaW4gb3JkZXIgdG8gdXBkYXRlIGNoaWxkcmVuLlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5UZW1wbGF0ZU1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh0aGlzLmF1dG9SZW5kZXIgJiYgIWlzVW5kZWZpbmVkKHRoaXMudGVtcGxhdGUpKSB7XG4gICAgICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrIGluIHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzW2tdLm9ic2VydmUoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW5kZXIgdGhlIGNvbXBvbmVudCB3aGVuIGNvbm5lY3RlZC5cbiAgICAgKiBAbWV0aG9kIGNvbm5lY3RlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuVGVtcGxhdGVNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMudGVtcGxhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBDb21wb25lbnQgY2hpbGQgbm9kZXMuXG4gICAgICogQG1ldGhvZCByZW5kZXJcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5UZW1wbGF0ZU1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gdHBsIEEgdGVtcGxhdGUgdG8gdXNlIGluc3RlYWQgb2YgYHRoaXMudGVtcGxhdGVgLlxuICAgICAqXG4gICAgICogQHRocm93cyB7VHlwZUVycm9yfSBXaWxsIHRocm93IGlmIHRoZSB0ZW1wbGF0ZSB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICovXG4gICAgcmVuZGVyKHRwbCkge1xuICAgICAgICB0cGwgPSB0cGwgfHwgdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odHBsKSkge1xuICAgICAgICAgICAgdHBsLmNhbGwodGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodHBsKSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmlubmVySFRNTCA9IHRwbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdGVtcGxhdGUgcHJvcGVydHkuJyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgcHJlZmVyLXJlc3QtcGFyYW1zICovXG5leHBvcnQgY29uc3QgcmVkdWNlID0gQXJyYXkucHJvdG90eXBlLnJlZHVjZSB8fCBmdW5jdGlvbihjYWxsYmFjayAvKiwgaW5pdGlhbFZhbHVlKi8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGxldCB0ID0gdGhpcztcbiAgICBsZXQgbGVuID0gdC5sZW5ndGg7XG4gICAgbGV0IGsgPSAwO1xuICAgIGxldCB2YWx1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICB2YWx1ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAoayA8IGxlbiAmJiAhKGsgaW4gdCkpIHtcbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9IHRbaysrXTtcbiAgICB9XG4gICAgZm9yICg7IGsgPCBsZW47IGsrKykge1xuICAgICAgICBpZiAoayBpbiB0KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrKHZhbHVlLCB0W2tdLCBrLCB0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuIiwiLyoqXG4gKiBAYXV0aG9yIEp1c3RpbiBGYWduYW5pXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qdXN0aW5mYWduYW5pL21peHdpdGguanNcbiAqL1xuaW1wb3J0IHsgcmVkdWNlIH0gZnJvbSAnLi4vcG9seWZpbGxzL3JlZHVjZS5qcyc7XG5cbi8qKlxuICogTWl4IGEgY2xhc3Mgd2l0aCBhIG1peGluLlxuICogQG1ldGhvZCBtaXgoLi4uKS53aXRoKC4uLilcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyQ2xhc3MgVGhlIGNsYXNzIHRvIGV4dGVuZC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG1peGVkIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktc3VwZXIuanNcbiAqIGV4cG9ydCBjbGFzcyBNeVN1cGVyQ2xhc3Mge1xuICogICAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgICAgICAvLyBkbyBzb21ldGhpbmdcbiAqICAgICB9XG4gKiB9XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiAvLyBtaXhpbi5qc1xuICogZXhwb3J0IGNvbnN0IE1peGluID0gKHN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZCBzdXBlckNsYXNzIHtcbiAqICAgICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICAgICAgc3VwZXIoKTtcbiAqICAgICAgICAgLy8gZG8gc29tZXRoaW5nIGVsc2VcbiAqICAgICB9XG4gKiB9O1xuICogYGBgXG4gKiBgYGBqc1xuICogaW1wb3J0IHsgbWl4IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogaW1wb3J0IHsgTXlTdXBlckNsYXNzIH0gZnJvbSAnLi9teS1zdXBlci5qcyc7XG4gKiBpbXBvcnQgeyBNaXhpbiB9IGZyb20gJy4vbWl4aW4uanMnO1xuICpcbiAqIGV4cG9ydCBjbGFzcyBNaXhlZENsYXNzIGV4dGVuZHMgbWl4KE15U3VwZXJDbGFzcykud2l0aChNaXhpbikge1xuICogICAgIC4uLlxuICogfVxuICogYGBgXG4gKi9cblxuLyoqXG4gKiBBIE1peGluIGhlbHBlciBjbGFzcy5cbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgTWl4aW4ge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG1peGFibGUgY2xhc3MuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDbGFzcyBUaGUgY2xhc3MgdG8gZXh0ZW5kLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN1cGVyY2xhc3MpIHtcbiAgICAgICAgc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3MgfHwgY2xhc3Mge307XG4gICAgICAgIHRoaXMuc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3M7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1peCB0aGUgc3VwZXIgY2xhc3Mgd2l0aCBhIGxpc3Qgb2YgbWl4aW5zLlxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IG1peGlucyAqTiogbWl4aW4gZnVuY3Rpb25zLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZXh0ZW5kZWQgY2xhc3MuXG4gICAgICovXG4gICAgd2l0aCgpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIGxldCBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICByZXR1cm4gcmVkdWNlLmNhbGwoYXJncywgKGMsIG1peGluKSA9PiBtaXhpbihjKSwgdGhpcy5zdXBlcmNsYXNzKTtcbiAgICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgTWl4aW4gaW5zdGFuY2UuXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBjb25zdCBtaXggPSAoc3VwZXJDbGFzcykgPT4gbmV3IE1peGluKHN1cGVyQ2xhc3MpO1xuIiwiaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuXG4vKipcbiAqIENoZWNrIGlmIGEgbm9kZSBpcyBhbHJlYWR5IGluc3RhbnRpYXRlZCBIVE1MRWxlbWVudCBmb3IgcHJvZ3JhbW1hdGljYWxseSBgY29uc3RydWN0b3JgIGNhbGxzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgVGhlIG5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBzaG91bGQgYmUgaW5zdGFudGlhdGVkLlxuICovXG5mdW5jdGlvbiBpc05ldyhub2RlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuICFpc1N0cmluZyhub2RlLm91dGVySFRNTCk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG4vKipcbiAqIFNoaW0gb3JpZ2luYWwgRWxlbWVudCBjb25zdHJ1Y3RvcnMgaW4gb3JkZXIgdG8gYmUgdXNlZCB3aXRoIGBuZXdgLlxuICogQG1ldGhvZCBzaGltXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBPcmlnaW5hbCBUaGUgb3JpZ2luYWwgY29uc3RydWN0b3IgdG8gc2hpbS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgc2hpbW1lZCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIHNoaW0gYXVkaW8gZWxlbWVudFxuICogaW1wb3J0IHsgc2hpbSB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqXG4gKiBjbGFzcyBNeUF1ZGlvIGV4dGVuZHMgc2hpbShIVE1MQXVkaW9FbGVtZW50KSB7XG4gKiAgICAgLi4uXG4gKiB9XG4gKlxuICogbGV0IGF1ZGlvID0gbmV3IE15QXVkaW8oKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hpbShPcmlnaW5hbCkge1xuICAgIGNsYXNzIFBvbHlmaWxsZWQge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIGlmICghaXNOZXcodGhpcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBkZXNjID0gcmVnaXN0cnkuZ2V0RGVzY3JpcHRvcih0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSBkZXNjLmNvbmZpZztcbiAgICAgICAgICAgIC8vIEZpbmQgdGhlIHRhZ25hbWUgb2YgdGhlIGNvbnN0cnVjdG9yIGFuZCBjcmVhdGUgYSBuZXcgZWxlbWVudCB3aXRoIGl0XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgY29uZmlnLmV4dGVuZHMgPyBjb25maWcuZXh0ZW5kcyA6IGRlc2MuaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlbGVtZW50Ll9fcHJvdG9fXyA9IGRlc2MuQ3RyLnByb3RvdHlwZTtcbiAgICAgICAgICAgIGlmIChjb25maWcuZXh0ZW5kcykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpcycsIGRlc2MuaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2xvbmUgdGhlIHByb3RvdHlwZSBvdmVycmlkaW5nIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBQb2x5ZmlsbGVkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoT3JpZ2luYWwucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogUG9seWZpbGxlZCxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBQb2x5ZmlsbGVkO1xufVxuIiwiaW1wb3J0ICogYXMgRE9NX0hFTFBFUlMgZnJvbSAnLi9saWIvZG9tLmpzJztcbmltcG9ydCB7IENvbXBvbmVudE1peGluIH0gZnJvbSAnLi9taXhpbnMvY29tcG9uZW50LmpzJztcbmltcG9ydCB7IFByb3BlcnRpZXNNaXhpbiB9IGZyb20gJy4vbWl4aW5zL3Byb3BlcnRpZXMtY29tcG9uZW50LmpzJztcbmltcG9ydCB7IEV2ZW50c01peGluIH0gZnJvbSAnLi9taXhpbnMvZXZlbnRzLWNvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBTdHlsZU1peGluIH0gZnJvbSAnLi9taXhpbnMvc3R5bGUtY29tcG9uZW50LmpzJztcbmltcG9ydCB7IFRlbXBsYXRlTWl4aW4gfSBmcm9tICcuL21peGlucy90ZW1wbGF0ZS1jb21wb25lbnQuanMnO1xuXG4vKipcbiAqIEEgc2V0IG9mIERPTSBoZWxwZXJzIGZvciBjYWxsYmFja3MgdHJpZ2dlciB3aGVuIEN1c3RvbSBFbGVtZW50c1xuICogYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuXG4gKiBAbmFtZSBET01cbiAqIEBuYW1lc3BhY2UgRE9NXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IERPTSA9IERPTV9IRUxQRVJTO1xuLyoqXG4gKiBBIHNldCBvZiBjb3JlIG1peGlucy5cbiAqIEBuYW1lIE1JWElOU1xuICogQG5hbWVzcGFjZSBNSVhJTlNcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICovXG5leHBvcnQgY29uc3QgTUlYSU5TID0ge1xuICAgIENvbXBvbmVudE1peGluLFxuICAgIFByb3BlcnRpZXNNaXhpbixcbiAgICBFdmVudHNNaXhpbixcbiAgICBTdHlsZU1peGluLFxuICAgIFRlbXBsYXRlTWl4aW4sXG59O1xuZXhwb3J0IHsgbWl4IH0gZnJvbSAnLi9saWIvbWl4aW5zLmpzJztcbmV4cG9ydCB7IHByb3AgfSBmcm9tICcuL2xpYi9wcm9wZXJ0eS5qcyc7XG5leHBvcnQgeyBzaGltIH0gZnJvbSAnLi9saWIvc2hpbS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9zeW1ib2xzLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbGliL3R5cGVvZi5qcyc7XG4iLCJleHBvcnQgZnVuY3Rpb24gc2hpbShFbGVtKSB7XG4gICAgY29uc3QgU2hpbUVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KEVsZW0sIFtdLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9O1xuXG4gICAgU2hpbUVsZW1lbnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbGVtLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgdmFsdWU6IFNoaW1FbGVtZW50LFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gU2hpbUVsZW1lbnQ7XG59XG4iLCIvKipcbiAqIEROQVxuICogKGMpIDIwMTUtMjAxNiBDaGlhbGFiIChodHRwOi8vd3d3LmNoaWFsYWIuY29tKSA8ZGV2QGNoaWFsYWIuaW8+XG4gKiBodHRwOi8vZG5hLmNoaWFsYWIuaW9cbiAqXG4gKiBKdXN0IGFub3RoZXIgY29tcG9uZW50cyBwYXR0ZXJuLlxuICogVXNlIHdpdGggQ3VzdG9tIEVsZW1lbnRzIHNwZWMuXG4gKi9cbmltcG9ydCB7IG1peCwgTUlYSU5TIH0gZnJvbSAnQGRuYWpzL2NvcmUvc3JjL2NvcmUuanMnO1xuaW1wb3J0IHsgc2hpbSB9IGZyb20gJy4vc3JjL2xpYi9zaGltLmpzJztcblxuZXhwb3J0IHsgcHJvcCB9IGZyb20gJ0BkbmFqcy9jb3JlL3NyYy9jb3JlLmpzJztcbmV4cG9ydCB7IHNoaW0sIG1peCwgTUlYSU5TIH07XG5leHBvcnQgY29uc3QgcmVnaXN0cnkgPSBzZWxmLmN1c3RvbUVsZW1lbnRzO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHJlZ2lzdHJ5LmRlZmluZSguLi5hcmdzKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIobm9kZSwgQ29tcG9uZW50LCBwcm9wcyA9IHt9KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBuZXcgQ29tcG9uZW50KCk7XG4gICAgZm9yIChsZXQgayBpbiBwcm9wcykge1xuICAgICAgICBlbGVtZW50W2tdID0gcHJvcHNba107XG4gICAgfVxuICAgIG5vZGUuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCBjbGFzcyBCYXNlQ29tcG9uZW50IGV4dGVuZHMgbWl4KFxuICAgIHNoaW0oc2VsZi5IVE1MRWxlbWVudClcbikud2l0aChcbiAgICBNSVhJTlMuQ29tcG9uZW50TWl4aW4sXG4gICAgTUlYSU5TLlByb3BlcnRpZXNNaXhpbixcbiAgICBNSVhJTlMuU3R5bGVNaXhpbixcbiAgICBNSVhJTlMuRXZlbnRzTWl4aW4sXG4gICAgTUlYSU5TLlRlbXBsYXRlTWl4aW5cbikge31cbiJdLCJuYW1lcyI6WyJpc0Z1bmN0aW9uIiwib2JqIiwiaXNTdHJpbmciLCJpc09iamVjdCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImlzVW5kZWZpbmVkIiwiaXNBcnJheSIsIkFycmF5IiwicmVnaXN0cnkiLCJuYW1lIiwiQ3RyIiwiY29uZmlnIiwiY29tcG9uZW50cyIsInRvTG93ZXJDYXNlIiwiayIsImRlc2MiLCJnZXREZXNjcmlwdG9yIiwiQ09NUE9ORU5UX1NZTUJPTCIsImdldENvbXBvbmVudCIsImVsZW1lbnQiLCJmdWxsIiwibm9kZSIsIm5vZGVUeXBlIiwiTm9kZSIsIkVMRU1FTlRfTk9ERSIsImdldEF0dHJpYnV0ZSIsInRhZ05hbWUiLCJnZXQiLCJDb21wb25lbnRNaXhpbiIsIlN1cGVyQ2xhc3MiLCJjb25uZWN0ZWRDYWxsYmFjayIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwibG9jYWxOYW1lIiwiQ3VzdG9tRXZlbnQiLCJldiIsInNlbGYiLCJleCIsImV2ZW50IiwicGFyYW1zIiwidW5kZWZpbmVkIiwiZXZ0IiwiZG9jdW1lbnQiLCJjcmVhdGVFdmVudCIsImluaXRDdXN0b21FdmVudCIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiZGV0YWlsIiwiZGlzcGF0Y2giLCJldk5hbWUiLCJkYXRhIiwiVHlwZUVycm9yIiwiZGlzcGF0Y2hFdmVudCIsImRlZmluZSIsImRlZmluZVByb3BlcnR5IiwiUHJvcGVydHkiLCJjdHJzIiwiXyIsInZhbGlkYXRvciIsIl9zZXR0ZXIiLCJ2YWwiLCJnZXR0ZXJGbiIsInZhbHVlIiwic2V0dGVyRm4iLCJ2YWxpZGF0ZVR5cGUiLCJvbGRWYWx1ZSIsImNoYW5nZWQiLCJzY29wZSIsImlzIiwib2JzZXJ2ZSIsImNhbGxiYWNrIiwicHVzaCIsInVub2JzZXJ2ZSIsImlvIiwiaW5kZXhPZiIsInNwbGljZSIsIm5ld1ZhbHVlIiwiaSIsImxlbiIsImxlbmd0aCIsImNsYiIsImFjY2VwdHMiLCJuYW1lZCIsImF0dHJSZXF1ZXN0ZWQiLCJhdHRyTmFtZSIsImRlZmF1bHQiLCJpbml0VmFsdWUiLCJkZWZhdWx0VmFsdWUiLCJmcmVlemUiLCJhdHRyaWJ1dGUiLCJldmVudE5hbWUiLCJnZXR0ZXIiLCJzZXR0ZXIiLCJ2YWxpZGF0ZSIsImNvbnN0cnVjdG9yIiwiaW5pdCIsImJpbmQiLCJwcm9wIiwiU3RyaW5nIiwiQm9vbGVhbiIsIk51bWJlciIsImdldFZhbHVlIiwicHJvcGVydHkiLCJhdHRyVmFsIiwiSlNPTiIsInBhcnNlIiwic2V0QXR0cmlidXRlIiwiY29udGV4dCIsImF0dHIiLCJjdXJyZW50QXR0clZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwiUHJvcGVydGllc01peGluIiwicHJvcHMiLCJwcm9wZXJ0aWVzIiwicmVkdWNlIiwicmVzIiwicGFydGlhbFByb3BzIiwib2JzZXJ2ZWQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJoYXNBdHRyaWJ1dGUiLCJvbGRWYWwiLCJuZXdWYWwiLCJvYnNlcnZlUHJvcGVydHkiLCJwcm9wTmFtZSIsInVub2JzZXJ2ZVByb3BlcnR5IiwiRUxFTV9QUk9UTyIsIkVsZW1lbnQiLCJtYXRjaGVzIiwibWF0Y2hlc1NlbGVjdG9yIiwibW96TWF0Y2hlc1NlbGVjdG9yIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJvTWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwiU1BMSVRfU0VMRUNUT1IiLCJFdmVudHNNaXhpbiIsImV2ZW50cyIsInJ1bGUiLCJtYXRjaCIsInNlbGVjdG9yIiwidHJpbSIsImRlbGVnYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRhcmdldCIsInBhcmVudE5vZGUiLCJ0cmlnZ2VyIiwicm9vdERvYyIsImNyZWF0ZVN0eWxlIiwiZG9jIiwib3duZXJEb2N1bWVudCIsInN0eWxlRWxlbSIsImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwiaGVhZCIsImZpcnN0RWxlbWVudENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwiYXBwZW5kQ2hpbGQiLCJTdHlsZU1peGluIiwidXBkYXRlQ1NTIiwiY2xhc3NMaXN0IiwiYWRkIiwic3R5bGUiLCJjc3MiLCJ0ZXh0Q29udGVudCIsIlRlbXBsYXRlTWl4aW4iLCJhdXRvUmVuZGVyIiwidGVtcGxhdGUiLCJyZW5kZXIiLCJ0cGwiLCJpbm5lckhUTUwiLCJ0IiwiYXJndW1lbnRzIiwiTWl4aW4iLCJzdXBlcmNsYXNzIiwid2l0aCIsImFyZ3MiLCJzbGljZSIsImMiLCJtaXhpbiIsIm1peCIsInN1cGVyQ2xhc3MiLCJpc05ldyIsIm91dGVySFRNTCIsIk1JWElOUyIsInNoaW0iLCJFbGVtIiwiU2hpbUVsZW1lbnQiLCJSZWZsZWN0IiwiY29uc3RydWN0IiwiY3JlYXRlIiwiY3VzdG9tRWxlbWVudHMiLCJDb21wb25lbnQiLCJCYXNlQ29tcG9uZW50IiwiSFRNTEVsZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPLFNBQVNBLFVBQVQsQ0FBb0JDLEdBQXBCLEVBQXlCO1NBQ3JCLE9BQU9BLEdBQVAsS0FBZSxVQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNDLFFBQVQsQ0FBa0JELEdBQWxCLEVBQXVCO1NBQ25CLE9BQU9BLEdBQVAsS0FBZSxRQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNFLFFBQVQsQ0FBa0JGLEdBQWxCLEVBQXVCO1NBQ25CRyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLEdBQS9CLE1BQXdDLGlCQUEvQzs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNPLFdBQVQsQ0FBcUJQLEdBQXJCLEVBQTBCO1NBQ3RCLE9BQU9BLEdBQVAsS0FBZSxXQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNRLE9BQVQsQ0FBaUJSLEdBQWpCLEVBQXNCO1NBQ2xCUyxNQUFNRCxPQUFOLENBQWNSLEdBQWQsQ0FBUDs7O0FDeERKOzs7Ozs7OztBQVFBLEFBQU8sSUFBTVUsYUFBVzs7Ozs7Z0JBS1IsRUFMUTs7Ozs7OztVQUFBLGtCQVliQyxJQVphLEVBWVBDLEdBWk8sRUFZVztZQUFiQyxNQUFhLHVFQUFKLEVBQUk7O2FBQ3RCQyxVQUFMLENBQWdCSCxLQUFLSSxXQUFMLEVBQWhCLElBQXNDO2dCQUM5QkosSUFEOEI7b0JBQUE7O1NBQXRDO0tBYmdCOzs7Ozs7OztpQkFBQSx5QkF5Qk5BLElBekJNLEVBeUJBO1lBQ1pWLFNBQVNVLElBQVQsQ0FBSixFQUFv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