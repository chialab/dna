import type { IterableNodeList } from './types';
/**
 * Create a symbolic key.
 * When native Symbol is not defined, compute an unique string key.
 * @return An unique key.
 */
export declare const createSymbol: (description?: string | number | undefined) => any;
export declare const Node: {
    new (): Node;
    prototype: Node;
    readonly ATTRIBUTE_NODE: number;
    readonly CDATA_SECTION_NODE: number;
    readonly COMMENT_NODE: number;
    readonly DOCUMENT_FRAGMENT_NODE: number;
    readonly DOCUMENT_NODE: number;
    readonly DOCUMENT_POSITION_CONTAINED_BY: number;
    readonly DOCUMENT_POSITION_CONTAINS: number;
    readonly DOCUMENT_POSITION_DISCONNECTED: number;
    readonly DOCUMENT_POSITION_FOLLOWING: number;
    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    readonly DOCUMENT_POSITION_PRECEDING: number;
    readonly DOCUMENT_TYPE_NODE: number;
    readonly ELEMENT_NODE: number;
    readonly ENTITY_NODE: number;
    readonly ENTITY_REFERENCE_NODE: number;
    readonly NOTATION_NODE: number;
    readonly PROCESSING_INSTRUCTION_NODE: number;
    readonly TEXT_NODE: number;
}, HTMLElement: {
    new (): HTMLElement;
    prototype: HTMLElement;
}, Event: {
    new (type: string, eventInitDict?: EventInit | undefined): Event;
    prototype: Event;
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    readonly CAPTURING_PHASE: number;
    readonly NONE: number;
}, CustomEvent: {
    new <T>(typeArg: string, eventInitDict?: CustomEventInit<T> | undefined): CustomEvent<T>;
    prototype: CustomEvent<any>;
}, document: Document;
export declare const DOCUMENT_NODE: number, TEXT_NODE: number, COMMENT_NODE: number, ELEMENT_NODE: number;
/**
 * Alias to Array.isArray.
 */
export declare const isArray: (arg: any) => arg is any[];
/**
 * Alias Array.prototype.indexOf.
 */
export declare const indexOf: (searchElement: any, fromIndex?: number | undefined) => number;
/**
 * Alias to Object.getOwnPropertyDescriptor.
 */
export declare const getOwnPropertyDescriptor: (o: any, p: PropertyKey) => PropertyDescriptor | undefined;
/**
 * Alias to Object.setPrototypeOf.
 */
export declare const getPrototypeOf: (o: any) => any;
/**
 * Alias to Object.setPrototypeOf.
 */
export declare const setPrototypeOf: (o: any, proto: object | null) => any;
/**
 * Alias to Object.prototype.toString.
 */
export declare const toString: () => string;
/**
 * Alias to Object.prototype.hasOwnProperty.
 */
export declare const hasOwnProperty: (v: PropertyKey) => boolean;
/**
 * Alias to Object.defineProperty.
 */
export declare const defineProperty: (o: any, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => any;
/**
 * Alias to Node.prototype.appendChild.
 */
export declare const appendChildImpl: <T extends Node>(newChild: T) => T;
/**
 * Alias to Node.prototype.removeChild.
 */
export declare const removeChildImpl: <T extends Node>(oldChild: T) => T;
/**
 * Alias to Node.prototype.insertBefore.
 */
export declare const insertBeforeImpl: <T extends Node>(newChild: T, refChild: Node | null) => T;
/**
 * Alias to Node.prototype.replaceChild.
 */
export declare const replaceChildImpl: <T extends Node>(newChild: Node, oldChild: T) => T;
/**
 * Alias to HTMLElement.prototype.insertAdjacentElement.
 */
export declare const insertAdjacentElementImpl: (position: InsertPosition, insertedElement: Element) => Element | null;
/**
 * Alias to Node.prototype.isConnected.
 */
export declare const isConnectedImpl: PropertyDescriptor | undefined;
/**
 * Alias to HTMLElement.prototype.getAttribute.
 */
export declare const getAttributeImpl: (qualifiedName: string) => string | null;
/**
 * Alias to HTMLElement.prototype.hasAttribute.
 */
export declare const hasAttributeImpl: (qualifiedName: string) => boolean;
/**
 * Alias to HTMLElement.prototype.setAttribute.
 */
export declare const setAttributeImpl: (qualifiedName: string, value: string) => void;
/**
 * Alias to HTMLElement.prototype.removeAttribute.
 */
export declare const removeAttributeImpl: (qualifiedName: string) => void;
/**
 * Alias to HTMLElement.prototype.matches.
 */
export declare const matchesImpl: (selectors: string) => boolean;
/**
 * Alias to document.createDocumentFragment.
 */
export declare const createDocumentFragmentImpl: () => DocumentFragment;
/**
 * Alias to document.createElement.
 */
export declare const createElementImpl: {
    <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions | undefined): HTMLElementTagNameMap[K];
    <K_1 extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K_1, options?: ElementCreationOptions | undefined): HTMLElementDeprecatedTagNameMap[K_1];
    (tagName: string, options?: ElementCreationOptions | undefined): HTMLElement;
};
/**
 * Alias to document.createElementNS.
 */
export declare const createElementNSImpl: {
    (namespaceURI: "http://www.w3.org/1999/xhtml", qualifiedName: string): HTMLElement;
    <K extends keyof SVGElementTagNameMap>(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: K): SVGElementTagNameMap[K];
    (namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: string): SVGElement;
    (namespaceURI: string | null, qualifiedName: string, options?: ElementCreationOptions | undefined): Element;
    (namespace: string | null, qualifiedName: string, options?: string | ElementCreationOptions | undefined): Element;
};
/**
 * Alias to document.createTextNode.
 */
export declare const createTextNodeImpl: (data: string) => Text;
/**
 * Alias to document.createComment.
 */
export declare const createCommentImpl: (data: string) => Comment;
/**
 * Create a Custom Event.
 * @param typeArg The name of the event.
 * @param eventInitDict The options of the event.
 * @return The constructed Custom Event.
 */
export declare const createEventImpl: (typeArg: string, eventInitDict?: CustomEventInit<unknown>) => CustomEvent<unknown>;
/**
 * Check if the target is a Node instance.
 * @param target The target to check.
 * @return The target is a Node instance.
 */
export declare const isNode: (target: unknown) => target is Node;
/**
 * Check if a node is a Document instance.
 * @param node The node to check.
 * @return The node is a Document instance.
 */
export declare const isDocument: (node: Node) => node is Document;
/**
 * Check if a node is a Text instance.
 * @param node The node to check.
 * @return The node is a Text instance.
 */
export declare const isText: (node: any) => node is Text;
/**
 * Check if a node is an Element instance.
 * @param node The node to check.
 * @return The node is an Element instance.
 */
export declare const isElement: <T extends Element>(node: any) => node is T;
/**
 * Check if an object is an Event instance.
 * @param node The node to check.
 * @return The object is an Event instance.
 */
export declare const isEvent: (event: any) => event is Event;
/**
 * Check if a Node is connected.
 *
 * @return A truthy value for connected targets.
 */
export declare const isConnected: (this: Node) => boolean;
/**
 * A symbol which identify emulated components.
 */
declare const EMULATE_LIFECYCLE_SYMBOL: unique symbol;
declare type WithEmulatedLifecycle<T extends Element> = T & {
    [EMULATE_LIFECYCLE_SYMBOL]?: boolean;
};
/**
 * Check if a node require emulated life cycle.
 * @param node The node to check.
 */
export declare const shouldEmulateLifeCycle: (node: WithEmulatedLifecycle<Element>) => boolean;
/**
 * Invoke `connectedCallback` method of a Node (and its descendents).
 * It does nothing if life cycle is disabled.
 *
 * @param node The connected node.
 */
export declare const connect: (node: Node) => void;
/**
 * Invoke `disconnectedCallback` method of a Node (and its descendents).
 * It does nothing if life cycle is disabled.
 *
 * @param node The disconnected node.
 */
export declare const disconnect: (node: Node) => void;
/**
 * Flag the element for life cycle emulation.
 */
export declare const emulateLifeCycle: (node: WithEmulatedLifecycle<HTMLElement>) => void;
/**
 * Life cycle emulation status.
 */
export declare const emulatingLifeCycle: () => boolean;
/**
 * Clone an array like instance.
 * @param arr The array to convert.
 * @return A shallow clone of the array.
 */
export declare const cloneChildNodes: (arr: NodeList | IterableNodeList) => IterableNodeList;
export {};
