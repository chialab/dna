'use strict';

// shim for Safari
// https://github.com/babel/babel/issues/1548
// https://bugs.webkit.org/show_bug.cgi?id=114457

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (typeof HTMLElement !== 'function') {
    var _HTMLElement = function _HTMLElement() {};
    _HTMLElement.prototype = HTMLElement.prototype;
    HTMLElement = _HTMLElement;
}

/**
 * This is the model to use to create DNA Custom Components.
 */

var DNAComponent = (function (_HTMLElement2) {
    _inherits(DNAComponent, _HTMLElement2);

    function DNAComponent() {
        _classCallCheck(this, DNAComponent);

        _get(Object.getPrototypeOf(DNAComponent.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(DNAComponent, [{
        key: 'createdCallback',

        /**
         * Fires when an instance of the element is created.
         */
        value: function createdCallback() {}
        //

        /**
         * Fires when an instance was inserted into the document.
         */

    }, {
        key: 'attachedCallback',
        value: function attachedCallback() {}
        //

        /**
         * Fires when an attribute was added, removed, or updated.
         * @param {String} attrName The changed attribute name.
         * @param {*} oldVal The value of the attribute before the change.
         * @param {*} newVal The value of the attribute after the change.
         */

    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(attrName, oldVal, newVal) {}
        //

        /**
         * The tag name of the custom element.
         * @type {String}
         */

    }], [{
        key: 'init',

        /**
         * Register the custom element.
         * @param {String} ext The name of an Element to extend (optional).
         */
        value: function init() {
            var ext = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (this.register(this, ext)) {
                this.template = this.getTemplate();
            }
        }
    }, {
        key: 'register',
        value: function register(fn, ext, tagName) {
            tagName = tagName || fn.tagName || DNAComponent.classToElement(fn);
            var options = {
                prototype: fn.prototype
            };
            if (ext) {
                options['extends'] = ext;
            }
            // Retrieve the Custom Element tag name.
            try {
                var ctr = window[DNAComponent.elementToClass(tagName)] = document.registerElement(tagName, options);
                ctr.tagName = tagName;
            } catch (ex) {
                return false;
            } finally {
                return true;
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
         * Convert a Class name into HTML tag.
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

        /**
         * Convert a HTML tag into a Class name.
         * @param {Class} fn Grab the class name from this tag.
         * @return {String} The class name for the Custom Element.
         */
    }, {
        key: 'elementToClass',
        value: function elementToClass(tag) {
            return tag.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
                if (+match === 0) return '';
                return match.toUpperCase();
            }).replace(/[\-|\_]/g, '');
        }
    }, {
        key: 'tagName',
        get: function get() {
            return this._tagName || DNAComponent.classToElement(this);
        },
        set: function set(tag) {
            if (typeof tag == 'string') {
                this._tagName = tag;
            }
        }
    }]);

    return DNAComponent;
})(HTMLElement);
//# sourceMappingURL=dna-component.next.js.map
