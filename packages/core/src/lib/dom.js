import { DNA_SYMBOL, COMPONENT_SYMBOL } from './symbols.js';

let TRIGGER_LIFE_CYCLE_METHODS = false;

/**
 * Enable or disable Component's programmatic life cycle.
 * @param {Boolean} enabled
 */
function lifeCycle(enabled) {
    TRIGGER_LIFE_CYCLE_METHODS = !!enabled;
}

/**
 * The base Node constructor.
 * @type {Function}
 * @memberof DNA.DOM
 */
const Node = self.Node;

/**
 * Retrieve a HTMLElement instance from a component instance.
 * @method getComponentNode
 * @memberof DNA.DOM
 *
 * @param {Object} elem The component instance.
 * @return {HTMLElement} The node for the component instance.
 */
function getComponentNode(elem) {
    return elem && elem.node;
}

/**
 * Retrieve a component instance from a HTMLElement instance.
 * @method getNodeComponent
 * @memberof DNA.DOM
 *
 * @param {HTMLElement} elem The node instance.
 * @return {Object} The component for the node instance.
 */
function getNodeComponent(elem) {
    return elem && elem[COMPONENT_SYMBOL];
}

/**
 * The `connectedCallback` name.
 * @private
 *
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
const CONNECTED = 'connectedCallback';

/**
 * The `disconnectedCallback` name.
 * @private
 *
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
const DISCONNECTED = 'disconnectedCallback';

/**
 * The `attributeChangedCallback` name.
 * @private
 *
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
const UPDATED = 'attributeChangedCallback';

/**
 * An helper for dynamically trigger the `connectedCallback` reaction on components.
 * @method connect
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} element The attached node.
 * @return {Boolean} The callback has been triggered.
 */
function connect(element) {
    if (!TRIGGER_LIFE_CYCLE_METHODS) {
        return false;
    }
    let component = DOM.getNodeComponent(element);
    let children;
    if (component) {
        element = component;
        children = component.node.childNodes;
    } else {
        children = element.childNodes;
    }
    if (children) {
        [].forEach.call(children, connect);
    }
    if (element[DNA_SYMBOL] && !element.isConnected) {
        element[DOM.CONNECTED].call(element);
        return true;
    }
    return false;
}

/**
 * An helper for dynamically trigger the `disconnectedCallback` reaction on components.
 * @method disconnect
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} element The detached node.
 * @return {Boolean} The callback has been triggered.
 */
function disconnect(element) {
    if (!TRIGGER_LIFE_CYCLE_METHODS) {
        return false;
    }
    let component = DOM.getNodeComponent(element);
    let children;
    if (component) {
        element = component;
        children = component.node.childNodes;
    } else {
        children = element.childNodes;
    }
    if (children) {
        [].forEach.call(children, disconnect);
    }
    if (element[DNA_SYMBOL]) {
        element[DOM.DISCONNECTED].call(element);
        return true;
    }
    return false;
}

/**
 * An helper for dynamically trigger the `attributeChangedCallback` reaction on components.
 * @method update
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} element The updated element.
 * @param {String} name The property name.
 * @property {*} oldValue The previous property value.
 * @property {*} newValue The current property value.
 * @return {Boolean} The callback has been triggered.
 */
function update(element, name, oldValue, newValue) {
    if (!TRIGGER_LIFE_CYCLE_METHODS) {
        return false;
    }
    element = DOM.getNodeComponent(element) || element;
    if (element[DNA_SYMBOL]) {
        let attrs = element.constructor.observedAttributes || [];
        if (attrs.indexOf(name) !== -1) {
            element[DOM.UPDATED].call(element, name, oldValue, newValue);
            return true;
        }
    }
    return false;
}

/**
 * Create a node instance.
 * @method createElement
 * @memberof DNA.DOM
 * @static
 *
 * @param {String} tag The tag name of the node to create.
 * @return {Node} The node instance.
 */
function createElement(tag) {
    return document.createElement(tag);
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
 * @param {HTMLElement} element The element to append.
 * @return {Boolean} The node has been appended.
 */
function appendChild(parent, element) {
    parent = getComponentNode(parent) || parent;
    element = getComponentNode(element) || element;
    if (parent !== element.parentNode || parent.lastElementChild !== element) {
        if (element.parentNode) {
            removeChild(element.parentNode, element);
        }
        parent.appendChild(element);
        return connect(element);
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
 * @param {HTMLElement} element The element to remove.
 * @return {Boolean} The node has been removed.
 */
function removeChild(parent, element) {
    parent = getComponentNode(parent) || parent;
    element = getComponentNode(element) || element;
    parent.removeChild(element);
    return disconnect(element);
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
 * @param {HTMLElement} element The element to insert.
 * @param {HTMLElement} refNode The node for positioning.
 * @return {Boolean} The node has been appended.
 */
function insertBefore(parent, element, refNode) {
    parent = getComponentNode(parent) || parent;
    element = getComponentNode(element) || element;
    refNode = getComponentNode(refNode) || refNode;
    if (element.nextSibling !== refNode) {
        if (element.parentNode) {
            disconnect(element);
        }
        parent.insertBefore(element, refNode);
        return connect(element);
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
 * @param {HTMLElement} element The element to insert.
 * @param {HTMLElement} refNode The node to replace.
 * @return {Boolean} The node has been appended.
 */
function replaceChild(parent, element, refNode) {
    element = getComponentNode(element) || element;
    refNode = getComponentNode(refNode) || refNode;
    if (element.parentNode) {
        disconnect(element);
    }
    parent.replaceChild(element, refNode);
    disconnect(refNode);
    return connect(element);
}

/**
 * Dynamically update a node attribute and call all the reactions.
 * @method setAttribute
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} element The element to update.
 * @param {String} name The attribute name.
 * @param {String} value The attribute value.
 * @return {Boolean} The node has been updated.
 */
function setAttribute(element, name, value) {
    element = getComponentNode(element) || element;
    let oldValue = element.getAttribute(name);
    element.setAttribute(name, value);
    return update(element, name, oldValue, value);
}

/**
 * Dynamically remove a node attribute and call all the reactions.
 * @method removeAttribute
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} element The element to update.
 * @param {String} name The attribute name.
 * @return {Boolean} The node has been updated.
 */
function removeAttribute(element, name) {
    element = getComponentNode(element) || element;
    let oldValue = element.getAttribute(name);
    element.removeAttribute(name);
    return update(element, name, oldValue, null);
}

const DOM = {
    Node,
    CONNECTED,
    DISCONNECTED,
    UPDATED,
    getNodeComponent,
    getComponentNode,
    connect,
    disconnect,
    update,
    createElement,
    appendChild,
    removeChild,
    insertBefore,
    replaceChild,
    setAttribute,
    removeAttribute,
    lifeCycle,
};

export default DOM;
