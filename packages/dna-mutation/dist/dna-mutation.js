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
var registry = {
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
 * The `connectedCallback` name.
 * @private
 *
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
var CONNECTED = 'connectedCallback';
/**
 * The `disconnectedCallback` name.
 * @private
 *
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
var DISCONNECTED = 'disconnectedCallback';
/**
 * The `attributeChangedCallback` name.
 * @private
 *
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
var UPDATED = 'attributeChangedCallback';
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
    return full ? registry.getDescriptor(element) : registry.get(element);
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
function isComponent(element) {
    var Ctr = getComponent(element);
    return Ctr && element instanceof Ctr;
}
/**
 * An helper for dynamically trigger the `connectedCallback` reaction on components.
 * @method connect
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The attached node.
 * @return {Boolean} The callback has been triggered.
 */
function connect(element) {
    if (isComponent(element)) {
        element[CONNECTED].call(element);
        return true;
    }
}
/**
 * An helper for dynamically trigger the `disconnectedCallback` reaction on components.
 * @method disconnect
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The detached node.
 * @return {Boolean} The callback has been triggered.
 */
function disconnect(element) {
    if (isComponent(element)) {
        element[DISCONNECTED].call(element);
        return true;
    }
}
/**
 * An helper for dynamically trigger the `attributeChangedCallback` reaction on components.
 * @method update
 * @memberof DNA.DOM
 * @static
 *
 * @param {Component} element The updated element.
 * @return {Boolean} The callback has been triggered.
 */
function update(element, name, oldValue, newValue) {
    if (isComponent(element)) {
        element[UPDATED].call(element, name, oldValue, newValue);
        return true;
    }
}
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
function bind(node, Ctr) {
    if (!isFunction(Ctr)) {
        Ctr = getComponent(node);
    }
    if (isFunction(Ctr)) {
        node.__proto__ = Ctr.prototype;
        Object.defineProperty(node, 'constructor', {
            value: Ctr,
            configurable: true,
            writable: true
        });
        Ctr.call(node);
        return true;
    }
    return false;
}
/**
 * Create a component instance.
 * @method createElement
 * @memberof DNA.DOM
 * @static
 *
 * @param {String} is The component tag name.
 * @return {HTMLElement} The component instance.
 */
function createElement(is) {
    var Ctr = getComponent(is);
    if (Ctr) {
        return new Ctr();
    }
}
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
function appendChild(parent, element) {
    if (element.node) {
        var node = element.node;
        if (parent !== node.parentNode || parent.lastElementChild !== node) {
            if (node.parentNode) {
                removeChild(node.parentNode, element);
            }
            parent.appendChild(node);
            return connect(element);
        }
    }
    return false;
}
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
function removeChild(parent, element) {
    if (element.node) {
        parent.removeChild(element.node);
        return disconnect(element);
    }
}
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
function insertBefore(parent, element, refNode) {
    if (element.node) {
        var node = element.node;
        if (node.nextSibling !== refNode) {
            if (node.parentNode) {
                disconnect(element);
            }
            parent.insertBefore(node, refNode);
            return connect(element);
        }
    }
}
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
function replaceChild(parent, element, refNode) {
    if (element.node) {
        var node = element.node;
        if (node.parentNode) {
            disconnect(element);
        }
        parent.replaceChild(node, refNode);
        if (refNode[COMPONENT_SYMBOL]) {
            disconnect(refNode[COMPONENT_SYMBOL]);
        }
        return connect(node);
    }
}
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
function setAttribute(element, name, value) {
    if (element.node) {
        var node = element.node;
        var oldValue = node.getAttribute(name);
        node.setAttribute(name, value);
        var attrs = element.constructor.observedAttributes || [];
        if (attrs.indexOf(name) !== -1) {
            return update(element, name, oldValue, value);
        }
    }
}
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
function removeAttribute(element, name) {
    if (element.node) {
        var node = element.node;
        var oldValue = node.getAttribute(name);
        node.removeAttribute(name);
        var attrs = element.constructor.observedAttributes || [];
        if (attrs.indexOf(name) !== -1) {
            return update(element, name, oldValue, null);
        }
    }
}

var DOM_HELPERS = Object.freeze({
	getComponent: getComponent,
	isComponent: isComponent,
	connect: connect,
	disconnect: disconnect,
	update: update,
	bind: bind,
	createElement: createElement,
	appendChild: appendChild,
	removeChild: removeChild,
	insertBefore: insertBefore,
	replaceChild: replaceChild,
	setAttribute: setAttribute,
	removeAttribute: removeAttribute
});

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
function shim(Original) {
    var Polyfilled = function Polyfilled() {
        classCallCheck(this, Polyfilled);

        if (!isNew(this)) {
            return this;
        }
        var desc = registry.getDescriptor(this.constructor);
        var config = desc.config;
        // Find the tagname of the constructor and create a new element with it
        var element = document.createElement(config.extends ? config.extends : desc.is);
        element.__proto__ = desc.Ctr.prototype;
        if (config.extends) {
            element.setAttribute('is', desc.is);
        }
        return element;
    };
    // Clone the prototype overriding the constructor.


    Polyfilled.prototype = Object.create(Original.prototype, {
        constructor: {
            value: Polyfilled,
            configurable: true,
            writable: true
        }
    });
    return Polyfilled;
}

/**
 * A set of DOM helpers for callbacks trigger when Custom Elements
 * are not supported by the browser.
 * @name DOM
 * @namespace DOM
 * @memberof! DNA.
 * @static
 */
var DOM = DOM_HELPERS;
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

/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements specs.
 */
/**
 * Register a new component.
 * @method define
 * @memberof! DNA.
 * @static
 *
 * @param {String} name The id of the component.
 * @param {Function} Ctr The component constructor.
 * @param {Object} config Optional component configuration.
 */
function define$1(tagName, Component, config) {
  return registry.define(tagName, Component, config);
}
/**
 * Create and append a new component instance.
 * @method render
 * @memberof! DNA.
 * @static
 *
 * @param {HTMLElement} node The parent node.
 * @param {Function} Component The component constructor.
 * @param {Object} props Optional set of properties to set to the component.
 * @return {HTMLElement} The new component instance.
 */
function render$1(node, Component, props) {
  var element = new Component();
  for (var k in props) {
    element[k] = props[k];
  }
  DOM.appendChild(node, element);
  return element;
}

/**
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
 * @extends HTMLElement
 * @memberof DNA.
 * @static
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   static get observedAttributes() {
 *     return ['...', '...'];
 *   }
 *   get css() {
 *     return '...';
 *   }
 *   get events() {
 *     return {
 *       '...': '...'
 *     };
 *   }
 *   get template() {
 *     return '...';
 *   }
 *   get properties() {
 *     return { ... };
 *   }
 * }
 * ```
 */
var BaseComponent = function (_mix$with) {
  inherits(BaseComponent, _mix$with);

  function BaseComponent() {
    classCallCheck(this, BaseComponent);
    return possibleConstructorReturn(this, _mix$with.apply(this, arguments));
  }

  return BaseComponent;
}(mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin, MIXINS.StyleMixin, MIXINS.EventsMixin, MIXINS.TemplateMixin));

var __cov_WgHI41MWXWdfHXwNkAhVzw = Function('return this')();
if (!__cov_WgHI41MWXWdfHXwNkAhVzw.__coverage__) {
   __cov_WgHI41MWXWdfHXwNkAhVzw.__coverage__ = {};
}
__cov_WgHI41MWXWdfHXwNkAhVzw = __cov_WgHI41MWXWdfHXwNkAhVzw.__coverage__;
if (!__cov_WgHI41MWXWdfHXwNkAhVzw['/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/observer.js']) {
   __cov_WgHI41MWXWdfHXwNkAhVzw['/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/observer.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/observer.js", "s": { "1": 1, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0, "24": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0], "7": [0, 0] }, "f": { "1": 0 }, "fnMap": { "1": { "name": "onCreation", "line": 3, "loc": { "start": { "line": 3, "column": 0 }, "end": { "line": 3, "column": 27 } } } }, "statementMap": { "1": { "start": { "line": 3, "column": 0 }, "end": { "line": 16, "column": 1 } }, "2": { "start": { "line": 4, "column": 4 }, "end": { "line": 15, "column": 7 } }, "3": { "start": { "line": 5, "column": 8 }, "end": { "line": 11, "column": 9 } }, "4": { "start": { "line": 6, "column": 12 }, "end": { "line": 8, "column": 13 } }, "5": { "start": { "line": 7, "column": 16 }, "end": { "line": 7, "column": 34 } }, "6": { "start": { "line": 10, "column": 12 }, "end": { "line": 10, "column": 30 } }, "7": { "start": { "line": 12, "column": 8 }, "end": { "line": 14, "column": 9 } }, "8": { "start": { "line": 13, "column": 12 }, "end": { "line": 13, "column": 38 } }, "9": { "start": { "line": 18, "column": 0 }, "end": { "line": 48, "column": 3 } }, "10": { "start": { "line": 19, "column": 4 }, "end": { "line": 47, "column": 7 } }, "11": { "start": { "line": 20, "column": 8 }, "end": { "line": 46, "column": 9 } }, "12": { "start": { "line": 22, "column": 12 }, "end": { "line": 24, "column": 13 } }, "13": { "start": { "line": 23, "column": 16 }, "end": { "line": 23, "column": 48 } }, "14": { "start": { "line": 25, "column": 12 }, "end": { "line": 29, "column": 13 } }, "15": { "start": { "line": 26, "column": 16 }, "end": { "line": 28, "column": 19 } }, "16": { "start": { "line": 27, "column": 20 }, "end": { "line": 27, "column": 41 } }, "17": { "start": { "line": 30, "column": 12 }, "end": { "line": 30, "column": 18 } }, "18": { "start": { "line": 33, "column": 12 }, "end": { "line": 33, "column": 55 } }, "19": { "start": { "line": 34, "column": 12 }, "end": { "line": 36, "column": 13 } }, "20": { "start": { "line": 35, "column": 16 }, "end": { "line": 35, "column": 22 } }, "21": { "start": { "line": 37, "column": 12 }, "end": { "line": 37, "column": 39 } }, "22": { "start": { "line": 38, "column": 12 }, "end": { "line": 43, "column": 14 } }, "23": { "start": { "line": 44, "column": 12 }, "end": { "line": 44, "column": 18 } }, "24": { "start": { "line": 50, "column": 0 }, "end": { "line": 54, "column": 3 } } }, "branchMap": { "1": { "line": 5, "type": "if", "locations": [{ "start": { "line": 5, "column": 8 }, "end": { "line": 5, "column": 8 } }, { "start": { "line": 5, "column": 8 }, "end": { "line": 5, "column": 8 } }] }, "2": { "line": 6, "type": "if", "locations": [{ "start": { "line": 6, "column": 12 }, "end": { "line": 6, "column": 12 } }, { "start": { "line": 6, "column": 12 }, "end": { "line": 6, "column": 12 } }] }, "3": { "line": 12, "type": "if", "locations": [{ "start": { "line": 12, "column": 8 }, "end": { "line": 12, "column": 8 } }, { "start": { "line": 12, "column": 8 }, "end": { "line": 12, "column": 8 } }] }, "4": { "line": 20, "type": "switch", "locations": [{ "start": { "line": 21, "column": 8 }, "end": { "line": 31, "column": 9 } }, { "start": { "line": 32, "column": 8 }, "end": { "line": 45, "column": 9 } }] }, "5": { "line": 22, "type": "if", "locations": [{ "start": { "line": 22, "column": 12 }, "end": { "line": 22, "column": 12 } }, { "start": { "line": 22, "column": 12 }, "end": { "line": 22, "column": 12 } }] }, "6": { "line": 25, "type": "if", "locations": [{ "start": { "line": 25, "column": 12 }, "end": { "line": 25, "column": 12 } }, { "start": { "line": 25, "column": 12 }, "end": { "line": 25, "column": 12 } }] }, "7": { "line": 34, "type": "if", "locations": [{ "start": { "line": 34, "column": 12 }, "end": { "line": 34, "column": 12 } }, { "start": { "line": 34, "column": 12 }, "end": { "line": 34, "column": 12 } }] } } };
}
__cov_WgHI41MWXWdfHXwNkAhVzw = __cov_WgHI41MWXWdfHXwNkAhVzw['/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/observer.js'];
function onCreation(nodes) {
   __cov_WgHI41MWXWdfHXwNkAhVzw.f['1']++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['2']++;[].forEach.call(nodes, function (node) {
      __cov_WgHI41MWXWdfHXwNkAhVzw.s['3']++;if (!node.is) {
         __cov_WgHI41MWXWdfHXwNkAhVzw.b['1'][0]++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['4']++;if (DOM.bind(node)) {
            __cov_WgHI41MWXWdfHXwNkAhVzw.b['2'][0]++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['5']++;DOM.connect(node);
         } else {
            __cov_WgHI41MWXWdfHXwNkAhVzw.b['2'][1]++;
         }
      } else {
         __cov_WgHI41MWXWdfHXwNkAhVzw.b['1'][1]++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['6']++;DOM.connect(node);
      }__cov_WgHI41MWXWdfHXwNkAhVzw.s['7']++;if (node.children) {
         __cov_WgHI41MWXWdfHXwNkAhVzw.b['3'][0]++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['8']++;onCreation(node.children);
      } else {
         __cov_WgHI41MWXWdfHXwNkAhVzw.b['3'][1]++;
      }
   });
}__cov_WgHI41MWXWdfHXwNkAhVzw.s['9']++;var OBSERVER = new MutationObserver(function (mutations) {
   __cov_WgHI41MWXWdfHXwNkAhVzw.s['10']++;mutations.forEach(function (mutation) {
      __cov_WgHI41MWXWdfHXwNkAhVzw.s['11']++;switch (mutation.type) {case 'childList':
            __cov_WgHI41MWXWdfHXwNkAhVzw.b['4'][0]++;{
               __cov_WgHI41MWXWdfHXwNkAhVzw.s['12']++;if (mutation.addedNodes) {
                  __cov_WgHI41MWXWdfHXwNkAhVzw.b['5'][0]++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['13']++;onCreation(mutation.addedNodes);
               } else {
                  __cov_WgHI41MWXWdfHXwNkAhVzw.b['5'][1]++;
               }__cov_WgHI41MWXWdfHXwNkAhVzw.s['14']++;if (mutation.removedNodes) {
                  __cov_WgHI41MWXWdfHXwNkAhVzw.b['6'][0]++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['15']++;mutation.removedNodes.forEach(function (node) {
                     __cov_WgHI41MWXWdfHXwNkAhVzw.s['16']++;DOM.disconnect(node);
                  });
               } else {
                  __cov_WgHI41MWXWdfHXwNkAhVzw.b['6'][1]++;
               }__cov_WgHI41MWXWdfHXwNkAhVzw.s['17']++;break;
            }case 'attributes':
            __cov_WgHI41MWXWdfHXwNkAhVzw.b['4'][1]++;{
               __cov_WgHI41MWXWdfHXwNkAhVzw.s['18']++;var attributeName = mutation.attributeName;__cov_WgHI41MWXWdfHXwNkAhVzw.s['19']++;if (attributeName === 'is') {
                  __cov_WgHI41MWXWdfHXwNkAhVzw.b['7'][0]++;__cov_WgHI41MWXWdfHXwNkAhVzw.s['20']++;break;
               } else {
                  __cov_WgHI41MWXWdfHXwNkAhVzw.b['7'][1]++;
               }__cov_WgHI41MWXWdfHXwNkAhVzw.s['21']++;var node = mutation.target;__cov_WgHI41MWXWdfHXwNkAhVzw.s['22']++;DOM.update(node, attributeName, mutation.oldValue, node.getAttribute(attributeName));__cov_WgHI41MWXWdfHXwNkAhVzw.s['23']++;break;
            }}
   });
});__cov_WgHI41MWXWdfHXwNkAhVzw.s['24']++;OBSERVER.observe(document.body, { attributes: true, childList: true, subtree: true });

var __cov_I4YfaAjATzkYB3taa0jcDg = Function('return this')();
if (!__cov_I4YfaAjATzkYB3taa0jcDg.__coverage__) {
   __cov_I4YfaAjATzkYB3taa0jcDg.__coverage__ = {};
}
__cov_I4YfaAjATzkYB3taa0jcDg = __cov_I4YfaAjATzkYB3taa0jcDg.__coverage__;
if (!__cov_I4YfaAjATzkYB3taa0jcDg['/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/index.js']) {
   __cov_I4YfaAjATzkYB3taa0jcDg['/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/index.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/index.js", "s": {}, "b": {}, "f": {}, "fnMap": {}, "statementMap": {}, "branchMap": {} };
}
__cov_I4YfaAjATzkYB3taa0jcDg = __cov_I4YfaAjATzkYB3taa0jcDg['/Users/edoardo/Development/dna/dna-components/packages/dna-mutation/index.js'];

exports.mix = mix;
exports.prop = prop;
exports.shim = shim;
exports.DOM = DOM;
exports.MIXINS = MIXINS;
exports.registry = registry;
exports.define = define$1;
exports.render = render$1;
exports.BaseComponent = BaseComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi90eXBlb2YuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvcmVnaXN0cnkuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3ltYm9scy5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9kb20uanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvY29tcG9uZW50LmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9kaXNwYXRjaC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9wcm9wZXJ0eS5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL21peGlucy9wcm9wZXJ0aWVzLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL3BvbHlmaWxscy9tYXRjaGVzLmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbWl4aW5zL2V2ZW50cy1jb21wb25lbnQuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3R5bGUuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvc3R5bGUtY29tcG9uZW50LmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbWl4aW5zL3RlbXBsYXRlLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL3BvbHlmaWxscy9yZWR1Y2UuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvbWl4aW5zLmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbGliL3NoaW0uanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9jb3JlLmpzIiwiL1VzZXJzL2Vkb2FyZG8vRGV2ZWxvcG1lbnQvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGEgZnVuY3Rpb24uXG4gKiBAbWV0aG9kIGlzRnVuY3Rpb25cbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhbiB2YWx1ZSBpcyBhIHN0cmluZy5cbiAqIEBtZXRob2QgaXNTdHJpbmdcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZyc7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGFuIG9iamVjdC5cbiAqIEBtZXRob2QgaXNPYmplY3RcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhbiB2YWx1ZSBpcyB1bmRlZmluZWQuXG4gKiBAbWV0aG9kIGlzVW5kZWZpbmVkXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0geyp9IG9iaiBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhbiB2YWx1ZSBpcyBhbiBhcnJheS5cbiAqIEBtZXRob2QgaXNBcnJheVxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbn1cbiIsImltcG9ydCB7IGlzRnVuY3Rpb24sIGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuXG4vKipcbiAqIEEgY3VzdG9tIGNvbXBvbmVudHMgcmVnaXN0cnkuXG4gKiBJdCByZXBsaWNhdGVzIHRoZSBbQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5IGludGVyZmFjZV0oaHR0cHM6Ly93d3cudzMub3JnL1RSL2N1c3RvbS1lbGVtZW50cy8jY3VzdG9tLWVsZW1lbnRzLWFwaSkuXG4gKiBAbmFtZSByZWdpc3RyeVxuICogQG5hbWVzcGFjZSByZWdpc3RyeVxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKi9cbmV4cG9ydCBjb25zdCByZWdpc3RyeSA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBkZWZpbmVkIGNvbXBvbmVudHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb21wb25lbnRzOiB7fSxcbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhIG5ldyBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGlkIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RyIFRoZSBjb21wb25lbnQgY29uc3RydWN0b3IuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBPcHRpb25hbCBjb21wb25lbnQgY29uZmlndXJhdGlvbi5cbiAgICAgKi9cbiAgICBkZWZpbmUobmFtZSwgQ3RyLCBjb25maWcgPSB7fSkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IHtcbiAgICAgICAgICAgIGlzOiBuYW1lLFxuICAgICAgICAgICAgQ3RyLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSBjb21wb25lbnQgZGVzY3JpcHRvciBieSBpZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBjb21wb25lbnQgaWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY29tcG9uZW50IGRlc2NyaXB0b3IuXG4gICAgICovXG4gICAgZ2V0RGVzY3JpcHRvcihuYW1lKSB7XG4gICAgICAgIGlmIChpc1N0cmluZyhuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50c1tuYW1lLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24obmFtZSkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5jb21wb25lbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRlc2MgPSB0aGlzLmNvbXBvbmVudHNba107XG4gICAgICAgICAgICAgICAgaWYgKGRlc2MuQ3RyID09PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSBjb21wb25lbnQgY29uc3RydWN0b3IgYnkgaWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGNvbXBvbmVudCBpZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGNvbXBvbmVudCBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBnZXQobmFtZSkge1xuICAgICAgICBsZXQgZGVzYyA9IHRoaXMuZ2V0RGVzY3JpcHRvcihuYW1lKTtcbiAgICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXNjLkN0cjtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuIiwiZXhwb3J0IGNvbnN0IENPTVBPTkVOVF9TWU1CT0wgPSAnX19jb21wb25lbnQnO1xuIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdHlwZW9mLmpzJztcbmltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBDT01QT05FTlRfU1lNQk9MIH0gZnJvbSAnLi9zeW1ib2xzLmpzJztcblxuLyoqXG4gKiBUaGUgYGNvbm5lY3RlZENhbGxiYWNrYCBuYW1lLlxuICogQHByaXZhdGVcbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHNlZSBbVzNDIHNwZWNdKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jdXN0b20tZWxlbWVudHMvI2N1c3RvbS1lbGVtZW50LXJlYWN0aW9ucylcbiAqL1xuY29uc3QgQ09OTkVDVEVEID0gJ2Nvbm5lY3RlZENhbGxiYWNrJztcbi8qKlxuICogVGhlIGBkaXNjb25uZWN0ZWRDYWxsYmFja2AgbmFtZS5cbiAqIEBwcml2YXRlXG4gKlxuICogQHR5cGUge1N0cmluZ31cbiAqIEBzZWUgW1czQyBzcGVjXShodHRwczovL3d3dy53My5vcmcvVFIvY3VzdG9tLWVsZW1lbnRzLyNjdXN0b20tZWxlbWVudC1yZWFjdGlvbnMpXG4gKi9cbmNvbnN0IERJU0NPTk5FQ1RFRCA9ICdkaXNjb25uZWN0ZWRDYWxsYmFjayc7XG4vKipcbiAqIFRoZSBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYCBuYW1lLlxuICogQHByaXZhdGVcbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHNlZSBbVzNDIHNwZWNdKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jdXN0b20tZWxlbWVudHMvI2N1c3RvbS1lbGVtZW50LXJlYWN0aW9ucylcbiAqL1xuY29uc3QgVVBEQVRFRCA9ICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snO1xuLyoqXG4gKiBSZXRyaWV2ZSBhIGNvbXBvbmVudCBjb25zdHJ1Y3RvciBmcm9tIGFuIEVsZW1lbnQgb3IgZnJvbSBhIHRhZyBuYW1lLlxuICogQG1ldGhvZCBnZXRDb21wb25lbnRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR8U3RyaW5nfSBlbGVtZW50IFRoZSBlbGVtZW50IG9yIHRoZSB0YWcgbmFtZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZnVsbCBSZXRyaWV2ZSBmdWxsIGNvbXBvbmVudCBpbmZvcm1hdGlvbi5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY29tcG9uZW50IGNvbnN0cnVjdG9yIGZvciB0aGUgZ2l2ZW4gcGFyYW0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnQoZWxlbWVudCwgZnVsbCA9IGZhbHNlKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5ub2RlO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpIHx8IGVsZW1lbnQudGFnTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bGwgPyByZWdpc3RyeS5nZXREZXNjcmlwdG9yKGVsZW1lbnQpIDogcmVnaXN0cnkuZ2V0KGVsZW1lbnQpO1xufVxuLyoqXG4gKiBDaGVjayBpZiBhIG5vZGUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBjb21wb25lbnQuXG4gKiBAbWV0aG9kIGlzQ29tcG9uZW50XG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcG9uZW50KGVsZW1lbnQpIHtcbiAgICBsZXQgQ3RyID0gZ2V0Q29tcG9uZW50KGVsZW1lbnQpO1xuICAgIHJldHVybiBDdHIgJiYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdHIpO1xufVxuLyoqXG4gKiBBbiBoZWxwZXIgZm9yIGR5bmFtaWNhbGx5IHRyaWdnZXIgdGhlIGBjb25uZWN0ZWRDYWxsYmFja2AgcmVhY3Rpb24gb24gY29tcG9uZW50cy5cbiAqIEBtZXRob2QgY29ubmVjdFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgYXR0YWNoZWQgbm9kZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBjYWxsYmFjayBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KGVsZW1lbnQpIHtcbiAgICBpZiAoaXNDb21wb25lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudFtDT05ORUNURURdLmNhbGwoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbi8qKlxuICogQW4gaGVscGVyIGZvciBkeW5hbWljYWxseSB0cmlnZ2VyIHRoZSBgZGlzY29ubmVjdGVkQ2FsbGJhY2tgIHJlYWN0aW9uIG9uIGNvbXBvbmVudHMuXG4gKiBAbWV0aG9kIGRpc2Nvbm5lY3RcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGRldGFjaGVkIG5vZGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgY2FsbGJhY2sgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzY29ubmVjdChlbGVtZW50KSB7XG4gICAgaWYgKGlzQ29tcG9uZW50KGVsZW1lbnQpKSB7XG4gICAgICAgIGVsZW1lbnRbRElTQ09OTkVDVEVEXS5jYWxsKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4vKipcbiAqIEFuIGhlbHBlciBmb3IgZHluYW1pY2FsbHkgdHJpZ2dlciB0aGUgYGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja2AgcmVhY3Rpb24gb24gY29tcG9uZW50cy5cbiAqIEBtZXRob2QgdXBkYXRlXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSB1cGRhdGVkIGVsZW1lbnQuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgY2FsbGJhY2sgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKGVsZW1lbnQsIG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIGlmIChpc0NvbXBvbmVudChlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50W1VQREFURURdLmNhbGwoZWxlbWVudCwgbmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuLyoqXG4gKiBBdHRhY2ggYSBjb21wb25lbnQgcHJvdG90eXBlIHRvIGFuIGFscmVhZHkgaW5zdGFudGlhdGVkIEhUTUxFbGVtZW50LlxuICogQG1ldGhvZCBiaW5kXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgVGhlIG5vZGUgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RyIFRoZSBjb21wb25lbnQgY2xhc3MgdG8gdXNlIChsZWF2ZSBlbXB0eSBmb3IgYXV0byBkZXRlY3QpLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIHByb3RvdHlwZSBoYXMgYmVlbiBhdHRhY2hlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmQobm9kZSwgQ3RyKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKEN0cikpIHtcbiAgICAgICAgQ3RyID0gZ2V0Q29tcG9uZW50KG5vZGUpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdGlvbihDdHIpKSB7XG4gICAgICAgIG5vZGUuX19wcm90b19fID0gQ3RyLnByb3RvdHlwZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgICAgICAgIHZhbHVlOiBDdHIsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIEN0ci5jYWxsKG5vZGUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBDcmVhdGUgYSBjb21wb25lbnQgaW5zdGFuY2UuXG4gKiBAbWV0aG9kIGNyZWF0ZUVsZW1lbnRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlzIFRoZSBjb21wb25lbnQgdGFnIG5hbWUuXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gVGhlIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoaXMpIHtcbiAgICBsZXQgQ3RyID0gZ2V0Q29tcG9uZW50KGlzKTtcbiAgICBpZiAoQ3RyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3RyKCk7XG4gICAgfVxufVxuLyoqXG4gKiBEeW5hbWljYWxseSBhcHBlbmQgYSBub2RlIGFuZCBjYWxsIHRoZSBgY29ubmVjdGVkQ2FsbGJhY2tgLlxuICogLSBkaXNjb25uZWN0IHRoZSBub2RlIGlmIGFscmVhZHkgaW4gdGhlIHRyZWVcbiAqIC0gY29ubmVjdCB0aGUgbm9kZSBhZnRlciB0aGUgaW5zZXJ0aW9uXG4gKiBAbWV0aG9kIGFwcGVuZENoaWxkXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBhcHBlbmQuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiBhcHBlbmRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZENoaWxkKHBhcmVudCwgZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50Lm5vZGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlbGVtZW50Lm5vZGU7XG4gICAgICAgIGlmIChwYXJlbnQgIT09IG5vZGUucGFyZW50Tm9kZSB8fCBwYXJlbnQubGFzdEVsZW1lbnRDaGlsZCAhPT0gbm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUNoaWxkKG5vZGUucGFyZW50Tm9kZSwgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHJlbW92ZSBhIG5vZGUgYW5kIGNhbGwgdGhlIGBkaXNjb25uZWN0ZWRDYWxsYmFja2AuXG4gKiBAbWV0aG9kIHJlbW92ZUNoaWxkXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byByZW1vdmUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQ2hpbGQocGFyZW50LCBlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5ub2RlKTtcbiAgICAgICAgcmV0dXJuIGRpc2Nvbm5lY3QoZWxlbWVudCk7XG4gICAgfVxufVxuLyoqXG4gKiBEeW5hbWljYWxseSBpbnNlcnQgYSBub2RlIGJlZm9yZSBhbm90aGVyIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogLSBkaXNjb25uZWN0IHRoZSBub2RlIGlmIGFscmVhZHkgaW4gdGhlIHRyZWVcbiAqIC0gY29ubmVjdCB0aGUgbm9kZSBhZnRlciB0aGUgaW5zZXJ0aW9uXG4gKiBAbWV0aG9kIGluc2VydEJlZm9yZVxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnQgVGhlIHBhcmVudCBlbGVtZW50LlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmTm9kZSBUaGUgbm9kZSBmb3IgcG9zaXRpb25pbmcuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiBhcHBlbmRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEJlZm9yZShwYXJlbnQsIGVsZW1lbnQsIHJlZk5vZGUpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGxldCBub2RlID0gZWxlbWVudC5ub2RlO1xuICAgICAgICBpZiAobm9kZS5uZXh0U2libGluZyAhPT0gcmVmTm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGRpc2Nvbm5lY3QoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHJlZk5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbm5lY3QoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHJlcGxhY2UgYSBub2RlIHdpdGggYW5vdGhlciBhbmQgY2FsbCBhbGwgdGhlIHJlYWN0aW9ucy5cbiAqIC0gZGlzY29ubmVjdCB0aGUgbm9kZSBpZiBhbHJlYWR5IGluIHRoZSB0cmVlXG4gKiAtIGRpc2Nvbm5lY3QgdGhlIHJlcGxhY2VkIG5vZGVcbiAqIC0gY29ubmVjdCB0aGUgZmlyc3Qgbm9kZSBhZnRlciB0aGUgaW5zZXJ0aW9uXG4gKiBAbWV0aG9kIHJlcGxhY2VDaGlsZFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnQgVGhlIHBhcmVudCBlbGVtZW50LlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmTm9kZSBUaGUgbm9kZSB0byByZXBsYWNlLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIG5vZGUgaGFzIGJlZW4gYXBwZW5kZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlQ2hpbGQocGFyZW50LCBlbGVtZW50LCByZWZOb2RlKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgZGlzY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKG5vZGUsIHJlZk5vZGUpO1xuICAgICAgICBpZiAocmVmTm9kZVtDT01QT05FTlRfU1lNQk9MXSkge1xuICAgICAgICAgICAgZGlzY29ubmVjdChyZWZOb2RlW0NPTVBPTkVOVF9TWU1CT0xdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ubmVjdChub2RlKTtcbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHVwZGF0ZSBhIG5vZGUgYXR0cmlidXRlIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogQG1ldGhvZCBzZXRBdHRyaWJ1dGVcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGF0dHJpYnV0ZSBuYW1lLlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiB1cGRhdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0QXR0cmlidXRlKGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgbGV0IGF0dHJzID0gZWxlbWVudC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGlmIChhdHRycy5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShlbGVtZW50LCBuYW1lLCBvbGRWYWx1ZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBEeW5hbWljYWxseSByZW1vdmUgYSBub2RlIGF0dHJpYnV0ZSBhbmQgY2FsbCBhbGwgdGhlIHJlYWN0aW9ucy5cbiAqIEBtZXRob2QgcmVtb3ZlQXR0cmlidXRlXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBhdHRyaWJ1dGUgbmFtZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIHVwZGF0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBdHRyaWJ1dGUoZWxlbWVudCwgbmFtZSkge1xuICAgIGlmIChlbGVtZW50Lm5vZGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlbGVtZW50Lm5vZGU7XG4gICAgICAgIGxldCBvbGRWYWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgbGV0IGF0dHJzID0gZWxlbWVudC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGlmIChhdHRycy5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShlbGVtZW50LCBuYW1lLCBvbGRWYWx1ZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDT01QT05FTlRfU1lNQk9MIH0gZnJvbSAnLi4vbGliL3N5bWJvbHMuanMnO1xuXG4vKipcbiAqIFRIZSBiYXNlIGN1c3RvbSBjb21wb25lbnQgbWl4aW5zLiBKdXN0IGFkZCBsaWZlIGN5Y2xlcyBjYWxsYmFjayBhbmQgYGlzYCBnZXR0ZXIuXG4gKiBAbWl4aW4gQ29tcG9uZW50TWl4aW5cbiAqIEBtZW1iZXJvZiBETkEuTUlYSU5TXG4gKiBAc3RhdGljXG4gKi9cbmV4cG9ydCBjb25zdCBDb21wb25lbnRNaXhpbiA9IChTdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpcyBHZXQgY29tcG9uZW50IGlkLlxuICAgICAqIEBuYW1lIGlzXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Db21wb25lbnRNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGdldCBpcygpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmdldEF0dHJpYnV0ZSgnaXMnKSB8fCB0aGlzLmxvY2FsTmFtZSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gbm9kZSBHZXQgY29tcG9uZW50IG5vZGUgcmVmZXJlbmNlLlxuICAgICAqIEBuYW1lIG5vZGVcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuQ29tcG9uZW50TWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBnZXQgbm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gYW4gaW5zdGFuY2Ugd2FzIGluc2VydGVkIGludG8gdGhlIGRvY3VtZW50LlxuICAgICAqIEBtZXRob2QgY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Db21wb25lbnRNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLm5vZGVbQ09NUE9ORU5UX1NZTUJPTF0gPSB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIGFuIGluc3RhbmNlIHdhcyBkZXRhY2hlZCBmcm9tIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAbWV0aG9kIGRpc2Nvbm5lY3RlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuQ29tcG9uZW50TWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiBhbiBhdHRyaWJ1dGUgd2FzIGFkZGVkLCByZW1vdmVkLCBvciB1cGRhdGVkLlxuICAgICAqIEBtZXRob2QgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuQ29tcG9uZW50TWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyTmFtZSBUaGUgY2hhbmdlZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb2xkVmFsIFRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGJlZm9yZSB0aGUgY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuZXdWYWwgVGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgYWZ0ZXIgdGhlIGNoYW5nZS5cbiAgICAgKi9cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soKSB7fVxufTtcbiIsImxldCBDdXN0b21FdmVudDtcblxudHJ5IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBsZXQgZXYgPSBuZXcgc2VsZi5DdXN0b21FdmVudCgndGVzdCcpO1xuICAgIEN1c3RvbUV2ZW50ID0gc2VsZi5DdXN0b21FdmVudDtcbn0gY2F0Y2goZXgpIHtcbiAgICBDdXN0b21FdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtcbiAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkZXRhaWw6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgICAgICByZXR1cm4gZXZ0O1xuICAgIH07XG4gICAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gc2VsZi5DdXN0b21FdmVudC5wcm90b3R5cGU7XG59XG5cbmV4cG9ydCB7IEN1c3RvbUV2ZW50IH07XG4iLCJpbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4vdHlwZW9mLmpzJztcbmltcG9ydCB7IEN1c3RvbUV2ZW50IH0gZnJvbSAnLi4vcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyc7XG5cbi8qKlxuICogVHJpZ2dlciBhIGN1c3RvbSBET00gRXZlbnQuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBUaGUgZXZlbnQgdGFyZ2V0LlxuICogQHBhcmFtIHtTdHJpbmd9IGV2TmFtZSBUaGUgY3VzdG9tIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBFeHRyYSBkYXRhIHRvIHBhc3MgdG8gdGhlIGV2ZW50LlxuICogQHBhcmFtIHtCb29sZWFufSBidWJibGVzIEVuYWJsZSBldmVudCBidWJibGluZy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FuY2VsYWJsZSBNYWtlIGV2ZW50IGNhbmNlbGFibGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIGV2ZW50IHByb3BhZ2F0aW9uIGhhcyBub3QgYmUgc3RvcHBlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGV2TmFtZSwgZGF0YSwgYnViYmxlcyA9IHRydWUsIGNhbmNlbGFibGUgPSB0cnVlKSB7XG4gICAgaWYgKCFpc1N0cmluZyhldk5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V2ZW50IG5hbWUgaXMgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIGxldCBldiA9IG5ldyBDdXN0b21FdmVudChldk5hbWUsIHtcbiAgICAgICAgZGV0YWlsOiBkYXRhLFxuICAgICAgICBidWJibGVzLFxuICAgICAgICBjYW5jZWxhYmxlLFxuICAgIH0pO1xuICAgIHJldHVybiBub2RlLmRpc3BhdGNoRXZlbnQoZXYpO1xufVxuIiwiaW1wb3J0IHsgaXNVbmRlZmluZWQsIGlzRnVuY3Rpb24sIGlzQXJyYXksIGlzT2JqZWN0LCBpc1N0cmluZyB9IGZyb20gJy4vdHlwZW9mLmpzJztcblxuLyoqXG4gKiBTaG9ydGN1dCB0byBgT2JqZWN0LmRlZmluZVByb3BlcnR5YC5cbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGRlZmluZSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuLyoqXG4gKiBQb3dlciB0byB0aGUgY29tcG9uZW50J3MgcHJvcGVydGllcy5cbiAqIFR5cGUgY2hlY2tpbmcsIHZhbGlkYXRpb24sIGNhbGxiYWNrcywgZXZlbnRzIGFuZCBhdHRyaWJ1dGUgc3luY2luZy5cbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFByb3BlcnR5IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBQcm9wZXJ0eSBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufEFycmF5fSBBIHNpbmdsZSBvciBhIGxpc3Qgb2YgdmFsaWQgY29uc3RydWN0b3JzIGZvciB0aGUgcHJvcGVydHkgdmFsdWUuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY3Rycykge1xuICAgICAgICB0aGlzLl8gPSBbXTtcbiAgICAgICAgY3RycyA9IGN0cnMgfHwgW107XG4gICAgICAgIGlmICghaXNBcnJheShjdHJzKSkge1xuICAgICAgICAgICAgY3RycyA9IFtjdHJzXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0cnMgPSBjdHJzO1xuICAgICAgICB0aGlzLnZhbGlkYXRvciA9ICgpID0+IHRydWU7XG4gICAgICAgIHRoaXMuX3NldHRlciA9ICh2YWwpID0+IHZhbDtcbiAgICAgICAgdGhpcy5nZXR0ZXJGbiA9ICgpID0+IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0dGVyRm4gPSAodmFsKSA9PiB7XG4gICAgICAgICAgICB2YWwgPSB0aGlzLl9zZXR0ZXIodmFsKTtcbiAgICAgICAgICAgIGlmICgodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVUeXBlKHZhbCkgJiYgdGhpcy52YWxpZGF0b3IodmFsKSkge1xuICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkKHZhbCwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYEludmFsaWQgXFxgJHt2YWx9XFxgIHZhbHVlIGZvciBcXGAke3RoaXMubmFtZX1cXGAgcHJvcGVydHkgZm9yIFxcYCR7dGhpcy5zY29wZS5pc31cXGAuYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNhbGxiYWNrIHdoZW4gdGhlIHByb3BlcnR5IGNoYW5nZXMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHRyaWdnZXIuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgb2JzZXJ2ZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykgfHwgaXNTdHJpbmcoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICB0aGlzLl8ucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNhbGxiYWNrIG9uIHByb3BlcnR5IGNoYW5nZXMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICB1bm9ic2VydmUoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGlvID0gdGhpcy5fLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICBpZiAoaW8gIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl8uc3BsaWNlKGlvLCAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBjYWxsYmFja3MgYWZ0ZXIgYSBjaGFuZ2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IG5ld1ZhbHVlIFRoZSBjdXJyZW50IHByb3BlcnR5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7Kn0gb2xkVmFsdWUgVGhlIHByZXZpb3VzIHByb3BlcnR5IHZhbHVlLlxuICAgICAqL1xuICAgIGNoYW5nZWQobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLl8ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjbGIgPSB0aGlzLl9baV07XG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcoY2xiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGVbY2xiXS5jYWxsKHRoaXMuc2NvcGUsIHRoaXMsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsYih0aGlzLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgcHJvcGVydHkgYWNjZXB0cyBhIGdpdmVuIHR5cGUgYXMgdmFsdWUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RyIFRoZSBjb25zdHJ1Y3RvciBmb3IgdGhlIGdpdmVuIHR5cGUuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBhY2NlcHRzKEN0cikge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHJzLmluZGV4T2YoQ3RyKSAhPT0gLTE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcHJvcGVydHkgbmFtZS5cbiAgICAgKiBJdCBhbHNvIHNldCB0aGUgYXR0ck5hbWUgaWYgYC5hdHRyaWJ1dGVgIG1ldGhvZCBhcyBiZWVuIHByZXZpb3VzbHlcbiAgICAgKiBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBwcm9wZXJ0eSBuYW1lLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIG5hbWVkKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgaWYgKHRoaXMuYXR0clJlcXVlc3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5hdHRyTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBwcm9wZXJ0eSBpbml0aWFsIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7Kn0gaW5pdFZhbHVlIFRoZSBwcm9wZXJ0eSBpbml0aWFsIHZhbHVlLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGRlZmF1bHQoaW5pdFZhbHVlKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gaXNPYmplY3QoaW5pdFZhbHVlKSA/XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKGluaXRWYWx1ZSkgOlxuICAgICAgICAgICAgaW5pdFZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBhdHRyaWJ1dGUgbmFtZSB0byBzeW5jLlxuICAgICAqIEludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGl0IHJldHJpZXZlIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ck5hbWUgVGhlIGF0dHJpYnV0ZSBuYW1lLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGF0dHJpYnV0ZShhdHRyTmFtZSA9IHRydWUpIHtcbiAgICAgICAgaWYgKGlzU3RyaW5nKGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5hdHRyUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmF0dHJOYW1lID0gYXR0ck5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJSZXF1ZXN0ZWQgPSAhIWF0dHJOYW1lO1xuICAgICAgICAgICAgdGhpcy5hdHRyTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkIGEgRE9NIGV2ZW50IG5hbWUgdG8gZGlzcGF0Y2ggb24gY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZOYW1lIFRoZSBldmVudCBuYW1lLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGRpc3BhdGNoKGV2TmFtZSkge1xuICAgICAgICB0aGlzLmV2ZW50TmFtZSA9IGV2TmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhIGdldHRlciBmdW5jdGlvbiBmb3IgdGhlIHByb3BlcnR5LlxuICAgICAqIEJ5IGRlZmF1bHQsIHRoZSBwcm9wZXJ0eSB2YWx1ZSB3aWxsIGJlIHJldHVybi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgcHJvcGVydHkgZ2V0dGVyLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGdldHRlcihjYWxsYmFjaykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVyRm4gPSAoKSA9PiBjYWxsYmFjayh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGEgc2V0dGVyIGZ1bmN0aW9uIGZvciB0aGUgcHJvcGVydHkuXG4gICAgICogQnkgZGVmYXVsdCwgdGhlIHByb3BlcnR5IHZhbHVlIHdpbGwgYmUgdXBkYXRlZCB3aXRoIGdpdmVuIHZhbHVlXG4gICAgICogd2l0aG91dCBhbnkgbW9kaWZpY2F0aW9uLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBwcm9wZXJ0eSBzZXR0ZXIuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgc2V0dGVyKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0dGVyID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcHJvcGVydHkgdmFsaWRhdG9yLlxuICAgICAqIEEgdmFsaWRhdG9yIHNob3VsZCByZXR1cm4gYHRydWVgIGlmIHRoZSB2YWx1ZSBpcyBhY2NlcHRhYmxlXG4gICAgICogb3IgYGZhbHNlYCBpZiB1bmFjY2FwdGFibGUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIHByb3BlcnR5IHZhbGlkdG9yLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHZhbGlkYXRlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0b3IgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGEgdmFsaWQgdHlwZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHZhbGlkYXRlVHlwZSh2YWwpIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgY3RycyA9IHRoaXMuY3RycztcbiAgICAgICAgaWYgKGN0cnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoaSA8IGN0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgY3Ryc1tpXSB8fCAoXG4gICAgICAgICAgICAgICAgdmFsLmNvbnN0cnVjdG9yICYmIHZhbC5jb25zdHJ1Y3RvciA9PT0gY3Ryc1tpXVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoIHRoZSBwcm9wZXJ0eSB0byBhIHNjb3BlIChhIGNvbXBvbmVudCBpbnN0YW5jZSkuXG4gICAgICogU2V0IHRoZSBkZWZhdWx0IHZhbHVlIGlmIHByb3ZpZGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZSBUaGUgc2NvcGUgd2hpY2ggbmVlZHMgdG8gYmUgYm91bmQgd2l0aCB0aGUgcHJvcGVydHkuXG4gICAgICovXG4gICAgaW5pdChzY29wZSkge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgICAgIGRlZmluZShzY29wZSwgdGhpcy5uYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IHRoaXMuZ2V0dGVyRm4uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHNldDogdGhpcy5zZXR0ZXJGbi5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNjb3BlW3RoaXMubmFtZV0gPSB0aGlzLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciBQcm9wZXJ0eSBjcmVhdGlvbi5cbiAqIEBtZXRob2QgcHJvcFxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHByb3BlcnR5IHtQcm9wZXJ0eX0gQU5ZIEEgcHJvcGVydHkgd2l0aG91dCB0eXBlIHZhbGlkYXRpb24uXG4gKiBAcHJvcGVydHkge1Byb3BlcnR5fSBTVFJJTkcgQSBwcm9wZXJ0eSB3aGljaCBhY2NlcHRzIG9ubHkgc3RyaW5ncy5cbiAqIEBwcm9wZXJ0eSB7UHJvcGVydHl9IEJPT0xFQU4gQSBwcm9wZXJ0eSB3aGljaCBhY2NlcHRzIG9ubHkgYm9vbGVhbnMuXG4gKiBAcHJvcGVydHkge1Byb3BlcnR5fSBOVU1CRVIgQSBwcm9wZXJ0eSB3aGljaCBhY2NlcHRzIG9ubHkgbnVtYmVycy5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fEZ1bmN0aW9ufEFycmF5fSBjdHJzIEEgUHJvcGVydHkgdG8gY2xvbmUgb3IgYSBzaW5nbGUgb3IgYSBsaXN0IG9mIHZhbGlkIGNvbnN0cnVjdG9ycyBmb3IgdGhlIHByb3BlcnR5IHZhbHVlLlxuICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBuZXcgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9wKGN0cnMpIHtcbiAgICBpZiAoY3RycyBpbnN0YW5jZW9mIFByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBjdHJzO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb3BlcnR5KGN0cnMpO1xufVxuXG4vLyBEZWZpbmUgc29tZSBoZWxwZXJzIGZvciBkZWZhdWx0IHR5cGVzXG5kZWZpbmUocHJvcCwgJ0FOWScsIHsgZ2V0KCkgeyByZXR1cm4gcHJvcCgpOyB9IH0pO1xuZGVmaW5lKHByb3AsICdTVFJJTkcnLCB7IGdldCgpIHsgcmV0dXJuIHByb3AoU3RyaW5nKTsgfSB9KTtcbmRlZmluZShwcm9wLCAnQk9PTEVBTicsIHsgZ2V0KCkgeyByZXR1cm4gcHJvcChCb29sZWFuKTsgfSB9KTtcbmRlZmluZShwcm9wLCAnTlVNQkVSJywgeyBnZXQoKSB7IHJldHVybiBwcm9wKE51bWJlcik7IH0gfSk7XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vbGliL3R5cGVvZi5qcyc7XG5pbXBvcnQgeyBkaXNwYXRjaCB9IGZyb20gJy4uL2xpYi9kaXNwYXRjaC5qcyc7XG5pbXBvcnQgeyBpc1VuZGVmaW5lZCB9IGZyb20gJy4uL2xpYi90eXBlb2YuanMnO1xuaW1wb3J0IHsgcHJvcCB9IGZyb20gJy4uL2xpYi9wcm9wZXJ0eS5qcyc7XG5cbi8qKlxuICogVHJ5IHRvIHBhcnNlIGF0dHJpYnV0ZSB2YWx1ZSBjaGVja2luZyB0aGUgcHJvcGVydHkgdmFsaWRhdGlvbiB0eXBlcy5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyVmFsIFRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcmV0dXJuIHsqfSBUaGUgcGFyc2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShwcm9wZXJ0eSwgYXR0clZhbCkge1xuICAgIGlmIChhdHRyVmFsID09PSAnJyAmJiBwcm9wZXJ0eS5hY2NlcHRzKEJvb2xlYW4pKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXByb3BlcnR5LmFjY2VwdHMoU3RyaW5nKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYXR0clZhbCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdHRyVmFsO1xufVxuXG4vKipcbiAqIFNldCBhbiBhdHRyaWJ1dGUgdmFsdWUgY2hlY2tpbmcgaXRzIHR5cGUuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRleHQgVGhlIG5vZGUgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlKGNvbnRleHQsIGF0dHIsIHZhbHVlKSB7XG4gICAgbGV0IGN1cnJlbnRBdHRyVmFsdWUgPSBjb250ZXh0LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICBpZiAoY3VycmVudEF0dHJWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgY29udGV4dC5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICAgICAgY29udGV4dC5zZXRBdHRyaWJ1dGUoYXR0ciwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRBdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBDdXN0b20gQ29tcG9uZW50IGZvciBwcm9wZXJ0aWVzIGluaXRpYWxpemF0aW9uIHZpYSBhdHRyaWJ1dGVzLlxuICogQG1peGluIFByb3BlcnRpZXNNaXhpblxuICogQG1lbWJlcm9mIEROQS5NSVhJTlNcbiAqIEBzdGF0aWNcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIG15LWNvbXBvbmVudC5qc1xuICogaW1wb3J0IHsgQmFzZUNvbXBvbmVudCB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICogICBnZXQgcHJvcGVydGllcygpIHtcbiAqICAgICByZXR1cm4geyBuYW1lOiBTdHJpbmcgfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gYXBwLmpzXG4gKiBpbXBvcnQgeyBkZWZpbmUgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gJy4vbXktY29tcG9uZW50LmpzJztcbiAqIGRlZmluZSgnbXktY29tcG9uZW50JywgTXlDb21wb25lbnQpO1xuICogdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAqIHRlbXAuaW5uZXJIVE1MID0gJzxteS1jb21wb25lbnQgbmFtZT1cIkFsYmVydFwiPjwvbXktY29tcG9uZW50Pic7XG4gKiB2YXIgZWxlbWVudCA9IHRlbXAuZmlyc3RDaGlsZDtcbiAqIGNvbnNvbGUubG9nKGVsZW1lbnQubmFtZSk7IC8vIGxvZ3MgXCJBbGJlcnRcIlxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBQcm9wZXJ0aWVzTWl4aW4gPSAoU3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBBdHRhY2ggcHJvcGVydGllcyBvbiBjb21wb25lbnQgY3JlYXRpb24uXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlByb3BlcnRpZXNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgICAgIGlmIChwcm9wcykge1xuICAgICAgICAgICAgaWYgKCFpc0FycmF5KHByb3BzKSkge1xuICAgICAgICAgICAgICAgIHByb3BzID0gW3Byb3BzXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BzID0gcHJvcHMucmVkdWNlKChyZXMsIHBhcnRpYWxQcm9wcykgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgaW4gcGFydGlhbFByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc1trXSA9IHByb3AocGFydGlhbFByb3BzW2tdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdwcm9wZXJ0aWVzJywge1xuICAgICAgICAgICAgdmFsdWU6IHByb3BzLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG9ic2VydmVkID0gdGhpcy5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGZvciAobGV0IGsgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gcHJvcHNba107XG4gICAgICAgICAgICBwcm9wLm5hbWVkKGspLmluaXQodGhpcyk7XG4gICAgICAgICAgICBsZXQgeyBhdHRyTmFtZSwgZXZlbnROYW1lIH0gPSBwcm9wO1xuICAgICAgICAgICAgaWYgKCFhdHRyTmFtZSAmJiBvYnNlcnZlZC5pbmRleE9mKGspICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHByb3AuYXR0cmlidXRlKCk7XG4gICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF0dHJOYW1lIHx8IGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIHByb3Aub2JzZXJ2ZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXR0cmlidXRlKHRoaXMubm9kZSwgYXR0ck5hbWUsIHRoaXNbcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2godGhpcy5ub2RlLCBldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU3luYyBpbml0aWFsIGF0dHJpYnV0ZXMgd2l0aCBwcm9wZXJ0aWVzLlxuICAgICAqIEBtZXRob2QgY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Qcm9wZXJ0aWVzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICBmb3IgKGxldCBrIGluIHByb3BzKSB7XG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BzW2tdO1xuICAgICAgICAgICAgbGV0IHsgYXR0ck5hbWUgfSA9IHByb3A7XG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQodGhpc1twcm9wLm5hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2RlLmhhc0F0dHJpYnV0ZShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcC5uYW1lXSA9IGdldFZhbHVlKHByb3AsIHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEF0dHJpYnV0ZSh0aGlzLm5vZGUsIGF0dHJOYW1lLCB0aGlzW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTeW5jIGF0dHJpYnV0ZXMgd2l0aCBwcm9wZXJ0aWVzLlxuICAgICAqIEBtZXRob2QgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuUHJvcGVydGllc01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ck5hbWUgVGhlIGNoYW5nZWQgYXR0cmlidXRlIG5hbWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9sZFZhbCBUaGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBiZWZvcmUgdGhlIGNoYW5nZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3VmFsIFRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGFmdGVyIHRoZSBjaGFuZ2UuXG4gICAgICovXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHIsIG9sZFZhbCwgbmV3VmFsKSB7XG4gICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBvbGRWYWwsIG5ld1ZhbCk7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMucHJvcGVydGllcztcbiAgICAgICAgZm9yIChsZXQgayBpbiBwcm9wcykge1xuICAgICAgICAgICAgbGV0IHByb3AgPSBwcm9wc1trXTtcbiAgICAgICAgICAgIGlmIChwcm9wLmF0dHJOYW1lID09PSBhdHRyKSB7XG4gICAgICAgICAgICAgICAgdGhpc1twcm9wLm5hbWVdID0gZ2V0VmFsdWUocHJvcCwgbmV3VmFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbGlzdGVuZXIgZm9yIG5vZGUncyBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqIEBtZXRob2Qgb2JzZXJ2ZVByb3BlcnR5XG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuUHJvcGVydGllc01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcE5hbWUgVGhlIHByb3BlcnR5IG5hbWUgdG8gb2JzZXJ2ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gZmlyZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIGBjYW5jZWxgIG1ldGhvZC5cbiAgICAgKi9cbiAgICBvYnNlcnZlUHJvcGVydHkocHJvcE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXNbcHJvcE5hbWVdLm9ic2VydmUoY2FsbGJhY2spO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmb3Igbm9kZSdzIHByb3BlcnR5IGNoYW5nZXMuXG4gICAgICogQG1ldGhvZCB1bm9ic2VydmVQcm9wZXJ0eVxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlByb3BlcnRpZXNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BOYW1lIFRoZSBwcm9wZXJ0eSBuYW1lIHRvIHVub2JzZXJ2ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHVub2JzZXJ2ZVByb3BlcnR5KHByb3BOYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcE5hbWVdLnVub2JzZXJ2ZShjYWxsYmFjayk7XG4gICAgfVxufTtcbiIsImNvbnN0IEVMRU1fUFJPVE8gPSBFbGVtZW50LnByb3RvdHlwZTtcblxuZXhwb3J0IGNvbnN0IG1hdGNoZXMgPSBFTEVNX1BST1RPLm1hdGNoZXMgfHxcbiAgICBFTEVNX1BST1RPLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgRUxFTV9QUk9UTy5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ub01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xuIiwiaW1wb3J0IHsgaXNTdHJpbmcsIGlzRnVuY3Rpb24gfSBmcm9tICcuLi9saWIvdHlwZW9mLmpzJztcbmltcG9ydCB7IG1hdGNoZXMgfSBmcm9tICcuLi9wb2x5ZmlsbHMvbWF0Y2hlcy5qcyc7XG5pbXBvcnQgeyBkaXNwYXRjaCB9IGZyb20gJy4uL2xpYi9kaXNwYXRjaC5qcyc7XG5cbmNvbnN0IFNQTElUX1NFTEVDVE9SID0gLyhbXlxcc10rKSguKik/LztcblxuLyoqXG4gKiBTaW1wbGUgQ3VzdG9tIENvbXBvbmVudCB3aXRoIGV2ZW50cyBkZWxlZ2F0aW9uLFxuICogSXQgYWxzbyBpbXBsZW1lbnQgYSBgZGlzcGF0Y2hFdmVudGAgd3JhcHBlciBuYW1lZCBgdHJpZ2dlcmAuXG4gKiBAbWl4aW4gRXZlbnRzTWl4aW5cbiAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlxuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktY29tcG9uZW50LmpzXG4gKiBpbXBvcnQgeyBCYXNlQ29tcG9uZW50IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gKiAgIGdldCBldmVudHMoKSB7XG4gKiAgICAgcmV0dXJuIHtcbiAqICAgICAgICdjbGljayBidXR0b24nOiAnb25CdXR0b25DbGljaydcbiAqICAgICB9XG4gKiAgIH1cbiAqICAgb25CdXR0b25DbGljaygpIHtcbiAqICAgICBjb25zb2xlLmxvZygnYnV0dG9uIGNsaWNrZWQnKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gYXBwLmpzXG4gKiBpbXBvcnQgeyBkZWZpbmUgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gJy4vbXktY29tcG9uZW50LmpzJztcbiAqIGRlZmluZSgnbXktY29tcG9uZW50JywgTXlDb21wb25lbnQpO1xuICogdmFyIGVsZW1lbnQgPSBuZXcgTXlDb21wb25lbnQoKTtcbiAqIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAqIGJ1dHRvbi5pbm5lclRleHQgPSAnQ2xpY2sgbWUnO1xuICogZWxlbWVudC5hcHBlbmRDaGlsZChidXR0b24pO1xuICogYnV0dG9uLmNsaWNrKCk7IC8vIGxvZ3MgXCJidXR0b24gY2xpY2tlZFwiXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IEV2ZW50c01peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgLyoqXG4gICAgICogQXR0YWNoIGFuZCBkZWxlZ2F0ZSBldmVudHMgdG8gdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuRXZlbnRzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgLy8gYmluZCBldmVudHNcbiAgICAgICAgbGV0IGV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9O1xuICAgICAgICBmb3IgKGxldCBrIGluIGV2ZW50cykge1xuICAgICAgICAgICAgbGV0IGNhbGxiYWNrID0gaXNTdHJpbmcoZXZlbnRzW2tdKSA/XG4gICAgICAgICAgICAgICAgdGhpc1tldmVudHNba11dIDpcbiAgICAgICAgICAgICAgICBldmVudHNba107XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICBsZXQgcnVsZSA9IGsubWF0Y2goU1BMSVRfU0VMRUNUT1IpO1xuICAgICAgICAgICAgICAgIGxldCBldk5hbWUgPSBydWxlWzFdO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RvciA9IChydWxlWzJdIHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZWdhdGUoZXZOYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKGV2TmFtZSwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNhbGxiYWNrIGZvciBldmVudC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZWxlZ2F0ZSBldmVudHMgdG8gdGhlIGNvbXBvbmVudCBkZXNjZW5kZW50cy5cbiAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuRXZlbnRzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldk5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGRlbGVnYXRlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBBIENTUyBzZWxlY3RvciBmb3IgZGVzY2VuZGVudHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGZpcmUgd2hlbiB0aGUgZXZlbnQgZmlyZXMuXG4gICAgICovXG4gICAgZGVsZWdhdGUoZXZOYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZOYW1lLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldCAhPT0gdGhpcykge1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzLmNhbGwodGFyZ2V0LCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldmVudCwgdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBgTm9kZS5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudGAgd3JhcHBlci5cbiAgICAgKiBAbWV0aG9kIHRyaWdnZXJcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5FdmVudHNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gZmlyZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBBIHNldCBvZiBjdXN0b20gZGF0YSB0byBwYXNzIHRvIHRoZSBldmVudC5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGJ1YmJsZXMgU2hvdWxkIHRoZSBldmVudCBidWJibGUgdGhyb3cgdGhlIERPTSB0cmVlLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FuY2VsYWJsZSBDYW4gYmUgdGhlIGV2ZW50IGNhbmNlbCBieSBhIGNhbGxiYWNrLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgZXZlbnQgcHJvcGFnYXRpb24gaGFzIG5vdCBiZSBzdG9wcGVkLlxuICAgICAqL1xuICAgIHRyaWdnZXIoZXZOYW1lLCBkYXRhLCBidWJibGVzID0gdHJ1ZSwgY2FuY2VsYWJsZSA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHRoaXMsIGV2TmFtZSwgZGF0YSwgYnViYmxlcywgY2FuY2VsYWJsZSk7XG4gICAgfVxufTtcbiIsImNvbnN0IHJvb3REb2MgPSBkb2N1bWVudDtcbi8qKlxuICogQ3JlYXRlIGFuZCBhdHRhY2ggYSBzdHlsZSBlbGVtZW50IGZvciBhIGNvbXBvbmVudC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBBIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBUaGUgY3JlYXRlZCBzdHlsZSBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3R5bGUobm9kZSkge1xuICAgIGxldCBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQgfHwgcm9vdERvYztcbiAgICBsZXQgc3R5bGVFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVFbGVtLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIHN0eWxlRWxlbS5zZXRBdHRyaWJ1dGUoJ2lkJywgYHN0eWxlLSR7bm9kZS5pc31gKTtcbiAgICBsZXQgaGVhZCA9IGRvYy5oZWFkO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGhlYWQuZmlyc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtLCBoZWFkLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBzdHlsZUVsZW07XG59XG4iLCJpbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL2xpYi90eXBlb2YuanMnO1xuaW1wb3J0IHsgY3JlYXRlU3R5bGUgfSBmcm9tICcuLi9saWIvc3R5bGUuanMnO1xuXG4vKipcbiAqIFNpbXBsZSBDdXN0b20gQ29tcG9uZW50IHdpdGggY3NzIHN0eWxlIGhhbmRsaW5nIHVzaW5nIHRoZSBgY3NzYCBwcm9wZXJ0eS5cbiAqIEBtaXhpbiBTdHlsZU1peGluXG4gKiBAbWVtYmVyb2YgRE5BLk1JWElOU1xuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktY29tcG9uZW50LmpzXG4gKiBpbXBvcnQgeyBCYXNlQ29tcG9uZW50IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gKiAgIGdldCBjc3MoKSB7XG4gKiAgICAgcmV0dXJuICcubXktY29tcG9uZW50IHAgeyBjb2xvcjogcmVkOyB9J1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiAvLyBhcHAuanNcbiAqIGltcG9ydCB7IGRlZmluZSB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSAnLi9teS1jb21wb25lbnQuanMnO1xuICogZGVmaW5lKCdteS1jb21wb25lbnQnLCBNeUNvbXBvbmVudCk7XG4gKiB2YXIgZWxlbWVudCA9IG5ldyBNeUNvbXBvbmVudCgpO1xuICogdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gKiBwLmlubmVyVGV4dCA9ICdQYXJhZ3JhcGgnO1xuICogZWxlbWVudC5hcHBlbmRDaGlsZChwKTsgLy8gdGV4dCBpbnNpZGUgYHBgIGdldHMgdGhlIHJlZCBjb2xvclxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBTdHlsZU1peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiBhbiBpbnN0YW5jZSBvZiB0aGUgZWxlbWVudCBpcyBjcmVhdGVkLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoIXRoaXMuY29uc3RydWN0b3Iuc3R5bGVFbGVtKSB7XG4gICAgICAgICAgICBsZXQgQ3RyID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDdHIsICdzdHlsZUVsZW0nLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGNyZWF0ZVN0eWxlKHRoaXMpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDU1MoKTtcbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgICAgdGhpcy5ub2RlLmNsYXNzTGlzdC5hZGQodGhpcy5pcyk7XG4gICAgfVxuXG4gICAgdXBkYXRlQ1NTKCkge1xuICAgICAgICBsZXQgc3R5bGUgPSB0aGlzLmNzcztcbiAgICAgICAgaWYgKGlzU3RyaW5nKHN0eWxlKSkge1xuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5zdHlsZUVsZW0udGV4dENvbnRlbnQgPSBzdHlsZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBpc1VuZGVmaW5lZCwgaXNGdW5jdGlvbiwgaXNTdHJpbmcgfSBmcm9tICcuLi9saWIvdHlwZW9mLmpzJztcblxuLyoqXG4gKiBTaW1wbGUgQ3VzdG9tIENvbXBvbmVudCB3aXRoIHRlbXBsYXRlIGhhbmRsaW5nIHVzaW5nIHRoZSBgdGVtcGxhdGVgIHByb3BlcnR5LlxuICogQG1lbWJlcm9mIEROQS5NSVhJTlNcbiAqIEBtaXhpbiBUZW1wbGF0ZU1peGluXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gU3VwZXJDbGFzcyBUaGUgY2xhc3MgdG8gZXh0ZW5kLlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBleHRlbmRlZCBjbGFzcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIG15LWNvbXBvbmVudC5qc1xuICogaW1wb3J0IHsgQmFzZUNvbXBvbmVudCB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICogICBnZXQgdGVtcGxhdGUoKSB7XG4gKiAgICAgcmV0dXJuIGA8aDE+JHt0aGlzLm5hbWV9PC9oMT5gO1xuICogICB9XG4gKiAgIGdldCBuYW1lKCkge1xuICogICAgIHJldHVybiAnTmV3dG9uJztcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gYXBwLmpzXG4gKiBpbXBvcnQgeyBkZWZpbmUgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gJy4vbXktY29tcG9uZW50LmpzJztcbiAqIGRlZmluZSgnbXktY29tcG9uZW50JywgTXlDb21wb25lbnQpO1xuICogdmFyIGVsZW1lbnQgPSBuZXcgTXlDb21wb25lbnQoKTtcbiAqIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTsgLy8gbG9ncyBcIjxoMT5OZXd0b248L2gxPlwiXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IFRlbXBsYXRlTWl4aW4gPSAoU3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGF1dG9SZW5kZXIgU2hvdWxkIHRoZSBjb21wb25lbnQgcmUtcmVuZGVyIG9uIHByb3BlcnRpZXMgY2hhbmdlcy5cbiAgICAgKiBAbmFtZSBhdXRvUmVuZGVyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuVGVtcGxhdGVNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGdldCBhdXRvUmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoIHByb3BlcnRpZXMgb2JzZXJ2ZXJzIGluIG9yZGVyIHRvIHVwZGF0ZSBjaGlsZHJlbi5cbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuVGVtcGxhdGVNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAodGhpcy5hdXRvUmVuZGVyICYmICFpc1VuZGVmaW5lZCh0aGlzLnRlbXBsYXRlKSkge1xuICAgICAgICAgICAgbGV0IHByb3BzID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiBwcm9wcykge1xuICAgICAgICAgICAgICAgICAgICBwcm9wc1trXS5vYnNlcnZlKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVuZGVyIHRoZSBjb21wb25lbnQgd2hlbiBjb25uZWN0ZWQuXG4gICAgICogQG1ldGhvZCBjb25uZWN0ZWRDYWxsYmFja1xuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlRlbXBsYXRlTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLnRlbXBsYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgQ29tcG9uZW50IGNoaWxkIG5vZGVzLlxuICAgICAqIEBtZXRob2QgcmVuZGVyXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuVGVtcGxhdGVNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IHRwbCBBIHRlbXBsYXRlIHRvIHVzZSBpbnN0ZWFkIG9mIGB0aGlzLnRlbXBsYXRlYC5cbiAgICAgKlxuICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gV2lsbCB0aHJvdyBpZiB0aGUgdGVtcGxhdGUgdHlwZSBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAqL1xuICAgIHJlbmRlcih0cGwpIHtcbiAgICAgICAgdHBsID0gdHBsIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHRwbCkpIHtcbiAgICAgICAgICAgIHRwbC5jYWxsKHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHRwbCkpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5pbm5lckhUTUwgPSB0cGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHRlbXBsYXRlIHByb3BlcnR5LicpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIHByZWZlci1yZXN0LXBhcmFtcyAqL1xuZXhwb3J0IGNvbnN0IHJlZHVjZSA9IEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgfHwgZnVuY3Rpb24oY2FsbGJhY2sgLyosIGluaXRpYWxWYWx1ZSovICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBsZXQgdCA9IHRoaXM7XG4gICAgbGV0IGxlbiA9IHQubGVuZ3RoO1xuICAgIGxldCBrID0gMDtcbiAgICBsZXQgdmFsdWU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgdmFsdWUgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKGsgPCBsZW4gJiYgIShrIGluIHQpKSB7XG4gICAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgPSB0W2srK107XG4gICAgfVxuICAgIGZvciAoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgaWYgKGsgaW4gdCkge1xuICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjayh2YWx1ZSwgdFtrXSwgaywgdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcbiIsIi8qKlxuICogQGF1dGhvciBKdXN0aW4gRmFnbmFuaVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vanVzdGluZmFnbmFuaS9taXh3aXRoLmpzXG4gKi9cbmltcG9ydCB7IHJlZHVjZSB9IGZyb20gJy4uL3BvbHlmaWxscy9yZWR1Y2UuanMnO1xuXG4vKipcbiAqIE1peCBhIGNsYXNzIHdpdGggYSBtaXhpbi5cbiAqIEBtZXRob2QgbWl4KC4uLikud2l0aCguLi4pXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlckNsYXNzIFRoZSBjbGFzcyB0byBleHRlbmQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBtaXhlZCBjbGFzcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIG15LXN1cGVyLmpzXG4gKiBleHBvcnQgY2xhc3MgTXlTdXBlckNsYXNzIHtcbiAqICAgICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4gKiAgICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gbWl4aW4uanNcbiAqIGV4cG9ydCBjb25zdCBNaXhpbiA9IChzdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmQgc3VwZXJDbGFzcyB7XG4gKiAgICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgICAgIHN1cGVyKCk7XG4gKiAgICAgICAgIC8vIGRvIHNvbWV0aGluZyBlbHNlXG4gKiAgICAgfVxuICogfTtcbiAqIGBgYFxuICogYGBganNcbiAqIGltcG9ydCB7IG1peCB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGltcG9ydCB7IE15U3VwZXJDbGFzcyB9IGZyb20gJy4vbXktc3VwZXIuanMnO1xuICogaW1wb3J0IHsgTWl4aW4gfSBmcm9tICcuL21peGluLmpzJztcbiAqXG4gKiBleHBvcnQgY2xhc3MgTWl4ZWRDbGFzcyBleHRlbmRzIG1peChNeVN1cGVyQ2xhc3MpLndpdGgoTWl4aW4pIHtcbiAqICAgICAuLi5cbiAqIH1cbiAqIGBgYFxuICovXG5cbi8qKlxuICogQSBNaXhpbiBoZWxwZXIgY2xhc3MuXG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIE1peGluIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBtaXhhYmxlIGNsYXNzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyQ2xhc3MgVGhlIGNsYXNzIHRvIGV4dGVuZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdXBlcmNsYXNzKSB7XG4gICAgICAgIHN1cGVyY2xhc3MgPSBzdXBlcmNsYXNzIHx8IGNsYXNzIHt9O1xuICAgICAgICB0aGlzLnN1cGVyY2xhc3MgPSBzdXBlcmNsYXNzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNaXggdGhlIHN1cGVyIGNsYXNzIHdpdGggYSBsaXN0IG9mIG1peGlucy5cbiAgICAgKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBtaXhpbnMgKk4qIG1peGluIGZ1bmN0aW9ucy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGV4dGVuZGVkIGNsYXNzLlxuICAgICAqL1xuICAgIHdpdGgoKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBsZXQgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgICAgcmV0dXJuIHJlZHVjZS5jYWxsKGFyZ3MsIChjLCBtaXhpbikgPT4gbWl4aW4oYyksIHRoaXMuc3VwZXJjbGFzcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIE1peGluIGluc3RhbmNlLlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgY29uc3QgbWl4ID0gKHN1cGVyQ2xhc3MpID0+IG5ldyBNaXhpbihzdXBlckNsYXNzKTtcbiIsImltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4vdHlwZW9mLmpzJztcblxuLyoqXG4gKiBDaGVjayBpZiBhIG5vZGUgaXMgYWxyZWFkeSBpbnN0YW50aWF0ZWQgSFRNTEVsZW1lbnQgZm9yIHByb2dyYW1tYXRpY2FsbHkgYGNvbnN0cnVjdG9yYCBjYWxscy5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlIFRoZSBub2RlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIG5vZGUgc2hvdWxkIGJlIGluc3RhbnRpYXRlZC5cbiAqL1xuZnVuY3Rpb24gaXNOZXcobm9kZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiAhaXNTdHJpbmcobm9kZS5vdXRlckhUTUwpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTaGltIG9yaWdpbmFsIEVsZW1lbnQgY29uc3RydWN0b3JzIGluIG9yZGVyIHRvIGJlIHVzZWQgd2l0aCBgbmV3YC5cbiAqIEBtZXRob2Qgc2hpbVxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gT3JpZ2luYWwgVGhlIG9yaWdpbmFsIGNvbnN0cnVjdG9yIHRvIHNoaW0uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIHNoaW1tZWQgY29uc3RydWN0b3IuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAvLyBzaGltIGF1ZGlvIGVsZW1lbnRcbiAqIGltcG9ydCB7IHNoaW0gfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKlxuICogY2xhc3MgTXlBdWRpbyBleHRlbmRzIHNoaW0oSFRNTEF1ZGlvRWxlbWVudCkge1xuICogICAgIC4uLlxuICogfVxuICpcbiAqIGxldCBhdWRpbyA9IG5ldyBNeUF1ZGlvKCk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNoaW0oT3JpZ2luYWwpIHtcbiAgICBjbGFzcyBQb2x5ZmlsbGVkIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBpZiAoIWlzTmV3KHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZGVzYyA9IHJlZ2lzdHJ5LmdldERlc2NyaXB0b3IodGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICBsZXQgY29uZmlnID0gZGVzYy5jb25maWc7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSB0YWduYW1lIG9mIHRoZSBjb25zdHJ1Y3RvciBhbmQgY3JlYXRlIGEgbmV3IGVsZW1lbnQgd2l0aCBpdFxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgIGNvbmZpZy5leHRlbmRzID8gY29uZmlnLmV4dGVuZHMgOiBkZXNjLmlzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZWxlbWVudC5fX3Byb3RvX18gPSBkZXNjLkN0ci5wcm90b3R5cGU7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmV4dGVuZHMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaXMnLCBkZXNjLmlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIENsb25lIHRoZSBwcm90b3R5cGUgb3ZlcnJpZGluZyB0aGUgY29uc3RydWN0b3IuXG4gICAgUG9seWZpbGxlZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE9yaWdpbmFsLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgdmFsdWU6IFBvbHlmaWxsZWQsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gUG9seWZpbGxlZDtcbn1cbiIsImltcG9ydCAqIGFzIERPTV9IRUxQRVJTIGZyb20gJy4vbGliL2RvbS5qcyc7XG5pbXBvcnQgeyBDb21wb25lbnRNaXhpbiB9IGZyb20gJy4vbWl4aW5zL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzTWl4aW4gfSBmcm9tICcuL21peGlucy9wcm9wZXJ0aWVzLWNvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBFdmVudHNNaXhpbiB9IGZyb20gJy4vbWl4aW5zL2V2ZW50cy1jb21wb25lbnQuanMnO1xuaW1wb3J0IHsgU3R5bGVNaXhpbiB9IGZyb20gJy4vbWl4aW5zL3N0eWxlLWNvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBUZW1wbGF0ZU1peGluIH0gZnJvbSAnLi9taXhpbnMvdGVtcGxhdGUtY29tcG9uZW50LmpzJztcblxuLyoqXG4gKiBBIHNldCBvZiBET00gaGVscGVycyBmb3IgY2FsbGJhY2tzIHRyaWdnZXIgd2hlbiBDdXN0b20gRWxlbWVudHNcbiAqIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLlxuICogQG5hbWUgRE9NXG4gKiBAbmFtZXNwYWNlIERPTVxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKi9cbmV4cG9ydCBjb25zdCBET00gPSBET01fSEVMUEVSUztcbi8qKlxuICogQSBzZXQgb2YgY29yZSBtaXhpbnMuXG4gKiBAbmFtZSBNSVhJTlNcbiAqIEBuYW1lc3BhY2UgTUlYSU5TXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IE1JWElOUyA9IHtcbiAgICBDb21wb25lbnRNaXhpbixcbiAgICBQcm9wZXJ0aWVzTWl4aW4sXG4gICAgRXZlbnRzTWl4aW4sXG4gICAgU3R5bGVNaXhpbixcbiAgICBUZW1wbGF0ZU1peGluLFxufTtcbmV4cG9ydCB7IG1peCB9IGZyb20gJy4vbGliL21peGlucy5qcyc7XG5leHBvcnQgeyBwcm9wIH0gZnJvbSAnLi9saWIvcHJvcGVydHkuanMnO1xuZXhwb3J0IHsgc2hpbSB9IGZyb20gJy4vbGliL3NoaW0uanMnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvc3ltYm9scy5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi90eXBlb2YuanMnO1xuIiwiLyoqXG4gKiBETkFcbiAqIChjKSAyMDE1LTIwMTYgQ2hpYWxhYiAoaHR0cDovL3d3dy5jaGlhbGFiLmNvbSkgPGRldkBjaGlhbGFiLmlvPlxuICogaHR0cDovL2RuYS5jaGlhbGFiLmlvXG4gKlxuICogSnVzdCBhbm90aGVyIGNvbXBvbmVudHMgcGF0dGVybi5cbiAqIFVzZSB3aXRoIEN1c3RvbSBFbGVtZW50cyBzcGVjcy5cbiAqL1xuaW1wb3J0IHsgbWl4LCBwcm9wLCBzaGltLCBET00sIE1JWElOUyB9IGZyb20gJy4vc3JjL2NvcmUuanMnO1xuaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuL3NyYy9saWIvcmVnaXN0cnkuanMnO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgRE5BXG4gKi9cbmV4cG9ydCB7IG1peCwgcHJvcCwgc2hpbSwgRE9NLCBNSVhJTlMgfTtcbmV4cG9ydCB7IHJlZ2lzdHJ5IH07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBuZXcgY29tcG9uZW50LlxuICogQG1ldGhvZCBkZWZpbmVcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBpZCBvZiB0aGUgY29tcG9uZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RyIFRoZSBjb21wb25lbnQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIE9wdGlvbmFsIGNvbXBvbmVudCBjb25maWd1cmF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lKHRhZ05hbWUsIENvbXBvbmVudCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHJlZ2lzdHJ5LmRlZmluZSh0YWdOYW1lLCBDb21wb25lbnQsIGNvbmZpZyk7XG59XG4vKipcbiAqIENyZWF0ZSBhbmQgYXBwZW5kIGEgbmV3IGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIEBtZXRob2QgcmVuZGVyXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlIFRoZSBwYXJlbnQgbm9kZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IENvbXBvbmVudCBUaGUgY29tcG9uZW50IGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIE9wdGlvbmFsIHNldCBvZiBwcm9wZXJ0aWVzIHRvIHNldCB0byB0aGUgY29tcG9uZW50LlxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IFRoZSBuZXcgY29tcG9uZW50IGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKG5vZGUsIENvbXBvbmVudCwgcHJvcHMpIHtcbiAgICBsZXQgZWxlbWVudCA9IG5ldyBDb21wb25lbnQoKTtcbiAgICBmb3IgKGxldCBrIGluIHByb3BzKSB7XG4gICAgICAgIGVsZW1lbnRba10gPSBwcm9wc1trXTtcbiAgICB9XG4gICAgRE9NLmFwcGVuZENoaWxkKG5vZGUsIGVsZW1lbnQpO1xuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG4vKipcbiAqIFNpbXBsZSBDdXN0b20gQ29tcG9uZW50IHdpdGggc29tZSBiZWhhdmlvcnMuXG4gKiBAY2xhc3MgQmFzZUNvbXBvbmVudFxuICogQGV4dGVuZHMgSFRNTEVsZW1lbnRcbiAqIEBtZW1iZXJvZiBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAvLyBteS1jb21wb25lbnQuanNcbiAqIGltcG9ydCB7IEJhc2VDb21wb25lbnQgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAqICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gKiAgICAgcmV0dXJuIFsnLi4uJywgJy4uLiddO1xuICogICB9XG4gKiAgIGdldCBjc3MoKSB7XG4gKiAgICAgcmV0dXJuICcuLi4nO1xuICogICB9XG4gKiAgIGdldCBldmVudHMoKSB7XG4gKiAgICAgcmV0dXJuIHtcbiAqICAgICAgICcuLi4nOiAnLi4uJ1xuICogICAgIH07XG4gKiAgIH1cbiAqICAgZ2V0IHRlbXBsYXRlKCkge1xuICogICAgIHJldHVybiAnLi4uJztcbiAqICAgfVxuICogICBnZXQgcHJvcGVydGllcygpIHtcbiAqICAgICByZXR1cm4geyAuLi4gfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlQ29tcG9uZW50IGV4dGVuZHMgbWl4KFxuICAgIHNoaW0oc2VsZi5IVE1MRWxlbWVudClcbikud2l0aChcbiAgICBNSVhJTlMuQ29tcG9uZW50TWl4aW4sXG4gICAgTUlYSU5TLlByb3BlcnRpZXNNaXhpbixcbiAgICBNSVhJTlMuU3R5bGVNaXhpbixcbiAgICBNSVhJTlMuRXZlbnRzTWl4aW4sXG4gICAgTUlYSU5TLlRlbXBsYXRlTWl4aW5cbikge31cbiJdLCJuYW1lcyI6WyJpc0Z1bmN0aW9uIiwib2JqIiwiaXNTdHJpbmciLCJpc09iamVjdCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImlzVW5kZWZpbmVkIiwiaXNBcnJheSIsIkFycmF5IiwicmVnaXN0cnkiLCJuYW1lIiwiQ3RyIiwiY29uZmlnIiwiY29tcG9uZW50cyIsInRvTG93ZXJDYXNlIiwiayIsImRlc2MiLCJnZXREZXNjcmlwdG9yIiwiQ09NUE9ORU5UX1NZTUJPTCIsIkNPTk5FQ1RFRCIsIkRJU0NPTk5FQ1RFRCIsIlVQREFURUQiLCJnZXRDb21wb25lbnQiLCJlbGVtZW50IiwiZnVsbCIsIm5vZGUiLCJub2RlVHlwZSIsIk5vZGUiLCJFTEVNRU5UX05PREUiLCJnZXRBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0IiwiaXNDb21wb25lbnQiLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInVwZGF0ZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJiaW5kIiwiX19wcm90b19fIiwiZGVmaW5lUHJvcGVydHkiLCJjcmVhdGVFbGVtZW50IiwiaXMiLCJhcHBlbmRDaGlsZCIsInBhcmVudCIsInBhcmVudE5vZGUiLCJsYXN0RWxlbWVudENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJyZWZOb2RlIiwibmV4dFNpYmxpbmciLCJyZXBsYWNlQ2hpbGQiLCJzZXRBdHRyaWJ1dGUiLCJ2YWx1ZSIsImF0dHJzIiwiY29uc3RydWN0b3IiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJpbmRleE9mIiwicmVtb3ZlQXR0cmlidXRlIiwiQ29tcG9uZW50TWl4aW4iLCJTdXBlckNsYXNzIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsImxvY2FsTmFtZSIsIkN1c3RvbUV2ZW50IiwiZXYiLCJzZWxmIiwiZXgiLCJldmVudCIsInBhcmFtcyIsInVuZGVmaW5lZCIsImV2dCIsImRvY3VtZW50IiwiY3JlYXRlRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRldGFpbCIsImRpc3BhdGNoIiwiZXZOYW1lIiwiZGF0YSIsIlR5cGVFcnJvciIsImRpc3BhdGNoRXZlbnQiLCJkZWZpbmUiLCJQcm9wZXJ0eSIsImN0cnMiLCJfIiwidmFsaWRhdG9yIiwiX3NldHRlciIsInZhbCIsImdldHRlckZuIiwic2V0dGVyRm4iLCJ2YWxpZGF0ZVR5cGUiLCJjaGFuZ2VkIiwic2NvcGUiLCJvYnNlcnZlIiwiY2FsbGJhY2siLCJwdXNoIiwidW5vYnNlcnZlIiwiaW8iLCJzcGxpY2UiLCJpIiwibGVuIiwibGVuZ3RoIiwiY2xiIiwiYWNjZXB0cyIsIm5hbWVkIiwiYXR0clJlcXVlc3RlZCIsImF0dHJOYW1lIiwiZGVmYXVsdCIsImluaXRWYWx1ZSIsImRlZmF1bHRWYWx1ZSIsImZyZWV6ZSIsImF0dHJpYnV0ZSIsImV2ZW50TmFtZSIsImdldHRlciIsInNldHRlciIsInZhbGlkYXRlIiwiaW5pdCIsInByb3AiLCJTdHJpbmciLCJCb29sZWFuIiwiTnVtYmVyIiwiZ2V0VmFsdWUiLCJwcm9wZXJ0eSIsImF0dHJWYWwiLCJKU09OIiwicGFyc2UiLCJjb250ZXh0IiwiYXR0ciIsImN1cnJlbnRBdHRyVmFsdWUiLCJQcm9wZXJ0aWVzTWl4aW4iLCJwcm9wcyIsInByb3BlcnRpZXMiLCJyZWR1Y2UiLCJyZXMiLCJwYXJ0aWFsUHJvcHMiLCJvYnNlcnZlZCIsImhhc0F0dHJpYnV0ZSIsIm9sZFZhbCIsIm5ld1ZhbCIsIm9ic2VydmVQcm9wZXJ0eSIsInByb3BOYW1lIiwidW5vYnNlcnZlUHJvcGVydHkiLCJFTEVNX1BST1RPIiwiRWxlbWVudCIsIm1hdGNoZXMiLCJtYXRjaGVzU2VsZWN0b3IiLCJtb3pNYXRjaGVzU2VsZWN0b3IiLCJtc01hdGNoZXNTZWxlY3RvciIsIm9NYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJTUExJVF9TRUxFQ1RPUiIsIkV2ZW50c01peGluIiwiZXZlbnRzIiwicnVsZSIsIm1hdGNoIiwic2VsZWN0b3IiLCJ0cmltIiwiZGVsZWdhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwidGFyZ2V0IiwidHJpZ2dlciIsInJvb3REb2MiLCJjcmVhdGVTdHlsZSIsImRvYyIsIm93bmVyRG9jdW1lbnQiLCJzdHlsZUVsZW0iLCJ0eXBlIiwiaGVhZCIsImZpcnN0RWxlbWVudENoaWxkIiwiU3R5bGVNaXhpbiIsInVwZGF0ZUNTUyIsImNsYXNzTGlzdCIsImFkZCIsInN0eWxlIiwiY3NzIiwidGV4dENvbnRlbnQiLCJUZW1wbGF0ZU1peGluIiwiYXV0b1JlbmRlciIsInRlbXBsYXRlIiwicmVuZGVyIiwidHBsIiwiaW5uZXJIVE1MIiwidCIsImFyZ3VtZW50cyIsIk1peGluIiwic3VwZXJjbGFzcyIsIndpdGgiLCJhcmdzIiwic2xpY2UiLCJjIiwibWl4aW4iLCJtaXgiLCJzdXBlckNsYXNzIiwiaXNOZXciLCJvdXRlckhUTUwiLCJzaGltIiwiT3JpZ2luYWwiLCJQb2x5ZmlsbGVkIiwiZXh0ZW5kcyIsImNyZWF0ZSIsIkRPTSIsIkRPTV9IRUxQRVJTIiwiTUlYSU5TIiwiQ29tcG9uZW50IiwiQmFzZUNvbXBvbmVudCIsIkhUTUxFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTyxTQUFTQSxVQUFULENBQW9CQyxHQUFwQixFQUF5QjtTQUNyQixPQUFPQSxHQUFQLEtBQWUsVUFBdEI7Ozs7Ozs7Ozs7O0FBV0osQUFBTyxTQUFTQyxRQUFULENBQWtCRCxHQUFsQixFQUF1QjtTQUNuQixPQUFPQSxHQUFQLEtBQWUsUUFBdEI7Ozs7Ozs7Ozs7O0FBV0osQUFBTyxTQUFTRSxRQUFULENBQWtCRixHQUFsQixFQUF1QjtTQUNuQkcsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCTixHQUEvQixNQUF3QyxpQkFBL0M7Ozs7Ozs7Ozs7O0FBV0osQUFBTyxTQUFTTyxXQUFULENBQXFCUCxHQUFyQixFQUEwQjtTQUN0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