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

function onCreation(nodes) {
    [].forEach.call(nodes, function (node) {
        if (!node.is) {
            if (DOM.bind(node)) {
                DOM.connect(node);
            }
        } else {
            DOM.connect(node);
        }
        if (node.children) {
            onCreation(node.children);
        }
    });
}

var OBSERVER = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        switch (mutation.type) {
            case 'childList':
                {
                    if (mutation.addedNodes) {
                        onCreation(mutation.addedNodes);
                    }
                    if (mutation.removedNodes) {
                        mutation.removedNodes.forEach(function (node) {
                            DOM.disconnect(node);
                        });
                    }
                    break;
                }
            case 'attributes':
                {
                    var attributeName = mutation.attributeName;
                    if (attributeName === 'is') {
                        break;
                    }
                    var node = mutation.target;
                    DOM.update(node, attributeName, mutation.oldValue, node.getAttribute(attributeName));
                    break;
                }
        }
    });
});

OBSERVER.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true
});

/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with MutationObserver API.
 */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvdHlwZW9mLmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL2xpYi9yZWdpc3RyeS5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3ltYm9scy5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvZG9tLmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL21peGlucy9jb21wb25lbnQuanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvZGlzcGF0Y2guanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbGliL3Byb3BlcnR5LmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL21peGlucy9wcm9wZXJ0aWVzLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9wb2x5ZmlsbHMvbWF0Y2hlcy5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvZXZlbnRzLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc3R5bGUuanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbWl4aW5zL3N0eWxlLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9taXhpbnMvdGVtcGxhdGUtY29tcG9uZW50LmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvc3JjL3BvbHlmaWxscy9yZWR1Y2UuanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL25vZGVfbW9kdWxlcy9AZG5hanMvY29yZS9zcmMvbGliL21peGlucy5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9saWIvc2hpbS5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvbm9kZV9tb2R1bGVzL0BkbmFqcy9jb3JlL3NyYy9jb3JlLmpzIiwiL1VzZXJzL2Vkb2FyZG9jYXZhenphL1Byb2plY3RzL2RuYS9kbmEtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQGRuYWpzL2NvcmUvaW5kZXguanMiLCIvVXNlcnMvZWRvYXJkb2NhdmF6emEvUHJvamVjdHMvZG5hL2RuYS1jb21wb25lbnRzL3BhY2thZ2VzL2RuYS1tdXRhdGlvbi9vYnNlcnZlci5qcyIsIi9Vc2Vycy9lZG9hcmRvY2F2YXp6YS9Qcm9qZWN0cy9kbmEvZG5hLWNvbXBvbmVudHMvcGFja2FnZXMvZG5hLW11dGF0aW9uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2hlY2sgaWYgYW4gdmFsdWUgaXMgYSBmdW5jdGlvbi5cbiAqIEBtZXRob2QgaXNGdW5jdGlvblxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGEgc3RyaW5nLlxuICogQG1ldGhvZCBpc1N0cmluZ1xuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJztcbn1cbi8qKlxuICogQ2hlY2sgaWYgYW4gdmFsdWUgaXMgYW4gb2JqZWN0LlxuICogQG1ldGhvZCBpc09iamVjdFxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHsqfSBvYmogVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIHVuZGVmaW5lZC5cbiAqIEBtZXRob2QgaXNVbmRlZmluZWRcbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCc7XG59XG4vKipcbiAqIENoZWNrIGlmIGFuIHZhbHVlIGlzIGFuIGFycmF5LlxuICogQG1ldGhvZCBpc0FycmF5XG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0geyp9IG9iaiBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xufVxuIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiwgaXNTdHJpbmcgfSBmcm9tICcuL3R5cGVvZi5qcyc7XG5cbi8qKlxuICogQSBjdXN0b20gY29tcG9uZW50cyByZWdpc3RyeS5cbiAqIEl0IHJlcGxpY2F0ZXMgdGhlIFtDdXN0b21FbGVtZW50UmVnaXN0cnkgaW50ZXJmYWNlXShodHRwczovL3d3dy53My5vcmcvVFIvY3VzdG9tLWVsZW1lbnRzLyNjdXN0b20tZWxlbWVudHMtYXBpKS5cbiAqIEBuYW1lIHJlZ2lzdHJ5XG4gKiBAbmFtZXNwYWNlIHJlZ2lzdHJ5XG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlZ2lzdHJ5ID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBsaXN0IG9mIGRlZmluZWQgY29tcG9uZW50cy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbXBvbmVudHM6IHt9LFxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgbmV3IGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgaWQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDdHIgVGhlIGNvbXBvbmVudCBjb25zdHJ1Y3Rvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIE9wdGlvbmFsIGNvbXBvbmVudCBjb25maWd1cmF0aW9uLlxuICAgICAqL1xuICAgIGRlZmluZShuYW1lLCBDdHIsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50c1tuYW1lLnRvTG93ZXJDYXNlKCldID0ge1xuICAgICAgICAgICAgaXM6IG5hbWUsXG4gICAgICAgICAgICBDdHIsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIGNvbXBvbmVudCBkZXNjcmlwdG9yIGJ5IGlkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGNvbXBvbmVudCBpZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjb21wb25lbnQgZGVzY3JpcHRvci5cbiAgICAgKi9cbiAgICBnZXREZXNjcmlwdG9yKG5hbWUpIHtcbiAgICAgICAgaWYgKGlzU3RyaW5nKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzW25hbWUudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihuYW1lKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGVzYyA9IHRoaXMuY29tcG9uZW50c1trXTtcbiAgICAgICAgICAgICAgICBpZiAoZGVzYy5DdHIgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc2M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIGNvbXBvbmVudCBjb25zdHJ1Y3RvciBieSBpZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgY29tcG9uZW50IGlkLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY29tcG9uZW50IGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIGdldChuYW1lKSB7XG4gICAgICAgIGxldCBkZXNjID0gdGhpcy5nZXREZXNjcmlwdG9yKG5hbWUpO1xuICAgICAgICBpZiAoZGVzYykge1xuICAgICAgICAgICAgcmV0dXJuIGRlc2MuQ3RyO1xuICAgICAgICB9XG4gICAgfSxcbn07XG4iLCJleHBvcnQgY29uc3QgQ09NUE9ORU5UX1NZTUJPTCA9ICdfX2NvbXBvbmVudCc7XG4iLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi90eXBlb2YuanMnO1xuaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IENPTVBPTkVOVF9TWU1CT0wgfSBmcm9tICcuL3N5bWJvbHMuanMnO1xuXG4vKipcbiAqIFRoZSBgY29ubmVjdGVkQ2FsbGJhY2tgIG5hbWUuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAc2VlIFtXM0Mgc3BlY10oaHR0cHM6Ly93d3cudzMub3JnL1RSL2N1c3RvbS1lbGVtZW50cy8jY3VzdG9tLWVsZW1lbnQtcmVhY3Rpb25zKVxuICovXG5jb25zdCBDT05ORUNURUQgPSAnY29ubmVjdGVkQ2FsbGJhY2snO1xuLyoqXG4gKiBUaGUgYGRpc2Nvbm5lY3RlZENhbGxiYWNrYCBuYW1lLlxuICogQHByaXZhdGVcbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHNlZSBbVzNDIHNwZWNdKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jdXN0b20tZWxlbWVudHMvI2N1c3RvbS1lbGVtZW50LXJlYWN0aW9ucylcbiAqL1xuY29uc3QgRElTQ09OTkVDVEVEID0gJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJztcbi8qKlxuICogVGhlIGBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tgIG5hbWUuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAc2VlIFtXM0Mgc3BlY10oaHR0cHM6Ly93d3cudzMub3JnL1RSL2N1c3RvbS1lbGVtZW50cy8jY3VzdG9tLWVsZW1lbnQtcmVhY3Rpb25zKVxuICovXG5jb25zdCBVUERBVEVEID0gJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayc7XG4vKipcbiAqIFJldHJpZXZlIGEgY29tcG9uZW50IGNvbnN0cnVjdG9yIGZyb20gYW4gRWxlbWVudCBvciBmcm9tIGEgdGFnIG5hbWUuXG4gKiBAbWV0aG9kIGdldENvbXBvbmVudFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudHxTdHJpbmd9IGVsZW1lbnQgVGhlIGVsZW1lbnQgb3IgdGhlIHRhZyBuYW1lLlxuICogQHBhcmFtIHtCb29sZWFufSBmdWxsIFJldHJpZXZlIGZ1bGwgY29tcG9uZW50IGluZm9ybWF0aW9uLlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgZm9yIHRoZSBnaXZlbiBwYXJhbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBvbmVudChlbGVtZW50LCBmdWxsID0gZmFsc2UpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm5vZGU7XG4gICAgfVxuICAgIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgfHwgZWxlbWVudC50YWdOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZnVsbCA/IHJlZ2lzdHJ5LmdldERlc2NyaXB0b3IoZWxlbWVudCkgOiByZWdpc3RyeS5nZXQoZWxlbWVudCk7XG59XG4vKipcbiAqIENoZWNrIGlmIGEgbm9kZSBpcyBhbiBpbnN0YW5jZSBvZiBhIGNvbXBvbmVudC5cbiAqIEBtZXRob2QgaXNDb21wb25lbnRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wb25lbnQoZWxlbWVudCkge1xuICAgIGxldCBDdHIgPSBnZXRDb21wb25lbnQoZWxlbWVudCk7XG4gICAgcmV0dXJuIEN0ciAmJiAoZWxlbWVudCBpbnN0YW5jZW9mIEN0cik7XG59XG4vKipcbiAqIEFuIGhlbHBlciBmb3IgZHluYW1pY2FsbHkgdHJpZ2dlciB0aGUgYGNvbm5lY3RlZENhbGxiYWNrYCByZWFjdGlvbiBvbiBjb21wb25lbnRzLlxuICogQG1ldGhvZCBjb25uZWN0XG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBhdHRhY2hlZCBub2RlLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIGNhbGxiYWNrIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3QoZWxlbWVudCkge1xuICAgIGlmIChpc0NvbXBvbmVudChlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50W0NPTk5FQ1RFRF0uY2FsbChlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuLyoqXG4gKiBBbiBoZWxwZXIgZm9yIGR5bmFtaWNhbGx5IHRyaWdnZXIgdGhlIGBkaXNjb25uZWN0ZWRDYWxsYmFja2AgcmVhY3Rpb24gb24gY29tcG9uZW50cy5cbiAqIEBtZXRob2QgZGlzY29ubmVjdFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZGV0YWNoZWQgbm9kZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBjYWxsYmFjayBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNjb25uZWN0KGVsZW1lbnQpIHtcbiAgICBpZiAoaXNDb21wb25lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudFtESVNDT05ORUNURURdLmNhbGwoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbi8qKlxuICogQW4gaGVscGVyIGZvciBkeW5hbWljYWxseSB0cmlnZ2VyIHRoZSBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYCByZWFjdGlvbiBvbiBjb21wb25lbnRzLlxuICogQG1ldGhvZCB1cGRhdGVcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIHVwZGF0ZWQgZWxlbWVudC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBjYWxsYmFjayBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUoZWxlbWVudCwgbmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgaWYgKGlzQ29tcG9uZW50KGVsZW1lbnQpKSB7XG4gICAgICAgIGVsZW1lbnRbVVBEQVRFRF0uY2FsbChlbGVtZW50LCBuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4vKipcbiAqIEF0dGFjaCBhIGNvbXBvbmVudCBwcm90b3R5cGUgdG8gYW4gYWxyZWFkeSBpbnN0YW50aWF0ZWQgSFRNTEVsZW1lbnQuXG4gKiBAbWV0aG9kIGJpbmRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgbm9kZSB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDdHIgVGhlIGNvbXBvbmVudCBjbGFzcyB0byB1c2UgKGxlYXZlIGVtcHR5IGZvciBhdXRvIGRldGVjdCkuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgcHJvdG90eXBlIGhhcyBiZWVuIGF0dGFjaGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZChub2RlLCBDdHIpIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24oQ3RyKSkge1xuICAgICAgICBDdHIgPSBnZXRDb21wb25lbnQobm9kZSk7XG4gICAgfVxuICAgIGlmIChpc0Z1bmN0aW9uKEN0cikpIHtcbiAgICAgICAgbm9kZS5fX3Byb3RvX18gPSBDdHIucHJvdG90eXBlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgICAgICAgdmFsdWU6IEN0cixcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgQ3RyLmNhbGwobm9kZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vKipcbiAqIENyZWF0ZSBhIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIEBtZXRob2QgY3JlYXRlRWxlbWVudFxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaXMgVGhlIGNvbXBvbmVudCB0YWcgbmFtZS5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBUaGUgY29tcG9uZW50IGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChpcykge1xuICAgIGxldCBDdHIgPSBnZXRDb21wb25lbnQoaXMpO1xuICAgIGlmIChDdHIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDdHIoKTtcbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IGFwcGVuZCBhIG5vZGUgYW5kIGNhbGwgdGhlIGBjb25uZWN0ZWRDYWxsYmFja2AuXG4gKiAtIGRpc2Nvbm5lY3QgdGhlIG5vZGUgaWYgYWxyZWFkeSBpbiB0aGUgdHJlZVxuICogLSBjb25uZWN0IHRoZSBub2RlIGFmdGVyIHRoZSBpbnNlcnRpb25cbiAqIEBtZXRob2QgYXBwZW5kQ2hpbGRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50IFRoZSBwYXJlbnQgZWxlbWVudC5cbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGFwcGVuZC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIGFwcGVuZGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ2hpbGQocGFyZW50LCBlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgaWYgKHBhcmVudCAhPT0gbm9kZS5wYXJlbnROb2RlIHx8IHBhcmVudC5sYXN0RWxlbWVudENoaWxkICE9PSBub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGQobm9kZS5wYXJlbnROb2RlLCBlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIHJldHVybiBjb25uZWN0KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbi8qKlxuICogRHluYW1pY2FsbHkgcmVtb3ZlIGEgbm9kZSBhbmQgY2FsbCB0aGUgYGRpc2Nvbm5lY3RlZENhbGxiYWNrYC5cbiAqIEBtZXRob2QgcmVtb3ZlQ2hpbGRcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50IFRoZSBwYXJlbnQgZWxlbWVudC5cbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHJlbW92ZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIHJlbW92ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDaGlsZChwYXJlbnQsIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChlbGVtZW50Lm5vZGUpO1xuICAgICAgICByZXR1cm4gZGlzY29ubmVjdChlbGVtZW50KTtcbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IGluc2VydCBhIG5vZGUgYmVmb3JlIGFub3RoZXIgYW5kIGNhbGwgYWxsIHRoZSByZWFjdGlvbnMuXG4gKiAtIGRpc2Nvbm5lY3QgdGhlIG5vZGUgaWYgYWxyZWFkeSBpbiB0aGUgdHJlZVxuICogLSBjb25uZWN0IHRoZSBub2RlIGFmdGVyIHRoZSBpbnNlcnRpb25cbiAqIEBtZXRob2QgaW5zZXJ0QmVmb3JlXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBpbnNlcnQuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZOb2RlIFRoZSBub2RlIGZvciBwb3NpdGlvbmluZy5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIGFwcGVuZGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKHBhcmVudCwgZWxlbWVudCwgcmVmTm9kZSkge1xuICAgIGlmIChlbGVtZW50Lm5vZGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlbGVtZW50Lm5vZGU7XG4gICAgICAgIGlmIChub2RlLm5leHRTaWJsaW5nICE9PSByZWZOb2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZGlzY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcmVmTm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gY29ubmVjdChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogRHluYW1pY2FsbHkgcmVwbGFjZSBhIG5vZGUgd2l0aCBhbm90aGVyIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogLSBkaXNjb25uZWN0IHRoZSBub2RlIGlmIGFscmVhZHkgaW4gdGhlIHRyZWVcbiAqIC0gZGlzY29ubmVjdCB0aGUgcmVwbGFjZWQgbm9kZVxuICogLSBjb25uZWN0IHRoZSBmaXJzdCBub2RlIGFmdGVyIHRoZSBpbnNlcnRpb25cbiAqIEBtZXRob2QgcmVwbGFjZUNoaWxkXG4gKiBAbWVtYmVyb2YgRE5BLkRPTVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBpbnNlcnQuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZOb2RlIFRoZSBub2RlIHRvIHJlcGxhY2UuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUaGUgbm9kZSBoYXMgYmVlbiBhcHBlbmRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VDaGlsZChwYXJlbnQsIGVsZW1lbnQsIHJlZk5vZGUpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGxldCBub2RlID0gZWxlbWVudC5ub2RlO1xuICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBkaXNjb25uZWN0KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQobm9kZSwgcmVmTm9kZSk7XG4gICAgICAgIGlmIChyZWZOb2RlW0NPTVBPTkVOVF9TWU1CT0xdKSB7XG4gICAgICAgICAgICBkaXNjb25uZWN0KHJlZk5vZGVbQ09NUE9ORU5UX1NZTUJPTF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25uZWN0KG5vZGUpO1xuICAgIH1cbn1cbi8qKlxuICogRHluYW1pY2FsbHkgdXBkYXRlIGEgbm9kZSBhdHRyaWJ1dGUgYW5kIGNhbGwgYWxsIHRoZSByZWFjdGlvbnMuXG4gKiBAbWV0aG9kIHNldEF0dHJpYnV0ZVxuICogQG1lbWJlcm9mIEROQS5ET01cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgYXR0cmlidXRlIG5hbWUuXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgVGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIGhhcyBiZWVuIHVwZGF0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRBdHRyaWJ1dGUoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGxldCBub2RlID0gZWxlbWVudC5ub2RlO1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICBsZXQgYXR0cnMgPSBlbGVtZW50LmNvbnN0cnVjdG9yLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgaWYgKGF0dHJzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlKGVsZW1lbnQsIG5hbWUsIG9sZFZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIER5bmFtaWNhbGx5IHJlbW92ZSBhIG5vZGUgYXR0cmlidXRlIGFuZCBjYWxsIGFsbCB0aGUgcmVhY3Rpb25zLlxuICogQG1ldGhvZCByZW1vdmVBdHRyaWJ1dGVcbiAqIEBtZW1iZXJvZiBETkEuRE9NXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGF0dHJpYnV0ZSBuYW1lLlxuICogQHJldHVybiB7Qm9vbGVhbn0gVGhlIG5vZGUgaGFzIGJlZW4gdXBkYXRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUF0dHJpYnV0ZShlbGVtZW50LCBuYW1lKSB7XG4gICAgaWYgKGVsZW1lbnQubm9kZSkge1xuICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQubm9kZTtcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBsZXQgYXR0cnMgPSBlbGVtZW50LmNvbnN0cnVjdG9yLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgaWYgKGF0dHJzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlKGVsZW1lbnQsIG5hbWUsIG9sZFZhbHVlLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENPTVBPTkVOVF9TWU1CT0wgfSBmcm9tICcuLi9saWIvc3ltYm9scy5qcyc7XG5cbi8qKlxuICogVEhlIGJhc2UgY3VzdG9tIGNvbXBvbmVudCBtaXhpbnMuIEp1c3QgYWRkIGxpZmUgY3ljbGVzIGNhbGxiYWNrIGFuZCBgaXNgIGdldHRlci5cbiAqIEBtaXhpbiBDb21wb25lbnRNaXhpblxuICogQG1lbWJlcm9mIEROQS5NSVhJTlNcbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IENvbXBvbmVudE1peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGlzIEdldCBjb21wb25lbnQgaWQuXG4gICAgICogQG5hbWUgaXNcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLkNvbXBvbmVudE1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgZ2V0IGlzKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZ2V0QXR0cmlidXRlKCdpcycpIHx8IHRoaXMubG9jYWxOYW1lKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBnZXQgbm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gYW4gaW5zdGFuY2Ugd2FzIGluc2VydGVkIGludG8gdGhlIGRvY3VtZW50LlxuICAgICAqIEBtZXRob2QgY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Db21wb25lbnRNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLm5vZGVbQ09NUE9ORU5UX1NZTUJPTF0gPSB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIGFuIGluc3RhbmNlIHdhcyBkZXRhY2hlZCBmcm9tIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAbWV0aG9kIGRpc2Nvbm5lY3RlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuQ29tcG9uZW50TWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiBhbiBhdHRyaWJ1dGUgd2FzIGFkZGVkLCByZW1vdmVkLCBvciB1cGRhdGVkLlxuICAgICAqIEBtZXRob2QgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuQ29tcG9uZW50TWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyTmFtZSBUaGUgY2hhbmdlZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb2xkVmFsIFRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGJlZm9yZSB0aGUgY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuZXdWYWwgVGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgYWZ0ZXIgdGhlIGNoYW5nZS5cbiAgICAgKi9cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soKSB7fVxufTtcbiIsImxldCBDdXN0b21FdmVudDtcblxudHJ5IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBsZXQgZXYgPSBuZXcgc2VsZi5DdXN0b21FdmVudCgndGVzdCcpO1xuICAgIEN1c3RvbUV2ZW50ID0gc2VsZi5DdXN0b21FdmVudDtcbn0gY2F0Y2goZXgpIHtcbiAgICBDdXN0b21FdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtcbiAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkZXRhaWw6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgICAgICByZXR1cm4gZXZ0O1xuICAgIH07XG4gICAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gc2VsZi5DdXN0b21FdmVudC5wcm90b3R5cGU7XG59XG5cbmV4cG9ydCB7IEN1c3RvbUV2ZW50IH07XG4iLCJpbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4vdHlwZW9mLmpzJztcbmltcG9ydCB7IEN1c3RvbUV2ZW50IH0gZnJvbSAnLi4vcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyc7XG5cbi8qKlxuICogVHJpZ2dlciBhIGN1c3RvbSBET00gRXZlbnQuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBUaGUgZXZlbnQgdGFyZ2V0LlxuICogQHBhcmFtIHtTdHJpbmd9IGV2TmFtZSBUaGUgY3VzdG9tIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBFeHRyYSBkYXRhIHRvIHBhc3MgdG8gdGhlIGV2ZW50LlxuICogQHBhcmFtIHtCb29sZWFufSBidWJibGVzIEVuYWJsZSBldmVudCBidWJibGluZy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FuY2VsYWJsZSBNYWtlIGV2ZW50IGNhbmNlbGFibGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIGV2ZW50IHByb3BhZ2F0aW9uIGhhcyBub3QgYmUgc3RvcHBlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGV2TmFtZSwgZGF0YSwgYnViYmxlcyA9IHRydWUsIGNhbmNlbGFibGUgPSB0cnVlKSB7XG4gICAgaWYgKCFpc1N0cmluZyhldk5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V2ZW50IG5hbWUgaXMgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIGxldCBldiA9IG5ldyBDdXN0b21FdmVudChldk5hbWUsIHtcbiAgICAgICAgZGV0YWlsOiBkYXRhLFxuICAgICAgICBidWJibGVzLFxuICAgICAgICBjYW5jZWxhYmxlLFxuICAgIH0pO1xuICAgIHJldHVybiBub2RlLmRpc3BhdGNoRXZlbnQoZXYpO1xufVxuIiwiaW1wb3J0IHsgaXNVbmRlZmluZWQsIGlzRnVuY3Rpb24sIGlzQXJyYXksIGlzT2JqZWN0LCBpc1N0cmluZyB9IGZyb20gJy4vdHlwZW9mLmpzJztcblxuLyoqXG4gKiBTaG9ydGN1dCB0byBgT2JqZWN0LmRlZmluZVByb3BlcnR5YC5cbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGRlZmluZSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuLyoqXG4gKiBQb3dlciB0byB0aGUgY29tcG9uZW50J3MgcHJvcGVydGllcy5cbiAqIFR5cGUgY2hlY2tpbmcsIHZhbGlkYXRpb24sIGNhbGxiYWNrcywgZXZlbnRzIGFuZCBhdHRyaWJ1dGUgc3luY2luZy5cbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFByb3BlcnR5IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBQcm9wZXJ0eSBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufEFycmF5fSBBIHNpbmdsZSBvciBhIGxpc3Qgb2YgdmFsaWQgY29uc3RydWN0b3JzIGZvciB0aGUgcHJvcGVydHkgdmFsdWUuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY3Rycykge1xuICAgICAgICB0aGlzLl8gPSBbXTtcbiAgICAgICAgY3RycyA9IGN0cnMgfHwgW107XG4gICAgICAgIGlmICghaXNBcnJheShjdHJzKSkge1xuICAgICAgICAgICAgY3RycyA9IFtjdHJzXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0cnMgPSBjdHJzO1xuICAgICAgICB0aGlzLnZhbGlkYXRvciA9ICgpID0+IHRydWU7XG4gICAgICAgIHRoaXMuX3NldHRlciA9ICh2YWwpID0+IHZhbDtcbiAgICAgICAgdGhpcy5nZXR0ZXJGbiA9ICgpID0+IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0dGVyRm4gPSAodmFsKSA9PiB7XG4gICAgICAgICAgICB2YWwgPSB0aGlzLl9zZXR0ZXIodmFsKTtcbiAgICAgICAgICAgIGlmICgodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVUeXBlKHZhbCkgJiYgdGhpcy52YWxpZGF0b3IodmFsKSkge1xuICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkKHZhbCwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYEludmFsaWQgXFxgJHt2YWx9XFxgIHZhbHVlIGZvciBcXGAke3RoaXMubmFtZX1cXGAgcHJvcGVydHkgZm9yIFxcYCR7dGhpcy5zY29wZS5pc31cXGAuYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNhbGxiYWNrIHdoZW4gdGhlIHByb3BlcnR5IGNoYW5nZXMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHRyaWdnZXIuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgb2JzZXJ2ZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykgfHwgaXNTdHJpbmcoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICB0aGlzLl8ucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNhbGxiYWNrIG9uIHByb3BlcnR5IGNoYW5nZXMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICB1bm9ic2VydmUoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGlvID0gdGhpcy5fLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICBpZiAoaW8gIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl8uc3BsaWNlKGlvLCAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBjYWxsYmFja3MgYWZ0ZXIgYSBjaGFuZ2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IG5ld1ZhbHVlIFRoZSBjdXJyZW50IHByb3BlcnR5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7Kn0gb2xkVmFsdWUgVGhlIHByZXZpb3VzIHByb3BlcnR5IHZhbHVlLlxuICAgICAqL1xuICAgIGNoYW5nZWQobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLl8ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjbGIgPSB0aGlzLl9baV07XG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcoY2xiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGVbY2xiXS5jYWxsKHRoaXMuc2NvcGUsIHRoaXMsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsYih0aGlzLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgcHJvcGVydHkgYWNjZXB0cyBhIGdpdmVuIHR5cGUgYXMgdmFsdWUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RyIFRoZSBjb25zdHJ1Y3RvciBmb3IgdGhlIGdpdmVuIHR5cGUuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBhY2NlcHRzKEN0cikge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHJzLmluZGV4T2YoQ3RyKSAhPT0gLTE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcHJvcGVydHkgbmFtZS5cbiAgICAgKiBJdCBhbHNvIHNldCB0aGUgYXR0ck5hbWUgaWYgYC5hdHRyaWJ1dGVgIG1ldGhvZCBhcyBiZWVuIHByZXZpb3VzbHlcbiAgICAgKiBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBwcm9wZXJ0eSBuYW1lLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIG5hbWVkKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgaWYgKHRoaXMuYXR0clJlcXVlc3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5hdHRyTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBwcm9wZXJ0eSBpbml0aWFsIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7Kn0gaW5pdFZhbHVlIFRoZSBwcm9wZXJ0eSBpbml0aWFsIHZhbHVlLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGRlZmF1bHQoaW5pdFZhbHVlKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gaXNPYmplY3QoaW5pdFZhbHVlKSA/XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKGluaXRWYWx1ZSkgOlxuICAgICAgICAgICAgaW5pdFZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBhdHRyaWJ1dGUgbmFtZSB0byBzeW5jLlxuICAgICAqIEludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGl0IHJldHJpZXZlIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ck5hbWUgVGhlIGF0dHJpYnV0ZSBuYW1lLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGF0dHJpYnV0ZShhdHRyTmFtZSA9IHRydWUpIHtcbiAgICAgICAgaWYgKGlzU3RyaW5nKGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5hdHRyUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmF0dHJOYW1lID0gYXR0ck5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJSZXF1ZXN0ZWQgPSAhIWF0dHJOYW1lO1xuICAgICAgICAgICAgdGhpcy5hdHRyTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkIGEgRE9NIGV2ZW50IG5hbWUgdG8gZGlzcGF0Y2ggb24gY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZOYW1lIFRoZSBldmVudCBuYW1lLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGRpc3BhdGNoKGV2TmFtZSkge1xuICAgICAgICB0aGlzLmV2ZW50TmFtZSA9IGV2TmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhIGdldHRlciBmdW5jdGlvbiBmb3IgdGhlIHByb3BlcnR5LlxuICAgICAqIEJ5IGRlZmF1bHQsIHRoZSBwcm9wZXJ0eSB2YWx1ZSB3aWxsIGJlIHJldHVybi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgcHJvcGVydHkgZ2V0dGVyLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGdldHRlcihjYWxsYmFjaykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVyRm4gPSAoKSA9PiBjYWxsYmFjayh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGEgc2V0dGVyIGZ1bmN0aW9uIGZvciB0aGUgcHJvcGVydHkuXG4gICAgICogQnkgZGVmYXVsdCwgdGhlIHByb3BlcnR5IHZhbHVlIHdpbGwgYmUgdXBkYXRlZCB3aXRoIGdpdmVuIHZhbHVlXG4gICAgICogd2l0aG91dCBhbnkgbW9kaWZpY2F0aW9uLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBwcm9wZXJ0eSBzZXR0ZXIuXG4gICAgICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBwcm9wZXJ0eSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgc2V0dGVyKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0dGVyID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcHJvcGVydHkgdmFsaWRhdG9yLlxuICAgICAqIEEgdmFsaWRhdG9yIHNob3VsZCByZXR1cm4gYHRydWVgIGlmIHRoZSB2YWx1ZSBpcyBhY2NlcHRhYmxlXG4gICAgICogb3IgYGZhbHNlYCBpZiB1bmFjY2FwdGFibGUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIHByb3BlcnR5IHZhbGlkdG9yLlxuICAgICAqIEByZXR1cm4ge1Byb3BlcnR5fSBUaGUgcHJvcGVydHkgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHZhbGlkYXRlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0b3IgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGEgdmFsaWQgdHlwZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHZhbGlkYXRlVHlwZSh2YWwpIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgY3RycyA9IHRoaXMuY3RycztcbiAgICAgICAgaWYgKGN0cnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoaSA8IGN0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgY3Ryc1tpXSB8fCAoXG4gICAgICAgICAgICAgICAgdmFsLmNvbnN0cnVjdG9yICYmIHZhbC5jb25zdHJ1Y3RvciA9PT0gY3Ryc1tpXVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoIHRoZSBwcm9wZXJ0eSB0byBhIHNjb3BlIChhIGNvbXBvbmVudCBpbnN0YW5jZSkuXG4gICAgICogU2V0IHRoZSBkZWZhdWx0IHZhbHVlIGlmIHByb3ZpZGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZSBUaGUgc2NvcGUgd2hpY2ggbmVlZHMgdG8gYmUgYm91bmQgd2l0aCB0aGUgcHJvcGVydHkuXG4gICAgICovXG4gICAgaW5pdChzY29wZSkge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgICAgIGRlZmluZShzY29wZSwgdGhpcy5uYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IHRoaXMuZ2V0dGVyRm4uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHNldDogdGhpcy5zZXR0ZXJGbi5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNjb3BlW3RoaXMubmFtZV0gPSB0aGlzLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciBQcm9wZXJ0eSBjcmVhdGlvbi5cbiAqIEBtZXRob2QgcHJvcFxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHByb3BlcnR5IHtQcm9wZXJ0eX0gQU5ZIEEgcHJvcGVydHkgd2l0aG91dCB0eXBlIHZhbGlkYXRpb24uXG4gKiBAcHJvcGVydHkge1Byb3BlcnR5fSBTVFJJTkcgQSBwcm9wZXJ0eSB3aGljaCBhY2NlcHRzIG9ubHkgc3RyaW5ncy5cbiAqIEBwcm9wZXJ0eSB7UHJvcGVydHl9IEJPT0xFQU4gQSBwcm9wZXJ0eSB3aGljaCBhY2NlcHRzIG9ubHkgYm9vbGVhbnMuXG4gKiBAcHJvcGVydHkge1Byb3BlcnR5fSBOVU1CRVIgQSBwcm9wZXJ0eSB3aGljaCBhY2NlcHRzIG9ubHkgbnVtYmVycy5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fEZ1bmN0aW9ufEFycmF5fSBjdHJzIEEgUHJvcGVydHkgdG8gY2xvbmUgb3IgYSBzaW5nbGUgb3IgYSBsaXN0IG9mIHZhbGlkIGNvbnN0cnVjdG9ycyBmb3IgdGhlIHByb3BlcnR5IHZhbHVlLlxuICogQHJldHVybiB7UHJvcGVydHl9IFRoZSBuZXcgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9wKGN0cnMpIHtcbiAgICBpZiAoY3RycyBpbnN0YW5jZW9mIFByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBjdHJzO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb3BlcnR5KGN0cnMpO1xufVxuXG4vLyBEZWZpbmUgc29tZSBoZWxwZXJzIGZvciBkZWZhdWx0IHR5cGVzXG5kZWZpbmUocHJvcCwgJ0FOWScsIHsgZ2V0KCkgeyByZXR1cm4gcHJvcCgpOyB9IH0pO1xuZGVmaW5lKHByb3AsICdTVFJJTkcnLCB7IGdldCgpIHsgcmV0dXJuIHByb3AoU3RyaW5nKTsgfSB9KTtcbmRlZmluZShwcm9wLCAnQk9PTEVBTicsIHsgZ2V0KCkgeyByZXR1cm4gcHJvcChCb29sZWFuKTsgfSB9KTtcbmRlZmluZShwcm9wLCAnTlVNQkVSJywgeyBnZXQoKSB7IHJldHVybiBwcm9wKE51bWJlcik7IH0gfSk7XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vbGliL3R5cGVvZi5qcyc7XG5pbXBvcnQgeyBkaXNwYXRjaCB9IGZyb20gJy4uL2xpYi9kaXNwYXRjaC5qcyc7XG5pbXBvcnQgeyBpc1VuZGVmaW5lZCB9IGZyb20gJy4uL2xpYi90eXBlb2YuanMnO1xuaW1wb3J0IHsgcHJvcCB9IGZyb20gJy4uL2xpYi9wcm9wZXJ0eS5qcyc7XG5cbi8qKlxuICogVHJ5IHRvIHBhcnNlIGF0dHJpYnV0ZSB2YWx1ZSBjaGVja2luZyB0aGUgcHJvcGVydHkgdmFsaWRhdGlvbiB0eXBlcy5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyVmFsIFRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcmV0dXJuIHsqfSBUaGUgcGFyc2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShwcm9wZXJ0eSwgYXR0clZhbCkge1xuICAgIGlmIChhdHRyVmFsID09PSAnJyAmJiBwcm9wZXJ0eS5hY2NlcHRzKEJvb2xlYW4pKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXByb3BlcnR5LmFjY2VwdHMoU3RyaW5nKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYXR0clZhbCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdHRyVmFsO1xufVxuXG4vKipcbiAqIFNldCBhbiBhdHRyaWJ1dGUgdmFsdWUgY2hlY2tpbmcgaXRzIHR5cGUuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRleHQgVGhlIG5vZGUgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlKGNvbnRleHQsIGF0dHIsIHZhbHVlKSB7XG4gICAgbGV0IGN1cnJlbnRBdHRyVmFsdWUgPSBjb250ZXh0LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICBpZiAoY3VycmVudEF0dHJWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgY29udGV4dC5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICAgICAgY29udGV4dC5zZXRBdHRyaWJ1dGUoYXR0ciwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRBdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBDdXN0b20gQ29tcG9uZW50IGZvciBwcm9wZXJ0aWVzIGluaXRpYWxpemF0aW9uIHZpYSBhdHRyaWJ1dGVzLlxuICogQG1peGluIFByb3BlcnRpZXNNaXhpblxuICogQG1lbWJlcm9mIEROQS5NSVhJTlNcbiAqIEBzdGF0aWNcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIG15LWNvbXBvbmVudC5qc1xuICogaW1wb3J0IHsgQmFzZUNvbXBvbmVudCB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICogICBnZXQgcHJvcGVydGllcygpIHtcbiAqICAgICByZXR1cm4geyBuYW1lOiBTdHJpbmcgfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gYXBwLmpzXG4gKiBpbXBvcnQgeyBkZWZpbmUgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gJy4vbXktY29tcG9uZW50LmpzJztcbiAqIGRlZmluZSgnbXktY29tcG9uZW50JywgTXlDb21wb25lbnQpO1xuICogdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAqIHRlbXAuaW5uZXJIVE1MID0gJzxteS1jb21wb25lbnQgbmFtZT1cIkFsYmVydFwiPjwvbXktY29tcG9uZW50Pic7XG4gKiB2YXIgZWxlbWVudCA9IHRlbXAuZmlyc3RDaGlsZDtcbiAqIGNvbnNvbGUubG9nKGVsZW1lbnQubmFtZSk7IC8vIGxvZ3MgXCJBbGJlcnRcIlxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBQcm9wZXJ0aWVzTWl4aW4gPSAoU3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBBdHRhY2ggcHJvcGVydGllcyBvbiBjb21wb25lbnQgY3JlYXRpb24uXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlByb3BlcnRpZXNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgICAgIGlmIChwcm9wcykge1xuICAgICAgICAgICAgaWYgKCFpc0FycmF5KHByb3BzKSkge1xuICAgICAgICAgICAgICAgIHByb3BzID0gW3Byb3BzXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BzID0gcHJvcHMucmVkdWNlKChyZXMsIHBhcnRpYWxQcm9wcykgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgaW4gcGFydGlhbFByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc1trXSA9IHByb3AocGFydGlhbFByb3BzW2tdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdwcm9wZXJ0aWVzJywge1xuICAgICAgICAgICAgdmFsdWU6IHByb3BzLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG9ic2VydmVkID0gdGhpcy5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGZvciAobGV0IGsgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gcHJvcHNba107XG4gICAgICAgICAgICBwcm9wLm5hbWVkKGspLmluaXQodGhpcyk7XG4gICAgICAgICAgICBsZXQgeyBhdHRyTmFtZSwgZXZlbnROYW1lIH0gPSBwcm9wO1xuICAgICAgICAgICAgaWYgKCFhdHRyTmFtZSAmJiBvYnNlcnZlZC5pbmRleE9mKGspICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHByb3AuYXR0cmlidXRlKCk7XG4gICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF0dHJOYW1lIHx8IGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIHByb3Aub2JzZXJ2ZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXR0cmlidXRlKHRoaXMubm9kZSwgYXR0ck5hbWUsIHRoaXNbcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2godGhpcy5ub2RlLCBldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU3luYyBpbml0aWFsIGF0dHJpYnV0ZXMgd2l0aCBwcm9wZXJ0aWVzLlxuICAgICAqIEBtZXRob2QgY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5Qcm9wZXJ0aWVzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICBmb3IgKGxldCBrIGluIHByb3BzKSB7XG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BzW2tdO1xuICAgICAgICAgICAgbGV0IHsgYXR0ck5hbWUgfSA9IHByb3A7XG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQodGhpc1twcm9wLm5hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2RlLmhhc0F0dHJpYnV0ZShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcC5uYW1lXSA9IGdldFZhbHVlKHByb3AsIHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEF0dHJpYnV0ZSh0aGlzLm5vZGUsIGF0dHJOYW1lLCB0aGlzW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTeW5jIGF0dHJpYnV0ZXMgd2l0aCBwcm9wZXJ0aWVzLlxuICAgICAqIEBtZXRob2QgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuUHJvcGVydGllc01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ck5hbWUgVGhlIGNoYW5nZWQgYXR0cmlidXRlIG5hbWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9sZFZhbCBUaGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBiZWZvcmUgdGhlIGNoYW5nZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3VmFsIFRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGFmdGVyIHRoZSBjaGFuZ2UuXG4gICAgICovXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHIsIG9sZFZhbCwgbmV3VmFsKSB7XG4gICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBvbGRWYWwsIG5ld1ZhbCk7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMucHJvcGVydGllcztcbiAgICAgICAgZm9yIChsZXQgayBpbiBwcm9wcykge1xuICAgICAgICAgICAgbGV0IHByb3AgPSBwcm9wc1trXTtcbiAgICAgICAgICAgIGlmIChwcm9wLmF0dHJOYW1lID09PSBhdHRyKSB7XG4gICAgICAgICAgICAgICAgdGhpc1twcm9wLm5hbWVdID0gZ2V0VmFsdWUocHJvcCwgbmV3VmFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbGlzdGVuZXIgZm9yIG5vZGUncyBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqIEBtZXRob2Qgb2JzZXJ2ZVByb3BlcnR5XG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuUHJvcGVydGllc01peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcE5hbWUgVGhlIHByb3BlcnR5IG5hbWUgdG8gb2JzZXJ2ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gZmlyZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIGBjYW5jZWxgIG1ldGhvZC5cbiAgICAgKi9cbiAgICBvYnNlcnZlUHJvcGVydHkocHJvcE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXNbcHJvcE5hbWVdLm9ic2VydmUoY2FsbGJhY2spO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmb3Igbm9kZSdzIHByb3BlcnR5IGNoYW5nZXMuXG4gICAgICogQG1ldGhvZCB1bm9ic2VydmVQcm9wZXJ0eVxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlByb3BlcnRpZXNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BOYW1lIFRoZSBwcm9wZXJ0eSBuYW1lIHRvIHVub2JzZXJ2ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHVub2JzZXJ2ZVByb3BlcnR5KHByb3BOYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcE5hbWVdLnVub2JzZXJ2ZShjYWxsYmFjayk7XG4gICAgfVxufTtcbiIsImNvbnN0IEVMRU1fUFJPVE8gPSBFbGVtZW50LnByb3RvdHlwZTtcblxuZXhwb3J0IGNvbnN0IG1hdGNoZXMgPSBFTEVNX1BST1RPLm1hdGNoZXMgfHxcbiAgICBFTEVNX1BST1RPLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgRUxFTV9QUk9UTy5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ub01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xuIiwiaW1wb3J0IHsgaXNTdHJpbmcsIGlzRnVuY3Rpb24gfSBmcm9tICcuLi9saWIvdHlwZW9mLmpzJztcbmltcG9ydCB7IG1hdGNoZXMgfSBmcm9tICcuLi9wb2x5ZmlsbHMvbWF0Y2hlcy5qcyc7XG5pbXBvcnQgeyBkaXNwYXRjaCB9IGZyb20gJy4uL2xpYi9kaXNwYXRjaC5qcyc7XG5cbmNvbnN0IFNQTElUX1NFTEVDVE9SID0gLyhbXlxcc10rKSguKik/LztcblxuLyoqXG4gKiBTaW1wbGUgQ3VzdG9tIENvbXBvbmVudCB3aXRoIGV2ZW50cyBkZWxlZ2F0aW9uLFxuICogSXQgYWxzbyBpbXBsZW1lbnQgYSBgZGlzcGF0Y2hFdmVudGAgd3JhcHBlciBuYW1lZCBgdHJpZ2dlcmAuXG4gKiBAbWl4aW4gRXZlbnRzTWl4aW5cbiAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlxuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktY29tcG9uZW50LmpzXG4gKiBpbXBvcnQgeyBCYXNlQ29tcG9uZW50IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gKiAgIGdldCBldmVudHMoKSB7XG4gKiAgICAgcmV0dXJuIHtcbiAqICAgICAgICdjbGljayBidXR0b24nOiAnb25CdXR0b25DbGljaydcbiAqICAgICB9XG4gKiAgIH1cbiAqICAgb25CdXR0b25DbGljaygpIHtcbiAqICAgICBjb25zb2xlLmxvZygnYnV0dG9uIGNsaWNrZWQnKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gYXBwLmpzXG4gKiBpbXBvcnQgeyBkZWZpbmUgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gJy4vbXktY29tcG9uZW50LmpzJztcbiAqIGRlZmluZSgnbXktY29tcG9uZW50JywgTXlDb21wb25lbnQpO1xuICogdmFyIGVsZW1lbnQgPSBuZXcgTXlDb21wb25lbnQoKTtcbiAqIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAqIGJ1dHRvbi5pbm5lclRleHQgPSAnQ2xpY2sgbWUnO1xuICogZWxlbWVudC5hcHBlbmRDaGlsZChidXR0b24pO1xuICogYnV0dG9uLmNsaWNrKCk7IC8vIGxvZ3MgXCJidXR0b24gY2xpY2tlZFwiXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IEV2ZW50c01peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgLyoqXG4gICAgICogQXR0YWNoIGFuZCBkZWxlZ2F0ZSBldmVudHMgdG8gdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuRXZlbnRzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgLy8gYmluZCBldmVudHNcbiAgICAgICAgbGV0IGV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9O1xuICAgICAgICBmb3IgKGxldCBrIGluIGV2ZW50cykge1xuICAgICAgICAgICAgbGV0IGNhbGxiYWNrID0gaXNTdHJpbmcoZXZlbnRzW2tdKSA/XG4gICAgICAgICAgICAgICAgdGhpc1tldmVudHNba11dIDpcbiAgICAgICAgICAgICAgICBldmVudHNba107XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICBsZXQgcnVsZSA9IGsubWF0Y2goU1BMSVRfU0VMRUNUT1IpO1xuICAgICAgICAgICAgICAgIGxldCBldk5hbWUgPSBydWxlWzFdO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RvciA9IChydWxlWzJdIHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZWdhdGUoZXZOYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKGV2TmFtZSwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNhbGxiYWNrIGZvciBldmVudC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZWxlZ2F0ZSBldmVudHMgdG8gdGhlIGNvbXBvbmVudCBkZXNjZW5kZW50cy5cbiAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICogQG1lbWJlcm9mIEROQS5NSVhJTlMuRXZlbnRzTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldk5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGRlbGVnYXRlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBBIENTUyBzZWxlY3RvciBmb3IgZGVzY2VuZGVudHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGZpcmUgd2hlbiB0aGUgZXZlbnQgZmlyZXMuXG4gICAgICovXG4gICAgZGVsZWdhdGUoZXZOYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZOYW1lLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldCAhPT0gdGhpcykge1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzLmNhbGwodGFyZ2V0LCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldmVudCwgdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBgTm9kZS5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudGAgd3JhcHBlci5cbiAgICAgKiBAbWV0aG9kIHRyaWdnZXJcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5FdmVudHNNaXhpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gZmlyZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBBIHNldCBvZiBjdXN0b20gZGF0YSB0byBwYXNzIHRvIHRoZSBldmVudC5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGJ1YmJsZXMgU2hvdWxkIHRoZSBldmVudCBidWJibGUgdGhyb3cgdGhlIERPTSB0cmVlLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FuY2VsYWJsZSBDYW4gYmUgdGhlIGV2ZW50IGNhbmNlbCBieSBhIGNhbGxiYWNrLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgZXZlbnQgcHJvcGFnYXRpb24gaGFzIG5vdCBiZSBzdG9wcGVkLlxuICAgICAqL1xuICAgIHRyaWdnZXIoZXZOYW1lLCBkYXRhLCBidWJibGVzID0gdHJ1ZSwgY2FuY2VsYWJsZSA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHRoaXMsIGV2TmFtZSwgZGF0YSwgYnViYmxlcywgY2FuY2VsYWJsZSk7XG4gICAgfVxufTtcbiIsImNvbnN0IHJvb3REb2MgPSBkb2N1bWVudDtcbi8qKlxuICogQ3JlYXRlIGFuZCBhdHRhY2ggYSBzdHlsZSBlbGVtZW50IGZvciBhIGNvbXBvbmVudC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBBIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBUaGUgY3JlYXRlZCBzdHlsZSBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3R5bGUobm9kZSkge1xuICAgIGxldCBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQgfHwgcm9vdERvYztcbiAgICBsZXQgc3R5bGVFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVFbGVtLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIHN0eWxlRWxlbS5zZXRBdHRyaWJ1dGUoJ2lkJywgYHN0eWxlLSR7bm9kZS5pc31gKTtcbiAgICBsZXQgaGVhZCA9IGRvYy5oZWFkO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGhlYWQuZmlyc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtLCBoZWFkLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBzdHlsZUVsZW07XG59XG4iLCJpbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL2xpYi90eXBlb2YuanMnO1xuaW1wb3J0IHsgY3JlYXRlU3R5bGUgfSBmcm9tICcuLi9saWIvc3R5bGUuanMnO1xuXG4vKipcbiAqIFNpbXBsZSBDdXN0b20gQ29tcG9uZW50IHdpdGggY3NzIHN0eWxlIGhhbmRsaW5nIHVzaW5nIHRoZSBgY3NzYCBwcm9wZXJ0eS5cbiAqIEBtaXhpbiBTdHlsZU1peGluXG4gKiBAbWVtYmVyb2YgRE5BLk1JWElOU1xuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktY29tcG9uZW50LmpzXG4gKiBpbXBvcnQgeyBCYXNlQ29tcG9uZW50IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gKiAgIGdldCBjc3MoKSB7XG4gKiAgICAgcmV0dXJuICcubXktY29tcG9uZW50IHAgeyBjb2xvcjogcmVkOyB9J1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiAvLyBhcHAuanNcbiAqIGltcG9ydCB7IGRlZmluZSB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSAnLi9teS1jb21wb25lbnQuanMnO1xuICogZGVmaW5lKCdteS1jb21wb25lbnQnLCBNeUNvbXBvbmVudCk7XG4gKiB2YXIgZWxlbWVudCA9IG5ldyBNeUNvbXBvbmVudCgpO1xuICogdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gKiBwLmlubmVyVGV4dCA9ICdQYXJhZ3JhcGgnO1xuICogZWxlbWVudC5hcHBlbmRDaGlsZChwKTsgLy8gdGV4dCBpbnNpZGUgYHBgIGdldHMgdGhlIHJlZCBjb2xvclxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBTdHlsZU1peGluID0gKFN1cGVyQ2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiBhbiBpbnN0YW5jZSBvZiB0aGUgZWxlbWVudCBpcyBjcmVhdGVkLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoIXRoaXMuY29uc3RydWN0b3Iuc3R5bGVFbGVtKSB7XG4gICAgICAgICAgICBsZXQgQ3RyID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDdHIsICdzdHlsZUVsZW0nLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGNyZWF0ZVN0eWxlKHRoaXMpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDU1MoKTtcbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgICAgdGhpcy5ub2RlLmNsYXNzTGlzdC5hZGQodGhpcy5pcyk7XG4gICAgfVxuXG4gICAgdXBkYXRlQ1NTKCkge1xuICAgICAgICBsZXQgc3R5bGUgPSB0aGlzLmNzcztcbiAgICAgICAgaWYgKGlzU3RyaW5nKHN0eWxlKSkge1xuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5zdHlsZUVsZW0udGV4dENvbnRlbnQgPSBzdHlsZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBpc1VuZGVmaW5lZCwgaXNGdW5jdGlvbiwgaXNTdHJpbmcgfSBmcm9tICcuLi9saWIvdHlwZW9mLmpzJztcblxuLyoqXG4gKiBTaW1wbGUgQ3VzdG9tIENvbXBvbmVudCB3aXRoIHRlbXBsYXRlIGhhbmRsaW5nIHVzaW5nIHRoZSBgdGVtcGxhdGVgIHByb3BlcnR5LlxuICogQG1lbWJlcm9mIEROQS5NSVhJTlNcbiAqIEBtaXhpbiBUZW1wbGF0ZU1peGluXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gU3VwZXJDbGFzcyBUaGUgY2xhc3MgdG8gZXh0ZW5kLlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBleHRlbmRlZCBjbGFzcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIC8vIG15LWNvbXBvbmVudC5qc1xuICogaW1wb3J0IHsgQmFzZUNvbXBvbmVudCB9IGZyb20gJ0BkbmFqcy9jb3JlJztcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICogICBnZXQgdGVtcGxhdGUoKSB7XG4gKiAgICAgcmV0dXJuIGA8aDE+JHt0aGlzLm5hbWV9PC9oMT5gO1xuICogICB9XG4gKiAgIGdldCBuYW1lKCkge1xuICogICAgIHJldHVybiAnTmV3dG9uJztcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBgYGBqc1xuICogLy8gYXBwLmpzXG4gKiBpbXBvcnQgeyBkZWZpbmUgfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gJy4vbXktY29tcG9uZW50LmpzJztcbiAqIGRlZmluZSgnbXktY29tcG9uZW50JywgTXlDb21wb25lbnQpO1xuICogdmFyIGVsZW1lbnQgPSBuZXcgTXlDb21wb25lbnQoKTtcbiAqIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTsgLy8gbG9ncyBcIjxoMT5OZXd0b248L2gxPlwiXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IFRlbXBsYXRlTWl4aW4gPSAoU3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICBnZXQgYXV0b1JlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaCBwcm9wZXJ0aWVzIG9ic2VydmVycyBpbiBvcmRlciB0byB1cGRhdGUgY2hpbGRyZW4uXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlRlbXBsYXRlTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1JlbmRlciAmJiAhaXNVbmRlZmluZWQodGhpcy50ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIGxldCBwcm9wcyA9IHRoaXMucHJvcGVydGllcztcbiAgICAgICAgICAgIGlmIChwcm9wcykge1xuICAgICAgICAgICAgICAgIGxldCBjYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNba10ub2JzZXJ2ZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbmRlciB0aGUgY29tcG9uZW50IHdoZW4gY29ubmVjdGVkLlxuICAgICAqIEBtZXRob2QgY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgKiBAbWVtYmVyb2YgRE5BLk1JWElOUy5UZW1wbGF0ZU1peGluXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQodGhpcy50ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlIENvbXBvbmVudCBjaGlsZCBub2Rlcy5cbiAgICAgKiBAbWV0aG9kIHJlbmRlclxuICAgICAqIEBtZW1iZXJvZiBETkEuTUlYSU5TLlRlbXBsYXRlTWl4aW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSB0cGwgQSB0ZW1wbGF0ZSB0byB1c2UgaW5zdGVhZCBvZiBgdGhpcy50ZW1wbGF0ZWAuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IFdpbGwgdGhyb3cgaWYgdGhlIHRlbXBsYXRlIHR5cGUgaXMgbm90IHN1cHBvcnRlZC5cbiAgICAgKi9cbiAgICByZW5kZXIodHBsKSB7XG4gICAgICAgIHRwbCA9IHRwbCB8fCB0aGlzLnRlbXBsYXRlO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICBpZiAoaXNGdW5jdGlvbih0cGwpKSB7XG4gICAgICAgICAgICB0cGwuY2FsbCh0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyh0cGwpKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuaW5uZXJIVE1MID0gdHBsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB0ZW1wbGF0ZSBwcm9wZXJ0eS4nKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBwcmVmZXItcmVzdC1wYXJhbXMgKi9cbmV4cG9ydCBjb25zdCByZWR1Y2UgPSBBcnJheS5wcm90b3R5cGUucmVkdWNlIHx8IGZ1bmN0aW9uKGNhbGxiYWNrIC8qLCBpbml0aWFsVmFsdWUqLyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgbGV0IHQgPSB0aGlzO1xuICAgIGxldCBsZW4gPSB0Lmxlbmd0aDtcbiAgICBsZXQgayA9IDA7XG4gICAgbGV0IHZhbHVlO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHZhbHVlID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChrIDwgbGVuICYmICEoayBpbiB0KSkge1xuICAgICAgICAgICAgaysrO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlID0gdFtrKytdO1xuICAgIH1cbiAgICBmb3IgKDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgIGlmIChrIGluIHQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRba10sIGssIHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn07XG4iLCIvKipcbiAqIEBhdXRob3IgSnVzdGluIEZhZ25hbmlcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2p1c3RpbmZhZ25hbmkvbWl4d2l0aC5qc1xuICovXG5pbXBvcnQgeyByZWR1Y2UgfSBmcm9tICcuLi9wb2x5ZmlsbHMvcmVkdWNlLmpzJztcblxuLyoqXG4gKiBNaXggYSBjbGFzcyB3aXRoIGEgbWl4aW4uXG4gKiBAbWV0aG9kIG1peCguLi4pLndpdGgoLi4uKVxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDbGFzcyBUaGUgY2xhc3MgdG8gZXh0ZW5kLlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbWl4ZWQgY2xhc3MuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAvLyBteS1zdXBlci5qc1xuICogZXhwb3J0IGNsYXNzIE15U3VwZXJDbGFzcyB7XG4gKiAgICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICogICAgIH1cbiAqIH1cbiAqIGBgYFxuICogYGBganNcbiAqIC8vIG1peGluLmpzXG4gKiBleHBvcnQgY29uc3QgTWl4aW4gPSAoc3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kIHN1cGVyQ2xhc3Mge1xuICogICAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgICAgICBzdXBlcigpO1xuICogICAgICAgICAvLyBkbyBzb21ldGhpbmcgZWxzZVxuICogICAgIH1cbiAqIH07XG4gKiBgYGBcbiAqIGBgYGpzXG4gKiBpbXBvcnQgeyBtaXggfSBmcm9tICdAZG5hanMvY29yZSc7XG4gKiBpbXBvcnQgeyBNeVN1cGVyQ2xhc3MgfSBmcm9tICcuL215LXN1cGVyLmpzJztcbiAqIGltcG9ydCB7IE1peGluIH0gZnJvbSAnLi9taXhpbi5qcyc7XG4gKlxuICogZXhwb3J0IGNsYXNzIE1peGVkQ2xhc3MgZXh0ZW5kcyBtaXgoTXlTdXBlckNsYXNzKS53aXRoKE1peGluKSB7XG4gKiAgICAgLi4uXG4gKiB9XG4gKiBgYGBcbiAqL1xuXG4vKipcbiAqIEEgTWl4aW4gaGVscGVyIGNsYXNzLlxuICogQGlnbm9yZVxuICovXG5jbGFzcyBNaXhpbiB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbWl4YWJsZSBjbGFzcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlckNsYXNzIFRoZSBjbGFzcyB0byBleHRlbmQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3VwZXJjbGFzcykge1xuICAgICAgICBzdXBlcmNsYXNzID0gc3VwZXJjbGFzcyB8fCBjbGFzcyB7fTtcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gc3VwZXJjbGFzcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWl4IHRoZSBzdXBlciBjbGFzcyB3aXRoIGEgbGlzdCBvZiBtaXhpbnMuXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbWl4aW5zICpOKiBtaXhpbiBmdW5jdGlvbnMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBleHRlbmRlZCBjbGFzcy5cbiAgICAgKi9cbiAgICB3aXRoKCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgbGV0IGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICAgIHJldHVybiByZWR1Y2UuY2FsbChhcmdzLCAoYywgbWl4aW4pID0+IG1peGluKGMpLCB0aGlzLnN1cGVyY2xhc3MpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBNaXhpbiBpbnN0YW5jZS5cbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNvbnN0IG1peCA9IChzdXBlckNsYXNzKSA9PiBuZXcgTWl4aW4oc3VwZXJDbGFzcyk7XG4iLCJpbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gJy4vcmVnaXN0cnkuanMnO1xuaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuL3R5cGVvZi5qcyc7XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBub2RlIGlzIGFscmVhZHkgaW5zdGFudGlhdGVkIEhUTUxFbGVtZW50IGZvciBwcm9ncmFtbWF0aWNhbGx5IGBjb25zdHJ1Y3RvcmAgY2FsbHMuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgbm9kZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRoZSBub2RlIHNob3VsZCBiZSBpbnN0YW50aWF0ZWQuXG4gKi9cbmZ1bmN0aW9uIGlzTmV3KG5vZGUpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gIWlzU3RyaW5nKG5vZGUub3V0ZXJIVE1MKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbi8qKlxuICogU2hpbSBvcmlnaW5hbCBFbGVtZW50IGNvbnN0cnVjdG9ycyBpbiBvcmRlciB0byBiZSB1c2VkIHdpdGggYG5ld2AuXG4gKiBAbWV0aG9kIHNoaW1cbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IE9yaWdpbmFsIFRoZSBvcmlnaW5hbCBjb25zdHJ1Y3RvciB0byBzaGltLlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaGltbWVkIGNvbnN0cnVjdG9yLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gc2hpbSBhdWRpbyBlbGVtZW50XG4gKiBpbXBvcnQgeyBzaGltIH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICpcbiAqIGNsYXNzIE15QXVkaW8gZXh0ZW5kcyBzaGltKEhUTUxBdWRpb0VsZW1lbnQpIHtcbiAqICAgICAuLi5cbiAqIH1cbiAqXG4gKiBsZXQgYXVkaW8gPSBuZXcgTXlBdWRpbygpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaGltKE9yaWdpbmFsKSB7XG4gICAgY2xhc3MgUG9seWZpbGxlZCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgaWYgKCFpc05ldyh0aGlzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGRlc2MgPSByZWdpc3RyeS5nZXREZXNjcmlwdG9yKHRoaXMuY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgbGV0IGNvbmZpZyA9IGRlc2MuY29uZmlnO1xuICAgICAgICAgICAgLy8gRmluZCB0aGUgdGFnbmFtZSBvZiB0aGUgY29uc3RydWN0b3IgYW5kIGNyZWF0ZSBhIG5ldyBlbGVtZW50IHdpdGggaXRcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICBjb25maWcuZXh0ZW5kcyA/IGNvbmZpZy5leHRlbmRzIDogZGVzYy5pc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGVsZW1lbnQuX19wcm90b19fID0gZGVzYy5DdHIucHJvdG90eXBlO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5leHRlbmRzKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lzJywgZGVzYy5pcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBDbG9uZSB0aGUgcHJvdG90eXBlIG92ZXJyaWRpbmcgdGhlIGNvbnN0cnVjdG9yLlxuICAgIFBvbHlmaWxsZWQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShPcmlnaW5hbC5wcm90b3R5cGUsIHtcbiAgICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgIHZhbHVlOiBQb2x5ZmlsbGVkLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIFBvbHlmaWxsZWQ7XG59XG4iLCJpbXBvcnQgKiBhcyBET01fSEVMUEVSUyBmcm9tICcuL2xpYi9kb20uanMnO1xuaW1wb3J0IHsgQ29tcG9uZW50TWl4aW4gfSBmcm9tICcuL21peGlucy9jb21wb25lbnQuanMnO1xuaW1wb3J0IHsgUHJvcGVydGllc01peGluIH0gZnJvbSAnLi9taXhpbnMvcHJvcGVydGllcy1jb21wb25lbnQuanMnO1xuaW1wb3J0IHsgRXZlbnRzTWl4aW4gfSBmcm9tICcuL21peGlucy9ldmVudHMtY29tcG9uZW50LmpzJztcbmltcG9ydCB7IFN0eWxlTWl4aW4gfSBmcm9tICcuL21peGlucy9zdHlsZS1jb21wb25lbnQuanMnO1xuaW1wb3J0IHsgVGVtcGxhdGVNaXhpbiB9IGZyb20gJy4vbWl4aW5zL3RlbXBsYXRlLWNvbXBvbmVudC5qcyc7XG5cbi8qKlxuICogQSBzZXQgb2YgRE9NIGhlbHBlcnMgZm9yIGNhbGxiYWNrcyB0cmlnZ2VyIHdoZW4gQ3VzdG9tIEVsZW1lbnRzXG4gKiBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci5cbiAqIEBuYW1lIERPTVxuICogQG5hbWVzcGFjZSBET01cbiAqIEBtZW1iZXJvZiEgRE5BLlxuICogQHN0YXRpY1xuICovXG5leHBvcnQgY29uc3QgRE9NID0gRE9NX0hFTFBFUlM7XG4vKipcbiAqIEEgc2V0IG9mIGNvcmUgbWl4aW5zLlxuICogQG5hbWUgTUlYSU5TXG4gKiBAbmFtZXNwYWNlIE1JWElOU1xuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKi9cbmV4cG9ydCBjb25zdCBNSVhJTlMgPSB7XG4gICAgQ29tcG9uZW50TWl4aW4sXG4gICAgUHJvcGVydGllc01peGluLFxuICAgIEV2ZW50c01peGluLFxuICAgIFN0eWxlTWl4aW4sXG4gICAgVGVtcGxhdGVNaXhpbixcbn07XG5leHBvcnQgeyBtaXggfSBmcm9tICcuL2xpYi9taXhpbnMuanMnO1xuZXhwb3J0IHsgcHJvcCB9IGZyb20gJy4vbGliL3Byb3BlcnR5LmpzJztcbmV4cG9ydCB7IHNoaW0gfSBmcm9tICcuL2xpYi9zaGltLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbGliL3N5bWJvbHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvdHlwZW9mLmpzJztcbiIsIi8qKlxuICogRE5BXG4gKiAoYykgMjAxNS0yMDE2IENoaWFsYWIgKGh0dHA6Ly93d3cuY2hpYWxhYi5jb20pIDxkZXZAY2hpYWxhYi5pbz5cbiAqIGh0dHA6Ly9kbmEuY2hpYWxhYi5pb1xuICpcbiAqIEp1c3QgYW5vdGhlciBjb21wb25lbnRzIHBhdHRlcm4uXG4gKiBVc2Ugd2l0aCBDdXN0b20gRWxlbWVudHMgc3BlY3MuXG4gKi9cbmltcG9ydCB7IG1peCwgcHJvcCwgc2hpbSwgRE9NLCBNSVhJTlMgfSBmcm9tICcuL3NyYy9jb3JlLmpzJztcbmltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi9zcmMvbGliL3JlZ2lzdHJ5LmpzJztcblxuLyoqXG4gKiBAbmFtZXNwYWNlIEROQVxuICovXG5leHBvcnQgeyBtaXgsIHByb3AsIHNoaW0sIERPTSwgTUlYSU5TIH07XG5leHBvcnQgeyByZWdpc3RyeSB9O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgbmV3IGNvbXBvbmVudC5cbiAqIEBtZXRob2QgZGVmaW5lXG4gKiBAbWVtYmVyb2YhIEROQS5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgaWQgb2YgdGhlIGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IEN0ciBUaGUgY29tcG9uZW50IGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBPcHRpb25hbCBjb21wb25lbnQgY29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZSh0YWdOYW1lLCBDb21wb25lbnQsIGNvbmZpZykge1xuICAgIHJldHVybiByZWdpc3RyeS5kZWZpbmUodGFnTmFtZSwgQ29tcG9uZW50LCBjb25maWcpO1xufVxuLyoqXG4gKiBDcmVhdGUgYW5kIGFwcGVuZCBhIG5ldyBjb21wb25lbnQgaW5zdGFuY2UuXG4gKiBAbWV0aG9kIHJlbmRlclxuICogQG1lbWJlcm9mISBETkEuXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgcGFyZW50IG5vZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDb21wb25lbnQgVGhlIGNvbXBvbmVudCBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBPcHRpb25hbCBzZXQgb2YgcHJvcGVydGllcyB0byBzZXQgdG8gdGhlIGNvbXBvbmVudC5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBUaGUgbmV3IGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihub2RlLCBDb21wb25lbnQsIHByb3BzKSB7XG4gICAgbGV0IGVsZW1lbnQgPSBuZXcgQ29tcG9uZW50KCk7XG4gICAgZm9yIChsZXQgayBpbiBwcm9wcykge1xuICAgICAgICBlbGVtZW50W2tdID0gcHJvcHNba107XG4gICAgfVxuICAgIERPTS5hcHBlbmRDaGlsZChub2RlLCBlbGVtZW50KTtcbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBTaW1wbGUgQ3VzdG9tIENvbXBvbmVudCB3aXRoIHNvbWUgYmVoYXZpb3JzLlxuICogQGNsYXNzIEJhc2VDb21wb25lbnRcbiAqIEBleHRlbmRzIEhUTUxFbGVtZW50XG4gKiBAbWVtYmVyb2YgRE5BLlxuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogLy8gbXktY29tcG9uZW50LmpzXG4gKiBpbXBvcnQgeyBCYXNlQ29tcG9uZW50IH0gZnJvbSAnQGRuYWpzL2NvcmUnO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gKiAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICogICAgIHJldHVybiBbJy4uLicsICcuLi4nXTtcbiAqICAgfVxuICogICBnZXQgY3NzKCkge1xuICogICAgIHJldHVybiAnLi4uJztcbiAqICAgfVxuICogICBnZXQgZXZlbnRzKCkge1xuICogICAgIHJldHVybiB7XG4gKiAgICAgICAnLi4uJzogJy4uLidcbiAqICAgICB9O1xuICogICB9XG4gKiAgIGdldCB0ZW1wbGF0ZSgpIHtcbiAqICAgICByZXR1cm4gJy4uLic7XG4gKiAgIH1cbiAqICAgZ2V0IHByb3BlcnRpZXMoKSB7XG4gKiAgICAgcmV0dXJuIHsgLi4uIH07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgQmFzZUNvbXBvbmVudCBleHRlbmRzIG1peChcbiAgICBzaGltKHNlbGYuSFRNTEVsZW1lbnQpXG4pLndpdGgoXG4gICAgTUlYSU5TLkNvbXBvbmVudE1peGluLFxuICAgIE1JWElOUy5Qcm9wZXJ0aWVzTWl4aW4sXG4gICAgTUlYSU5TLlN0eWxlTWl4aW4sXG4gICAgTUlYSU5TLkV2ZW50c01peGluLFxuICAgIE1JWElOUy5UZW1wbGF0ZU1peGluXG4pIHt9XG4iLCJpbXBvcnQgeyBET00gfSBmcm9tICdAZG5hanMvY29yZSc7XG5cbmZ1bmN0aW9uIG9uQ3JlYXRpb24obm9kZXMpIHtcbiAgICBbXS5mb3JFYWNoLmNhbGwobm9kZXMsIChub2RlKSA9PiB7XG4gICAgICAgIGlmICghbm9kZS5pcykge1xuICAgICAgICAgICAgaWYoRE9NLmJpbmQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBET00uY29ubmVjdChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERPTS5jb25uZWN0KG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBvbkNyZWF0aW9uKG5vZGUuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmNvbnN0IE9CU0VSVkVSID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICBzd2l0Y2ggKG11dGF0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0Jzoge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICBvbkNyZWF0aW9uKG11dGF0aW9uLmFkZGVkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnJlbW92ZWROb2Rlcykge1xuICAgICAgICAgICAgICAgIG11dGF0aW9uLnJlbW92ZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIERPTS5kaXNjb25uZWN0KG5vZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnYXR0cmlidXRlcyc6IHtcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAnaXMnKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG11dGF0aW9uLnRhcmdldDtcbiAgICAgICAgICAgIERPTS51cGRhdGUoXG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgICAgIG11dGF0aW9uLm9sZFZhbHVlLFxuICAgICAgICAgICAgICAgIG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbk9CU0VSVkVSLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG59KTtcbiIsIi8qKlxuICogRE5BXG4gKiAoYykgMjAxNS0yMDE2IENoaWFsYWIgKGh0dHA6Ly93d3cuY2hpYWxhYi5jb20pIDxkZXZAY2hpYWxhYi5pbz5cbiAqIGh0dHA6Ly9kbmEuY2hpYWxhYi5pb1xuICpcbiAqIEp1c3QgYW5vdGhlciBjb21wb25lbnRzIHBhdHRlcm4uXG4gKiBVc2Ugd2l0aCBNdXRhdGlvbk9ic2VydmVyIEFQSS5cbiAqL1xuaW1wb3J0ICcuL29ic2VydmVyLmpzJztcbmV4cG9ydCAqIGZyb20gJ0BkbmFqcy9jb3JlJztcbiJdLCJuYW1lcyI6WyJpc0Z1bmN0aW9uIiwib2JqIiwiaXNTdHJpbmciLCJpc09iamVjdCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImlzVW5kZWZpbmVkIiwiaXNBcnJheSIsIkFycmF5IiwicmVnaXN0cnkiLCJuYW1lIiwiQ3RyIiwiY29uZmlnIiwiY29tcG9uZW50cyIsInRvTG93ZXJDYXNlIiwiayIsImRlc2MiLCJnZXREZXNjcmlwdG9yIiwiQ09NUE9ORU5UX1NZTUJPTCIsIkNPTk5FQ1RFRCIsIkRJU0NPTk5FQ1RFRCIsIlVQREFURUQiLCJnZXRDb21wb25lbnQiLCJlbGVtZW50IiwiZnVsbCIsIm5vZGUiLCJub2RlVHlwZSIsIk5vZGUiLCJFTEVNRU5UX05PREUiLCJnZXRBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0IiwiaXNDb21wb25lbnQiLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInVwZGF0ZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJiaW5kIiwiX19wcm90b19fIiwiZGVmaW5lUHJvcGVydHkiLCJjcmVhdGVFbGVtZW50IiwiaXMiLCJhcHBlbmRDaGlsZCIsInBhcmVudCIsInBhcmVudE5vZGUiLCJsYXN0RWxlbWVudENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJyZWZOb2RlIiwibmV4dFNpYmxpbmciLCJyZXBsYWNlQ2hpbGQiLCJzZXRBdHRyaWJ1dGUiLCJ2YWx1ZSIsImF0dHJzIiwiY29uc3RydWN0b3IiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJpbmRleE9mIiwicmVtb3ZlQXR0cmlidXRlIiwiQ29tcG9uZW50TWl4aW4iLCJTdXBlckNsYXNzIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsImxvY2FsTmFtZSIsIkN1c3RvbUV2ZW50IiwiZXYiLCJzZWxmIiwiZXgiLCJldmVudCIsInBhcmFtcyIsInVuZGVmaW5lZCIsImV2dCIsImRvY3VtZW50IiwiY3JlYXRlRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRldGFpbCIsImRpc3BhdGNoIiwiZXZOYW1lIiwiZGF0YSIsIlR5cGVFcnJvciIsImRpc3BhdGNoRXZlbnQiLCJkZWZpbmUiLCJQcm9wZXJ0eSIsImN0cnMiLCJfIiwidmFsaWRhdG9yIiwiX3NldHRlciIsInZhbCIsImdldHRlckZuIiwic2V0dGVyRm4iLCJ2YWxpZGF0ZVR5cGUiLCJjaGFuZ2VkIiwic2NvcGUiLCJvYnNlcnZlIiwiY2FsbGJhY2siLCJwdXNoIiwidW5vYnNlcnZlIiwiaW8iLCJzcGxpY2UiLCJpIiwibGVuIiwibGVuZ3RoIiwiY2xiIiwiYWNjZXB0cyIsIm5hbWVkIiwiYXR0clJlcXVlc3RlZCIsImF0dHJOYW1lIiwiZGVmYXVsdCIsImluaXRWYWx1ZSIsImRlZmF1bHRWYWx1ZSIsImZyZWV6ZSIsImF0dHJpYnV0ZSIsImV2ZW50TmFtZSIsImdldHRlciIsInNldHRlciIsInZhbGlkYXRlIiwiaW5pdCIsInByb3AiLCJTdHJpbmciLCJCb29sZWFuIiwiTnVtYmVyIiwiZ2V0VmFsdWUiLCJwcm9wZXJ0eSIsImF0dHJWYWwiLCJKU09OIiwicGFyc2UiLCJjb250ZXh0IiwiYXR0ciIsImN1cnJlbnRBdHRyVmFsdWUiLCJQcm9wZXJ0aWVzTWl4aW4iLCJwcm9wcyIsInByb3BlcnRpZXMiLCJyZWR1Y2UiLCJyZXMiLCJwYXJ0aWFsUHJvcHMiLCJvYnNlcnZlZCIsImhhc0F0dHJpYnV0ZSIsIm9sZFZhbCIsIm5ld1ZhbCIsIm9ic2VydmVQcm9wZXJ0eSIsInByb3BOYW1lIiwidW5vYnNlcnZlUHJvcGVydHkiLCJFTEVNX1BST1RPIiwiRWxlbWVudCIsIm1hdGNoZXMiLCJtYXRjaGVzU2VsZWN0b3IiLCJtb3pNYXRjaGVzU2VsZWN0b3IiLCJtc01hdGNoZXNTZWxlY3RvciIsIm9NYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJTUExJVF9TRUxFQ1RPUiIsIkV2ZW50c01peGluIiwiZXZlbnRzIiwicnVsZSIsIm1hdGNoIiwic2VsZWN0b3IiLCJ0cmltIiwiZGVsZWdhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwidGFyZ2V0IiwidHJpZ2dlciIsInJvb3REb2MiLCJjcmVhdGVTdHlsZSIsImRvYyIsIm93bmVyRG9jdW1lbnQiLCJzdHlsZUVsZW0iLCJ0eXBlIiwiaGVhZCIsImZpcnN0RWxlbWVudENoaWxkIiwiU3R5bGVNaXhpbiIsInVwZGF0ZUNTUyIsImNsYXNzTGlzdCIsImFkZCIsInN0eWxlIiwiY3NzIiwidGV4dENvbnRlbnQiLCJUZW1wbGF0ZU1peGluIiwiYXV0b1JlbmRlciIsInRlbXBsYXRlIiwicmVuZGVyIiwidHBsIiwiaW5uZXJIVE1MIiwidCIsImFyZ3VtZW50cyIsIk1peGluIiwic3VwZXJjbGFzcyIsIndpdGgiLCJhcmdzIiwic2xpY2UiLCJjIiwibWl4aW4iLCJtaXgiLCJzdXBlckNsYXNzIiwiaXNOZXciLCJvdXRlckhUTUwiLCJzaGltIiwiT3JpZ2luYWwiLCJQb2x5ZmlsbGVkIiwiZXh0ZW5kcyIsImNyZWF0ZSIsIkRPTSIsIkRPTV9IRUxQRVJTIiwiTUlYSU5TIiwiQ29tcG9uZW50IiwiQmFzZUNvbXBvbmVudCIsIkhUTUxFbGVtZW50Iiwib25DcmVhdGlvbiIsIm5vZGVzIiwiZm9yRWFjaCIsImNoaWxkcmVuIiwiT0JTRVJWRVIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwicmVtb3ZlZE5vZGVzIiwiYXR0cmlidXRlTmFtZSIsImJvZHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPLFNBQVNBLFVBQVQsQ0FBb0JDLEdBQXBCLEVBQXlCO1NBQ3JCLE9BQU9BLEdBQVAsS0FBZSxVQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNDLFFBQVQsQ0FBa0JELEdBQWxCLEVBQXVCO1NBQ25CLE9BQU9BLEdBQVAsS0FBZSxRQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNFLFFBQVQsQ0FBa0JGLEdBQWxCLEVBQXVCO1NBQ25CRyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLEdBQS9CLE1BQXdDLGlCQUEvQzs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNPLFdBQVQsQ0FBcUJQLEdBQXJCLEVBQTBCO1NBQ3RCLE9BQU9BLEdBQVAsS0FBZSxXQUF0Qjs7Ozs7Ozs7Ozs7QUFXSixBQUFPLFNBQVNRLE9BQVQsQ0FBaUJSLEdBQWpCLEVBQXNCO1NBQ2xCUyxNQUFNRCxPQUFOLENBQWNSLEdBQWQsQ0FBUDs7O0FDeERKOzs7Ozs7OztBQVFBLEFBQU8sSUFB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