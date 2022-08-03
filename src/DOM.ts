import type { ComponentConstructor, ComponentInstance } from './Component';
import type { Context } from './Context';
import { isConnected, appendChildImpl, removeChildImpl, insertBeforeImpl, replaceChildImpl, insertAdjacentElementImpl, getAttributeImpl, hasAttributeImpl, setAttributeImpl, removeAttributeImpl, createDocumentFragmentImpl, createElementImpl, createElementNSImpl, createTextNodeImpl, createCommentImpl, createEventImpl } from './helpers';
import { connect, disconnect, shouldEmulateLifeCycle, emulatingLifeCycle, isComponent, isComponentConstructor } from './Component';
import { customElements } from './CustomElementRegistry';
import { getOrCreateContext, getHostContext } from './Context';

/**
 * DOM is a singleton that components uses to access DOM methods.
 * By default, it uses browsers' DOM implementation, but it can be set to use a different one.
 * For example, in a Node context it is possibile to use DNA thanks to the `jsdom` dom implementation.
 * It also handle element life cycle for custom elements unless otherwise specified.
 */
export const DOM = {
    /**
     * Create a document fragment.
     *
     * @returns The new DOM fragment.
     */
    createDocumentFragment: createDocumentFragmentImpl,

    /**
     * Create a new DOM element node for the specified tag.
     * @param qualifiedName The specified tag.
     * @param options Create element options.
     * @returns The new DOM element instance.
     */
    createElement<K extends keyof HTMLElementTagNameMap>(qualifiedName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K] {
        const is = options && options.is;
        const name = is || qualifiedName.toLowerCase();
        const node = createElementImpl(qualifiedName);
        const constructor = customElements.get(name);
        if (constructor && isComponentConstructor(constructor) && !(node instanceof constructor)) {
            constructor.upgrade(node);
        }
        return node;
    },

    /**
     * Create a new DOM element node for the specified tag using a namespace.
     * @param namespaceURI The namespace of the tag.
     * @param qualifiedName The specified tag.
     * @returns The new DOM element instance.
     */
    createElementNS(namespaceURI: Parameters<typeof createElementNSImpl>[0], qualifiedName: Parameters<typeof createElementNSImpl>[1]) {
        if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
            return this.createElement(qualifiedName as keyof HTMLElementTagNameMap);
        }
        return createElementNSImpl(namespaceURI, qualifiedName as keyof SVGElementTagNameMap);
    },

    /**
     * Create a new DOM text node from the specified value.
     *
     * @param data The specified value.
     * @returns The new DOM text instance.
     */
    createTextNode: createTextNodeImpl,

    /**
     * Create a new DOM comment node from the specified value.
     *
     * @param data The specified value.
     * @returns The new DOM text instance.
     */
    createComment(data: string): Comment {
        return createCommentImpl(data || '');
    },

    /**
     * Instantiate an Event.
     * @param typeArg The name of the event.
     * @param eventInitDict A set of options for the event, such as detail and bubbling.
     * @returns The new Event instance.
     */
    createEvent(typeArg: string, eventInitDict: CustomEventInit<unknown> = {}) {
        return createEventImpl(typeArg, eventInitDict);
    },

    /**
     * Append a child to an element.
     *
     * @param parent The parent element.
     * @param newChild The child to add.
     * @param slot Should add a slot node.
     * @returns The appended child.
     */
    appendChild<T extends Node>(parent: Node, newChild: T, slot = isComponent(parent)): T {
        const oldParent = newChild.parentNode;
        const context = slot ? getHostContext(parent) as Context : getOrCreateContext(parent);

        if (slot) {
            const slotted = context.children;
            const previousIndex = slotted.indexOf(newChild);
            if (previousIndex !== -1) {
                slotted.splice(previousIndex, 1);
            } else if (oldParent) {
                DOM.removeChild(oldParent, newChild, false);
            }
            slotted.push(newChild);
            (parent as ComponentInstance).forceUpdate();
            return newChild;
        }
        if (emulatingLifeCycle() && oldParent) {
            DOM.removeChild(oldParent, newChild, false);
        }
        context.children.push(newChild);
        appendChildImpl.call(parent, newChild);
        if (emulatingLifeCycle() && isConnected.call(newChild)) {
            connect(newChild);
        }
        return newChild;
    },

    /**
     * Remove a child from an element.
     *
     * @param parent The parent element.
     * @param oldChild The child to remove.
     * @param slot Should remove a slot node.
     * @returns The removed child.
     */
    removeChild<T extends Node>(parent: Node, oldChild: T, slot = isComponent(parent)): T {
        const context = slot ? getHostContext(parent) as Context : getOrCreateContext(parent);
        if (slot) {
            const slotted = context.children;
            const io = slotted.indexOf(oldChild);
            if (io !== -1) {
                slotted.splice(io, 1);
                (parent as ComponentInstance).forceUpdate();
            }
            return oldChild;
        }
        const connected = isConnected.call(oldChild);
        const childNodes = context.children;
        const io = childNodes.indexOf(oldChild);
        if (io !== -1) {
            childNodes.splice(io, 1);
        }
        removeChildImpl.call(parent, oldChild);
        if (emulatingLifeCycle() && connected) {
            disconnect(oldChild);
        }
        return oldChild;
    },

    /**
     * Insert a child before another in an element.
     *
     * @param parent The parent element.
     * @param newChild The child to insert.
     * @param refChild The referred node.
     * @param slot Should insert a slot node.
     * @returns The inserted child.
     */
    insertBefore<T extends Node>(parent: Node, newChild: T, refChild: Node | null, slot = isComponent(parent)): T {
        const context = slot ? getHostContext(parent) as Context : getOrCreateContext(parent);
        const parentNode = newChild.parentNode;

        if (slot) {
            const slotted = context.children;
            const previousIndex = slotted.indexOf(newChild);
            if (previousIndex !== -1) {
                slotted.splice(previousIndex, 1);
            } else if (parentNode) {
                DOM.removeChild(parentNode, newChild, false);
            }

            if (refChild) {
                const refIndex = slotted.indexOf(refChild);
                if (refIndex !== -1) {
                    slotted.splice(refIndex, 0, newChild);
                }
            } else {
                slotted.push(newChild);
            }
            (parent as ComponentInstance).forceUpdate();
            return newChild;
        }
        if (emulatingLifeCycle() && parentNode) {
            DOM.removeChild(parentNode, newChild, false);
        }
        const childNodes = context.children;
        const oldIo = childNodes.indexOf(newChild);
        if (oldIo !== -1) {
            childNodes.splice(oldIo, 1);
        }
        const io = refChild ? childNodes.indexOf(refChild) : -1;
        if (io !== -1) {
            childNodes.splice(io, 0, newChild);
        } else {
            childNodes.push(newChild);
        }
        insertBeforeImpl.call(parent, newChild, refChild);
        if (emulatingLifeCycle() && isConnected.call(newChild)) {
            connect(newChild);
        }
        return newChild;
    },

    /**
     * Replace a child with another in an element.
     *
     * @param parent The parent element.
     * @param newChild The child to insert.
     * @param oldChild The node to replace.
     * @param slot Should replace a slot node.
     * @returns The replaced child.
     */
    replaceChild<T extends Node>(parent: Node, newChild: Node, oldChild: T, slot = isComponent(parent)): T {
        const context = slot ? getHostContext(parent) as Context : getOrCreateContext(parent);
        const parentNode = newChild.parentNode;

        if (slot) {
            const slotted = context.children;
            const io = slotted.indexOf(oldChild);
            slotted.splice(io, 1, newChild);
            (parent as ComponentInstance).forceUpdate();
            return oldChild;
        }
        if (emulatingLifeCycle()) {
            if (parentNode && newChild !== oldChild) {
                DOM.removeChild(parentNode, newChild, false);
            }
            if (isConnected.call(oldChild)) {
                disconnect(oldChild);
            }
        }
        const childNodes = context.children;
        const io = childNodes.indexOf(oldChild);
        if (io !== -1) {
            childNodes.splice(io, 1);
        }
        replaceChildImpl.call(parent, newChild, oldChild);
        if (emulatingLifeCycle() && isConnected.call(newChild)) {
            connect(newChild);
        }
        return oldChild;
    },

    /**
     * Insert a child at the given position.
     *
     * @param parent The parent element.
     * @param position The position of the insertion.
     * @param insertedElement The child to insert.
     * @param slot Should insert a slot node.
     * @returns The inserted child.
     */
    insertAdjacentElement(parent: Element, position: InsertPosition, insertedElement: Element, slot = isComponent(parent)): Element | null {
        if (position === 'afterbegin') {
            const refChild = isComponent(parent) ? (parent.slotChildNodes as Node[])[0] : parent.firstChild;
            return DOM.insertBefore(parent, insertedElement, refChild, slot);
        }
        if (position === 'beforeend') {
            return DOM.insertBefore(parent, insertedElement, null, slot);
        }

        return insertAdjacentElementImpl.call(parent, position, insertedElement);
    },

    /**
     * Get a Component attribute.
     * @param element The node element.
     * @param qualifiedName The attribute name.
     * @returns The attribute value.
     */
    getAttribute(element: Element, qualifiedName: string): string | null {
        return getAttributeImpl.call(element, qualifiedName);
    },

    /**
     * Check if an element has an attribute.
     * @param element The node element to check.
     * @param qualifiedName The attribute name to check.
     * @returns True if the element has the attribute.
     */
    hasAttribute(element: Element, qualifiedName: string): boolean {
        return hasAttributeImpl.call(element, qualifiedName);
    },

    /**
     * Add/set an attribute to an element.
     * @param element The element node to update.
     * @param qualifiedName The attribute name to add/set.
     * @param value The value to set.
     */
    setAttribute(element: Element, qualifiedName: string, value: string): void {
        if (shouldEmulateLifeCycle(element)) {
            const constructor = element.constructor as ComponentConstructor<typeof element>;
            const observedAttributes = constructor.observedAttributes;
            const observed = observedAttributes && observedAttributes.indexOf(qualifiedName) !== -1;
            if (!observed) {
                setAttributeImpl.call(element, qualifiedName, value);
                return;
            }

            const oldValue = DOM.getAttribute(element, qualifiedName);
            setAttributeImpl.call(element, qualifiedName, value);
            (element as ComponentInstance).attributeChangedCallback(qualifiedName, oldValue, value);
            return;
        }
        setAttributeImpl.call(element, qualifiedName, value);
    },

    /**
     * Remove an element's attribute.
     * @param element The element node to update.
     * @param qualifiedName The attribute name to remove.
     */
    removeAttribute(element: Element, qualifiedName: string): void {
        if (shouldEmulateLifeCycle(element)) {
            const constructor = element.constructor as ComponentConstructor<typeof element>;
            const observedAttributes = constructor.observedAttributes;
            const observed = observedAttributes && observedAttributes.indexOf(qualifiedName) !== -1;
            if (!observed) {
                removeAttributeImpl.call(element, qualifiedName);
                return;
            }

            const oldValue = DOM.getAttribute(element, qualifiedName);
            removeAttributeImpl.call(element, qualifiedName);
            (element as ComponentInstance).attributeChangedCallback(qualifiedName, oldValue, null);
        }
        removeAttributeImpl.call(element, qualifiedName);
    },
};
