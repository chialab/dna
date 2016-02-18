!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.virtualDom=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":15}],2:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":35}],3:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":22}],4:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":1,"./diff.js":2,"./h.js":3,"./patch.js":13,"./vnode/vnode.js":31,"./vnode/vtext.js":33}],5:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":9}],8:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":8}],10:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":6}],11:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],12:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],13:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":18}],14:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":26,"is-object":11}],15:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":24,"../vnode/is-vnode.js":27,"../vnode/is-vtext.js":28,"../vnode/is-widget.js":29,"./apply-properties":14,"global/document":10}],16:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],17:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":29,"../vnode/vpatch.js":32,"./apply-properties":14,"./update-widget":19}],18:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":15,"./dom-index":16,"./patch-op":17,"global/document":10,"x-is-array":12}],19:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":29}],20:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":7}],21:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],22:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":25,"../vnode/is-vhook":26,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vnode.js":31,"../vnode/vtext.js":33,"./hooks/ev-hook.js":20,"./hooks/soft-set-hook.js":21,"./parse-tag.js":23,"x-is-array":12}],23:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":5}],24:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":25,"./is-vnode":27,"./is-vtext":28,"./is-widget":29}],25:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],26:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],27:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":30}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":30}],29:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],30:[function(require,module,exports){
module.exports = "2"

},{}],31:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":25,"./is-vhook":26,"./is-vnode":27,"./is-widget":29,"./version":30}],32:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":30}],33:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":30}],34:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":26,"is-object":11}],35:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":24,"../vnode/is-thunk":25,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vpatch":32,"./diff-props":34,"x-is-array":12}]},{},[4])(4)
});
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version 0.7.19
if (typeof WeakMap === "undefined") {
    (function() {
        var defineProperty = Object.defineProperty;
        var counter = Date.now() % 1e9;
        var WeakMap = function() {
            this.name = "__st" + (Math.random() * 1e9 >>> 0) + (counter++ + "__");
        };
        WeakMap.prototype = {
            set: function(key, value) {
                var entry = key[this.name];
                if (entry && entry[0] === key) entry[1] = value;
                else defineProperty(key, this.name, {
                    value: [key, value],
                    writable: true
                });
                return this;
            },
            get: function(key) {
                var entry;
                return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined;
            },
            "delete": function(key) {
                var entry = key[this.name];
                if (!entry || entry[0] !== key) return false;
                entry[0] = entry[1] = undefined;
                return true;
            },
            has: function(key) {
                var entry = key[this.name];
                if (!entry) return false;
                return entry[0] === key;
            }
        };
        window.WeakMap = WeakMap;
    })();
}

(function(global) {
    if (global.JsMutationObserver) {
        return;
    }
    var registrationsTable = new WeakMap();
    var setImmediate;
    if (/Trident|Edge/.test(navigator.userAgent)) {
        setImmediate = setTimeout;
    } else if (window.setImmediate) {
        setImmediate = window.setImmediate;
    } else {
        var setImmediateQueue = [];
        var sentinel = String(Math.random());
        window.addEventListener("message", function(e) {
            if (e.data === sentinel) {
                var queue = setImmediateQueue;
                setImmediateQueue = [];
                queue.forEach(function(func) {
                    func();
                });
            }
        });
        setImmediate = function(func) {
            setImmediateQueue.push(func);
            window.postMessage(sentinel, "*");
        };
    }
    var isScheduled = false;
    var scheduledObservers = [];

    function scheduleCallback(observer) {
        scheduledObservers.push(observer);
        if (!isScheduled) {
            isScheduled = true;
            setImmediate(dispatchCallbacks);
        }
    }

    function wrapIfNeeded(node) {
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(node) || node;
    }

    function dispatchCallbacks() {
        isScheduled = false;
        var observers = scheduledObservers;
        scheduledObservers = [];
        observers.sort(function(o1, o2) {
            return o1.uid_ - o2.uid_;
        });
        var anyNonEmpty = false;
        observers.forEach(function(observer) {
            var queue = observer.takeRecords();
            removeTransientObserversFor(observer);
            if (queue.length) {
                observer.callback_(queue, observer);
                anyNonEmpty = true;
            }
        });
        if (anyNonEmpty) dispatchCallbacks();
    }

    function removeTransientObserversFor(observer) {
        observer.nodes_.forEach(function(node) {
            var registrations = registrationsTable.get(node);
            if (!registrations) return;
            registrations.forEach(function(registration) {
                if (registration.observer === observer) registration.removeTransientObservers();
            });
        });
    }

    function forEachAncestorAndObserverEnqueueRecord(target, callback) {
        for (var node = target; node; node = node.parentNode) {
            var registrations = registrationsTable.get(node);
            if (registrations) {
                for (var j = 0; j < registrations.length; j++) {
                    var registration = registrations[j];
                    var options = registration.options;
                    if (node !== target && !options.subtree) continue;
                    var record = callback(options);
                    if (record) registration.enqueue(record);
                }
            }
        }
    }
    var uidCounter = 0;

    function JsMutationObserver(callback) {
        this.callback_ = callback;
        this.nodes_ = [];
        this.records_ = [];
        this.uid_ = ++uidCounter;
    }
    JsMutationObserver.prototype = {
        observe: function(target, options) {
            target = wrapIfNeeded(target);
            if (!options.childList && !options.attributes && !options.characterData || options.attributeOldValue && !options.attributes || options.attributeFilter && options.attributeFilter.length && !options.attributes || options.characterDataOldValue && !options.characterData) {
                throw new SyntaxError();
            }
            var registrations = registrationsTable.get(target);
            if (!registrations) registrationsTable.set(target, registrations = []);
            var registration;
            for (var i = 0; i < registrations.length; i++) {
                if (registrations[i].observer === this) {
                    registration = registrations[i];
                    registration.removeListeners();
                    registration.options = options;
                    break;
                }
            }
            if (!registration) {
                registration = new Registration(this, target, options);
                registrations.push(registration);
                this.nodes_.push(target);
            }
            registration.addListeners();
        },
        disconnect: function() {
            this.nodes_.forEach(function(node) {
                var registrations = registrationsTable.get(node);
                for (var i = 0; i < registrations.length; i++) {
                    var registration = registrations[i];
                    if (registration.observer === this) {
                        registration.removeListeners();
                        registrations.splice(i, 1);
                        break;
                    }
                }
            }, this);
            this.records_ = [];
        },
        takeRecords: function() {
            var copyOfRecords = this.records_;
            this.records_ = [];
            return copyOfRecords;
        }
    };

    function MutationRecord(type, target) {
        this.type = type;
        this.target = target;
        this.addedNodes = [];
        this.removedNodes = [];
        this.previousSibling = null;
        this.nextSibling = null;
        this.attributeName = null;
        this.attributeNamespace = null;
        this.oldValue = null;
    }

    function copyMutationRecord(original) {
        var record = new MutationRecord(original.type, original.target);
        record.addedNodes = original.addedNodes.slice();
        record.removedNodes = original.removedNodes.slice();
        record.previousSibling = original.previousSibling;
        record.nextSibling = original.nextSibling;
        record.attributeName = original.attributeName;
        record.attributeNamespace = original.attributeNamespace;
        record.oldValue = original.oldValue;
        return record;
    }
    var currentRecord, recordWithOldValue;

    function getRecord(type, target) {
        return currentRecord = new MutationRecord(type, target);
    }

    function getRecordWithOldValue(oldValue) {
        if (recordWithOldValue) return recordWithOldValue;
        recordWithOldValue = copyMutationRecord(currentRecord);
        recordWithOldValue.oldValue = oldValue;
        return recordWithOldValue;
    }

    function clearRecords() {
        currentRecord = recordWithOldValue = undefined;
    }

    function recordRepresentsCurrentMutation(record) {
        return record === recordWithOldValue || record === currentRecord;
    }

    function selectRecord(lastRecord, newRecord) {
        if (lastRecord === newRecord) return lastRecord;
        if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord)) return recordWithOldValue;
        return null;
    }

    function Registration(observer, target, options) {
        this.observer = observer;
        this.target = target;
        this.options = options;
        this.transientObservedNodes = [];
    }
    Registration.prototype = {
        enqueue: function(record) {
            var records = this.observer.records_;
            var length = records.length;
            if (records.length > 0) {
                var lastRecord = records[length - 1];
                var recordToReplaceLast = selectRecord(lastRecord, record);
                if (recordToReplaceLast) {
                    records[length - 1] = recordToReplaceLast;
                    return;
                }
            } else {
                scheduleCallback(this.observer);
            }
            records[length] = record;
        },
        addListeners: function() {
            this.addListeners_(this.target);
        },
        addListeners_: function(node) {
            var options = this.options;
            if (options.attributes) node.addEventListener("DOMAttrModified", this, true);
            if (options.characterData) node.addEventListener("DOMCharacterDataModified", this, true);
            if (options.childList) node.addEventListener("DOMNodeInserted", this, true);
            if (options.childList || options.subtree) node.addEventListener("DOMNodeRemoved", this, true);
        },
        removeListeners: function() {
            this.removeListeners_(this.target);
        },
        removeListeners_: function(node) {
            var options = this.options;
            if (options.attributes) node.removeEventListener("DOMAttrModified", this, true);
            if (options.characterData) node.removeEventListener("DOMCharacterDataModified", this, true);
            if (options.childList) node.removeEventListener("DOMNodeInserted", this, true);
            if (options.childList || options.subtree) node.removeEventListener("DOMNodeRemoved", this, true);
        },
        addTransientObserver: function(node) {
            if (node === this.target) return;
            this.addListeners_(node);
            this.transientObservedNodes.push(node);
            var registrations = registrationsTable.get(node);
            if (!registrations) registrationsTable.set(node, registrations = []);
            registrations.push(this);
        },
        removeTransientObservers: function() {
            var transientObservedNodes = this.transientObservedNodes;
            this.transientObservedNodes = [];
            transientObservedNodes.forEach(function(node) {
                this.removeListeners_(node);
                var registrations = registrationsTable.get(node);
                for (var i = 0; i < registrations.length; i++) {
                    if (registrations[i] === this) {
                        registrations.splice(i, 1);
                        break;
                    }
                }
            }, this);
        },
        handleEvent: function(e) {
            e.stopImmediatePropagation();
            switch (e.type) {
                case "DOMAttrModified":
                    var name = e.attrName;
                    var namespace = e.relatedNode.namespaceURI;
                    var target = e.target;
                    var record = new getRecord("attributes", target);
                    record.attributeName = name;
                    record.attributeNamespace = namespace;
                    var oldValue = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                    forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                        if (!options.attributes) return;
                        if (options.attributeFilter && options.attributeFilter.length && options.attributeFilter.indexOf(name) === -1 && options.attributeFilter.indexOf(namespace) === -1) {
                            return;
                        }
                        if (options.attributeOldValue) return getRecordWithOldValue(oldValue);
                        return record;
                    });
                    break;

                case "DOMCharacterDataModified":
                    var target = e.target;
                    var record = getRecord("characterData", target);
                    var oldValue = e.prevValue;
                    forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                        if (!options.characterData) return;
                        if (options.characterDataOldValue) return getRecordWithOldValue(oldValue);
                        return record;
                    });
                    break;

                case "DOMNodeRemoved":
                    this.addTransientObserver(e.target);

                case "DOMNodeInserted":
                    var changedNode = e.target;
                    var addedNodes, removedNodes;
                    if (e.type === "DOMNodeInserted") {
                        addedNodes = [changedNode];
                        removedNodes = [];
                    } else {
                        addedNodes = [];
                        removedNodes = [changedNode];
                    }
                    var previousSibling = changedNode.previousSibling;
                    var nextSibling = changedNode.nextSibling;
                    var record = getRecord("childList", e.target.parentNode);
                    record.addedNodes = addedNodes;
                    record.removedNodes = removedNodes;
                    record.previousSibling = previousSibling;
                    record.nextSibling = nextSibling;
                    forEachAncestorAndObserverEnqueueRecord(e.relatedNode, function(options) {
                        if (!options.childList) return;
                        return record;
                    });
            }
            clearRecords();
        }
    };
    global.JsMutationObserver = JsMutationObserver;
    if (!global.MutationObserver) {
        global.MutationObserver = JsMutationObserver;
        JsMutationObserver._isPolyfilled = true;
    }
})(self);

(function(scope) {
    "use strict";
    if (!window.performance) {
        var start = Date.now();
        window.performance = {
            now: function() {
                return Date.now() - start;
            }
        };
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function() {
            var nativeRaf = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
            return nativeRaf ? function(callback) {
                return nativeRaf(function() {
                    callback(performance.now());
                });
            } : function(callback) {
                return window.setTimeout(callback, 1e3 / 60);
            };
        }();
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function() {
            return window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(id) {
                clearTimeout(id);
            };
        }();
    }
    var workingDefaultPrevented = function() {
        var e = document.createEvent("Event");
        e.initEvent("foo", true, true);
        e.preventDefault();
        return e.defaultPrevented;
    }();
    if (!workingDefaultPrevented) {
        var origPreventDefault = Event.prototype.preventDefault;
        Event.prototype.preventDefault = function() {
            if (!this.cancelable) {
                return;
            }
            origPreventDefault.call(this);
            Object.defineProperty(this, "defaultPrevented", {
                get: function() {
                    return true;
                },
                configurable: true
            });
        };
    }
    var isIE = /Trident/.test(navigator.userAgent);
    if (!window.CustomEvent || isIE && typeof window.CustomEvent !== "function") {
        window.CustomEvent = function(inType, params) {
            params = params || {};
            var e = document.createEvent("CustomEvent");
            e.initCustomEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
            return e;
        };
        window.CustomEvent.prototype = window.Event.prototype;
    }
    if (!window.Event || isIE && typeof window.Event !== "function") {
        var origEvent = window.Event;
        window.Event = function(inType, params) {
            params = params || {};
            var e = document.createEvent("Event");
            e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
            return e;
        };
        window.Event.prototype = origEvent.prototype;
    }
})(window.WebComponents);

window.CustomElements = window.CustomElements || {
    flags: {}
};

(function(scope) {
    var flags = scope.flags;
    var modules = [];
    var addModule = function(module) {
        modules.push(module);
    };
    var initializeModules = function() {
        modules.forEach(function(module) {
            module(scope);
        });
    };
    scope.addModule = addModule;
    scope.initializeModules = initializeModules;
    scope.hasNative = Boolean(document.registerElement);
    scope.isIE = /Trident/.test(navigator.userAgent);
    scope.useNative = !flags.register && scope.hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || window.HTMLImports.useNative);
})(window.CustomElements);

window.CustomElements.addModule(function(scope) {
    var IMPORT_LINK_TYPE = window.HTMLImports ? window.HTMLImports.IMPORT_LINK_TYPE : "none";

    function forSubtree(node, cb) {
        findAllElements(node, function(e) {
            if (cb(e)) {
                return true;
            }
            forRoots(e, cb);
        });
        forRoots(node, cb);
    }

    function findAllElements(node, find, data) {
        var e = node.firstElementChild;
        if (!e) {
            e = node.firstChild;
            while (e && e.nodeType !== Node.ELEMENT_NODE) {
                e = e.nextSibling;
            }
        }
        while (e) {
            var next = e.nextElementSibling;
            if (find(e, data) !== true) {
                findAllElements(e, find, data);
            }
            e = next;
        }
        return null;
    }

    function forRoots(node, cb) {
        var root = node.shadowRoot;
        while (root) {
            forSubtree(root, cb);
            root = root.olderShadowRoot;
        }
    }

    function forDocumentTree(doc, cb) {
        _forDocumentTree(doc, cb, []);
    }

    function _forDocumentTree(doc, cb, processingDocuments) {
        doc = window.wrap(doc);
        if (processingDocuments.indexOf(doc) >= 0) {
            return;
        }
        processingDocuments.push(doc);
        var imports = doc.querySelectorAll("link[rel=" + IMPORT_LINK_TYPE + "]");
        for (var i = 0, l = imports.length, n; i < l && (n = imports[i]); i++) {
            if (n.import) {
                _forDocumentTree(n.import, cb, processingDocuments);
            }
        }
        cb(doc);
    }
    scope.forDocumentTree = forDocumentTree;
    scope.forSubtree = forSubtree;
});

window.CustomElements.addModule(function(scope) {
    var flags = scope.flags;
    var forSubtree = scope.forSubtree;
    var forDocumentTree = scope.forDocumentTree;

    function addedNode(node, isAttached) {
        return added(node, isAttached) || addedSubtree(node, isAttached);
    }

    function added(node, isAttached) {
        if (scope.upgrade(node, isAttached)) {
            return true;
        }
        if (isAttached) {
            attached(node);
        }
    }

    function addedSubtree(node, isAttached) {
        forSubtree(node, function(e) {
            if (added(e, isAttached)) {
                return true;
            }
        });
    }
    var hasThrottledAttached = window.MutationObserver._isPolyfilled && flags["throttle-attached"];
    scope.hasPolyfillMutations = hasThrottledAttached;
    scope.hasThrottledAttached = hasThrottledAttached;
    var isPendingMutations = false;
    var pendingMutations = [];

    function deferMutation(fn) {
        pendingMutations.push(fn);
        if (!isPendingMutations) {
            isPendingMutations = true;
            setTimeout(takeMutations);
        }
    }

    function takeMutations() {
        isPendingMutations = false;
        var $p = pendingMutations;
        for (var i = 0, l = $p.length, p; i < l && (p = $p[i]); i++) {
            p();
        }
        pendingMutations = [];
    }

    function attached(element) {
        if (hasThrottledAttached) {
            deferMutation(function() {
                _attached(element);
            });
        } else {
            _attached(element);
        }
    }

    function _attached(element) {
        if (element.__upgraded__ && !element.__attached) {
            element.__attached = true;
            if (element.attachedCallback) {
                element.attachedCallback();
            }
        }
    }

    function detachedNode(node) {
        detached(node);
        forSubtree(node, function(e) {
            detached(e);
        });
    }

    function detached(element) {
        if (hasThrottledAttached) {
            deferMutation(function() {
                _detached(element);
            });
        } else {
            _detached(element);
        }
    }

    function _detached(element) {
        if (element.__upgraded__ && element.__attached) {
            element.__attached = false;
            if (element.detachedCallback) {
                element.detachedCallback();
            }
        }
    }

    function inDocument(element) {
        var p = element;
        var doc = window.wrap(document);
        while (p) {
            if (p == doc) {
                return true;
            }
            p = p.parentNode || p.nodeType === Node.DOCUMENT_FRAGMENT_NODE && p.host;
        }
    }

    function watchShadow(node) {
        if (node.shadowRoot && !node.shadowRoot.__watched) {
            flags.dom && console.log("watching shadow-root for: ", node.localName);
            var root = node.shadowRoot;
            while (root) {
                observe(root);
                root = root.olderShadowRoot;
            }
        }
    }

    function handler(root, mutations) {
        if (flags.dom) {
            var mx = mutations[0];
            if (mx && mx.type === "childList" && mx.addedNodes) {
                if (mx.addedNodes) {
                    var d = mx.addedNodes[0];
                    while (d && d !== document && !d.host) {
                        d = d.parentNode;
                    }
                    var u = d && (d.URL || d._URL || d.host && d.host.localName) || "";
                    u = u.split("/?").shift().split("/").pop();
                }
            }
            console.group("mutations (%d) [%s]", mutations.length, u || "");
        }
        var isAttached = inDocument(root);
        mutations.forEach(function(mx) {
            if (mx.type === "childList") {
                forEach(mx.addedNodes, function(n) {
                    if (!n.localName) {
                        return;
                    }
                    addedNode(n, isAttached);
                });
                forEach(mx.removedNodes, function(n) {
                    if (!n.localName) {
                        return;
                    }
                    detachedNode(n);
                });
            }
        });
        flags.dom && console.groupEnd();
    }

    function takeRecords(node) {
        node = window.wrap(node);
        if (!node) {
            node = window.wrap(document);
        }
        while (node.parentNode) {
            node = node.parentNode;
        }
        var observer = node.__observer;
        if (observer) {
            handler(node, observer.takeRecords());
            takeMutations();
        }
    }
    var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

    function observe(inRoot) {
        if (inRoot.__observer) {
            return;
        }
        var observer = new MutationObserver(handler.bind(this, inRoot));
        observer.observe(inRoot, {
            childList: true,
            subtree: true
        });
        inRoot.__observer = observer;
    }

    function upgradeDocument(doc) {
        doc = window.wrap(doc);
        flags.dom && console.group("upgradeDocument: ", doc.baseURI.split("/").pop());
        var isMainDocument = doc === window.wrap(document);
        addedNode(doc, isMainDocument);
        observe(doc);
        flags.dom && console.groupEnd();
    }

    function upgradeDocumentTree(doc) {
        forDocumentTree(doc, upgradeDocument);
    }
    var originalCreateShadowRoot = Element.prototype.createShadowRoot;
    if (originalCreateShadowRoot) {
        Element.prototype.createShadowRoot = function() {
            var root = originalCreateShadowRoot.call(this);
            window.CustomElements.watchShadow(this);
            return root;
        };
    }
    scope.watchShadow = watchShadow;
    scope.upgradeDocumentTree = upgradeDocumentTree;
    scope.upgradeDocument = upgradeDocument;
    scope.upgradeSubtree = addedSubtree;
    scope.upgradeAll = addedNode;
    scope.attached = attached;
    scope.takeRecords = takeRecords;
});

window.CustomElements.addModule(function(scope) {
    var flags = scope.flags;

    function upgrade(node, isAttached) {
        if (node.localName === "template") {
            if (window.HTMLTemplateElement && HTMLTemplateElement.decorate) {
                HTMLTemplateElement.decorate(node);
            }
        }
        if (!node.__upgraded__ && node.nodeType === Node.ELEMENT_NODE) {
            var is = node.getAttribute("is");
            var definition = scope.getRegisteredDefinition(node.localName) || scope.getRegisteredDefinition(is);
            if (definition) {
                if (is && definition.tag == node.localName || !is && !definition.extends) {
                    return upgradeWithDefinition(node, definition, isAttached);
                }
            }
        }
    }

    function upgradeWithDefinition(element, definition, isAttached) {
        flags.upgrade && console.group("upgrade:", element.localName);
        if (definition.is) {
            element.setAttribute("is", definition.is);
        }
        implementPrototype(element, definition);
        element.__upgraded__ = true;
        if (definition.prototype && typeof definition.prototype._constructor == 'function') {
            element.constructor = definition.prototype._constructor;
        }
        created(element);
        if (isAttached) {
            scope.attached(element);
        }
        scope.upgradeSubtree(element, isAttached);
        flags.upgrade && console.groupEnd();
        return element;
    }

    function implementPrototype(element, definition) {
        if (Object.__proto__) {
            element.__proto__ = definition.prototype;
        } else {
            customMixin(element, definition.prototype, definition.native);
            element.__proto__ = definition.prototype;
        }
    }

    function customMixin(inTarget, inSrc, inNative) {
        var used = {};
        var p = inSrc;
        while (p !== inNative && p !== HTMLElement.prototype) {
            var keys = Object.getOwnPropertyNames(p);
            for (var i = 0, k; k = keys[i]; i++) {
                if (!used[k]) {
                    Object.defineProperty(inTarget, k, Object.getOwnPropertyDescriptor(p, k));
                    used[k] = 1;
                }
            }
            p = Object.getPrototypeOf(p);
        }
    }

    function created(element) {
        if (element.createdCallback) {
            element.createdCallback();
        }
    }
    scope.upgrade = upgrade;
    scope.upgradeWithDefinition = upgradeWithDefinition;
    scope.implementPrototype = implementPrototype;
});

window.CustomElements.addModule(function(scope) {
    var isIE = scope.isIE;
    var upgradeDocumentTree = scope.upgradeDocumentTree;
    var upgradeAll = scope.upgradeAll;
    var upgradeWithDefinition = scope.upgradeWithDefinition;
    var implementPrototype = scope.implementPrototype;
    var useNative = scope.useNative;

    function register(name, options) {
        var definition = options || {};
        if (!name) {
            throw new Error("document.registerElement: first argument `name` must not be empty");
        }
        if (name.indexOf("-") < 0) {
            throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(name) + "'.");
        }
        if (isReservedTag(name)) {
            throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(name) + "'. The type name is invalid.");
        }
        if (getRegisteredDefinition(name)) {
            throw new Error("DuplicateDefinitionError: a type with name '" + String(name) + "' is already registered");
        }
        if (!definition.prototype) {
            definition.prototype = Object.create(HTMLElement.prototype);
        }
        definition.__name = name.toLowerCase();
        definition.lifecycle = definition.lifecycle || {};
        definition.ancestry = ancestry(definition.extends);
        resolveTagName(definition);
        resolvePrototypeChain(definition);
        overrideAttributeApi(definition.prototype);
        registerDefinition(definition.__name, definition);
        definition.ctor = generateConstructor(definition);
        definition.ctor.prototype = definition.prototype;
        if (typeof definition.prototype.constructor === 'function') {
            definition.prototype._constructor = definition.prototype.constructor;
        }
        definition.prototype.constructor = definition.ctor;
        if (scope.ready) {
            upgradeDocumentTree(document);
        }
        return definition.ctor;
    }

    function overrideAttributeApi(prototype) {
        if (prototype.setAttribute._polyfilled) {
            return;
        }
        var setAttribute = prototype.setAttribute;
        prototype.setAttribute = function(name, value) {
            changeAttribute.call(this, name, value, setAttribute);
        };
        var removeAttribute = prototype.removeAttribute;
        prototype.removeAttribute = function(name) {
            changeAttribute.call(this, name, null, removeAttribute);
        };
        prototype.setAttribute._polyfilled = true;
    }

    function changeAttribute(name, value, operation) {
        name = name.toLowerCase();
        var oldValue = this.getAttribute(name);
        operation.apply(this, arguments);
        var newValue = this.getAttribute(name);
        if (this.attributeChangedCallback && newValue !== oldValue) {
            this.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    function isReservedTag(name) {
        for (var i = 0; i < reservedTagList.length; i++) {
            if (name === reservedTagList[i]) {
                return true;
            }
        }
    }
    var reservedTagList = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"];

    function ancestry(extnds) {
        var extendee = getRegisteredDefinition(extnds);
        if (extendee) {
            return ancestry(extendee.extends).concat([extendee]);
        }
        return [];
    }

    function resolveTagName(definition) {
        var baseTag = definition.extends;
        for (var i = 0, a; a = definition.ancestry[i]; i++) {
            baseTag = a.is && a.tag;
        }
        definition.tag = baseTag || definition.__name;
        if (baseTag) {
            definition.is = definition.__name;
        }
    }

    function resolvePrototypeChain(definition) {
        if (!Object.__proto__) {
            var nativePrototype = HTMLElement.prototype;
            if (definition.is) {
                var inst = document.createElement(definition.tag);
                nativePrototype = Object.getPrototypeOf(inst);
            }
            var proto = definition.prototype,
                ancestor;
            var foundPrototype = false;
            while (proto) {
                if (proto == nativePrototype) {
                    foundPrototype = true;
                }
                ancestor = Object.getPrototypeOf(proto);
                if (ancestor) {
                    proto.__proto__ = ancestor;
                }
                proto = ancestor;
            }
            if (!foundPrototype) {
                console.warn(definition.tag + " prototype not found in prototype chain for " + definition.is);
            }
            definition.native = nativePrototype;
        }
    }

    function instantiate(definition) {
        return upgradeWithDefinition(domCreateElement(definition.tag), definition);
    }
    var registry = {};

    function getRegisteredDefinition(name) {
        if (name) {
            return registry[name.toLowerCase()];
        }
    }

    function registerDefinition(name, definition) {
        registry[name] = definition;
    }

    function generateConstructor(definition) {
        return function() {
            return instantiate(definition);
        };
    }
    var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";

    function createElementNS(namespace, tag, typeExtension) {
        if (namespace === HTML_NAMESPACE) {
            return createElement(tag, typeExtension);
        } else {
            return domCreateElementNS(namespace, tag);
        }
    }

    function createElement(tag, typeExtension) {
        if (tag) {
            tag = tag.toLowerCase();
        }
        if (typeExtension) {
            typeExtension = typeExtension.toLowerCase();
        }
        var definition = getRegisteredDefinition(typeExtension || tag);
        if (definition) {
            if (tag == definition.tag && typeExtension == definition.is) {
                return new definition.ctor();
            }
            if (!typeExtension && !definition.is) {
                return new definition.ctor();
            }
        }
        var element;
        if (typeExtension) {
            element = createElement(tag);
            element.setAttribute("is", typeExtension);
            return element;
        }
        element = domCreateElement(tag);
        if (tag.indexOf("-") >= 0) {
            implementPrototype(element, HTMLElement);
        }
        return element;
    }
    var domCreateElement = document.createElement.bind(document);
    var domCreateElementNS = document.createElementNS.bind(document);
    var isInstance;
    if (!Object.__proto__ && !useNative) {
        isInstance = function(obj, ctor) {
            if (obj instanceof ctor) {
                return true;
            }
            var p = obj;
            while (p) {
                if (p === ctor.prototype) {
                    return true;
                }
                p = p.__proto__;
            }
            return false;
        };
    } else {
        isInstance = function(obj, base) {
            return obj instanceof base;
        };
    }

    function wrapDomMethodToForceUpgrade(obj, methodName) {
        var orig = obj[methodName];
        obj[methodName] = function() {
            var n = orig.apply(this, arguments);
            upgradeAll(n);
            return n;
        };
    }
    wrapDomMethodToForceUpgrade(Node.prototype, "cloneNode");
    wrapDomMethodToForceUpgrade(document, "importNode");
    if (isIE) {
        (function() {
            var importNode = document.importNode;
            document.importNode = function() {
                var n = importNode.apply(document, arguments);
                if (n.nodeType == n.DOCUMENT_FRAGMENT_NODE) {
                    var f = document.createDocumentFragment();
                    f.appendChild(n);
                    return f;
                } else {
                    return n;
                }
            };
        })();
    }
    document.registerElement = register;
    document.createElement = createElement;
    document.createElementNS = createElementNS;
    scope.registry = registry;
    scope.instanceof = isInstance;
    scope.reservedTagList = reservedTagList;
    scope.getRegisteredDefinition = getRegisteredDefinition;
    document.register = document.registerElement;
});

(function(scope) {
    var useNative = scope.useNative;
    var initializeModules = scope.initializeModules;
    var isIE = scope.isIE;
    if (useNative) {
        var nop = function() {};
        scope.watchShadow = nop;
        scope.upgrade = nop;
        scope.upgradeAll = nop;
        scope.upgradeDocumentTree = nop;
        scope.upgradeSubtree = nop;
        scope.takeRecords = nop;
        scope.instanceof = function(obj, base) {
            return obj instanceof base;
        };
    } else {
        initializeModules();
    }
    var upgradeDocumentTree = scope.upgradeDocumentTree;
    var upgradeDocument = scope.upgradeDocument;
    if (!window.wrap) {
        if (window.ShadowDOMPolyfill) {
            window.wrap = window.ShadowDOMPolyfill.wrapIfNeeded;
            window.unwrap = window.ShadowDOMPolyfill.unwrapIfNeeded;
        } else {
            window.wrap = window.unwrap = function(node) {
                return node;
            };
        }
    }
    if (window.HTMLImports) {
        window.HTMLImports.__importsParsingHook = function(elt) {
            if (elt.import) {
                upgradeDocument(wrap(elt.import));
            }
        };
    }

    function bootstrap() {
        upgradeDocumentTree(window.wrap(document));
        window.CustomElements.ready = true;
        var requestAnimationFrame = window.requestAnimationFrame || function(f) {
            setTimeout(f, 16);
        };
        requestAnimationFrame(function() {
            setTimeout(function() {
                window.CustomElements.readyTime = Date.now();
                if (window.HTMLImports) {
                    window.CustomElements.elapsed = window.CustomElements.readyTime - window.HTMLImports.readyTime;
                }
                document.dispatchEvent(new CustomEvent("WebComponentsReady", {
                    bubbles: true
                }));
            });
        });
    }
    if (document.readyState === "complete" || scope.flags.eager) {
        bootstrap();
    } else if (document.readyState === "interactive" && !window.attachEvent && (!window.HTMLImports || window.HTMLImports.ready)) {
        bootstrap();
    } else {
        var loadEvent = window.HTMLImports && !window.HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
        window.addEventListener(loadEvent, bootstrap);
    }
})(window.CustomElements);

!function(a){function b(a,b,e){return 4===arguments.length?c.apply(this,arguments):void d(a,{declarative:!0,deps:b,declare:e})}function c(a,b,c,e){d(a,{declarative:!1,deps:b,executingRequire:c,execute:e})}function d(a,b){b.name=a,a in n||(n[a]=b),b.normalizedDeps=b.deps}function e(a,b){if(b[a.groupIndex]=b[a.groupIndex]||[],-1==o.call(b[a.groupIndex],a)){b[a.groupIndex].push(a);for(var c=0,d=a.normalizedDeps.length;d>c;c++){var f=a.normalizedDeps[c],g=n[f];if(g&&!g.evaluated){var h=a.groupIndex+(g.declarative!=a.declarative);if(void 0===g.groupIndex||g.groupIndex<h){if(void 0!==g.groupIndex&&(b[g.groupIndex].splice(o.call(b[g.groupIndex],g),1),0==b[g.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");g.groupIndex=h}e(g,b)}}}}function f(a){var b=n[a];b.groupIndex=0;var c=[];e(b,c);for(var d=!!b.declarative==c.length%2,f=c.length-1;f>=0;f--){for(var g=c[f],i=0;i<g.length;i++){var k=g[i];d?h(k):j(k)}d=!d}}function g(a){return s[a]||(s[a]={name:a,dependencies:[],exports:{},importers:[]})}function h(b){if(!b.module){var c=b.module=g(b.name),d=b.module.exports,e=b.declare.call(a,function(a,b){if(c.locked=!0,"object"==typeof a)for(var e in a)d[e]=a[e];else d[a]=b;for(var f=0,g=c.importers.length;g>f;f++){var h=c.importers[f];if(!h.locked)for(var i=0;i<h.dependencies.length;++i)h.dependencies[i]===c&&h.setters[i](d)}return c.locked=!1,b},b.name);c.setters=e.setters,c.execute=e.execute;for(var f=0,i=b.normalizedDeps.length;i>f;f++){var j,k=b.normalizedDeps[f],l=n[k],o=s[k];o?j=o.exports:l&&!l.declarative?j=l.esModule:l?(h(l),o=l.module,j=o.exports):j=m(k),o&&o.importers?(o.importers.push(c),c.dependencies.push(o)):c.dependencies.push(null),c.setters[f]&&c.setters[f](j)}}}function i(a){var b,c=n[a];if(c)c.declarative?l(a,[]):c.evaluated||j(c),b=c.module.exports;else if(b=m(a),!b)throw new Error("Unable to load dependency "+a+".");return(!c||c.declarative)&&b&&b.__useDefault?b["default"]:b}function j(b){if(!b.module){var c={},d=b.module={exports:c,id:b.name};if(!b.executingRequire)for(var e=0,f=b.normalizedDeps.length;f>e;e++){var g=b.normalizedDeps[e],h=n[g];h&&j(h)}b.evaluated=!0;var l=b.execute.call(a,function(a){for(var c=0,d=b.deps.length;d>c;c++)if(b.deps[c]==a)return i(b.normalizedDeps[c]);throw new TypeError("Module "+a+" not declared as a dependency.")},c,d);l&&(d.exports=l),c=d.exports,c&&c.__esModule?b.esModule=c:b.esModule=k(c)}}function k(b){if(b===a)return b;var c={};if("object"==typeof b||"function"==typeof b)if(p){var d;for(var e in b)(d=Object.getOwnPropertyDescriptor(b,e))&&r(c,e,d)}else{var f=b&&b.hasOwnProperty;for(var e in b)(!f||b.hasOwnProperty(e))&&(c[e]=b[e])}return c["default"]=b,r(c,"__useDefault",{value:!0}),c}function l(b,c){var d=n[b];if(d&&!d.evaluated&&d.declarative){c.push(b);for(var e=0,f=d.normalizedDeps.length;f>e;e++){var g=d.normalizedDeps[e];-1==o.call(c,g)&&(n[g]?l(g,c):m(g))}d.evaluated||(d.evaluated=!0,d.module.execute.call(a))}}function m(a){if(u[a])return u[a];if("@node/"==a.substr(0,6))return t(a.substr(6));var b=n[a];if(!b)throw"Module "+a+" not present.";return f(a),l(a,[]),n[a]=void 0,b.declarative&&r(b.module.exports,"__esModule",{value:!0}),u[a]=b.declarative?b.module.exports:b.esModule}var n={},o=Array.prototype.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},p=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(q){p=!1}var r;!function(){try{Object.defineProperty({},"a",{})&&(r=Object.defineProperty)}catch(a){r=function(a,b,c){try{a[b]=c.value||c.get.call(a)}catch(d){}}}}();var s={},t="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,u={"@empty":{}};return function(a,d,e){return function(f){f(function(f){for(var g={_nodeRequire:t,register:b,registerDynamic:c,get:m,set:function(a,b){u[a]=b},newModule:function(a){return a}},h=0;h<d.length;h++)(function(a,b){b&&b.__esModule?u[a]=b:u[a]=k(b)})(d[h],arguments[h]);e(g);var i=m(a[0]);if(a.length>1)for(var h=1;h<a.length;h++)m(a[h]);return i.__useDefault?i["default"]:i})}}}("undefined"!=typeof self?self:global)(["1"],[],function(a){!function(){var b=a;if("undefined"!=typeof window&&"undefined"!=typeof document&&window.location)var c=location.protocol+"//"+location.hostname+(location.port?":"+location.port:"");b.set("@@cjs-helpers",b.newModule({getPathVars:function(a){var b,d=a.lastIndexOf("!");b=-1!=d?a.substr(0,d):a;var e=b.split("/");return e.pop(),e=e.join("/"),"file:///"==b.substr(0,8)?(b=b.substr(7),e=e.substr(7),isWindows&&(b=b.substr(1),e=e.substr(1))):c&&b.substr(0,c.length)===c&&(b=b.substr(c.length),e=e.substr(c.length)),{filename:b,dirname:e}}}))}(),a.registerDynamic("2",[],!0,function(a,b,c){"use strict";function d(a){this.listenerMap=[{},{}],a&&this.root(a),this.handle=d.prototype.handle.bind(this)}function e(a,b){return a.toLowerCase()===b.tagName.toLowerCase()}function f(a,b){return this.rootElement===window?b===document:this.rootElement===b}function g(a,b){return a===b.id}var h=this,i=h.define;h.define=void 0,c.exports=d,d.prototype.root=function(a){var b,c=this.listenerMap;if(this.rootElement){for(b in c[1])c[1].hasOwnProperty(b)&&this.rootElement.removeEventListener(b,this.handle,!0);for(b in c[0])c[0].hasOwnProperty(b)&&this.rootElement.removeEventListener(b,this.handle,!1)}if(!a||!a.addEventListener)return this.rootElement&&delete this.rootElement,this;this.rootElement=a;for(b in c[1])c[1].hasOwnProperty(b)&&this.rootElement.addEventListener(b,this.handle,!0);for(b in c[0])c[0].hasOwnProperty(b)&&this.rootElement.addEventListener(b,this.handle,!1);return this},d.prototype.captureForType=function(a){return-1!==["blur","error","focus","load","resize","scroll"].indexOf(a)},d.prototype.on=function(a,b,c,d){var h,i,k,l;if(!a)throw new TypeError("Invalid event type: "+a);if("function"==typeof b&&(d=c,c=b,b=null),void 0===d&&(d=this.captureForType(a)),"function"!=typeof c)throw new TypeError("Handler must be a type of Function");return h=this.rootElement,i=this.listenerMap[d?1:0],i[a]||(h&&h.addEventListener(a,this.handle,d),i[a]=[]),b?/^[a-z]+$/i.test(b)?(l=b,k=e):/^#[a-z0-9\-_]+$/i.test(b)?(l=b.slice(1),k=g):(l=b,k=j):(l=null,k=f.bind(this)),i[a].push({selector:b,handler:c,matcher:k,matcherParam:l}),this},d.prototype.off=function(a,b,c,d){var e,f,g,h,i;if("function"==typeof b&&(d=c,c=b,b=null),void 0===d)return this.off(a,b,c,!0),this.off(a,b,c,!1),this;if(g=this.listenerMap[d?1:0],!a){for(i in g)g.hasOwnProperty(i)&&this.off(i,b,c);return this}if(h=g[a],!h||!h.length)return this;for(e=h.length-1;e>=0;e--)f=h[e],b&&b!==f.selector||c&&c!==f.handler||h.splice(e,1);return h.length||(delete g[a],this.rootElement&&this.rootElement.removeEventListener(a,this.handle,d)),this},d.prototype.handle=function(a){var b,c,d,e,f,g,h,i=a.type,j=[],k="ftLabsDelegateIgnore";if(a[k]!==!0){switch(h=a.target,3===h.nodeType&&(h=h.parentNode),d=this.rootElement,e=a.eventPhase||(a.target!==a.currentTarget?3:2)){case 1:j=this.listenerMap[1][i];break;case 2:this.listenerMap[0]&&this.listenerMap[0][i]&&(j=j.concat(this.listenerMap[0][i])),this.listenerMap[1]&&this.listenerMap[1][i]&&(j=j.concat(this.listenerMap[1][i]));break;case 3:j=this.listenerMap[0][i]}for(c=j.length;h&&c;){for(b=0;c>b&&(f=j[b],f);b++)if(f.matcher.call(h,f.matcherParam,h)&&(g=this.fire(a,h,f)),g===!1)return a[k]=!0,void a.preventDefault();if(h===d)break;c=j.length,h=h.parentElement}}},d.prototype.fire=function(a,b,c){return c.handler.call(b,a,b)};var j=function(a){if(a){var b=a.prototype;return b.matches||b.matchesSelector||b.webkitMatchesSelector||b.mozMatchesSelector||b.msMatchesSelector||b.oMatchesSelector}}(Element);return d.prototype.destroy=function(){this.off(),this.root()},h.define=i,c.exports}),a.register("1",["2"],function(a){"use strict";function b(a,c){var d=void 0;return a&&(d=Object.getOwnPropertyDescriptor(a,c),!d&&a.__proto__&&(d=b(a.__proto__,c))),d}function c(a,b){if(b&&b.set&&b.set.wrapped)return b.set;var c=function(c){b.set?b.set.call(this,c):this["__"+a]=c;var d=this[a];return null!==d&&void 0!==d&&d!==!1?"string"!=typeof d&&"number"!=typeof d||this.getAttribute(a)===d?"boolean"==typeof d&&this.setAttribute(e(a),a):this.setAttribute(e(a),d):this.removeAttribute(e(a)),d};return c.wrapped=!0,c}function d(a,b){return b.get||function(){return this["__"+a]}}function e(a){return a.replace(/\W+/g,"-").replace(/([a-z\d])([A-Z])/g,"$1-$2")}function f(a){return a.replace(/\W+(.)/g,function(a,b){return b.toUpperCase()})}function g(a,b,c){var d=a;"function"!=typeof d&&d.constructor&&(d=d.constructor);var e=i(b),f=d[e]||d.__proto__&&d.__proto__[e];if(f&&Array.isArray(f))for(var g=0,h=f.length;h>g;g++)f[g].apply(a,c)}function h(a,b){if(Array.isArray(b))for(var c=0;c<b.length;c++)h(a,b[c]);else{if(a.__attachedBehaviors=a.__attachedBehaviors||[],-1!==a.__attachedBehaviors.indexOf(b))return;var d=G,e=Object.getOwnPropertyNames(b);for(var f in e){var g=e[f];if(g in B||(a[g]=b[g]),-1!==d.indexOf(g)){var j=i(g);a[j]=a[j]||[],a[j].push(b[g])}else g in B||(a[g]=b[g])}if(b.prototype){e=Object.getOwnPropertyNames(b.prototype);for(var f in e){var g=e[f];if(-1!==d.indexOf(g)){var j=i(g);a[j]=a[j]||[],a[j].push(b.prototype[g])}else g in B.prototype||(a.prototype[g]=b.prototype[g])}}a.__attachedBehaviors.push(b)}}function i(a){return"__"+a+"Callbacks"}function j(a){var b={};return Array.prototype.forEach.call(a.attributes||[],function(a){b[a.name]=a.value}),b}function k(a){return a.nodeType===Node.TEXT_NODE?new I.VText(a.textContent):new I.VNode(a.tagName,{attributes:j(a)},Array.prototype.map.call(a.childNodes||[],k))}function l(a){var b=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];if("string"!=typeof a)throw"Missing or bad typed `tagName` property";var c=b.prototype;if("undefined"==typeof c)throw"Missing prototype";if("function"!=typeof c){var d=function(){};d.prototype=c,c=d}var e=L(c,K);for(var f in c.prototype)-1!==["createdCallback","attachedCallback","detachedCallback","attributeChangedCallback"].indexOf(f)&&(e.prototype[f]=p(e.prototype[f],K.prototype[f]));Object.defineProperty(e,"tagName",{configurable:!0,get:function(){return a}}),b.tagName=a;var g=s(e,b);return g.Extend=function(){var a=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],b="function"==typeof a?a:function(a){var b=function(){};return b.prototype=a,b}(a);return L(b,c)},g}function m(a){function b(b){if(-1===d.indexOf(b)){var c={key:b};if("function"==typeof a[b])c.value=a[b];else{var e=Object.getOwnPropertyDescriptor(a,b)||{};e.get?(c.get=e.get,c.set=e.set):c.value=a[b]}return d.push(b),c}}var c=[],d=["name","length","prototype"];for(var e in a){var f=b(e);f&&c.push(f)}var g=Object.getOwnPropertyNames(a);for(var h in g){var f=b(g[h]);f&&c.push(f)}return c}function n(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}function o(a,b,c){return b&&n(a.prototype,b),c&&n(a,c),a}function p(a,b){return function(){a.apply(this,arguments),b.apply(this,arguments)}}function q(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}function r(a,b,c){null===a&&(a=Function.prototype);var d=Object.getOwnPropertyDescriptor(a,b);if(void 0===d){var e=Object.getPrototypeOf(a);return null===e?void 0:get(e,b,c)}if("value"in d)return d.value;var f=d.get;if(void 0!==f)return f.call(c)}function s(){return z.register.apply(z,arguments)}var t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L;return{setters:[function(a){t=a["default"]}],execute:function(){u=function(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")},v=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),w=function(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!b||"object"!=typeof b&&"function"!=typeof b?a:b},x=function(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)},y=function j(){u(this,j)},y.useWebComponents="undefined"!=typeof window&&("undefined"!=typeof window.WebComponents||"undefined"!=typeof window.CustomElements),y.useVirtualDOM="undefined"!=typeof window&&"undefined"!=typeof window.virtualDom,y.autoUpdateView=!0,z=function(){function a(){u(this,a)}return v(a,null,[{key:"register",value:function(b){var c=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],d=void 0,e=void 0;"string"==typeof b&&(d=b,"function"==typeof c?(b=c,c={}):"undefined"!=typeof c.prototype&&(b=c.prototype)),"function"==typeof b?(d=d||c.tagName||b.hasOwnProperty("tagName")&&b.tagName||a.classToElement(b),Object.defineProperty(b,"tagName",{get:function(){return d}}),"function"==typeof b.onRegister&&b.onRegister.call(b),c.prototype=b.prototype,c["extends"]||"string"!=typeof b["extends"]||(c["extends"]=b["extends"])):(c.prototype=b,b=function(){c.prototype.constructor.apply(this,arguments)},b.prototype=c.prototype);try{return b.prototype.is=d,e=y.useWebComponents?document.registerElement(d,c):function(){var a=document.createElement(d);return Object.setPrototypeOf(a,b.prototype),setTimeout(function(){a.createdCallback()},0),a},e.prototype.is=d,"function"==typeof b&&(e.prototype.constructor=b),e}catch(f){return console.error(f),!1}}},{key:"classToElement",value:function(a){var b=a.name||a.toString().match(/^function\s*([^\s(]+)/)[1];if(b)return a.name.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()}).replace(/^\-/,"")}},{key:"elementToClass",value:function(a){return a.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g,function(a,b){return 0===+a?"":a.toUpperCase()}).replace(/[\-|\_]/g,"")}}]),a}(),"function"!=typeof HTMLElement&&(A=function(){},A.prototype=HTMLElement.prototype,HTMLElement=A),B=function(a){function b(){return u(this,b),w(this,Object.getPrototypeOf(b).apply(this,arguments))}return x(b,a),v(b,[{key:"createdCallback",value:function(){}},{key:"attachedCallback",value:function(){}},{key:"detachedCallback",value:function(){}},{key:"attributeChangedCallback",value:function(a,b,c){}}],[{key:"onRegister",value:function(){}},{key:"tagName",get:function(){return this._tagName||z.classToElement(this)},set:function(a){"string"==typeof a&&(this._tagName=a)}}]),b}(HTMLElement),C=function n(a,b,c){null===a&&(a=Function.prototype);var d=Object.getOwnPropertyDescriptor(a,b);if(void 0===d){var e=Object.getPrototypeOf(a);return null===e?void 0:n(e,b,c)}if("value"in d)return d.value;var f=d.get;if(void 0!==f)return f.call(c)},D=function(a){function g(){return u(this,g),w(this,Object.getPrototypeOf(g).apply(this,arguments))}return x(g,a),v(g,[{key:"createdCallback",value:function(){var a=this;C(Object.getPrototypeOf(g.prototype),"createdCallback",this).call(this);for(var b=this.attributes||[],c=0,d=b.length;d>c;c++){var f=b[c];""!=f.value?this.attributeChangedCallback(f.name,void 0,f.value):null!==this.getAttribute(f.name)&&this.attributeChangedCallback(f.name,void 0,!0)}var h=this.constructor.normalizedAttributes||[];h.forEach(function(b){null!==a[b]&&void 0!==a[b]&&a[b]!==!1&&a.setAttribute(e(b),a[b])})}},{key:"attributeChangedCallback",value:function(a,b,c){C(Object.getPrototypeOf(g.prototype),"attributeChangedCallback",this).call(this,a,b,c);var d=this.constructor;d&&d.normalizedAttributes&&Array.isArray(d.normalizedAttributes)&&(a=f(a),-1!==d.normalizedAttributes.indexOf(a)&&(this[a]=c))}}],[{key:"onRegister",value:function(){var a=this,e=this.attributes||[];this.normalizedAttributes=e.map(function(e){e=f(e);var g=b(a.prototype,e)||{};return Object.defineProperty(a.prototype,e,{configurable:!0,get:d(e,g),set:c(e,g)}),e})}}]),g}(B),E=function(a){function b(){return u(this,b),w(this,Object.getPrototypeOf(b).apply(this,arguments))}return x(b,a),v(b,[{key:"createdCallback",value:function(){var a=this,c=this.constructor.events||this.constructor.bindEvents;if(c){var d=new t(this);for(var e in c){var f="string"==typeof c[e]?this[c[e]]:c[e];f&&"function"==typeof f&&!function(){var b=e.split(" ").shift(),c=e.split(" ").slice(1).join(" "),g=f.bind(a);c?d.on(b,c,function(a){g(a,this)}):d.on(b,function(a){g(a,this)})}()}}C(Object.getPrototypeOf(b.prototype),"createdCallback",this).call(this)}},{key:"addEventListener",value:function(a,b){return"undefined"!=typeof Node.prototype.addEventListener?Node.prototype.addEventListener.call(this,a,b):"undefined"!=typeof Node.prototype.attachEvent?Node.prototype.attachEvent.call(this,"on"+a,b):void 0}},{key:"trigger",value:function(a,c){var d=arguments.length<=2||void 0===arguments[2]?!0:arguments[2],e=arguments.length<=3||void 0===arguments[3]?!0:arguments[3],f=b.createEvent();if(f){if("undefined"!=typeof f.initEvent&&f.initEvent(a,d,e),f.detail=c,"undefined"!=typeof Node.prototype.dispatchEvent)return Node.prototype.dispatchEvent.call(this,f);if("undefined"!=typeof Node.prototype.fireEvent)return Node.prototype.fireEvent.call(this,"on"+a,f)}}}],[{key:"createEvent",value:function(){var a=arguments.length<=0||void 0===arguments[0]?"Event":arguments[0];return"undefined"!=typeof document.createEvent?document.createEvent(a):"undefined"!=typeof document.createEventObject?document.createEventObject():void 0}}]),b}(B),F=function(a){function b(){return u(this,b),w(this,Object.getPrototypeOf(b).apply(this,arguments))}return x(b,a),v(b,[{key:"createdCallback",value:function(){C(Object.getPrototypeOf(b.prototype),"createdCallback",this).call(this),g(this,"createdCallback")}},{key:"attachedCallback",value:function(){C(Object.getPrototypeOf(b.prototype),"attachedCallback",this).call(this),g(this,"attachedCallback")}},{key:"detachedCallback",value:function(){C(Object.getPrototypeOf(b.prototype),"detachedCallback",this).call(this),g(this,"detachedCallback")}},{key:"attributeChangedCallback",value:function(a,c,d){C(Object.getPrototypeOf(b.prototype),"attributeChangedCallback",this).call(this,a,c,d),g(this,"attributeChangedCallback",[a,c,d])}}],[{key:"onRegister",value:function(){for(var a,c=this,d=this,e=arguments.length,f=Array(e),j=0;e>j;j++)f[j]=arguments[j];(a=C(Object.getPrototypeOf(b),"onRegister",this)).call.apply(a,[this].concat(f)),G.forEach(function(a){var b=i(a);c[b]=[]});var k=this.behaviors||[];return h(this,k),g(this,"onRegister",f),delete this.__attachedBehaviors,d}}]),b}(B),G=["onRegister","createdCallback","attachedCallback","detachedCallback","attributeChangedCallback"],H=function(a){function b(){return u(this,b),w(this,Object.getPrototypeOf(b).apply(this,arguments))}return x(b,a),v(b,[{key:"createdCallback",value:function(){C(Object.getPrototypeOf(b.prototype),"createdCallback",this).call(this),this.is&&this.classList.add(this.is)}}],[{key:"onRegister",value:function(){this.css&&this.addCss(this.css)}},{key:"addCss",value:function(a){"function"==typeof a&&(a=a());var b="style-"+this.tagName,c=document.getElementById(b)||document.createElement("style");if(c.type="text/css",c.setAttribute("id",b),c.styleSheet?c.styleSheet.cssText=a:(c.innerHTML="",c.appendChild(document.createTextNode(a))),!c.parentNode){var d=document.head||document.getElementsByTagName("head")[0];d.firstElementChild?d.insertBefore(c,d.firstElementChild):d.appendChild(c)}return c}}]),b}(B),I=window.virtualDom,J=function(a){function b(){return u(this,b),w(this,Object.getPrototypeOf(b).apply(this,arguments))}return x(b,a),v(b,[{key:"createdCallback",value:function(){this.updateViewContent(),C(Object.getPrototypeOf(b.prototype),"createdCallback",this).call(this)}},{key:"updateViewContent",value:function(){if("function"==typeof this.render){var a=this.render(),b=a;if(a instanceof NodeList){b="";for(var c=0,d=a.length;d>c;c++)b+=a[c].outerHTML}else a instanceof Node&&(b=a.outerHTML);if(b=b.replace(/[\n\r\t]/g,"").replace(/\s+/g," "),y.useVirtualDOM){var e=document.createElement("div");e.innerHTML=b;var f=k(e);if(this._vtree){var g=I.diff(this._vtree,f);I.patch(this,g)}else this.innerHTML=b;this._vtree=f}else this.innerHTML=b}}}],[{key:"onRegister",value:function(){var a=this,b=this;this.template&&("function"==typeof b.template?b.prototype.render=function(){return b.template.call(this)}:"string"==typeof b.template?!function(){var c=b.template;b.prototype.render=function(a){return function(){return c}}(a)}():b.template instanceof Node&&"TEMPLATE"==b.template.tagName&&(b.prototype.render=function(){return document.importNode(b.template.content,!0)}),y.autoUpdateView&&!function(){var b=a.prototype;Object.getOwnPropertyNames(b).forEach(function(c){"function"!=typeof b[c]&&!function(){var d=Object.getOwnPropertyDescriptor(b,c)||{};Object.defineProperty(a.prototype,c,{configurable:!0,get:function(){return d.get?d.get.call(this):this["__"+c]},set:function(a){var b=void 0;return b=d.set?d.set.call(this,a):this["__"+c]=a,this.updateViewContent(),b}})}()})}())}}]),b}(B),K=function(a){function b(){return u(this,b),w(this,Object.getPrototypeOf(b).apply(this,arguments))}return x(b,a),v(b,null,[{key:"behaviors",get:function(){return[H,E,D,J]}}]),b}(F),L=function(a,b){var c=function f(){r(Object.getPrototypeOf(f.prototype),"constructor",a).apply(a,arguments)};q(c,b);for(var d in b.prototype){var e=Object.getOwnPropertyDescriptor(b.prototype,d)||{};e.get&&Object.defineProperty(c.prototype,d,{get:e.get,set:e.set,configurable:!0})}return o(c,m(a.prototype),m(a))},a("Config",y),a("DNAComponent",B),a("DNAAttributesComponent",D),a("DNAEventsComponent",E),a("DNAMixedComponent",F),a("DNAStyleComponent",H),a("DNATemplateComponent",J),a("DNABaseComponent",K),a("Create",l),a("Register",s)}}})})(function(a){"function"==typeof define&&define.amd?define([],a):"object"==typeof module&&module.exports&&"function"==typeof require?module.exports=a():DNAComponents=a()});
//# sourceMappingURL=dna-components.js.map