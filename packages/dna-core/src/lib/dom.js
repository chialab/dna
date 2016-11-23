import { isFunction } from './typeof.js';
import { registry } from './registry.js';

/**
 * The `connectedCallback` name.
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
const CONNECTED = 'connectedCallback';
/**
 * The `disconnectedCallback` name.
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
const DISCONNECTED = 'disconnectedCallback';
/**
 * The `attributeChangedCallback` name.
 * @type {String}
 * @see [W3C spec](https://www.w3.org/TR/custom-elements/#custom-element-reactions)
 */
const UPDATED = 'attributeChangedCallback';
/**
 * Retrieve a component constructor from an Element or from a tag name.
 * @param {HTMLElement|String} node The element or the tag name.
 * @return {Function} The component constructor for the given param.
 */
export function getComponent(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        node = node.getAttribute('is') || node.tagName;
    }
    return registry.get(node);
}
/**
 * Check if a node is an instance of a component.
 * @param {HTMLElement} node The element to check.
 * @return {Boolean}
 */
export function isComponent(node) {
    let desc = getComponent(node);
    return desc && (node instanceof desc.Ctr);
}
/**
 * An helper for dynamically trigger the `connectedCallback` reaction on components.
 * @param {HTMLElement} node The attached node.
 * @return {Boolean} The callback has been triggered.
 */
export function connect(node) {
    if (isComponent(node)) {
        node[CONNECTED].call(node);
        return true;
    }
}
/**
 * An helper for dynamically trigger the `disconnectedCallback` reaction on components.
 * @param {HTMLElement} node The detached node.
 * @return {Boolean} The callback has been triggered.
 */
export function disconnect(node) {
    if (isComponent(node)) {
        node[DISCONNECTED].call(node);
        return true;
    }
}
/**
 * An helper for dynamically trigger the `attributeChangedCallback` reaction on components.
 * @param {HTMLElement} node The updated node.
 * @return {Boolean} The callback has been triggered.
 */
export function update(node, name, oldValue, newValue) {
    if (isComponent(node)) {
        node[UPDATED].call(node, name, oldValue, newValue);
        return true;
    }
}
/**
 * Attach a component prototype to an already instantiated HTMLElement.
 * @param {HTMLElement} node The node to update.
 * @param {Function} Ctr The component class to use (leave empty for auto detect).
 * @return {Boolean} The prototype has been attached.
 */
export function bind(node, Ctr) {
    if (!isFunction(Ctr)) {
        let desc = getComponent(node);
        if (desc) {
            Ctr = desc.Ctr;
        }
    }
    if (isFunction(Ctr)) {
        node.__proto__ = Ctr.prototype;
        Object.defineProperty(node, 'constructor', {
            value: Ctr,
            configurable: true,
            writable: true,
        });
        Ctr.call(node);
        return true;
    }
    return false;
}
/**
 * Create a component instance.
 * @param {String} is The component tag name.
 * @return {HTMLElement} The component instance.
 */
export function createElement(is) {
    let descriptor = getComponent(is);
    if (descriptor) {
        return new descriptor.Ctr();
    }
}
/**
 * Dynamically append a node and call the `connectedCallback`.
 * - disconnect the node if already in the tree
 * - connect the node after the insertion
 * @param {HTMLElement} parent The parent element.
 * @param {HTMLElement} node The node to append.
 * @return {Boolean} The node has been appended.
 */
export function appendChild(parent, node) {
    if (parent !== node.parentNode || parent.lastElementChild !== node) {
        if (node.parentNode) {
            removeChild(node.parentNode, node);
        }
        parent.appendChild(node);
        return connect(node);
    }
    return false;
}
/**
 * Dynamically remove a node and call the `disconnectedCallback`.
 * @param {HTMLElement} parent The parent element.
 * @param {HTMLElement} node The node to remove.
 * @return {Boolean} The node has been removed.
 */
export function removeChild(parent, node) {
    parent.removeChild(node);
    return disconnect(node);
}
/**
 * Dynamically insert a node before another and call all the reactions.
 * - disconnect the node if already in the tree
 * - connect the node after the insertion
 * @param {HTMLElement} parent The parent element.
 * @param {HTMLElement} node The node to insert.
 * @param {HTMLElement} refNode The node for positioning.
 * @return {Boolean} The node has been appended.
 */
export function insertBefore(parent, node, refNode) {
    if (node.nextSibling !== refNode) {
        if (node.parentNode) {
            disconnect(node);
        }
        parent.insertBefore(node, refNode);
        return connect(node);
    }
}
/**
 * Dynamically replace a node with another and call all the reactions.
 * - disconnect the node if already in the tree
 * - disconnect the replaced node
 * - connect the first node after the insertion
 * @param {HTMLElement} parent The parent element.
 * @param {HTMLElement} node The node to insert.
 * @param {HTMLElement} refNode The node to replace.
 * @return {Boolean} The node has been appended.
 */
export function replaceChild(parent, node, refNode) {
    if (node.parentNode) {
        disconnect(node);
    }
    parent.replaceChild(node, refNode);
    disconnect(refNode);
    return connect(node);
}
/**
 * Dynamically update a node attribute and call all the reactions.
 * @param {HTMLElement} node The node to update.
 * @param {String} name The attribute name.
 * @param {String} value The attribute value.
 * @return {Boolean} The node has been updated.
 */
export function setAttribute(node, name, value) {
    let oldValue = node.getAttribute(name);
    node.setAttribute(name, value);
    let attrs = node.constructor.observedAttributes || [];
    if (attrs.indexOf(name) !== -1) {
        return update(node, name, oldValue, value);
    }
}
/**
 * Dynamically remove a node attribute and call all the reactions.
 * @param {HTMLElement} node The node to update.
 * @param {String} name The attribute name.
 * @return {Boolean} The node has been updated.
 */
export function removeAttribute(node, name) {
    let oldValue = node.getAttribute(name);
    node.removeAttribute(name);
    let attrs = node.constructor.observedAttributes || [];
    if (attrs.indexOf(name) !== -1) {
        return update(node, name, oldValue, null);
    }
}
