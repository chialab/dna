import { createElementNSImpl } from './helpers';
/**
 * DOM is a singleton that components uses to access DOM methods.
 * By default, it uses browsers' DOM implementation, but it can be set to use a different one.
 * For example, in a Node context it is possibile to use DNA thanks to the `jsdom` dom implementation.
 * It also handle element life cycle for custom elements unless otherwise specified.
 */
export declare const DOM: {
    /**
     * Create a document fragment.
     *
     * @return The new DOM fragment.
     */
    createDocumentFragment: () => DocumentFragment;
    /**
     * Create a new DOM element node for the specified tag.
     *
     * @param qualifiedName The specified tag.
     * @return The new DOM element instance.
     */
    createElement<K extends keyof HTMLElementTagNameMap>(qualifiedName: K, options?: ElementCreationOptions | undefined): HTMLElementTagNameMap[K];
    /**
     * Create a new DOM element node for the specified tag using a namespace.
     *
     * @param namespaceURI The namespace of the tag.
     * @param tagName The specified tag.
     * @return The new DOM element instance.
     */
    createElementNS(namespaceURI: Parameters<typeof createElementNSImpl>[0], qualifiedName: Parameters<typeof createElementNSImpl>[1]): Element;
    /**
     * Create a new DOM text node from the specified value.
     *
     * @param data The specified value.
     * @return The new DOM text instance.
     */
    createTextNode: (data: string) => Text;
    /**
     * Create a new DOM comment node from the specified value.
     *
     * @param data The specified value.
     * @return The new DOM text instance.
     */
    createComment(data: string): Comment;
    /**
     * Instantiate an Event.
     * @param typeArg The name of the event.
     * @param eventInitDict A set of options for the event, such as detail and bubbling.
     */
    createEvent(typeArg: string, eventInitDict?: CustomEventInit<unknown>): CustomEvent<unknown>;
    /**
     * Append a child to an element.
     *
     * @param parent The parent element.
     * @param newChild The child to add.
     * @param slot Should add a slot node.
     */
    appendChild<T extends Node>(parent: Node, newChild: T, slot?: boolean): T;
    /**
     * Remove a child from an element.
     *
     * @param parent The parent element.
     * @param oldChild The child to remove.
     * @param slot Should remove a slot node.
     */
    removeChild<T_1 extends Node>(parent: Node, oldChild: T_1, slot?: boolean): T_1;
    /**
     * Insert a child before another in an element.
     *
     * @param parent The parent element.
     * @param newChild The child to insert.
     * @param refChild The referred node.
     * @param slot Should insert a slot node.
     */
    insertBefore<T_2 extends Node>(parent: Node, newChild: T_2, refChild: Node | null, slot?: boolean): T_2;
    /**
     * Replace a child with another in an element.
     *
     * @param parent The parent element.
     * @param newChild The child to insert.
     * @param oldChild The node to replace.
     * @param slot Should replace a slot node.
     */
    replaceChild<T_3 extends Node>(parent: Node, newChild: Node, oldChild: T_3, slot?: boolean): T_3;
    /**
     * Insert a child at the given position.
     *
     * @param parent The parent element.
     * @param postion The position of the insertion.
     * @param insertedElement The child to insert.
     * @param slot Should insert a slot node.
     */
    insertAdjacentElement(parent: Element, position: InsertPosition, insertedElement: Element, slot?: boolean): Element | null;
    /**
     * Get a Component attribute.
     *
     * @param element The node element
     * @param qualifiedName The attribute name
     */
    getAttribute(element: Element, qualifiedName: string): string | null;
    /**
     * Check if an element has an attribute.
     *
     * @param element The node element to check.
     * @param qualifiedName The attribute name to check.
     */
    hasAttribute(element: Element, qualifiedName: string): boolean;
    /**
     * Add/set an attribute to an element.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to add/set.
     * @param value The value to set.
     */
    setAttribute(element: Element, qualifiedName: string, value: string): void;
    /**
     * Remove an element's attribute.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to remove.
     */
    removeAttribute(element: Element, qualifiedName: string): void;
};
