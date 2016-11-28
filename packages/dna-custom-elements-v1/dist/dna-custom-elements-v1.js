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
      /**
       * @property {HTMLElement} node Get component node reference.
       * @name node
       * @type {HTMLElement}
       * @memberof DNA.MIXINS.ComponentMixin
       * @instance
       */

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

            /**
             * @property {Boolean} autoRender Should the component re-render on properties changes.
             * @name autoRender
             * @type {Boolean}
             * @memberof DNA.MIXINS.TemplateMixin
             * @instance
             */
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

var __cov__gEfKMFLO0CUlSdJbboJWg = Function('return this')();
if (!__cov__gEfKMFLO0CUlSdJbboJWg.__coverage__) {
   __cov__gEfKMFLO0CUlSdJbboJWg.__coverage__ = {};
}
__cov__gEfKMFLO0CUlSdJbboJWg = __cov__gEfKMFLO0CUlSdJbboJWg.__coverage__;
if (!__cov__gEfKMFLO0CUlSdJbboJWg['/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/src/lib/shim.js']) {
   __cov__gEfKMFLO0CUlSdJbboJWg['/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/src/lib/shim.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/src/lib/shim.js", "s": { "1": 1, "2": 0, "3": 0, "4": 0, "5": 0 }, "b": {}, "f": { "1": 0, "2": 0 }, "fnMap": { "1": { "name": "shim", "line": 1, "loc": { "start": { "line": 1, "column": 7 }, "end": { "line": 1, "column": 27 } } }, "2": { "name": "(anonymous_2)", "line": 2, "loc": { "start": { "line": 2, "column": 24 }, "end": { "line": 2, "column": 35 } } } }, "statementMap": { "1": { "start": { "line": 1, "column": 7 }, "end": { "line": 15, "column": 1 } }, "2": { "start": { "line": 2, "column": 4 }, "end": { "line": 4, "column": 6 } }, "3": { "start": { "line": 3, "column": 8 }, "end": { "line": 3, "column": 61 } }, "4": { "start": { "line": 6, "column": 4 }, "end": { "line": 12, "column": 7 } }, "5": { "start": { "line": 14, "column": 4 }, "end": { "line": 14, "column": 23 } } }, "branchMap": {} };
}
__cov__gEfKMFLO0CUlSdJbboJWg = __cov__gEfKMFLO0CUlSdJbboJWg['/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/src/lib/shim.js'];
function shim$1(Elem) {
   __cov__gEfKMFLO0CUlSdJbboJWg.f['1']++;__cov__gEfKMFLO0CUlSdJbboJWg.s['2']++;var ShimElement = function ShimElement() {
      __cov__gEfKMFLO0CUlSdJbboJWg.f['2']++;__cov__gEfKMFLO0CUlSdJbboJWg.s['3']++;return Reflect.construct(Elem, [], this.constructor);
   };__cov__gEfKMFLO0CUlSdJbboJWg.s['4']++;ShimElement.prototype = Object.create(Elem.prototype, { constructor: { value: ShimElement, configurable: true, writable: true } });__cov__gEfKMFLO0CUlSdJbboJWg.s['5']++;return ShimElement;
}

var __cov_HVvjPCHfEvzUZBbrto$D9w = Function('return this')();
if (!__cov_HVvjPCHfEvzUZBbrto$D9w.__coverage__) {
   __cov_HVvjPCHfEvzUZBbrto$D9w.__coverage__ = {};
}
__cov_HVvjPCHfEvzUZBbrto$D9w = __cov_HVvjPCHfEvzUZBbrto$D9w.__coverage__;
if (!__cov_HVvjPCHfEvzUZBbrto$D9w['/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/index.js']) {
   __cov_HVvjPCHfEvzUZBbrto$D9w['/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/index.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/index.js", "s": { "1": 0, "2": 1, "3": 0, "4": 1, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 }, "b": {}, "f": { "1": 0, "2": 0 }, "fnMap": { "1": { "name": "define", "line": 15, "loc": { "start": { "line": 15, "column": 7 }, "end": { "line": 15, "column": 32 } } }, "2": { "name": "render", "line": 18, "loc": { "start": { "line": 18, "column": 7 }, "end": { "line": 18, "column": 52 } } } }, "statementMap": { "1": { "start": { "line": 14, "column": 7 }, "end": { "line": 14, "column": 44 } }, "2": { "start": { "line": 15, "column": 7 }, "end": { "line": 17, "column": 1 } }, "3": { "start": { "line": 16, "column": 4 }, "end": { "line": 16, "column": 36 } }, "4": { "start": { "line": 18, "column": 7 }, "end": { "line": 25, "column": 1 } }, "5": { "start": { "line": 19, "column": 4 }, "end": { "line": 19, "column": 34 } }, "6": { "start": { "line": 20, "column": 4 }, "end": { "line": 22, "column": 5 } }, "7": { "start": { "line": 21, "column": 8 }, "end": { "line": 21, "column": 30 } }, "8": { "start": { "line": 23, "column": 4 }, "end": { "line": 23, "column": 30 } }, "9": { "start": { "line": 24, "column": 4 }, "end": { "line": 24, "column": 19 } } }, "branchMap": {} };
}
__cov_HVvjPCHfEvzUZBbrto$D9w = __cov_HVvjPCHfEvzUZBbrto$D9w['/Users/edoardo/Development/dna/dna-components/packages/dna-custom-elements-v1/index.js'];
__cov_HVvjPCHfEvzUZBbrto$D9w.s['1']++;var registry = self.customElements;function define$1() {
   __cov_HVvjPCHfEvzUZBbrto$D9w.f['1']++;__cov_HVvjPCHfEvzUZBbrto$D9w.s['3']++;return registry.define.apply(registry, arguments);
}function render$1(node, Component) {
   var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
   __cov_HVvjPCHfEvzUZBbrto$D9w.f['2']++;__cov_HVvjPCHfEvzUZBbrto$D9w.s['5']++;var element = new Component();__cov_HVvjPCHfEvzUZBbrto$D9w.s['6']++;for (var k in props) {
      __cov_HVvjPCHfEvzUZBbrto$D9w.s['7']++;element[k] = props[k];
   }__cov_HVvjPCHfEvzUZBbrto$D9w.s['8']++;node.appendChild(element);__cov_HVvjPCHfEvzUZBbrto$D9w.s['9']++;return element;
}var BaseComponent = function (_mix$with) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi90eXBlb2YuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvcmVnaXN0cnkuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3ltYm9scy5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9kb20uanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvY29tcG9uZW50LmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9kaXNwYXRjaC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9wcm9wZXJ0eS5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL21peGlucy9wcm9wZXJ0aWVzLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL3BvbHlmaWxscy9tYXRjaGVzLmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbWl4aW5zL2V2ZW50cy1jb21wb25lbnQuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3R5bGUuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvc3R5bGUtY29tcG9uZW50LmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbWl4aW5zL3RlbXBsYXRlLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL3BvbHlmaWxscy9yZWR1Y2UuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvbWl4aW5zLmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbGliL3NoaW0uanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9jb3JlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2hlY2sgaWYgYW4gdmFsdWUgaXMgYSBmdW5jdGlvbi5cbiAqIEBtZXRob2QgaXNGdW5jdGlvblxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGEgc3RyaW5nLlxuICogQG1ldGhvZCBpc1N0cmluZ1xuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJztcbn1cbi8qKlxuICogQ2hlY2sgaWYgYW4gdmFsdWUgaXMgYW4gb2JqZWN0LlxuICogQG1ldGhvZCBpc09iamVjdFxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIHVuZGVmaW5lZC5cbiAqIEBtZXRob2QgaXNVbmRlZmluZWRcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCc7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGFuIGFycmF5LlxuICogQG1ldGhvZCBpc0FycmF5XG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0geyp9IG9iaiBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xufVxuIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiwgaXNTdHJpbmcgfSBmcm9tICcuL3R5cGVvZi5qcyc7XG5cbi8qKlxuICogQSBjdXN0b20gY29tcG9uZW50cyByZWdpc3RyeS5cbiAqIEl0IHJlcGxpY2F0ZXMgdGhlIFtDdXN0b21FbGVtZW50UmVnaXN0cnkgaW50ZXJmYWNlXShodHRwczovL3d3dy53My5vcmcvVFIvY3VzdG9tLWVsZW1lbnRzLyNjdXN0b20tZWxlbWVudHMtYXBpKS5cbiAqIEBuYW1lIHJlZ2lzdHJ5XG4gKiBAbmFtZXNwYWNlIHJlZ2lzdHJ5XG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlZ2lzdHJ5ID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBsaXN0IG9mIGRlZmluZWQgY29tcG9uZW50cy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbXBvbmVudHM6IHt9LFxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgbmV3IGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgaWQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDdHIgVGhlIGNvbXBvbmVudCBjb25zdHJ1Y3Rvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIE9wdGlvbmFsIGNvbXBvbmVudCBjb25maWd1cmF0aW9uLlxuICAgICAqL1xuICAgIGRlZmluZShuYW1lLCBDdHIsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50c1tuYW1lLnRvTG93ZXJDYXNlKCldID0ge1xuICAgICAgICAgICAgaXM6IG5hbWUsXG4gICAgICAgICAgICBDdHIsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIGNvbXBvbmVudCBkZXNjcmlwdG9yIGJ5IGlkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGNvbXBvbmVudCBpZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjb21wb25lbnQgZGVzY3JpcHRvci5cbiAgICAgKi9cbiAgICBnZXREZXNjcmlwdG9yKG5hbWUpIHtcbiAgICAgICAgaWYgKGlzU3RyaW5nKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzW25hbWUudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihuYW1lKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGVzYyA9IHRoaXMuY29tcG9uZW50c1trXTtcbiAgICAgICAgICAgICAgICBpZiAoZGVzYy5DdHIgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc2M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIGNvbXBvbmVudCBjb25zdHJ1Y3RvciBieSBpZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgY29tcG9uZW50IGlkLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY29tcG9uZW50IGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIGdldChuYW1lKSB7XG4gICAgICAgIGxldCBkZXNjID0gdGhpcy5nZXREZXNjcmlwdG9yKG5hbWUpO1xuICAgICAgICBpZiAoZGVzYykge1xuICAgICAgICAgICAgcmV0dXJuIGRlc2MuQ3RyO1xuICAgICAgICB9XG4gICAgfSxcbn07XG4iLCJleHBvcnQgY29uc3QgQ09NUE9ORU5UX1NZTUJPTCA9ICdfX2NvbXBvbmVudCc7XG4iLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IENPTVBPTkVOVF9TWU1CT0wgfSBmcm9tICcuL3N5bWJvbHMuanMnO1xuXG4vKipcbiAqIFRoZSBgY29ubmVjdGVkQ2FsbGJhY2tgIG5hbWUuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAc2VlIFtXM0Mgc3BlY10oaHR0cHM6Ly93d3cudzMub3JnL1RSL2N1c3RvbS1lbGVtZW50cy8jY3VzdG9tLWVsZW1lbnQtcmVhY3Rpb25zKVxuICovXG5jb25zdCBDT05ORUNURUQgPSAnY29ubmVjdGVkQ2FsbGJhY2snO1xuLyoqXG4gKiBUaGUgYGRpc2Nvbm5lY3RlZENhbGxiYWNrYCBuYW1lLlxuICogQHByaXZhdGVcbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHNlZSBbVzNDIHNwZWNdKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jdXN0b20tZWxlbWVudHMvI2N1c3RvbS1lbGVtZW50LXJlYWN0aW9ucylcbiAqL1xuY29uc3QgRElTQ09OTkVDVEVEID0gJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJztcbi8qKlxuICogVGhlIGBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tgIG5hbWUuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAc2VlIFtXM0Mgc3BlY10oaHR0cHM6Ly93d3cudzMub3JnL1RSL2N1c3RvbS1lbGVtZW50cy8jY3VzdG9tLWVsZW1lbnQtcmVhY3Rpb25zKVxuICovXG5jb25zdCBVUERBVEVEID0gJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayc7XG4vKipcbiAqIFJldHJpZXZlIGEgY29tcG9uZW50IGNvbnN0cnVjdG9yIGZyb20gYW4gRWxlbWVudCBvciBmcm9tIGEgdGFnIG5hbWUuXG4gKiBAbWV0aG9kIGdldENvbXBvbmVudFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudHxTdHJpbmd9IGVsZW1lbnQgVGhlIGVsZW1lbnQgb3IgdGhlIHRhZyBuYW1lLlxuICogQHBhcmFtIHtCb29sZWFufSBmdWxsIFJldHJpZXZlIGZ1bGwgY29tcG9uZW50IGluZm9ybWF0aW9uLlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgZm9yIHRoZSBnaXZlbiBwYXJhbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBvbmVudChlbGVtZW50LCBmdWxsID0gZmFsc2UpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm5vZGU7XG4gICAgfVxuICAgIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgfHwgZWxlbWVudC50YWdOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZnVsbCA/IHJlZ2lzdHJ5LmdldERlc2NyaXB0b3IoZWxlbWVudCkgOiByZWdpc3RyeS5nZXQoZWxlbWVudCk7XG59XG4vKipcbiAqIENoZWNrIGlmIGEgbm9kZSBpcyBhbiBpbnN0YW5jZSBvZiBhIGNvbXBvbmVudC5cbiAqIEBtZXRob2QgaXNDb21wb25lbnRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wb25lbnQoZWxlbWVudCkge1xuICAgIGxldCBDdHIgPSBnZXRDb21wb25lbnQoZWxlbWVudCk7XG4gICAgcmV0dXJuIEN0ciAmJiAoZWxlbWVudCBpbnN0YW5jZW9mIEN0cik7XG59XG4vKipcbiAqIEFuIGhlbHBlciBmb3IgZHluYW1pY2FsbHkgdHJpZ2dlciB0aGUgYGNvbm5lY3RlZENhbGxiYWNrYCByZWFjdGlvbiBvbiBjb21wb25lbnRzLlxuICogQG1ldGhvZCBjb25uZWN0XG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBhdHRhY2hlZCBub2RlLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIGNhbGxiYWNrIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3QoZWxlbWVudCkge1xuICAgIGlmIChpc0NvbXBvbmVudChlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50W0NPTk5FQ1RFRF0uY2FsbChlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuLyoqXG4gKiBBbiBoZWxwZXIgZm9yIGR5bmFtaWNhbGx5IHRyaWdnZXIgdGhlIGBkaXNjb25uZWN0ZWRDYWxsYmFja2AgcmVhY3Rpb24gb24gY29tcG9uZW50cy5cbiAqIEBtZXRob2QgZGlzY29ubmVjdFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZGV0YWNoZWQgbm9kZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBjYWxsYmFjayBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNjb25uZWN0KGVsZW1lbnQpIHtcbiAgICBpZiAoaXNDb21wb25lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudFtESVNDT05ORUNURURdLmNhbGwoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbi8qKlxuICogQW4gaGVscGVyIGZvciBkeW5hbWljYWxseSB0cmlnZ2VyIHRoZSBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYCByZWFjdGlvbiBvbiBjb21wb25lbnRzLlxuICogQG1ldGhvZCB1cGRhdGVcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIHVwZGF0ZWQgZWxlbWVudC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBjYWxsYmFjayBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUoZWxlbWVudCwgbmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgaWYgKGlzQ29tcG9uZW50KGVsZW1lbnQpKSB7XG4gICAgICAgIGVsZW1lbnRbVVBEQVRFRF0uY2FsbChlbGVtZW50LCBuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4vKipcbiAqIEF0dGFjaCBhIGNvbXBvbmVudCBwcm90b3R5cGUgdG8gYW4gYWxyZWFkeSBpbnN0YW50aWF0ZWQgSFRNTEVsZW1lbnQuXG4gKiBAbWV0aG9kIGJpbmRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgbm9kZSB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDdHIgVGhlIGNvbXBvbmVudCBjbGFzcyB0byB1c2UgKGxlYXZlIGVtcHR5IGZvciBhdXRvIGRldGVjdCkuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgcHJvdG90eXBlIGhhcyBiZWVuIGF0dGFjaGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZChub2RlLCBDdHIpIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24oQ3RyKSkge1xuICAgICAgICBDdHIgPSBnZXRDb21wb25lbnQobm9kZSk7XG4gICAgfVxuICAgIGlmIChpc0Z1bmN0aW9uKEN0cikpIHtcbiAgICAgICAgbm9kZS5fX3Byb3RvX18gPSBDdHIucHJvdG90eXBlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgICAgICAgdmFsdWU6IEN0cixcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgQ3RyLmNhbGwobm9kZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vKipcbiAqIENyZWF0ZSBhIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIEBtZXRob2QgY3JlYXRlRWxlbWVudFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaXMgVGhlIGNvbXBvbmVudCB0YWcgbmFtZS5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBUaGUgY29tcG9uZW50IGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChpcykge1xuICAgIGxldCBDdHIgPSBnZXRDb21wb25lbnQoaXMpO1xuICAgIGlmIChDdHIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDdHIoKTtcbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IGFwcGVuZCBhIG5vZGUgYW5kIGNhbGwgdGhlIGBjb25uZWN0ZWRDYWxsYmFja2AuXG4gKiAtIGRpc2Nvbm5lY3QgdGhlIG5vZGUgaWYgYWxyZWFkeSBpbiB0aGUgdHJlZVxuICogLSBjb25uZWN0IHRoZSBub2RlIGFmdGVyIHRoZSBpbnNlcnRpb25cbiAqIEBtZXRob2QgYXBwZW5kQ2hpbGRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50IFRoZSBwYXJlbnQgZWxlbWVudC5cbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGFwcGVuZC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIGFwcGVuZGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ2hpbGQocGFyZW50LCBlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgaWYgKHBhcmVudCAhPT0gbm9kZS5wYXJlbnROb2RlIHx8IHBhcmVudC5sYXN0RWxlbWVudENoaWxkICE9PSBub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGQobm9kZS5wYXJlbnROb2RlLCBlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIHJldHVybiBjb25uZWN0KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbi8qKlxuICogRHluYW1pY2FsbHkgcmVtb3ZlIGEgbm9kZSBhbmQgY2FsbCB0aGUgYGRpc2Nvbm5lY3RlZENhbGxiYWNrYC5cbiAqIEBtZXRob2QgcmVtb3ZlQ2hpbGRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50IFRoZSBwYXJlbnQgZWxlbWVudC5cbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHJlbW92ZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIHJlbW92ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDaGlsZChwYXJlbnQsIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChlbGVtZW50Lm5vZGUpO1xuICAgICAgICByZXR1cm4gZGlzY29ubmVjdChlbGVtZW50KTtcbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IGluc2VydCBhIG5vZGUgYmVmb3JlIGFub3RoZXIgYW5kIGNhbGwgYWxsIHRoZSByZWFjdGlvbnMuXG4gKiAtIGRpc2Nvbm5lY3QgdGhlIG5vZGUgaWYgYWxyZWFkeSBpbiB0aGUgdHJlZVxuICogLSBjb25uZWN0IHRoZSBub2RlIGFmdGVyIHRoZSBpbnNlcnRpb25cbiAqIEBtZXRob2QgaW5zZXJ0QmVmb3JlXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBpbnNlcnQuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZOb2RlIFRoZSBub2RlIGZvciBwb3NpdGlvbmluZy5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIGFwcGVuZGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKHBhcmVudCwgZWxlbWVudCwgcmVmTm9kZSkge1xuICAgIGlmIChlbGVtZW50Lm5vZGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlbGVtZW50Lm5vZGU7XG4gICAgICAgIGlmIChub2RlLm5leHRTaWJsaW5nICE9PSByZWZOb2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZGlzY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcmVmTm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogRHluYW1pY2FsbHkgcmVwbGFjZSBhIG5vZGUgd2l0aCBhbm90aGVyIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogLSBkaXNjb25uZWN0IHRoZSBub2RlIGlmIGFscmVhZHkgaW4gdGhlIHRyZWVcbiAqIC0gZGlzY29ubmVjdCB0aGUgcmVwbGFjZWQgbm9kZVxuICogLSBjb25uZWN0IHRoZSBmaXJzdCBub2RlIGFmdGVyIHRoZSBpbnNlcnRpb25cbiAqIEBtZXRob2QgcmVwbGFjZUNoaWxkXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBpbnNlcnQuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZOb2RlIFRoZSBub2RlIHRvIHJlcGxhY2UuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiBhcHBlbmRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VDaGlsZChwYXJlbnQsIGVsZW1lbnQsIHJlZk5vZGUpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGxldCBub2RlID0gZWxlbWVudC5ub2RlO1xuICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBkaXNjb25uZWN0KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQobm9kZSwgcmVmTm9kZSk7XG4gICAgICAgIGlmIChyZWZOb2RlW0NPTVBPTkVOVF9TWU1CT0xdKSB7XG4gICAgICAgICAgICBkaXNjb25uZWN0KHJlZk5vZGVbQ09NUE9ORU5UX1NZTUJPTF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25uZWN0KG5vZGUpO1xuICAgIH1cbn1cbi8qKlxuICogRHluYW1pY2FsbHkgdXBkYXRlIGEgbm9kZSBhdHRyaWJ1dGUgYW5kIGNhbGwgYWxsIHRoZSByZWFjdGlvbnMuXG4gKiBAbWV0aG9kIHNldEF0dHJpYnV0ZVxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgYXR0cmlidXRlIG5hbWUuXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgVGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIHVwZGF0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRBdHRyaWJ1dGUoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGxldCBub2RlID0gZWxlbWVudC5ub2RlO1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICBsZXQgYXR0cnMgPSBlbGVtZW50LmNvbnN0cnVjdG9yLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgaWYgKGF0dHJzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlKGVsZW1lbnQsIG5hbWUsIG9sZFZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHJlbW92ZSBhIG5vZGUgYXR0cmlidXRlIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogQG1ldGhvZCByZW1vdmVBdHRyaWJ1dGVcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGF0dHJpYnV0ZSBuYW1lLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIG5vZGUgaGFzIGJlZW4gdXBkYXRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUF0dHJpYnV0ZShlbGVtZW50LCBuYW1lKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBsZXQgYXR0cnMgPSBlbGVtZW50LmNvbnN0cnVjdG9yLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgaWYgKGF0dHJzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlKGVsZW1lbnQsIG5hbWUsIG9sZFZhbHVlLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENPTVBPTkVOVF9TWU1CT0wgfSBmcm9tICcuLi9saWIvc3ltYm9scy5qcyc7XG5cbi8qKlxuICogVEhlIGJhc2UgY3VzdG9tIGNvbXBvbmVudCBtaXhpbnMuIEp1c3QgYWRkIGxpZmUgY3ljbGVzIGNhbGxiYWNrIGFuZCBgaXNgIGdldHRlci5cbiAqIEBtaXhpbiBDb21wb25lbnRNaXhpblxuICogQG1lbWJlcm9mIEROQS5NSVhJTlNcbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IENvbXBvbmVudE1peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGlzIEdldCBjb21wb25lbnQgaWQuXG4gICAgICogQG5hbWUgaXNcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkNvbXBvbmVudE1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgZ2V0IGlzKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZ2V0QXR0cmlidXRlKCdpcycpIHx8IHRoaXMubG9jYWxOYW1lKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBub2RlIEdldCBjb21wb25lbnQgbm9kZSByZWZlcmVuY2UuXG4gICAgICogQG5hbWUgbm9kZVxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Db21wb25lbnRNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGdldCBub2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiBhbiBpbnN0YW5jZSB3YXMgaW5zZXJ0ZWQgaW50byB0aGUgZG9jdW1lbnQuXG4gICAgICogQG1ldGhvZCBjb25uZWN0ZWRDYWxsYmFja1xuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkNvbXBvbmVudE1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMubm9kZVtDT01QT05FTlRfU1lNQk9MXSA9IHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gYW4gaW5zdGFuY2Ugd2FzIGRldGFjaGVkIGZyb20gdGhlIGRvY3VtZW50LlxuICAgICAqIEBtZXRob2QgZGlzY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Db21wb25lbnRNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIGFuIGF0dHJpYnV0ZSB3YXMgYWRkZWQsIHJlbW92ZWQsIG9yIHVwZGF0ZWQuXG4gICAgICogQG1ldGhvZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Db21wb25lbnRNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJOYW1lIFRoZSBjaGFuZ2VkIGF0dHJpYnV0ZSBuYW1lLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvbGRWYWwgVGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgYmVmb3JlIHRoZSBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5ld1ZhbCBUaGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBhZnRlciB0aGUgY2hhbmdlLlxuICAgICAqL1xuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaygpIHt9XG59O1xuIiwibGV0IEN1c3RvbUV2ZW50O1xuXG50cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGxldCBldiA9IG5ldyBzZWxmLkN1c3RvbUV2ZW50KCd0ZXN0Jyk7XG4gICAgQ3VzdG9tRXZlbnQgPSBzZWxmLkN1c3RvbUV2ZW50O1xufSBjYXRjaChleCkge1xuICAgIEN1c3RvbUV2ZW50ID0gZnVuY3Rpb24oZXZlbnQsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge1xuICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGRldGFpbDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICAgIHJldHVybiBldnQ7XG4gICAgfTtcbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSBzZWxmLkN1c3RvbUV2ZW50LnByb3RvdHlwZTtcbn1cblxuZXhwb3J0IHsgQ3VzdG9tRXZlbnQgfTtcbiIsImltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuaW1wb3J0IHsgQ3VzdG9tRXZlbnQgfSBmcm9tICcuLi9wb2x5ZmlsbHMvY3VzdG9tLWV2ZW50LmpzJztcblxuLyoqXG4gKiBUcmlnZ2VyIGEgY3VzdG9tIERPTSBFdmVudC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIFRoZSBldmVudCB0YXJnZXQuXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZOYW1lIFRoZSBjdXN0b20gZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEV4dHJhIGRhdGEgdG8gcGFzcyB0byB0aGUgZXZlbnQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGJ1YmJsZXMgRW5hYmxlIGV2ZW50IGJ1YmJsaW5nLlxuICogQHBhcmFtIHtCb29sZWFufSBjYW5jZWxhYmxlIE1ha2UgZXZlbnQgY2FuY2VsYWJsZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgZXZlbnQgcHJvcGFnYXRpb24gaGFzIG5vdCBiZSBzdG9wcGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZXZOYW1lLCBkYXRhLCBidWJibGVzID0gdHJ1ZSwgY2FuY2VsYWJsZSA9IHRydWUpIHtcbiAgICBpZiAoIWlzU3RyaW5nKGV2TmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXZlbnQgbmFtZSBpcyB1bmRlZmluZWQnKTtcbiAgICB9XG4gICAgbGV0IGV2ID0gbmV3IEN1c3RvbUV2ZW50KGV2TmFtZSwge1xuICAgICAgICBkZXRhaWw6IGRhdGEsXG4gICAgICAgIGJ1YmJsZXMsXG4gICAgICAgIGNhbmNlbGFibGUsXG4gICAgfSk7XG4gICAgcmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChldik7XG59XG4iLCJpbXBvcnQgeyBpc1VuZGVmaW5lZCwgaXNGdW5jdGlvbiwgaXNBcnJheSwgaXNPYmplY3QsIGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuXG4vKipcbiAqIFNob3J0Y3V0IHRvIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgLlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgZGVmaW5lID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vKipcbiAqIFBvd2VyIHRvIHRoZSBjb21wb25lbnQncyBwcm9wZXJ0aWVzLlxuICogVHlwZSBjaGVja2luZywgdmFsaWRhdGlvbiwgY2FsbGJhY2tzLCBldmVudHMgYW5kIGF0dHJpYnV0ZSBzeW5jaW5nLlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUHJvcGVydHkge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFByb3BlcnR5IGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258QXJyYXl9IEEgc2luZ2xlIG9yIGEgbGlzdCBvZiB2YWxpZCBjb25zdHJ1Y3RvcnMgZm9yIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihjdHJzKSB7XG4gICAgICAgIHRoaXMuXyA9IFtdO1xuICAgICAgICBjdHJzID0gY3RycyB8fCBbXTtcbiAgICAgICAgaWYgKCFpc0FycmF5KGN0cnMpKSB7XG4gICAgICAgICAgICBjdHJzID0gW2N0cnNdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3RycyA9IGN0cnM7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yID0gKCkgPT4gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2V0dGVyID0gKHZhbCkgPT4gdmFsO1xuICAgICAgICB0aGlzLmdldHRlckZuID0gKCkgPT4gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXR0ZXJGbiA9ICh2YWwpID0+IHtcbiAgICAgICAgICAgIHZhbCA9IHRoaXMuX3NldHRlcih2YWwpO1xuICAgICAgICAgICAgaWYgKCh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZVR5cGUodmFsKSAmJiB0aGlzLnZhbGlkYXRvcih2YWwpKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWQodmFsLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgSW52YWxpZCBcXGAke3ZhbH1cXGAgdmFsdWUgZm9yIFxcYCR7dGhpcy5uYW1lfVxcYCBwcm9wZXJ0eSBmb3IgXFxgJHt0aGlzLnNjb3BlLmlzfVxcYC5gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkIGEgY2FsbGJhY2sgd2hlbiB0aGUgcHJvcGVydHkgY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gdHJpZ2dlci5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBvYnNlcnZlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSB8fCBpc1N0cmluZyhjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHRoaXMuXy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY2FsbGJhY2sgb24gcHJvcGVydHkgY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHVub2JzZXJ2ZShjYWxsYmFjaykge1xuICAgICAgICBsZXQgaW8gPSB0aGlzLl8uaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgIGlmIChpbyAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuXy5zcGxpY2UoaW8sIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIGNhbGxiYWNrcyBhZnRlciBhIGNoYW5nZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gbmV3VmFsdWUgVGhlIGN1cnJlbnQgcHJvcGVydHkgdmFsdWUuXG4gICAgICogQHBhcmFtIHsqfSBvbGRWYWx1ZSBUaGUgcHJldmlvdXMgcHJvcGVydHkgdmFsdWUuXG4gICAgICovXG4gICAgY2hhbmdlZChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuXy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGNsYiA9IHRoaXMuX1tpXTtcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyhjbGIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZVtjbGJdLmNhbGwodGhpcy5zY29wZSwgdGhpcywgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xiKHRoaXMsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYSBwcm9wZXJ0eSBhY2NlcHRzIGEgZ2l2ZW4gdHlwZSBhcyB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDdHIgVGhlIGNvbnN0cnVjdG9yIGZvciB0aGUgZ2l2ZW4gdHlwZS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGFjY2VwdHMoQ3RyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0cnMuaW5kZXhPZihDdHIpICE9PSAtMTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBwcm9wZXJ0eSBuYW1lLlxuICAgICAqIEl0IGFsc28gc2V0IHRoZSBhdHRyTmFtZSBpZiBgLmF0dHJpYnV0ZWAgbWV0aG9kIGFzIGJlZW4gcHJldmlvdXNseVxuICAgICAqIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIHByb3BlcnR5IG5hbWUuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgbmFtZWQobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICBpZiAodGhpcy5hdHRyUmVxdWVzdGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHByb3BlcnR5IGluaXRpYWwgdmFsdWUuXG4gICAgICogQHBhcmFtIHsqfSBpbml0VmFsdWUgVGhlIHByb3BlcnR5IGluaXRpYWwgdmFsdWUuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgZGVmYXVsdChpbml0VmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBpc09iamVjdChpbml0VmFsdWUpID9cbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUoaW5pdFZhbHVlKSA6XG4gICAgICAgICAgICBpbml0VmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHN5bmMuXG4gICAgICogSW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgaXQgcmV0cmlldmUgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyTmFtZSBUaGUgYXR0cmlidXRlIG5hbWUuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgYXR0cmlidXRlKGF0dHJOYW1lID0gdHJ1ZSkge1xuICAgICAgICBpZiAoaXNTdHJpbmcoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYXR0ck5hbWUgPSBhdHRyTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXR0clJlcXVlc3RlZCA9ICEhYXR0ck5hbWU7XG4gICAgICAgICAgICB0aGlzLmF0dHJOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBET00gZXZlbnQgbmFtZSB0byBkaXNwYXRjaCBvbiBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldk5hbWUgVGhlIGV2ZW50IG5hbWUuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgZGlzcGF0Y2goZXZOYW1lKSB7XG4gICAgICAgIHRoaXMuZXZlbnROYW1lID0gZXZOYW1lO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGEgZ2V0dGVyIGZ1bmN0aW9uIGZvciB0aGUgcHJvcGVydHkuXG4gICAgICogQnkgZGVmYXVsdCwgdGhlIHByb3BlcnR5IHZhbHVlIHdpbGwgYmUgcmV0dXJuLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBwcm9wZXJ0eSBnZXR0ZXIuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgZ2V0dGVyKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy5nZXR0ZXJGbiA9ICgpID0+IGNhbGxiYWNrKHRoaXMudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgYSBzZXR0ZXIgZnVuY3Rpb24gZm9yIHRoZSBwcm9wZXJ0eS5cbiAgICAgKiBCeSBkZWZhdWx0LCB0aGUgcHJvcGVydHkgdmFsdWUgd2lsbCBiZSB1cGRhdGVkIHdpdGggZ2l2ZW4gdmFsdWVcbiAgICAgKiB3aXRob3V0IGFueSBtb2RpZmljYXRpb24uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIHByb3BlcnR5IHNldHRlci5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBzZXR0ZXIoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXR0ZXIgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBwcm9wZXJ0eSB2YWxpZGF0b3IuXG4gICAgICogQSB2YWxpZGF0b3Igc2hvdWxkIHJldHVybiBgdHJ1ZWAgaWYgdGhlIHZhbHVlIGlzIGFjY2VwdGFibGVcbiAgICAgKiBvciBgZmFsc2VgIGlmIHVuYWNjYXB0YWJsZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgcHJvcGVydHkgdmFsaWR0b3IuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgdmFsaWRhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRvciA9IGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgYSB2YWxpZCB0eXBlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgdmFsaWRhdGVUeXBlKHZhbCkge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBjdHJzID0gdGhpcy5jdHJzO1xuICAgICAgICBpZiAoY3Rycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChpIDwgY3Rycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBjdHJzW2ldIHx8IChcbiAgICAgICAgICAgICAgICB2YWwuY29uc3RydWN0b3IgJiYgdmFsLmNvbnN0cnVjdG9yID09PSBjdHJzW2ldXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggdGhlIHByb3BlcnR5IHRvIGEgc2NvcGUgKGEgY29tcG9uZW50IGluc3RhbmNlKS5cbiAgICAgKiBTZXQgdGhlIGRlZmF1bHQgdmFsdWUgaWYgcHJvdmlkZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlIFRoZSBzY29wZSB3aGljaCBuZWVkcyB0byBiZSBib3VuZCB3aXRoIHRoZSBwcm9wZXJ0eS5cbiAgICAgKi9cbiAgICBpbml0KHNjb3BlKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICAgICAgZGVmaW5lKHNjb3BlLCB0aGlzLm5hbWUsIHtcbiAgICAgICAgICAgIGdldDogdGhpcy5nZXR0ZXJGbi5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgc2V0OiB0aGlzLnNldHRlckZuLmJpbmQodGhpcyksXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICAgICAgc2NvcGVbdGhpcy5uYW1lXSA9IHRoaXMuZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIFByb3BlcnR5IGNyZWF0aW9uLlxuICogQG1ldGhvZCBwcm9wXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcHJvcGVydHkge1Byb3BlcnR5fSBBTlkgQSBwcm9wZXJ0eSB3aXRob3V0IHR5cGUgdmFsaWRhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7UHJvcGVydHl9IFNUUklORyBBIHByb3BlcnR5IHdoaWNoIGFjY2VwdHMgb25seSBzdHJpbmdzLlxuICogQHByb3BlcnR5IHtQcm9wZXJ0eX0gQk9PTEVBTiBBIHByb3BlcnR5IHdoaWNoIGFjY2VwdHMgb25seSBib29sZWFucy5cbiAqIEBwcm9wZXJ0eSB7UHJvcGVydHl9IE5VTUJFUiBBIHByb3BlcnR5IHdoaWNoIGFjY2VwdHMgb25seSBudW1iZXJzLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl8RnVuY3Rpb258QXJyYXl9IGN0cnMgQSBQcm9wZXJ0eSB0byBjbG9uZSBvciBhIHNpbmdsZSBvciBhIGxpc3Qgb2YgdmFsaWQgY29uc3RydWN0b3JzIGZvciB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIG5ldyBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3AoY3Rycykge1xuICAgIGlmIChjdHJzIGluc3RhbmNlb2YgUHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIGN0cnM7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvcGVydHkoY3Rycyk7XG59XG5cbi8vIERlZmluZSBzb21lIGhlbHBlcnMgZm9yIGRlZmF1bHQgdHlwZXNcbmRlZmluZShwcm9wLCAnQU5ZJywgeyBnZXQoKSB7IHJldHVybiBwcm9wKCk7IH0gfSk7XG5kZWZpbmUocHJvcCwgJ1NUUklORycsIHsgZ2V0KCkgeyByZXR1cm4gcHJvcChTdHJpbmcpOyB9IH0pO1xuZGVmaW5lKHByb3AsICdCT09MRUFOJywgeyBnZXQoKSB7IHJldHVybiBwcm9wKEJvb2xlYW4pOyB9IH0pO1xuZGVmaW5lKHByb3AsICdOVU1CRVInLCB7IGdldCgpIHsgcmV0dXJuIHByb3AoTnVtYmVyKTsgfSB9KTtcbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi9saWIvdHlwZW9mLmpzJztcbmltcG9ydCB7IGRpc3BhdGNoIH0gZnJvbSAnLi4vbGliL2Rpc3BhdGNoLmpzJztcbmltcG9ydCB7IGlzVW5kZWZpbmVkIH0gZnJvbSAnLi4vbGliL3R5cGVvZi5qcyc7XG5pbXBvcnQgeyBwcm9wIH0gZnJvbSAnLi4vbGliL3Byb3BlcnR5LmpzJztcblxuLyoqXG4gKiBUcnkgdG8gcGFyc2UgYXR0cmlidXRlIHZhbHVlIGNoZWNraW5nIHRoZSBwcm9wZXJ0eSB2YWxpZGF0aW9uIHR5cGVzLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJWYWwgVGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEByZXR1cm4geyp9IFRoZSBwYXJzZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKHByb3BlcnR5LCBhdHRyVmFsKSB7XG4gICAgaWYgKGF0dHJWYWwgPT09ICcnICYmIHByb3BlcnR5LmFjY2VwdHMoQm9vbGVhbikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghcHJvcGVydHkuYWNjZXB0cyhTdHJpbmcpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhdHRyVmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF0dHJWYWw7XG59XG5cbi8qKlxuICogU2V0IGFuIGF0dHJpYnV0ZSB2YWx1ZSBjaGVja2luZyBpdHMgdHlwZS5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGV4dCBUaGUgbm9kZSB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBUaGUgYXR0cmlidXRlIG5hbWUgdG8gdXBkYXRlLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUoY29udGV4dCwgYXR0ciwgdmFsdWUpIHtcbiAgICBsZXQgY3VycmVudEF0dHJWYWx1ZSA9IGNvbnRleHQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgIGlmIChjdXJyZW50QXR0clZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICBjb250ZXh0LnNldEF0dHJpYnV0ZShhdHRyLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICBjb250ZXh0LnNldEF0dHJpYnV0ZShhdHRyLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEF0dHJWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGV4dC5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogU2ltcGxlIEN1c3RvbSBDb21wb25lbnQgZm9yIHByb3BlcnRpZXMgaW5pdGlhbGl6YXRpb24gdmlhIGF0dHJpYnV0ZXMuXG4gKiBAbWl4aW4gUHJvcGVydGllc01peGluXG4gKiBAbWVtYmVyb2YgRE5BLk1JWElOU1xuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktY29tcG9uZW50LmpzXG4gKiBpbXBvcnQgeyBCYXNlQ29tcG9uZW50IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gKiAgIGdldCBwcm9wZXJ0aWVzKCkge1xuICogICAgIHJldHVybiB7IG5hbWU6IFN0cmluZyB9O1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiAvLyBhcHAuanNcbiAqIGltcG9ydCB7IGRlZmluZSB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSAnLi9teS1jb21wb25lbnQuanMnO1xuICogZGVmaW5lKCdteS1jb21wb25lbnQnLCBNeUNvbXBvbmVudCk7XG4gKiB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICogdGVtcC5pbm5lckhUTUwgPSAnPG15LWNvbXBvbmVudCBuYW1lPVwiQWxiZXJ0XCI+PC9teS1jb21wb25lbnQ+JztcbiAqIHZhciBlbGVtZW50ID0gdGVtcC5maXJzdENoaWxkO1xuICogY29uc29sZS5sb2coZWxlbWVudC5uYW1lKTsgLy8gbG9ncyBcIkFsYmVydFwiXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IFByb3BlcnRpZXNNaXhpbiA9IChTdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIEF0dGFjaCBwcm9wZXJ0aWVzIG9uIGNvbXBvbmVudCBjcmVhdGlvbi5cbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuUHJvcGVydGllc01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMucHJvcGVydGllcztcbiAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkocHJvcHMpKSB7XG4gICAgICAgICAgICAgICAgcHJvcHMgPSBbcHJvcHNdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcHMgPSBwcm9wcy5yZWR1Y2UoKHJlcywgcGFydGlhbFByb3BzKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiBwYXJ0aWFsUHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzW2tdID0gcHJvcChwYXJ0aWFsUHJvcHNba10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvcHMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Byb3BlcnRpZXMnLCB7XG4gICAgICAgICAgICB2YWx1ZTogcHJvcHMsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgb2JzZXJ2ZWQgPSB0aGlzLmNvbnN0cnVjdG9yLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgZm9yIChsZXQgayBpbiBwcm9wcykge1xuICAgICAgICAgICAgbGV0IHByb3AgPSBwcm9wc1trXTtcbiAgICAgICAgICAgIHByb3AubmFtZWQoaykuaW5pdCh0aGlzKTtcbiAgICAgICAgICAgIGxldCB7IGF0dHJOYW1lLCBldmVudE5hbWUgfSA9IHByb3A7XG4gICAgICAgICAgICBpZiAoIWF0dHJOYW1lICYmIG9ic2VydmVkLmluZGV4T2YoaykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcHJvcC5hdHRyaWJ1dGUoKTtcbiAgICAgICAgICAgICAgICBhdHRyTmFtZSA9IGs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUgfHwgZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgcHJvcC5vYnNlcnZlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRBdHRyaWJ1dGUodGhpcy5ub2RlLCBhdHRyTmFtZSwgdGhpc1twcm9wLm5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCh0aGlzLm5vZGUsIGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTeW5jIGluaXRpYWwgYXR0cmlidXRlcyB3aXRoIHByb3BlcnRpZXMuXG4gICAgICogQG1ldGhvZCBjb25uZWN0ZWRDYWxsYmFja1xuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlByb3BlcnRpZXNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgICAgIGZvciAobGV0IGsgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gcHJvcHNba107XG4gICAgICAgICAgICBsZXQgeyBhdHRyTmFtZSB9ID0gcHJvcDtcbiAgICAgICAgICAgIGlmIChhdHRyTmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZCh0aGlzW3Byb3AubmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuaGFzQXR0cmlidXRlKGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wLm5hbWVdID0gZ2V0VmFsdWUocHJvcCwgdGhpcy5ub2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0QXR0cmlidXRlKHRoaXMubm9kZSwgYXR0ck5hbWUsIHRoaXNbcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN5bmMgYXR0cmlidXRlcyB3aXRoIHByb3BlcnRpZXMuXG4gICAgICogQG1ldGhvZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Qcm9wZXJ0aWVzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyTmFtZSBUaGUgY2hhbmdlZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb2xkVmFsIFRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGJlZm9yZSB0aGUgY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuZXdWYWwgVGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgYWZ0ZXIgdGhlIGNoYW5nZS5cbiAgICAgKi9cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgb2xkVmFsLCBuZXdWYWwpIHtcbiAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHIsIG9sZFZhbCwgbmV3VmFsKTtcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICBmb3IgKGxldCBrIGluIHByb3BzKSB7XG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BzW2tdO1xuICAgICAgICAgICAgaWYgKHByb3AuYXR0ck5hbWUgPT09IGF0dHIpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3Byb3AubmFtZV0gPSBnZXRWYWx1ZShwcm9wLCBuZXdWYWwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBsaXN0ZW5lciBmb3Igbm9kZSdzIHByb3BlcnR5IGNoYW5nZXMuXG4gICAgICogQG1ldGhvZCBvYnNlcnZlUHJvcGVydHlcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Qcm9wZXJ0aWVzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wTmFtZSBUaGUgcHJvcGVydHkgbmFtZSB0byBvYnNlcnZlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBmaXJlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IHdpdGggYGNhbmNlbGAgbWV0aG9kLlxuICAgICAqL1xuICAgIG9ic2VydmVQcm9wZXJ0eShwcm9wTmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcGVydGllc1twcm9wTmFtZV0ub2JzZXJ2ZShjYWxsYmFjayk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZvciBub2RlJ3MgcHJvcGVydHkgY2hhbmdlcy5cbiAgICAgKiBAbWV0aG9kIHVub2JzZXJ2ZVByb3BlcnR5XG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuUHJvcGVydGllc01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcE5hbWUgVGhlIHByb3BlcnR5IG5hbWUgdG8gdW5vYnNlcnZlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAgICovXG4gICAgdW5vYnNlcnZlUHJvcGVydHkocHJvcE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMucHJvcGVydGllc1twcm9wTmFtZV0udW5vYnNlcnZlKGNhbGxiYWNrKTtcbiAgICB9XG59O1xuIiwiY29uc3QgRUxFTV9QUk9UTyA9IEVsZW1lbnQucHJvdG90eXBlO1xuXG5leHBvcnQgY29uc3QgbWF0Y2hlcyA9IEVMRU1fUFJPVE8ubWF0Y2hlcyB8fFxuICAgIEVMRU1fUFJPVE8ubWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgRUxFTV9QUk9UTy5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBFTEVNX1BST1RPLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgRUxFTV9QUk9UTy5vTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgRUxFTV9QUk9UTy53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG4iLCJpbXBvcnQgeyBpc1N0cmluZywgaXNGdW5jdGlvbiB9IGZyb20gJy4uL2xpYi90eXBlb2YuanMnO1xuaW1wb3J0IHsgbWF0Y2hlcyB9IGZyb20gJy4uL3BvbHlmaWxscy9tYXRjaGVzLmpzJztcbmltcG9ydCB7IGRpc3BhdGNoIH0gZnJvbSAnLi4vbGliL2Rpc3BhdGNoLmpzJztcblxuY29uc3QgU1BMSVRfU0VMRUNUT1IgPSAvKFteXFxzXSspKC4qKT8vO1xuXG4vKipcbiAqIFNpbXBsZSBDdXN0b20gQ29tcG9uZW50IHdpdGggZXZlbnRzIGRlbGVnYXRpb24sXG4gKiBJdCBhbHNvIGltcGxlbWVudCBhIGBkaXNwYXRjaEV2ZW50YCB3cmFwcGVyIG5hbWVkIGB0cmlnZ2VyYC5cbiAqIEBtaXhpbiBFdmVudHNNaXhpblxuICogQG1lbWJlcm9mIEROQS5NSVhJTlMuXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAvLyBteS1jb21wb25lbnQuanNcbiAqIGltcG9ydCB7IEJhc2VDb21wb25lbnQgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAqICAgZ2V0IGV2ZW50cygpIHtcbiAqICAgICByZXR1cm4ge1xuICogICAgICAgJ2NsaWNrIGJ1dHRvbic6ICdvbkJ1dHRvbkNsaWNrJ1xuICogICAgIH1cbiAqICAgfVxuICogICBvbkJ1dHRvbkNsaWNrKCkge1xuICogICAgIGNvbnNvbGUubG9nKCdidXR0b24gY2xpY2tlZCcpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiAvLyBhcHAuanNcbiAqIGltcG9ydCB7IGRlZmluZSB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSAnLi9teS1jb21wb25lbnQuanMnO1xuICogZGVmaW5lKCdteS1jb21wb25lbnQnLCBNeUNvbXBvbmVudCk7XG4gKiB2YXIgZWxlbWVudCA9IG5ldyBNeUNvbXBvbmVudCgpO1xuICogdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICogYnV0dG9uLmlubmVyVGV4dCA9ICdDbGljayBtZSc7XG4gKiBlbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gKiBidXR0b24uY2xpY2soKTsgLy8gbG9ncyBcImJ1dHRvbiBjbGlja2VkXCJcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgRXZlbnRzTWl4aW4gPSAoU3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBBdHRhY2ggYW5kIGRlbGVnYXRlIGV2ZW50cyB0byB0aGUgY29tcG9uZW50LlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5FdmVudHNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvLyBiaW5kIGV2ZW50c1xuICAgICAgICBsZXQgZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge307XG4gICAgICAgIGZvciAobGV0IGsgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICBsZXQgY2FsbGJhY2sgPSBpc1N0cmluZyhldmVudHNba10pID9cbiAgICAgICAgICAgICAgICB0aGlzW2V2ZW50c1trXV0gOlxuICAgICAgICAgICAgICAgIGV2ZW50c1trXTtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIGxldCBydWxlID0gay5tYXRjaChTUExJVF9TRUxFQ1RPUik7XG4gICAgICAgICAgICAgICAgbGV0IGV2TmFtZSA9IHJ1bGVbMV07XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdG9yID0gKHJ1bGVbMl0gfHwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxlZ2F0ZShldk5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZOYW1lLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXYsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2FsbGJhY2sgZm9yIGV2ZW50LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERlbGVnYXRlIGV2ZW50cyB0byB0aGUgY29tcG9uZW50IGRlc2NlbmRlbnRzLlxuICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5FdmVudHNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gZGVsZWdhdGUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIEEgQ1NTIHNlbGVjdG9yIGZvciBkZXNjZW5kZW50cy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gZmlyZSB3aGVuIHRoZSBldmVudCBmaXJlcy5cbiAgICAgKi9cbiAgICBkZWxlZ2F0ZShldk5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldk5hbWUsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMuY2FsbCh0YXJnZXQsIHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50LCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGBOb2RlLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50YCB3cmFwcGVyLlxuICAgICAqIEBtZXRob2QgdHJpZ2dlclxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkV2ZW50c01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZOYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBmaXJlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEEgc2V0IG9mIGN1c3RvbSBkYXRhIHRvIHBhc3MgdG8gdGhlIGV2ZW50LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYnViYmxlcyBTaG91bGQgdGhlIGV2ZW50IGJ1YmJsZSB0aHJvdyB0aGUgRE9NIHRyZWUuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBjYW5jZWxhYmxlIENhbiBiZSB0aGUgZXZlbnQgY2FuY2VsIGJ5IGEgY2FsbGJhY2suXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiBldmVudCBwcm9wYWdhdGlvbiBoYXMgbm90IGJlIHN0b3BwZWQuXG4gICAgICovXG4gICAgdHJpZ2dlcihldk5hbWUsIGRhdGEsIGJ1YmJsZXMgPSB0cnVlLCBjYW5jZWxhYmxlID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2godGhpcywgZXZOYW1lLCBkYXRhLCBidWJibGVzLCBjYW5jZWxhYmxlKTtcbiAgICB9XG59O1xuIiwiY29uc3Qgcm9vdERvYyA9IGRvY3VtZW50O1xuLyoqXG4gKiBDcmVhdGUgYW5kIGF0dGFjaCBhIHN0eWxlIGVsZW1lbnQgZm9yIGEgY29tcG9uZW50LlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlIEEgY29tcG9uZW50IGluc3RhbmNlLlxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IFRoZSBjcmVhdGVkIHN0eWxlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdHlsZShub2RlKSB7XG4gICAgbGV0IGRvYyA9IG5vZGUub3duZXJEb2N1bWVudCB8fCByb290RG9jO1xuICAgIGxldCBzdHlsZUVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsZW0udHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgc3R5bGVFbGVtLnNldEF0dHJpYnV0ZSgnaWQnLCBgc3R5bGUtJHtub2RlLmlzfWApO1xuICAgIGxldCBoZWFkID0gZG9jLmhlYWQ7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoaGVhZC5maXJzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW0sIGhlYWQuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlRWxlbTtcbn1cbiIsImltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi4vbGliL3R5cGVvZi5qcyc7XG5pbXBvcnQgeyBjcmVhdGVTdHlsZSB9IGZyb20gJy4uL2xpYi9zdHlsZS5qcyc7XG5cbi8qKlxuICogU2ltcGxlIEN1c3RvbSBDb21wb25lbnQgd2l0aCBjc3Mgc3R5bGUgaGFuZGxpbmcgdXNpbmcgdGhlIGBjc3NgIHByb3BlcnR5LlxuICogQG1peGluIFN0eWxlTWl4aW5cbiAqIEBtZW1iZXJvZiBETkEuTUlYSU5TXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAvLyBteS1jb21wb25lbnQuanNcbiAqIGltcG9ydCB7IEJhc2VDb21wb25lbnQgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAqICAgZ2V0IGNzcygpIHtcbiAqICAgICByZXR1cm4gJy5teS1jb21wb25lbnQgcCB7IGNvbG9yOiByZWQ7IH0nXG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICogYGBganNcbiAqIC8vIGFwcC5qc1xuICogaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogaW1wb3J0IHsgTXlDb21wb25lbnQgfSBmcm9tICcuL215LWNvbXBvbmVudC5qcyc7XG4gKiBkZWZpbmUoJ215LWNvbXBvbmVudCcsIE15Q29tcG9uZW50KTtcbiAqIHZhciBlbGVtZW50ID0gbmV3IE15Q29tcG9uZW50KCk7XG4gKiB2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAqIHAuaW5uZXJUZXh0ID0gJ1BhcmFncmFwaCc7XG4gKiBlbGVtZW50LmFwcGVuZENoaWxkKHApOyAvLyB0ZXh0IGluc2lkZSBgcGAgZ2V0cyB0aGUgcmVkIGNvbG9yXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IFN0eWxlTWl4aW4gPSAoU3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIGFuIGluc3RhbmNlIG9mIHRoZSBlbGVtZW50IGlzIGNyZWF0ZWQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICghdGhpcy5jb25zdHJ1Y3Rvci5zdHlsZUVsZW0pIHtcbiAgICAgICAgICAgIGxldCBDdHIgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEN0ciwgJ3N0eWxlRWxlbScsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogY3JlYXRlU3R5bGUodGhpcyksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNTUygpO1xuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZCh0aGlzLmlzKTtcbiAgICB9XG5cbiAgICB1cGRhdGVDU1MoKSB7XG4gICAgICAgIGxldCBzdHlsZSA9IHRoaXMuY3NzO1xuICAgICAgICBpZiAoaXNTdHJpbmcoc3R5bGUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN0eWxlRWxlbS50ZXh0Q29udGVudCA9IHN0eWxlO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsImltcG9ydCB7IGlzVW5kZWZpbmVkLCBpc0Z1bmN0aW9uLCBpc1N0cmluZyB9IGZyb20gJy4uL2xpYi90eXBlb2YuanMnO1xuXG4vKipcbiAqIFNpbXBsZSBDdXN0b20gQ29tcG9uZW50IHdpdGggdGVtcGxhdGUgaGFuZGxpbmcgdXNpbmcgdGhlIGB0ZW1wbGF0ZWAgcHJvcGVydHkuXG4gKiBAbWVtYmVyb2YgRE5BLk1JWElOU1xuICogQG1peGluIFRlbXBsYXRlTWl4aW5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBTdXBlckNsYXNzIFRoZSBjbGFzcyB0byBleHRlbmQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGV4dGVuZGVkIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktY29tcG9uZW50LmpzXG4gKiBpbXBvcnQgeyBCYXNlQ29tcG9uZW50IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gKiAgIGdldCB0ZW1wbGF0ZSgpIHtcbiAqICAgICByZXR1cm4gYDxoMT4ke3RoaXMubmFtZX08L2gxPmA7XG4gKiAgIH1cbiAqICAgZ2V0IG5hbWUoKSB7XG4gKiAgICAgcmV0dXJuICdOZXd0b24nO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiAvLyBhcHAuanNcbiAqIGltcG9ydCB7IGRlZmluZSB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSAnLi9teS1jb21wb25lbnQuanMnO1xuICogZGVmaW5lKCdteS1jb21wb25lbnQnLCBNeUNvbXBvbmVudCk7XG4gKiB2YXIgZWxlbWVudCA9IG5ldyBNeUNvbXBvbmVudCgpO1xuICogY29uc29sZS5sb2coZWxlbWVudC5pbm5lckhUTUwpOyAvLyBsb2dzIFwiPGgxPk5ld3RvbjwvaDE+XCJcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgVGVtcGxhdGVNaXhpbiA9IChTdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYXV0b1JlbmRlciBTaG91bGQgdGhlIGNvbXBvbmVudCByZS1yZW5kZXIgb24gcHJvcGVydGllcyBjaGFuZ2VzLlxuICAgICAqIEBuYW1lIGF1dG9SZW5kZXJcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5UZW1wbGF0ZU1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgZ2V0IGF1dG9SZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggcHJvcGVydGllcyBvYnNlcnZlcnMgaW4gb3JkZXIgdG8gdXBkYXRlIGNoaWxkcmVuLlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5UZW1wbGF0ZU1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh0aGlzLmF1dG9SZW5kZXIgJiYgIWlzVW5kZWZpbmVkKHRoaXMudGVtcGxhdGUpKSB7XG4gICAgICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrIGluIHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzW2tdLm9ic2VydmUoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW5kZXIgdGhlIGNvbXBvbmVudCB3aGVuIGNvbm5lY3RlZC5cbiAgICAgKiBAbWV0aG9kIGNvbm5lY3RlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuVGVtcGxhdGVNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMudGVtcGxhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBDb21wb25lbnQgY2hpbGQgbm9kZXMuXG4gICAgICogQG1ldGhvZCByZW5kZXJcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5UZW1wbGF0ZU1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gdHBsIEEgdGVtcGxhdGUgdG8gdXNlIGluc3RlYWQgb2YgYHRoaXMudGVtcGxhdGVgLlxuICAgICAqXG4gICAgICogQHRocm93cyB7VHlwZUVycm9yfSBXaWxsIHRocm93IGlmIHRoZSB0ZW1wbGF0ZSB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICovXG4gICAgcmVuZGVyKHRwbCkge1xuICAgICAgICB0cGwgPSB0cGwgfHwgdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odHBsKSkge1xuICAgICAgICAgICAgdHBsLmNhbGwodGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodHBsKSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmlubmVySFRNTCA9IHRwbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdGVtcGxhdGUgcHJvcGVydHkuJyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgcHJlZmVyLXJlc3QtcGFyYW1zICovXG5leHBvcnQgY29uc3QgcmVkdWNlID0gQXJyYXkucHJvdG90eXBlLnJlZHVjZSB8fCBmdW5jdGlvbihjYWxsYmFjayAvKiwgaW5pdGlhbFZhbHVlKi8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGxldCB0ID0gdGhpcztcbiAgICBsZXQgbGVuID0gdC5sZW5ndGg7XG4gICAgbGV0IGsgPSAwO1xuICAgIGxldCB2YWx1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICB2YWx1ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAoayA8IGxlbiAmJiAhKGsgaW4gdCkpIHtcbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9IHRbaysrXTtcbiAgICB9XG4gICAgZm9yICg7IGsgPCBsZW47IGsrKykge1xuICAgICAgICBpZiAoayBpbiB0KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrKHZhbHVlLCB0W2tdLCBrLCB0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuIiwiLyoqXG4gKiBAYXV0aG9yIEp1c3RpbiBGYWduYW5pXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qdXN0aW5mYWduYW5pL21peHdpdGguanNcbiAqL1xuaW1wb3J0IHsgcmVkdWNlIH0gZnJvbSAnLi4vcG9seWZpbGxzL3JlZHVjZS5qcyc7XG5cbi8qKlxuICogTWl4IGEgY2xhc3Mgd2l0aCBhIG1peGluLlxuICogQG1ldGhvZCBtaXgoLi4uKS53aXRoKC4uLilcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyQ2xhc3MgVGhlIGNsYXNzIHRvIGV4dGVuZC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG1peGVkIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktc3VwZXIuanNcbiAqIGV4cG9ydCBjbGFzcyBNeVN1cGVyQ2xhc3Mge1xuICogICAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgICAgICAvLyBkbyBzb21ldGhpbmdcbiAqICAgICB9XG4gKiB9XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiAvLyBtaXhpbi5qc1xuICogZXhwb3J0IGNvbnN0IE1peGluID0gKHN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZCBzdXBlckNsYXNzIHtcbiAqICAgICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICAgICAgc3VwZXIoKTtcbiAqICAgICAgICAgLy8gZG8gc29tZXRoaW5nIGVsc2VcbiAqICAgICB9XG4gKiB9O1xuICogYGBgXG4gKiBgYGBqc1xuICogaW1wb3J0IHsgbWl4IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogaW1wb3J0IHsgTXlTdXBlckNsYXNzIH0gZnJvbSAnLi9teS1zdXBlci5qcyc7XG4gKiBpbXBvcnQgeyBNaXhpbiB9IGZyb20gJy4vbWl4aW4uanMnO1xuICpcbiAqIGV4cG9ydCBjbGFzcyBNaXhlZENsYXNzIGV4dGVuZHMgbWl4KE15U3VwZXJDbGFzcykud2l0aChNaXhpbikge1xuICogICAgIC4uLlxuICogfVxuICogYGBgXG4gKi9cblxuLyoqXG4gKiBBIE1peGluIGhlbHBlciBjbGFzcy5cbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgTWl4aW4ge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG1peGFibGUgY2xhc3MuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDbGFzcyBUaGUgY2xhc3MgdG8gZXh0ZW5kLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN1cGVyY2xhc3MpIHtcbiAgICAgICAgc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3MgfHwgY2xhc3Mge307XG4gICAgICAgIHRoaXMuc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3M7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1peCB0aGUgc3VwZXIgY2xhc3Mgd2l0aCBhIGxpc3Qgb2YgbWl4aW5zLlxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IG1peGlucyAqTiogbWl4aW4gZnVuY3Rpb25zLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZXh0ZW5kZWQgY2xhc3MuXG4gICAgICovXG4gICAgd2l0aCgpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIGxldCBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICByZXR1cm4gcmVkdWNlLmNhbGwoYXJncywgKGMsIG1peGluKSA9PiBtaXhpbihjKSwgdGhpcy5zdXBlcmNsYXNzKTtcbiAgICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgTWl4aW4gaW5zdGFuY2UuXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBjb25zdCBtaXggPSAoc3VwZXJDbGFzcykgPT4gbmV3IE1peGluKHN1cGVyQ2xhc3MpO1xuIiwiaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuXG4vKipcbiAqIENoZWNrIGlmIGEgbm9kZSBpcyBhbHJlYWR5IGluc3RhbnRpYXRlZCBIVE1MRWxlbWVudCBmb3IgcHJvZ3JhbW1hdGljYWxseSBgY29uc3RydWN0b3JgIGNhbGxzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgVGhlIG5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBzaG91bGQgYmUgaW5zdGFudGlhdGVkLlxuICovXG5mdW5jdGlvbiBpc05ldyhub2RlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuICFpc1N0cmluZyhub2RlLm91dGVySFRNTCk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG4vKipcbiAqIFNoaW0gb3JpZ2luYWwgRWxlbWVudCBjb25zdHJ1Y3RvcnMgaW4gb3JkZXIgdG8gYmUgdXNlZCB3aXRoIGBuZXdgLlxuICogQG1ldGhvZCBzaGltXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBPcmlnaW5hbCBUaGUgb3JpZ2luYWwgY29uc3RydWN0b3IgdG8gc2hpbS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgc2hpbW1lZCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIHNoaW0gYXVkaW8gZWxlbWVudFxuICogaW1wb3J0IHsgc2hpbSB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqXG4gKiBjbGFzcyBNeUF1ZGlvIGV4dGVuZHMgc2hpbShIVE1MQXVkaW9FbGVtZW50KSB7XG4gKiAgICAgLi4uXG4gKiB9XG4gKlxuICogbGV0IGF1ZGlvID0gbmV3IE15QXVkaW8oKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hpbShPcmlnaW5hbCkge1xuICAgIGNsYXNzIFBvbHlmaWxsZWQge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIGlmICghaXNOZXcodGhpcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBkZXNjID0gcmVnaXN0cnkuZ2V0RGVzY3JpcHRvcih0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSBkZXNjLmNvbmZpZztcbiAgICAgICAgICAgIC8vIEZpbmQgdGhlIHRhZ25hbWUgb2YgdGhlIGNvbnN0cnVjdG9yIGFuZCBjcmVhdGUgYSBuZXcgZWxlbWVudCB3aXRoIGl0XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgY29uZmlnLmV4dGVuZHMgPyBjb25maWcuZXh0ZW5kcyA6IGRlc2MuaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlbGVtZW50Ll9fcHJvdG9fXyA9IGRlc2MuQ3RyLnByb3RvdHlwZTtcbiAgICAgICAgICAgIGlmIChjb25maWcuZXh0ZW5kcykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpcycsIGRlc2MuaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2xvbmUgdGhlIHByb3RvdHlwZSBvdmVycmlkaW5nIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBQb2x5ZmlsbGVkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoT3JpZ2luYWwucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogUG9seWZpbGxlZCxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBQb2x5ZmlsbGVkO1xufVxuIiwiaW1wb3J0ICogYXMgRE9NX0hFTFBFUlMgZnJvbSAnLi9saWIvZG9tLmpzJztcbmltcG9ydCB7IENvbXBvbmVudE1peGluIH0gZnJvbSAnLi9taXhpbnMvY29tcG9uZW50LmpzJztcbmltcG9ydCB7IFByb3BlcnRpZXNNaXhpbiB9IGZyb20gJy4vbWl4aW5zL3Byb3BlcnRpZXMtY29tcG9uZW50LmpzJztcbmltcG9ydCB7IEV2ZW50c01peGluIH0gZnJvbSAnLi9taXhpbnMvZXZlbnRzLWNvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBTdHlsZU1peGluIH0gZnJvbSAnLi9taXhpbnMvc3R5bGUtY29tcG9uZW50LmpzJztcbmltcG9ydCB7IFRlbXBsYXRlTWl4aW4gfSBmcm9tICcuL21peGlucy90ZW1wbGF0ZS1jb21wb25lbnQuanMnO1xuXG4vKipcbiAqIEEgc2V0IG9mIERPTSBoZWxwZXJzIGZvciBjYWxsYmFja3MgdHJpZ2dlciB3aGVuIEN1c3RvbSBFbGVtZW50c1xuICogYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuXG4gKiBAbmFtZSBET01cbiAqIEBuYW1lc3BhY2UgRE9NXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IERPTSA9IERPTV9IRUxQRVJTO1xuLyoqXG4gKiBBIHNldCBvZiBjb3JlIG1peGlucy5cbiAqIEBuYW1lIE1JWElOU1xuICogQG5hbWVzcGFjZSBNSVhJTlNcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICovXG5leHBvcnQgY29uc3QgTUlYSU5TID0ge1xuICAgIENvbXBvbmVudE1peGluLFxuICAgIFByb3BlcnRpZXNNaXhpbixcbiAgICBFdmVudHNNaXhpbixcbiAgICBTdHlsZU1peGluLFxuICAgIFRlbXBsYXRlTWl4aW4sXG59O1xuZXhwb3J0IHsgbWl4IH0gZnJvbSAnLi9saWIvbWl4aW5zLmpzJztcbmV4cG9ydCB7IHByb3AgfSBmcm9tICcuL2xpYi9wcm9wZXJ0eS5qcyc7XG5leHBvcnQgeyBzaGltIH0gZnJvbSAnLi9saWIvc2hpbS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9zeW1ib2xzLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbGliL3R5cGVvZi5qcyc7XG4iXSwibmFtZXMiOlsiaXNGdW5jdGlvbiIsIm9iaiIsImlzU3RyaW5nIiwiaXNPYmplY3QiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJpc1VuZGVmaW5lZCIsImlzQXJyYXkiLCJBcnJheSIsInJlZ2lzdHJ5IiwibmFtZSIsIkN0ciIsImNvbmZpZyIsImNvbXBvbmVudHMiLCJ0b0xvd2VyQ2FzZSIsImsiLCJkZXNjIiwiZ2V0RGVzY3JpcHRvciIsIkNPTVBPTkVOVF9TWU1CT0wiLCJnZXRDb21wb25lbnQiLCJlbGVtZW50IiwiZnVsbCIsIm5vZGUiLCJub2RlVHlwZSIsIk5vZGUiLCJFTEVNRU5UX05PREUiLCJnZXRBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0IiwiQ29tcG9uZW50TWl4aW4iLCJTdXBlckNsYXNzIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsImxvY2FsTmFtZSIsIkN1c3RvbUV2ZW50IiwiZXYiLCJzZWxmIiwiZXgiLCJldmVudCIsInBhcmFtcyIsInVuZGVmaW5lZCIsImV2dCIsImRvY3VtZW50IiwiY3JlYXRlRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRldGFpbCIsImRpc3BhdGNoIiwiZXZOYW1lIiwiZGF0YSIsIlR5cGVFcnJvciIsImRpc3BhdGNoRXZlbnQiLCJkZWZpbmUiLCJkZWZpbmVQcm9wZXJ0eSIsIlByb3BlcnR5IiwiY3RycyIsIl8iLCJ2YWxpZGF0b3IiLCJfc2V0dGVyIiwidmFsIiwiZ2V0dGVyRm4iLCJ2YWx1ZSIsInNldHRlckZuIiwidmFsaWRhdGVUeXBlIiwib2xkVmFsdWUiLCJjaGFuZ2VkIiwic2NvcGUiLCJpcyIsIm9ic2VydmUiLCJjYWxsYmFjayIsInB1c2giLCJ1bm9ic2VydmUiLCJpbyIsImluZGV4T2YiLCJzcGxpY2UiLCJuZXdWYWx1ZSIsImkiLCJsZW4iLCJsZW5ndGgiLCJjbGIiLCJhY2NlcHRzIiwibmFtZWQiLCJhdHRyUmVxdWVzdGVkIiwiYXR0ck5hbWUiLCJkZWZhdWx0IiwiaW5pdFZhbHVlIiwiZGVmYXVsdFZhbHVlIiwiZnJlZXplIiwiYXR0cmlidXRlIiwiZXZlbnROYW1lIiwiZ2V0dGVyIiwic2V0dGVyIiwidmFsaWRhdGUiLCJjb25zdHJ1Y3RvciIsImluaXQiLCJiaW5kIiwicHJvcCIsIlN0cmluZyIsIkJvb2xlYW4iLCJOdW1iZXIiLCJnZXRWYWx1ZSIsInByb3BlcnR5IiwiYXR0clZhbCIsIkpTT04iLCJwYXJzZSIsInNldEF0dHJpYnV0ZSIsImNvbnRleHQiLCJhdHRyIiwiY3VycmVudEF0dHJWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsIlByb3BlcnRpZXNNaXhpbiIsInByb3BzIiwicHJvcGVydGllcyIsInJlZHVjZSIsInJlcyIsInBhcnRpYWxQcm9wcyIsIm9ic2VydmVkIiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiaGFzQXR0cmlidXRlIiwib2xkVmFsIiwibmV3VmFsIiwib2JzZXJ2ZVByb3BlcnR5IiwicHJvcE5hbWUiLCJ1bm9ic2VydmVQcm9wZXJ0eSIsIkVMRU1fUFJPVE8iLCJFbGVtZW50IiwibWF0Y2hlcyIsIm1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsIlNQTElUX1NFTEVDVE9SIiwiRXZlbnRzTWl4aW4iLCJldmVudHMiLCJydWxlIiwibWF0Y2giLCJzZWxlY3RvciIsInRyaW0iLCJkZWxlZ2F0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwidHJpZ2dlciIsInJvb3REb2MiLCJjcmVhdGVTdHlsZSIsImRvYyIsIm93bmVyRG9jdW1lbnQiLCJzdHlsZUVsZW0iLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImhlYWQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsImluc2VydEJlZm9yZSIsImFwcGVuZENoaWxkIiwiU3R5bGVNaXhpbiIsInVwZGF0ZUNTUyIsImNsYXNzTGlzdCIsImFkZCIsInN0eWxlIiwiY3NzIiwidGV4dENvbnRlbnQiLCJUZW1wbGF0ZU1peGluIiwiYXV0b1JlbmRlciIsInRlbXBsYXRlIiwicmVuZGVyIiwidHBsIiwiaW5uZXJIVE1MIiwidCIsImFyZ3VtZW50cyIsIk1peGluIiwic3VwZXJjbGFzcyIsIndpdGgiLCJhcmdzIiwic2xpY2UiLCJjIiwibWl4aW4iLCJtaXgiLCJzdXBlckNsYXNzIiwiaXNOZXciLCJvdXRlckhUTUwiLCJNSVhJTlMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPLFNBQVNBLFVBQVQsQ0FBb0JDLEdBQXBCLEVBQXlCO1NBQ3JCLE9BQU9BLEdBQVAsS0FBZSxVQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNDLFFBQVQsQ0FBa0JELEdBQWxCLEVBQXVCO1NBQ25CLE9BQU9BLEdBQVAsS0FBZSxRQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNFLFFBQVQsQ0FB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