'use strict';

/**
 * This is the base model to use to create DNA Custom Components.
 */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DNABaseComponent = (function (_HTMLElement) {
    _inherits(DNABaseComponent, _HTMLElement);

    function DNABaseComponent() {
        _classCallCheck(this, DNABaseComponent);

        _get(Object.getPrototypeOf(DNABaseComponent.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(DNABaseComponent, [{
        key: 'createdCallback',

        /**
         * Fires when an instance of the element is created.
         * @private
         */
        value: function createdCallback() {
            // Add scope style class
            if (this.constructor.tagName) {
                this.classList.add(this.constructor.tagName);
            }
            // Render the template
            if (this.constructor.template) {
                this.innerHTML = this.constructor.template.innerHTML || '';
            }
            if (typeof this.created == 'function') {
                this.created.apply(this, arguments);
            }
        }

        /**
         * Fires when an instance was inserted into the document.
         * @private
         */
    }, {
        key: 'attachedCallback',
        value: function attachedCallback() {
            if (typeof this.attached == 'function') {
                this.attached.apply(this, arguments);
            }
        }

        /**
         * Fires when an attribute was added, removed, or updated.
         * @private
         * @param {String} attrName The changed attribute name.
         * @param {*} oldVal The value of the attribute before the change.
         * @param {*} newVal The value of the attribute after the change.
         */
    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(attrName, oldVal, newVal) {
            if (typeof this.attributeChanged == 'function') {
                this.attributeChanged(attrName, oldVal, newVal);
            }
        }

        /**
         * Abstract `created` callback. Extend in your component!
         */
    }, {
        key: 'created',
        value: function created() {}

        /**
         * Abstract `attached` callback. Extend in your component!
         */
    }, {
        key: 'attached',
        value: function attached() {}

        /**
         * Abstract `attributeChanged` callback. Extend in your component!
         * @param {String} attrName The changed attribute name.
         * @param {*} oldVal The value of the attribute before the change.
         * @param {*} newVal The value of the attribute after the change.
         */
    }, {
        key: 'attributeChanged',
        value: function attributeChanged(attrName, oldVal, newVal) {}

        /**
         * Register the custom element.
         * @param {String} ext The name of an Element to extend (optional).
         */
    }], [{
        key: 'init',
        value: function init() {
            var ext = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            var fn = this,
                options = {
                prototype: fn.prototype
            };
            if (ext) {
                options['extends'] = ext;
            }
            // Retrieve the Custom Element tag name.
            var tagName = fn.tagName;
            if (!tagName) {
                fn.tagName = tagName = DNABaseComponent.classToElement(fn);
            }
            try {
                document.registerElement(tagName, options);
            } catch (ex) {
                //
            } finally {
                fn.template = DNABaseComponent.getTemplate();
            }
        }

        /**
         * Instantiate an element.
         * This is a sort of constructor.
         */
    }, {
        key: 'instantiate',
        value: function instantiate() {
            var tag = this.tagName || this.classToElement(this);
            return document.createElement(tag);
        }

        /**
         * Get current component template.
         * Uses `document.currentScript`, so use only on initialization!
         * @return {HTMLTemplateElement} The template element of the component.
         */
    }, {
        key: 'getTemplate',
        value: function getTemplate() {
            if (document.currentScript && document.currentScript.parentNode) {
                return document.currentScript.parentNode.querySelector('template');
            }
        }

        /**
         * Convert a Class name to HTML tag.
         * @param {Class} fn Grab the tag name from this class.
         * @return {String} The tag name for the Custom Element.
         */
    }, {
        key: 'classToElement',
        value: function classToElement(fn) {
            return fn.name.replace(/[A-Z]/g, function (match) {
                return '-' + match.toLowerCase();
            }).replace(/^\-/, '');
        }
    }]);

    return DNABaseComponent;
})(HTMLElement);
//# sourceMappingURL=dna-base-component.next.js.map
