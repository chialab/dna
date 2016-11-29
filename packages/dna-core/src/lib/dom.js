import { isFunction, isString } from './typeof.js';
import { registry } from './registry.js';
import { COMPONENT_SYMBOL } from './symbols.js';

/**
 * Retrieve a HTMLElement instance from a component instance.
 * @private
 * @method getComponentNode
 *
 * @param {Component} elem The component instance.
 * @return {HTMLElement} The node for the component instance.
 */
function getComponentNode(elem) {
    if (!elem.nodeType) {
        return elem.node;
    }
    return elem;
}
/**
 * Retrieve a component instance from a HTMLElement instance.
 * @private
 * @method getNodeComponent
 *
 * @param {HTMLElement} elem The node instance.
 * @return {Component} The component for the node instance.
 */
function getNodeComponent(elem) {
    if (elem.nodeType) {
        return elem[COMPONENT_SYMBOL];
    }
    return elem;
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
 * @param {Component} element The attached node.
 * @return {Boolean} The callback has been triggered.
 */
export function connect(element) {
    element = getNodeComponent(element);
    if (element) {
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
export function disconnect(element) {
    element = getNodeComponent(element);
    if (element) {
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
export function update(element, name, oldValue, newValue) {
    element = getNodeComponent(element);
    if (element) {
        let attrs = element.constructor.observedAttributes || [];
        if (attrs.indexOf(name) !== -1) {
            element[UPDATED].call(element, name, oldValue, newValue);
            return true;
        }
    }
}
/**
 * Create a component instance.
 * @method createElement
 * @memberof DNA.DOM
 * @static
 *
 * @param {Function|String} Ctr The component constructor or tag name.
 * @return {HTMLElement} The component instance.
 */
export function createElement(Ctr) {
    if (isString(Ctr)) {
        Ctr = registry.get(Ctr);
    }
    if (isFunction(Ctr)) {
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
 * @param {HTMLElement} element The element to append.
 * @return {Boolean} The node has been appended.
 */
export function appendChild(parent, element) {
    parent = getComponentNode(parent);
    element = getComponentNode(element);
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
export function removeChild(parent, element) {
    parent = getComponentNode(parent);
    element = getComponentNode(element);
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
export function insertBefore(parent, element, refNode) {
    parent = getComponentNode(parent);
    element = getComponentNode(element);
    refNode = getComponentNode(refNode);
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
export function replaceChild(parent, element, refNode) {
    element = getComponentNode(element);
    refNode = getComponentNode(refNode);
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
export function setAttribute(element, name, value) {
    element = getComponentNode(element);
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
export function removeAttribute(element, name) {
    element = getComponentNode(element);
    let oldValue = element.getAttribute(name);
    element.removeAttribute(name);
    return update(element, name, oldValue, null);
}
