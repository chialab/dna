import type { Constructor, ClassDescriptor } from './types';
import type { DelegatedEventCallback, ListenerConfig } from './events';
import type { PropertyConfig, PropertyObserver } from './property';
import type { Template } from './render';
import { HTMLElement } from './helpers';
/**
 * A symbol which identify components.
 */
export declare const COMPONENT_SYMBOL: unique symbol;
export declare type WithComponentFlag<T> = T & {
    [COMPONENT_SYMBOL]?: boolean;
};
/**
 * A symbol which identify constructed components (properties can be assigned).
 */
export declare const CONSTRUCTED_SYMBOL: unique symbol;
export declare type WithConstructedFlag<T> = T & {
    [CONSTRUCTED_SYMBOL]?: boolean;
};
/**
 * Check if a node is a component.
 * @param node The node to check.
 */
export declare const isComponent: (node: WithComponentFlag<Node>) => node is {
    /**
     * The tag name used for Component definition.
     */
    readonly is: string;
    /**
     * A flag with the connected value of the node.
     */
    readonly isConnected: boolean;
    /**
     * A list of slot nodes.
     */
    readonly slotChildNodes: import("./types").IterableNodeList | undefined;
    /**
     * Initialize component properties.
     * @param properties A set of initial properties for the element.
     */
    initialize(properties?: {
        readonly is: string;
        readonly isConnected: boolean;
        readonly slotChildNodes: import("./types").IterableNodeList | undefined;
        initialize: (properties?: any | undefined) => void;
        connectedCallback: () => void;
        disconnectedCallback: () => void;
        attributeChangedCallback: (attributeName: string, oldValue: null | string, newValue: string | null) => void;
        stateChangedCallback: <P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]) => void;
        propertyChangedCallback: <P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]) => void;
        getInnerPropertyValue: <P_2 extends keyof any>(propertyName: P_2) => any[P_2];
        setInnerPropertyValue: <P_4 extends keyof any>(propertyName: P_4, value: any[P_4]) => void;
        observe: <P_5 extends keyof any>(propertyName: P_5, observer: PropertyObserver<any[P_5]>) => void;
        unobserve: <P_6 extends keyof any>(propertyName: P_6, observer: PropertyObserver<any[P_6]>) => void;
        dispatchEvent: {
            (event: Event): boolean;
            (event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
        };
        dispatchAsyncEvent: {
            (event: Event): Promise<any[]>;
            (event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
        };
        delegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined) => void;
        undelegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback) => void;
        render: () => Template | undefined;
        forceUpdate: () => void;
        appendChild: <T extends Node>(newChild: T) => T;
        removeChild: <T_2 extends Node>(oldChild: T_2) => T_2;
        insertBefore: <T_4 extends Node>(newChild: T_4, refChild: Node | null) => T_4;
        replaceChild: <T_6 extends Node>(newChild: Node, oldChild: T_6) => T_6;
        insertAdjacentElement: (position: InsertPosition, insertedElement: Element) => Element | null;
        setAttribute: (qualifiedName: string, value: string) => void;
        removeAttribute: (qualifiedName: string) => void;
        accessKey: string;
        readonly accessKeyLabel: string;
        autocapitalize: string;
        dir: string;
        draggable: boolean;
        hidden: boolean;
        innerText: string;
        lang: string;
        readonly offsetHeight: number;
        readonly offsetLeft: number;
        readonly offsetParent: Element | null;
        readonly offsetTop: number;
        readonly offsetWidth: number;
        spellcheck: boolean;
        title: string;
        translate: boolean;
        click: () => void;
        addEventListener: {
            <K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
        };
        removeEventListener: {
            <K_1 extends keyof HTMLElementEventMap>(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any, options?: boolean | EventListenerOptions | undefined): void;
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
        };
        readonly attributes: NamedNodeMap;
        readonly classList: DOMTokenList;
        className: string;
        readonly clientHeight: number;
        readonly clientLeft: number;
        readonly clientTop: number;
        readonly clientWidth: number;
        id: string;
        readonly localName: string;
        readonly namespaceURI: string | null;
        onfullscreenchange: ((this: Element, ev: Event) => any) | null;
        onfullscreenerror: ((this: Element, ev: Event) => any) | null;
        outerHTML: string;
        readonly ownerDocument: Document;
        readonly prefix: string | null;
        readonly scrollHeight: number;
        scrollLeft: number;
        scrollTop: number;
        readonly scrollWidth: number;
        readonly shadowRoot: ShadowRoot | null;
        slot: string;
        readonly tagName: string;
        attachShadow: (init: ShadowRootInit) => ShadowRoot;
        closest: {
            <K_2 extends keyof HTMLElementTagNameMap>(selector: K_2): HTMLElementTagNameMap[K_2] | null;
            <K_3 extends keyof SVGElementTagNameMap>(selector: K_3): SVGElementTagNameMap[K_3] | null;
            <E extends Element = Element>(selector: string): E | null;
        };
        getAttribute: (qualifiedName: string) => string | null;
        getAttributeNS: (namespace: string | null, localName: string) => string | null;
        getAttributeNames: () => string[];
        getAttributeNode: (qualifiedName: string) => Attr | null;
        getAttributeNodeNS: (namespace: string | null, localName: string) => Attr | null;
        getBoundingClientRect: () => DOMRect;
        getClientRects: () => DOMRectList;
        getElementsByClassName: (classNames: string) => HTMLCollectionOf<Element>;
        getElementsByTagName: {
            <K_4 extends keyof HTMLElementTagNameMap>(qualifiedName: K_4): HTMLCollectionOf<HTMLElementTagNameMap[K_4]>;
            <K_5 extends keyof SVGElementTagNameMap>(qualifiedName: K_5): HTMLCollectionOf<SVGElementTagNameMap[K_5]>;
            (qualifiedName: string): HTMLCollectionOf<Element>;
        };
        getElementsByTagNameNS: {
            (namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
            (namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
            (namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
        };
        hasAttribute: (qualifiedName: string) => boolean;
        hasAttributeNS: (namespace: string | null, localName: string) => boolean;
        hasAttributes: () => boolean;
        hasPointerCapture: (pointerId: number) => boolean;
        insertAdjacentHTML: (where: InsertPosition, html: string) => void;
        insertAdjacentText: (where: InsertPosition, text: string) => void;
        matches: (selectors: string) => boolean;
        msGetRegionContent: () => any;
        releasePointerCapture: (pointerId: number) => void;
        removeAttributeNS: (namespace: string | null, localName: string) => void;
        removeAttributeNode: (attr: Attr) => Attr;
        requestFullscreen: (options?: FullscreenOptions | undefined) => Promise<void>;
        requestPointerLock: () => void;
        scroll: {
            (options?: ScrollToOptions | undefined): void;
            (x: number, y: number): void;
        };
        scrollBy: {
            (options?: ScrollToOptions | undefined): void;
            (x: number, y: number): void;
        };
        scrollIntoView: (arg?: boolean | ScrollIntoViewOptions | undefined) => void;
        scrollTo: {
            (options?: ScrollToOptions | undefined): void;
            (x: number, y: number): void;
        };
        setAttributeNS: (namespace: string | null, qualifiedName: string, value: string) => void;
        setAttributeNode: (attr: Attr) => Attr | null;
        setAttributeNodeNS: (attr: Attr) => Attr | null;
        setPointerCapture: (pointerId: number) => void;
        toggleAttribute: (qualifiedName: string, force?: boolean | undefined) => boolean;
        webkitMatchesSelector: (selectors: string) => boolean;
        readonly baseURI: string;
        readonly childNodes: NodeListOf<ChildNode>;
        readonly firstChild: ChildNode | null;
        readonly lastChild: ChildNode | null;
        readonly nextSibling: ChildNode | null;
        readonly nodeName: string;
        readonly nodeType: number;
        nodeValue: string | null;
        readonly parentElement: HTMLElement | null;
        readonly parentNode: (Node & ParentNode) | null;
        readonly previousSibling: ChildNode | null;
        textContent: string | null;
        cloneNode: (deep?: boolean | undefined) => Node;
        compareDocumentPosition: (other: Node) => number;
        contains: (other: Node | null) => boolean;
        getRootNode: (options?: GetRootNodeOptions | undefined) => Node;
        hasChildNodes: () => boolean;
        isDefaultNamespace: (namespace: string | null) => boolean;
        isEqualNode: (otherNode: Node | null) => boolean;
        isSameNode: (otherNode: Node | null) => boolean;
        lookupNamespaceURI: (prefix: string | null) => string | null;
        lookupPrefix: (namespace: string | null) => string | null;
        normalize: () => void;
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
        animate: (keyframes: PropertyIndexedKeyframes | Keyframe[] | null, options?: number | KeyframeAnimationOptions | undefined) => Animation;
        getAnimations: () => Animation[];
        after: (...nodes: (string | Node)[]) => void;
        before: (...nodes: (string | Node)[]) => void;
        remove: () => void;
        replaceWith: (...nodes: (string | Node)[]) => void;
        innerHTML: string;
        readonly nextElementSibling: Element | null;
        readonly previousElementSibling: Element | null;
        readonly childElementCount: number;
        readonly children: HTMLCollection;
        readonly firstElementChild: Element | null;
        readonly lastElementChild: Element | null;
        append: (...nodes: (string | Node)[]) => void;
        prepend: (...nodes: (string | Node)[]) => void;
        querySelector: {
            <K_6 extends keyof HTMLElementTagNameMap>(selectors: K_6): HTMLElementTagNameMap[K_6] | null;
            <K_7 extends keyof SVGElementTagNameMap>(selectors: K_7): SVGElementTagNameMap[K_7] | null;
            <E_1 extends Element = Element>(selectors: string): E_1 | null;
        };
        querySelectorAll: {
            <K_8 extends keyof HTMLElementTagNameMap>(selectors: K_8): NodeListOf<HTMLElementTagNameMap[K_8]>;
            <K_9 extends keyof SVGElementTagNameMap>(selectors: K_9): NodeListOf<SVGElementTagNameMap[K_9]>;
            <E_2 extends Element = Element>(selectors: string): NodeListOf<E_2>;
        };
        readonly assignedSlot: HTMLSlotElement | null;
        oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        readonly style: CSSStyleDeclaration;
        contentEditable: string;
        enterKeyHint: string;
        inputMode: string;
        readonly isContentEditable: boolean;
        onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragexit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onerror: OnErrorEventHandler;
        onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any) | null;
        onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
        onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
        autofocus: boolean;
        readonly dataset: DOMStringMap;
        nonce?: string | undefined;
        tabIndex: number;
        blur: () => void;
        focus: (options?: FocusOptions | undefined) => void;
    } | undefined): void;
    /**
     * Invoked each time the Component is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
     */
    connectedCallback(): void;
    /**
     * Invoked each time the Component is disconnected from the document's DOM.
     */
    disconnectedCallback(): void;
    /**
     * Invoked each time one of the Component's attributes is added, removed, or changed.
     *
     * @param attributeName The name of the updated attribute.
     * @param oldValue The previous value of the attribute.
     * @param newValue The new value for the attribute (null if removed).
     */
    attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: string | null): void;
    /**
     * Invoked each time one of a Component's state property is setted, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    stateChangedCallback<P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]): void;
    /**
     * Invoked each time one of a Component's property is setted, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    propertyChangedCallback<P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]): void;
    /**
     * Get the inner value of a property.
     * This is an helper method for properties getters and setters.
     * @param propertyName The name of the property to get.
     * @return The inner value of the property.
     */
    getInnerPropertyValue<P_2 extends keyof any>(propertyName: P_2): any[P_2];
    /**
     * Set the inner value of a property.
     * This is an helper method for properties getters and setters.
     * @param propertyName The name of the property to get.
     * @param value The inner value to set.
     */
    setInnerPropertyValue<P_4 extends keyof any>(propertyName: P_4, value: any[P_4]): void;
    /**
     * Observe a Component Property.
     *
     * @param propertyName The name of the Property to observe
     * @param observer The callback function
     */
    observe<P_5 extends keyof any>(propertyName: P_5, observer: PropertyObserver<any[P_5]>): void;
    /**
     * Unobserve a Component Property.
     *
     * @param propertyName The name of the Property to unobserve
     * @param observer The callback function to remove
     */
    unobserve<P_6 extends keyof any>(propertyName: P_6, observer: PropertyObserver<any[P_6]>): void;
    /**
     * Dispatch a custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchEvent(event: Event): boolean;
    /**
     * Dispatch a custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
    /**
     * Dispatch an async custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchAsyncEvent(event: Event): Promise<any[]>;
    /**
     * Dispatch an async custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchAsyncEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
    /**
     * Delegate an Event listener.
     *
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     */
    delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined): void;
    /**
     * Remove an Event delegation.
     *
     * @param eventName The Event name to undelegate
     * @param selector The selector to undelegate
     * @param callback The callback to remove
     */
    undelegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback): void;
    /**
     * Render method of the Component.
     *
     * @return The instances of the rendered Components and/or Nodes
     */
    render(): Template | undefined;
    /**
     * Force an element to re-render.
     */
    forceUpdate(): void;
    /**
     * Append a child to the Component.
     *
     * @param newChild The child to add.
     */
    appendChild<T extends Node>(newChild: T): T;
    /**
     * Remove a child from the Component.
     *
     * @param {Node} oldChild The child to remove.
     */
    removeChild<T_2 extends Node>(oldChild: T_2): T_2;
    /**
     * Insert a child before another in the Component.
     *
     * @param newChild The child to insert.
     * @param refChild The referred Node.
     */
    insertBefore<T_4 extends Node>(newChild: T_4, refChild: Node | null): T_4;
    /**
     * Replace a child with another in the Component.
     *
     * @param newChild The child to insert.
     * @param oldChild The Node to replace.
     */
    replaceChild<T_6 extends Node>(newChild: Node, oldChild: T_6): T_6;
    /**
     * Insert a child at the given position.
     *
     * @param postion The position of the insertion.
     * @param insertedElement The child to insert.
     * @param slot Should insert a slot node.
     */
    insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null;
    /**
     * Set a Component attribute.
     *
     * @param ualifiedName The attribute name.
     * @param value The value to set.
     */
    setAttribute(qualifiedName: string, value: string): void;
    /**
     * Remove a Component attribute.
     *
     * @param qualifiedName The attribute name.
     */
    removeAttribute(qualifiedName: string): void;
    accessKey: string;
    readonly accessKeyLabel: string;
    autocapitalize: string;
    dir: string;
    draggable: boolean;
    hidden: boolean;
    innerText: string;
    lang: string;
    readonly offsetHeight: number;
    readonly offsetLeft: number;
    readonly offsetParent: Element | null;
    readonly offsetTop: number;
    readonly offsetWidth: number;
    spellcheck: boolean;
    title: string;
    translate: boolean;
    click(): void;
    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
    removeEventListener<K_1 extends keyof HTMLElementEventMap>(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any, options?: boolean | EventListenerOptions | undefined): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
    readonly attributes: NamedNodeMap;
    readonly classList: DOMTokenList;
    className: string;
    readonly clientHeight: number;
    readonly clientLeft: number;
    readonly clientTop: number;
    readonly clientWidth: number;
    id: string;
    readonly localName: string;
    readonly namespaceURI: string | null;
    onfullscreenchange: ((this: Element, ev: Event) => any) | null;
    onfullscreenerror: ((this: Element, ev: Event) => any) | null;
    outerHTML: string;
    readonly ownerDocument: Document;
    readonly prefix: string | null;
    readonly scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    readonly scrollWidth: number;
    readonly shadowRoot: ShadowRoot | null;
    slot: string;
    readonly tagName: string;
    attachShadow(init: ShadowRootInit): ShadowRoot;
    closest<K_2 extends keyof HTMLElementTagNameMap>(selector: K_2): HTMLElementTagNameMap[K_2] | null;
    closest<K_3 extends keyof SVGElementTagNameMap>(selector: K_3): SVGElementTagNameMap[K_3] | null;
    closest<E extends Element = Element>(selector: string): E | null;
    getAttribute(qualifiedName: string): string | null;
    getAttributeNS(namespace: string | null, localName: string): string | null;
    getAttributeNames(): string[];
    getAttributeNode(qualifiedName: string): Attr | null;
    getAttributeNodeNS(namespace: string | null, localName: string): Attr | null;
    getBoundingClientRect(): DOMRect;
    getClientRects(): DOMRectList;
    getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
    getElementsByTagName<K_4 extends keyof HTMLElementTagNameMap>(qualifiedName: K_4): HTMLCollectionOf<HTMLElementTagNameMap[K_4]>;
    getElementsByTagName<K_5 extends keyof SVGElementTagNameMap>(qualifiedName: K_5): HTMLCollectionOf<SVGElementTagNameMap[K_5]>;
    getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
    getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
    hasAttribute(qualifiedName: string): boolean;
    hasAttributeNS(namespace: string | null, localName: string): boolean;
    hasAttributes(): boolean;
    hasPointerCapture(pointerId: number): boolean;
    insertAdjacentHTML(where: InsertPosition, html: string): void;
    insertAdjacentText(where: InsertPosition, text: string): void;
    matches(selectors: string): boolean;
    msGetRegionContent(): any;
    releasePointerCapture(pointerId: number): void;
    removeAttributeNS(namespace: string | null, localName: string): void;
    removeAttributeNode(attr: Attr): Attr;
    requestFullscreen(options?: FullscreenOptions | undefined): Promise<void>;
    requestPointerLock(): void;
    scroll(options?: ScrollToOptions | undefined): void;
    scroll(x: number, y: number): void;
    scrollBy(options?: ScrollToOptions | undefined): void;
    scrollBy(x: number, y: number): void;
    scrollIntoView(arg?: boolean | ScrollIntoViewOptions | undefined): void;
    scrollTo(options?: ScrollToOptions | undefined): void;
    scrollTo(x: number, y: number): void;
    setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
    setAttributeNode(attr: Attr): Attr | null;
    setAttributeNodeNS(attr: Attr): Attr | null;
    setPointerCapture(pointerId: number): void;
    toggleAttribute(qualifiedName: string, force?: boolean | undefined): boolean;
    webkitMatchesSelector(selectors: string): boolean;
    readonly baseURI: string;
    readonly childNodes: NodeListOf<ChildNode>;
    readonly firstChild: ChildNode | null;
    readonly lastChild: ChildNode | null;
    readonly nextSibling: ChildNode | null;
    readonly nodeName: string;
    readonly nodeType: number;
    nodeValue: string | null;
    readonly parentElement: HTMLElement | null;
    readonly parentNode: (Node & ParentNode) | null;
    readonly previousSibling: ChildNode | null;
    textContent: string | null;
    cloneNode(deep?: boolean | undefined): Node;
    compareDocumentPosition(other: Node): number;
    contains(other: Node | null): boolean;
    getRootNode(options?: GetRootNodeOptions | undefined): Node;
    hasChildNodes(): boolean;
    isDefaultNamespace(namespace: string | null): boolean;
    isEqualNode(otherNode: Node | null): boolean;
    isSameNode(otherNode: Node | null): boolean;
    lookupNamespaceURI(prefix: string | null): string | null;
    lookupPrefix(namespace: string | null): string | null;
    normalize(): void;
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
    animate(keyframes: PropertyIndexedKeyframes | Keyframe[] | null, options?: number | KeyframeAnimationOptions | undefined): Animation;
    getAnimations(): Animation[];
    after(...nodes: (string | Node)[]): void;
    before(...nodes: (string | Node)[]): void;
    remove(): void;
    replaceWith(...nodes: (string | Node)[]): void;
    innerHTML: string;
    readonly nextElementSibling: Element | null;
    readonly previousElementSibling: Element | null;
    readonly childElementCount: number;
    readonly children: HTMLCollection;
    readonly firstElementChild: Element | null;
    readonly lastElementChild: Element | null;
    append(...nodes: (string | Node)[]): void;
    prepend(...nodes: (string | Node)[]): void;
    querySelector<K_6 extends keyof HTMLElementTagNameMap>(selectors: K_6): HTMLElementTagNameMap[K_6] | null;
    querySelector<K_7 extends keyof SVGElementTagNameMap>(selectors: K_7): SVGElementTagNameMap[K_7] | null;
    querySelector<E_1 extends Element = Element>(selectors: string): E_1 | null;
    querySelectorAll<K_8 extends keyof HTMLElementTagNameMap>(selectors: K_8): NodeListOf<HTMLElementTagNameMap[K_8]>;
    querySelectorAll<K_9 extends keyof SVGElementTagNameMap>(selectors: K_9): NodeListOf<SVGElementTagNameMap[K_9]>;
    querySelectorAll<E_2 extends Element = Element>(selectors: string): NodeListOf<E_2>;
    readonly assignedSlot: HTMLSlotElement | null;
    oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
    oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
    onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
    readonly style: CSSStyleDeclaration;
    contentEditable: string;
    enterKeyHint: string;
    inputMode: string;
    readonly isContentEditable: boolean;
    onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
    onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
    onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
    onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
    onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
    onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
    oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
    ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
    ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
    ondragexit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
    ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
    ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
    ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
    ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onerror: OnErrorEventHandler;
    onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
    ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
    onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
    onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
    onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
    onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
    onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any) | null;
    onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
    onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
    onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
    ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
    ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
    ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
    ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
    ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
    ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
    ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
    onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
    autofocus: boolean;
    readonly dataset: DOMStringMap;
    nonce?: string | undefined;
    tabIndex: number;
    blur(): void;
    focus(options?: FocusOptions | undefined): void;
} & HTMLElement;
/**
 * Check if a node is a constructed component.
 * @param node The node to check.
 */
export declare const isConstructed: (node: WithConstructedFlag<Node>) => boolean;
/**
 * Add the constructed flag to the node.
 * @param node The constructed node.
 */
export declare const flagConstructed: (node: WithConstructedFlag<HTMLElement>) => void;
/**
 * Check if a constructor is a component constructor.
 * @param constructor The constructor to check.
 */
export declare const isComponentConstructor: (constructor: Function) => constructor is ComponentConstructor<HTMLElement>;
/**
 * Create a base Component class which extends a native constructor.
 * @param ctor The base HTMLElement constructor to extend.
 * @return The extend class.
 */
declare const mixin: <T extends HTMLElement>(ctor: Constructor<T>) => {
    new (...args: any[]): {
        /**
         * The tag name used for Component definition.
         */
        readonly is: string;
        /**
         * A flag with the connected value of the node.
         */
        readonly isConnected: boolean;
        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: import("./types").IterableNodeList | undefined;
        /**
         * Initialize component properties.
         * @param properties A set of initial properties for the element.
         */
        initialize(properties?: {
            readonly is: string;
            readonly isConnected: boolean;
            readonly slotChildNodes: import("./types").IterableNodeList | undefined;
            initialize: (properties?: any | undefined) => void;
            connectedCallback: () => void;
            disconnectedCallback: () => void;
            attributeChangedCallback: (attributeName: string, oldValue: null | string, newValue: string | null) => void;
            stateChangedCallback: <P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]) => void;
            propertyChangedCallback: <P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]) => void;
            getInnerPropertyValue: <P_2 extends keyof any>(propertyName: P_2) => any[P_2];
            setInnerPropertyValue: <P_4 extends keyof any>(propertyName: P_4, value: any[P_4]) => void;
            observe: <P_5 extends keyof any>(propertyName: P_5, observer: PropertyObserver<any[P_5]>) => void;
            unobserve: <P_6 extends keyof any>(propertyName: P_6, observer: PropertyObserver<any[P_6]>) => void;
            dispatchEvent: {
                (event: Event): boolean;
                (event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
            };
            dispatchAsyncEvent: {
                (event: Event): Promise<any[]>;
                (event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
            };
            delegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined) => void;
            undelegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback) => void;
            render: () => Template | undefined;
            forceUpdate: () => void;
            appendChild: <T_1 extends Node>(newChild: T_1) => T_1;
            removeChild: <T_3 extends Node>(oldChild: T_3) => T_3;
            insertBefore: <T_5 extends Node>(newChild: T_5, refChild: Node | null) => T_5;
            replaceChild: <T_7 extends Node>(newChild: Node, oldChild: T_7) => T_7;
            insertAdjacentElement: (position: InsertPosition, insertedElement: Element) => Element | null;
            setAttribute: (qualifiedName: string, value: string) => void;
            removeAttribute: (qualifiedName: string) => void;
            accessKey: string;
            readonly accessKeyLabel: string;
            autocapitalize: string;
            dir: string;
            draggable: boolean;
            hidden: boolean;
            innerText: string;
            lang: string;
            readonly offsetHeight: number;
            readonly offsetLeft: number;
            readonly offsetParent: Element | null;
            readonly offsetTop: number;
            readonly offsetWidth: number;
            spellcheck: boolean;
            title: string;
            translate: boolean;
            click: () => void;
            addEventListener: {
                <K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
            };
            removeEventListener: {
                <K_1 extends keyof HTMLElementEventMap>(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any, options?: boolean | EventListenerOptions | undefined): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
            };
            readonly attributes: NamedNodeMap;
            readonly classList: DOMTokenList;
            className: string;
            readonly clientHeight: number;
            readonly clientLeft: number;
            readonly clientTop: number;
            readonly clientWidth: number;
            id: string;
            readonly localName: string;
            readonly namespaceURI: string | null;
            onfullscreenchange: ((this: Element, ev: Event) => any) | null;
            onfullscreenerror: ((this: Element, ev: Event) => any) | null;
            outerHTML: string;
            readonly ownerDocument: Document;
            readonly prefix: string | null;
            readonly scrollHeight: number;
            scrollLeft: number;
            scrollTop: number;
            readonly scrollWidth: number;
            readonly shadowRoot: ShadowRoot | null;
            slot: string;
            readonly tagName: string;
            attachShadow: (init: ShadowRootInit) => ShadowRoot;
            closest: {
                <K_2 extends keyof HTMLElementTagNameMap>(selector: K_2): HTMLElementTagNameMap[K_2] | null;
                <K_3 extends keyof SVGElementTagNameMap>(selector: K_3): SVGElementTagNameMap[K_3] | null;
                <E extends Element = Element>(selector: string): E | null;
            };
            getAttribute: (qualifiedName: string) => string | null;
            getAttributeNS: (namespace: string | null, localName: string) => string | null;
            getAttributeNames: () => string[];
            getAttributeNode: (qualifiedName: string) => Attr | null;
            getAttributeNodeNS: (namespace: string | null, localName: string) => Attr | null;
            getBoundingClientRect: () => DOMRect;
            getClientRects: () => DOMRectList;
            getElementsByClassName: (classNames: string) => HTMLCollectionOf<Element>;
            getElementsByTagName: {
                <K_4 extends keyof HTMLElementTagNameMap>(qualifiedName: K_4): HTMLCollectionOf<HTMLElementTagNameMap[K_4]>;
                <K_5 extends keyof SVGElementTagNameMap>(qualifiedName: K_5): HTMLCollectionOf<SVGElementTagNameMap[K_5]>;
                (qualifiedName: string): HTMLCollectionOf<Element>;
            };
            getElementsByTagNameNS: {
                (namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
                (namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
                (namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
            };
            hasAttribute: (qualifiedName: string) => boolean;
            hasAttributeNS: (namespace: string | null, localName: string) => boolean;
            hasAttributes: () => boolean;
            hasPointerCapture: (pointerId: number) => boolean;
            insertAdjacentHTML: (where: InsertPosition, html: string) => void;
            insertAdjacentText: (where: InsertPosition, text: string) => void;
            matches: (selectors: string) => boolean;
            msGetRegionContent: () => any;
            releasePointerCapture: (pointerId: number) => void;
            removeAttributeNS: (namespace: string | null, localName: string) => void;
            removeAttributeNode: (attr: Attr) => Attr;
            requestFullscreen: (options?: FullscreenOptions | undefined) => Promise<void>;
            requestPointerLock: () => void;
            scroll: {
                (options?: ScrollToOptions | undefined): void;
                (x: number, y: number): void;
            };
            scrollBy: {
                (options?: ScrollToOptions | undefined): void;
                (x: number, y: number): void;
            };
            scrollIntoView: (arg?: boolean | ScrollIntoViewOptions | undefined) => void;
            scrollTo: {
                (options?: ScrollToOptions | undefined): void;
                (x: number, y: number): void;
            };
            setAttributeNS: (namespace: string | null, qualifiedName: string, value: string) => void;
            setAttributeNode: (attr: Attr) => Attr | null;
            setAttributeNodeNS: (attr: Attr) => Attr | null;
            setPointerCapture: (pointerId: number) => void;
            toggleAttribute: (qualifiedName: string, force?: boolean | undefined) => boolean;
            webkitMatchesSelector: (selectors: string) => boolean;
            readonly baseURI: string;
            readonly childNodes: NodeListOf<ChildNode>;
            readonly firstChild: ChildNode | null;
            readonly lastChild: ChildNode | null;
            readonly nextSibling: ChildNode | null;
            readonly nodeName: string;
            readonly nodeType: number;
            nodeValue: string | null;
            readonly parentElement: HTMLElement | null;
            readonly parentNode: (Node & ParentNode) | null;
            readonly previousSibling: ChildNode | null;
            textContent: string | null;
            cloneNode: (deep?: boolean | undefined) => Node;
            compareDocumentPosition: (other: Node) => number;
            contains: (other: Node | null) => boolean;
            getRootNode: (options?: GetRootNodeOptions | undefined) => Node;
            hasChildNodes: () => boolean;
            isDefaultNamespace: (namespace: string | null) => boolean;
            isEqualNode: (otherNode: Node | null) => boolean;
            isSameNode: (otherNode: Node | null) => boolean;
            lookupNamespaceURI: (prefix: string | null) => string | null;
            lookupPrefix: (namespace: string | null) => string | null;
            normalize: () => void;
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
            animate: (keyframes: PropertyIndexedKeyframes | Keyframe[] | null, options?: number | KeyframeAnimationOptions | undefined) => Animation;
            getAnimations: () => Animation[];
            after: (...nodes: (string | Node)[]) => void;
            before: (...nodes: (string | Node)[]) => void;
            remove: () => void;
            replaceWith: (...nodes: (string | Node)[]) => void;
            innerHTML: string;
            readonly nextElementSibling: Element | null;
            readonly previousElementSibling: Element | null;
            readonly childElementCount: number;
            readonly children: HTMLCollection;
            readonly firstElementChild: Element | null;
            readonly lastElementChild: Element | null;
            append: (...nodes: (string | Node)[]) => void;
            prepend: (...nodes: (string | Node)[]) => void;
            querySelector: {
                <K_6 extends keyof HTMLElementTagNameMap>(selectors: K_6): HTMLElementTagNameMap[K_6] | null;
                <K_7 extends keyof SVGElementTagNameMap>(selectors: K_7): SVGElementTagNameMap[K_7] | null;
                <E_1 extends Element = Element>(selectors: string): E_1 | null;
            };
            querySelectorAll: {
                <K_8 extends keyof HTMLElementTagNameMap>(selectors: K_8): NodeListOf<HTMLElementTagNameMap[K_8]>;
                <K_9 extends keyof SVGElementTagNameMap>(selectors: K_9): NodeListOf<SVGElementTagNameMap[K_9]>;
                <E_2 extends Element = Element>(selectors: string): NodeListOf<E_2>;
            };
            readonly assignedSlot: HTMLSlotElement | null;
            oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
            oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
            onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
            readonly style: CSSStyleDeclaration;
            contentEditable: string;
            enterKeyHint: string;
            inputMode: string;
            readonly isContentEditable: boolean;
            onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
            onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
            oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragexit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onerror: OnErrorEventHandler;
            onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
            ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
            onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
            onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
            onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any) | null;
            onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
            onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
            onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
            autofocus: boolean;
            readonly dataset: DOMStringMap;
            nonce?: string | undefined;
            tabIndex: number;
            blur: () => void;
            focus: (options?: FocusOptions | undefined) => void;
        } | undefined): void;
        /**
         * Invoked each time the Component is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;
        /**
         * Invoked each time the Component is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;
        /**
         * Invoked each time one of the Component's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         */
        attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: string | null): void;
        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]): void;
        /**
         * Invoked each time one of a Component's property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        propertyChangedCallback<P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]): void;
        /**
         * Get the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @return The inner value of the property.
         */
        getInnerPropertyValue<P_2 extends keyof any>(propertyName: P_2): any[P_2];
        /**
         * Set the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @param value The inner value to set.
         */
        setInnerPropertyValue<P_4 extends keyof any>(propertyName: P_4, value: any[P_4]): void;
        /**
         * Observe a Component Property.
         *
         * @param propertyName The name of the Property to observe
         * @param observer The callback function
         */
        observe<P_5 extends keyof any>(propertyName: P_5, observer: PropertyObserver<any[P_5]>): void;
        /**
         * Unobserve a Component Property.
         *
         * @param propertyName The name of the Property to unobserve
         * @param observer The callback function to remove
         */
        unobserve<P_6 extends keyof any>(propertyName: P_6, observer: PropertyObserver<any[P_6]>): void;
        /**
         * Dispatch a custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchEvent(event: Event): boolean;
        /**
         * Dispatch a custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
        /**
         * Dispatch an async custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchAsyncEvent(event: Event): Promise<any[]>;
        /**
         * Dispatch an async custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchAsyncEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
        /**
         * Delegate an Event listener.
         *
         * @param eventName The event name to listen
         * @param selector The selector to delegate
         * @param callback The callback to trigger when an Event matches the delegation
         */
        delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined): void;
        /**
         * Remove an Event delegation.
         *
         * @param eventName The Event name to undelegate
         * @param selector The selector to undelegate
         * @param callback The callback to remove
         */
        undelegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback): void;
        /**
         * Render method of the Component.
         *
         * @return The instances of the rendered Components and/or Nodes
         */
        render(): Template | undefined;
        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;
        /**
         * Append a child to the Component.
         *
         * @param newChild The child to add.
         */
        appendChild<T_1 extends Node>(newChild: T_1): T_1;
        /**
         * Remove a child from the Component.
         *
         * @param {Node} oldChild The child to remove.
         */
        removeChild<T_3 extends Node>(oldChild: T_3): T_3;
        /**
         * Insert a child before another in the Component.
         *
         * @param newChild The child to insert.
         * @param refChild The referred Node.
         */
        insertBefore<T_5 extends Node>(newChild: T_5, refChild: Node | null): T_5;
        /**
         * Replace a child with another in the Component.
         *
         * @param newChild The child to insert.
         * @param oldChild The Node to replace.
         */
        replaceChild<T_7 extends Node>(newChild: Node, oldChild: T_7): T_7;
        /**
         * Insert a child at the given position.
         *
         * @param postion The position of the insertion.
         * @param insertedElement The child to insert.
         * @param slot Should insert a slot node.
         */
        insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null;
        /**
         * Set a Component attribute.
         *
         * @param ualifiedName The attribute name.
         * @param value The value to set.
         */
        setAttribute(qualifiedName: string, value: string): void;
        /**
         * Remove a Component attribute.
         *
         * @param qualifiedName The attribute name.
         */
        removeAttribute(qualifiedName: string): void;
        accessKey: string;
        readonly accessKeyLabel: string;
        autocapitalize: string;
        dir: string;
        draggable: boolean;
        hidden: boolean;
        innerText: string;
        lang: string;
        readonly offsetHeight: number;
        readonly offsetLeft: number;
        readonly offsetParent: Element | null;
        readonly offsetTop: number;
        readonly offsetWidth: number;
        spellcheck: boolean;
        title: string;
        translate: boolean;
        click(): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
        removeEventListener<K_1 extends keyof HTMLElementEventMap>(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any, options?: boolean | EventListenerOptions | undefined): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
        readonly attributes: NamedNodeMap;
        readonly classList: DOMTokenList;
        className: string;
        readonly clientHeight: number;
        readonly clientLeft: number;
        readonly clientTop: number;
        readonly clientWidth: number;
        id: string;
        readonly localName: string;
        readonly namespaceURI: string | null;
        onfullscreenchange: ((this: Element, ev: Event) => any) | null;
        onfullscreenerror: ((this: Element, ev: Event) => any) | null;
        outerHTML: string;
        readonly ownerDocument: Document;
        readonly prefix: string | null;
        readonly scrollHeight: number;
        scrollLeft: number;
        scrollTop: number;
        readonly scrollWidth: number;
        readonly shadowRoot: ShadowRoot | null;
        slot: string;
        readonly tagName: string;
        attachShadow(init: ShadowRootInit): ShadowRoot;
        closest<K_2 extends keyof HTMLElementTagNameMap>(selector: K_2): HTMLElementTagNameMap[K_2] | null;
        closest<K_3 extends keyof SVGElementTagNameMap>(selector: K_3): SVGElementTagNameMap[K_3] | null;
        closest<E extends Element = Element>(selector: string): E | null;
        getAttribute(qualifiedName: string): string | null;
        getAttributeNS(namespace: string | null, localName: string): string | null;
        getAttributeNames(): string[];
        getAttributeNode(qualifiedName: string): Attr | null;
        getAttributeNodeNS(namespace: string | null, localName: string): Attr | null;
        getBoundingClientRect(): DOMRect;
        getClientRects(): DOMRectList;
        getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
        getElementsByTagName<K_4 extends keyof HTMLElementTagNameMap>(qualifiedName: K_4): HTMLCollectionOf<HTMLElementTagNameMap[K_4]>;
        getElementsByTagName<K_5 extends keyof SVGElementTagNameMap>(qualifiedName: K_5): HTMLCollectionOf<SVGElementTagNameMap[K_5]>;
        getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
        getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
        hasAttribute(qualifiedName: string): boolean;
        hasAttributeNS(namespace: string | null, localName: string): boolean;
        hasAttributes(): boolean;
        hasPointerCapture(pointerId: number): boolean;
        insertAdjacentHTML(where: InsertPosition, html: string): void;
        insertAdjacentText(where: InsertPosition, text: string): void;
        matches(selectors: string): boolean;
        msGetRegionContent(): any;
        releasePointerCapture(pointerId: number): void;
        removeAttributeNS(namespace: string | null, localName: string): void;
        removeAttributeNode(attr: Attr): Attr;
        requestFullscreen(options?: FullscreenOptions | undefined): Promise<void>;
        requestPointerLock(): void;
        scroll(options?: ScrollToOptions | undefined): void;
        scroll(x: number, y: number): void;
        scrollBy(options?: ScrollToOptions | undefined): void;
        scrollBy(x: number, y: number): void;
        scrollIntoView(arg?: boolean | ScrollIntoViewOptions | undefined): void;
        scrollTo(options?: ScrollToOptions | undefined): void;
        scrollTo(x: number, y: number): void;
        setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
        setAttributeNode(attr: Attr): Attr | null;
        setAttributeNodeNS(attr: Attr): Attr | null;
        setPointerCapture(pointerId: number): void;
        toggleAttribute(qualifiedName: string, force?: boolean | undefined): boolean;
        webkitMatchesSelector(selectors: string): boolean;
        readonly baseURI: string;
        readonly childNodes: NodeListOf<ChildNode>;
        readonly firstChild: ChildNode | null;
        readonly lastChild: ChildNode | null;
        readonly nextSibling: ChildNode | null;
        readonly nodeName: string;
        readonly nodeType: number;
        nodeValue: string | null;
        readonly parentElement: HTMLElement | null;
        readonly parentNode: (Node & ParentNode) | null;
        readonly previousSibling: ChildNode | null;
        textContent: string | null;
        cloneNode(deep?: boolean | undefined): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node | null): boolean;
        getRootNode(options?: GetRootNodeOptions | undefined): Node;
        hasChildNodes(): boolean;
        isDefaultNamespace(namespace: string | null): boolean;
        isEqualNode(otherNode: Node | null): boolean;
        isSameNode(otherNode: Node | null): boolean;
        lookupNamespaceURI(prefix: string | null): string | null;
        lookupPrefix(namespace: string | null): string | null;
        normalize(): void;
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
        animate(keyframes: PropertyIndexedKeyframes | Keyframe[] | null, options?: number | KeyframeAnimationOptions | undefined): Animation;
        getAnimations(): Animation[];
        after(...nodes: (string | Node)[]): void;
        before(...nodes: (string | Node)[]): void;
        remove(): void;
        replaceWith(...nodes: (string | Node)[]): void;
        innerHTML: string;
        readonly nextElementSibling: Element | null;
        readonly previousElementSibling: Element | null;
        readonly childElementCount: number;
        readonly children: HTMLCollection;
        readonly firstElementChild: Element | null;
        readonly lastElementChild: Element | null;
        append(...nodes: (string | Node)[]): void;
        prepend(...nodes: (string | Node)[]): void;
        querySelector<K_6 extends keyof HTMLElementTagNameMap>(selectors: K_6): HTMLElementTagNameMap[K_6] | null;
        querySelector<K_7 extends keyof SVGElementTagNameMap>(selectors: K_7): SVGElementTagNameMap[K_7] | null;
        querySelector<E_1 extends Element = Element>(selectors: string): E_1 | null;
        querySelectorAll<K_8 extends keyof HTMLElementTagNameMap>(selectors: K_8): NodeListOf<HTMLElementTagNameMap[K_8]>;
        querySelectorAll<K_9 extends keyof SVGElementTagNameMap>(selectors: K_9): NodeListOf<SVGElementTagNameMap[K_9]>;
        querySelectorAll<E_2 extends Element = Element>(selectors: string): NodeListOf<E_2>;
        readonly assignedSlot: HTMLSlotElement | null;
        oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        readonly style: CSSStyleDeclaration;
        contentEditable: string;
        enterKeyHint: string;
        inputMode: string;
        readonly isContentEditable: boolean;
        onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragexit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onerror: OnErrorEventHandler;
        onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any) | null;
        onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
        onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
        autofocus: boolean;
        readonly dataset: DOMStringMap;
        nonce?: string | undefined;
        tabIndex: number;
        blur(): void;
        focus(options?: FocusOptions | undefined): void;
    };
    /**
     * An array containing the names of the attributes to observe.
     */
    readonly observedAttributes: string[];
    /**
     * Define component properties.
     */
    readonly properties?: {
        [key: string]: PropertyConfig<Constructor<unknown>>;
    } | undefined;
    /**
     * Define component listeners.
     */
    readonly listeners?: {
        [key: string]: ListenerConfig;
    } | undefined;
    /**
     * Identify shimmed constructors.
     * Constructor will skip native constructing when true.
     */
    shim?: boolean | undefined;
    /**
     * Upgrade a plain element prototype.
     * @param node The node to upgrade.
     * @return The new prototyped node.
     */
    upgrade<T_9 extends HTMLElement>(node: T_9): {
        /**
         * The tag name used for Component definition.
         */
        readonly is: string;
        /**
         * A flag with the connected value of the node.
         */
        readonly isConnected: boolean;
        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: import("./types").IterableNodeList | undefined;
        /**
         * Initialize component properties.
         * @param properties A set of initial properties for the element.
         */
        initialize(properties?: {
            readonly is: string;
            readonly isConnected: boolean;
            readonly slotChildNodes: import("./types").IterableNodeList | undefined;
            initialize: (properties?: any | undefined) => void;
            connectedCallback: () => void;
            disconnectedCallback: () => void;
            attributeChangedCallback: (attributeName: string, oldValue: null | string, newValue: string | null) => void;
            stateChangedCallback: <P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]) => void;
            propertyChangedCallback: <P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]) => void;
            getInnerPropertyValue: <P_2 extends keyof any>(propertyName: P_2) => any[P_2];
            setInnerPropertyValue: <P_4 extends keyof any>(propertyName: P_4, value: any[P_4]) => void;
            observe: <P_5 extends keyof any>(propertyName: P_5, observer: PropertyObserver<any[P_5]>) => void;
            unobserve: <P_6 extends keyof any>(propertyName: P_6, observer: PropertyObserver<any[P_6]>) => void;
            dispatchEvent: {
                (event: Event): boolean;
                (event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
            };
            dispatchAsyncEvent: {
                (event: Event): Promise<any[]>;
                (event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
            };
            delegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined) => void;
            undelegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback) => void;
            render: () => Template | undefined;
            forceUpdate: () => void;
            appendChild: <T_1 extends Node>(newChild: T_1) => T_1;
            removeChild: <T_3 extends Node>(oldChild: T_3) => T_3;
            insertBefore: <T_5 extends Node>(newChild: T_5, refChild: Node | null) => T_5;
            replaceChild: <T_7 extends Node>(newChild: Node, oldChild: T_7) => T_7;
            insertAdjacentElement: (position: InsertPosition, insertedElement: Element) => Element | null;
            setAttribute: (qualifiedName: string, value: string) => void;
            removeAttribute: (qualifiedName: string) => void;
            accessKey: string;
            readonly accessKeyLabel: string;
            autocapitalize: string;
            dir: string;
            draggable: boolean;
            hidden: boolean;
            innerText: string;
            lang: string;
            readonly offsetHeight: number;
            readonly offsetLeft: number;
            readonly offsetParent: Element | null;
            readonly offsetTop: number;
            readonly offsetWidth: number;
            spellcheck: boolean;
            title: string;
            translate: boolean;
            click: () => void;
            addEventListener: {
                <K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
            };
            removeEventListener: {
                <K_1 extends keyof HTMLElementEventMap>(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any, options?: boolean | EventListenerOptions | undefined): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
            };
            readonly attributes: NamedNodeMap;
            readonly classList: DOMTokenList;
            className: string;
            readonly clientHeight: number;
            readonly clientLeft: number;
            readonly clientTop: number;
            readonly clientWidth: number;
            id: string;
            readonly localName: string;
            readonly namespaceURI: string | null;
            onfullscreenchange: ((this: Element, ev: Event) => any) | null;
            onfullscreenerror: ((this: Element, ev: Event) => any) | null;
            outerHTML: string;
            readonly ownerDocument: Document;
            readonly prefix: string | null;
            readonly scrollHeight: number;
            scrollLeft: number;
            scrollTop: number;
            readonly scrollWidth: number;
            readonly shadowRoot: ShadowRoot | null;
            slot: string;
            readonly tagName: string;
            attachShadow: (init: ShadowRootInit) => ShadowRoot;
            closest: {
                <K_2 extends keyof HTMLElementTagNameMap>(selector: K_2): HTMLElementTagNameMap[K_2] | null;
                <K_3 extends keyof SVGElementTagNameMap>(selector: K_3): SVGElementTagNameMap[K_3] | null;
                <E extends Element = Element>(selector: string): E | null;
            };
            getAttribute: (qualifiedName: string) => string | null;
            getAttributeNS: (namespace: string | null, localName: string) => string | null;
            getAttributeNames: () => string[];
            getAttributeNode: (qualifiedName: string) => Attr | null;
            getAttributeNodeNS: (namespace: string | null, localName: string) => Attr | null;
            getBoundingClientRect: () => DOMRect;
            getClientRects: () => DOMRectList;
            getElementsByClassName: (classNames: string) => HTMLCollectionOf<Element>;
            getElementsByTagName: {
                <K_4 extends keyof HTMLElementTagNameMap>(qualifiedName: K_4): HTMLCollectionOf<HTMLElementTagNameMap[K_4]>;
                <K_5 extends keyof SVGElementTagNameMap>(qualifiedName: K_5): HTMLCollectionOf<SVGElementTagNameMap[K_5]>;
                (qualifiedName: string): HTMLCollectionOf<Element>;
            };
            getElementsByTagNameNS: {
                (namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
                (namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
                (namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
            };
            hasAttribute: (qualifiedName: string) => boolean;
            hasAttributeNS: (namespace: string | null, localName: string) => boolean;
            hasAttributes: () => boolean;
            hasPointerCapture: (pointerId: number) => boolean;
            insertAdjacentHTML: (where: InsertPosition, html: string) => void;
            insertAdjacentText: (where: InsertPosition, text: string) => void;
            matches: (selectors: string) => boolean;
            msGetRegionContent: () => any;
            releasePointerCapture: (pointerId: number) => void;
            removeAttributeNS: (namespace: string | null, localName: string) => void;
            removeAttributeNode: (attr: Attr) => Attr;
            requestFullscreen: (options?: FullscreenOptions | undefined) => Promise<void>;
            requestPointerLock: () => void;
            scroll: {
                (options?: ScrollToOptions | undefined): void;
                (x: number, y: number): void;
            };
            scrollBy: {
                (options?: ScrollToOptions | undefined): void;
                (x: number, y: number): void;
            };
            scrollIntoView: (arg?: boolean | ScrollIntoViewOptions | undefined) => void;
            scrollTo: {
                (options?: ScrollToOptions | undefined): void;
                (x: number, y: number): void;
            };
            setAttributeNS: (namespace: string | null, qualifiedName: string, value: string) => void;
            setAttributeNode: (attr: Attr) => Attr | null;
            setAttributeNodeNS: (attr: Attr) => Attr | null;
            setPointerCapture: (pointerId: number) => void;
            toggleAttribute: (qualifiedName: string, force?: boolean | undefined) => boolean;
            webkitMatchesSelector: (selectors: string) => boolean;
            readonly baseURI: string;
            readonly childNodes: NodeListOf<ChildNode>;
            readonly firstChild: ChildNode | null;
            readonly lastChild: ChildNode | null;
            readonly nextSibling: ChildNode | null;
            readonly nodeName: string;
            readonly nodeType: number;
            nodeValue: string | null;
            readonly parentElement: HTMLElement | null;
            readonly parentNode: (Node & ParentNode) | null;
            readonly previousSibling: ChildNode | null;
            textContent: string | null;
            cloneNode: (deep?: boolean | undefined) => Node;
            compareDocumentPosition: (other: Node) => number;
            contains: (other: Node | null) => boolean;
            getRootNode: (options?: GetRootNodeOptions | undefined) => Node;
            hasChildNodes: () => boolean;
            isDefaultNamespace: (namespace: string | null) => boolean;
            isEqualNode: (otherNode: Node | null) => boolean;
            isSameNode: (otherNode: Node | null) => boolean;
            lookupNamespaceURI: (prefix: string | null) => string | null;
            lookupPrefix: (namespace: string | null) => string | null;
            normalize: () => void;
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
            animate: (keyframes: PropertyIndexedKeyframes | Keyframe[] | null, options?: number | KeyframeAnimationOptions | undefined) => Animation;
            getAnimations: () => Animation[];
            after: (...nodes: (string | Node)[]) => void;
            before: (...nodes: (string | Node)[]) => void;
            remove: () => void;
            replaceWith: (...nodes: (string | Node)[]) => void;
            innerHTML: string;
            readonly nextElementSibling: Element | null;
            readonly previousElementSibling: Element | null;
            readonly childElementCount: number;
            readonly children: HTMLCollection;
            readonly firstElementChild: Element | null;
            readonly lastElementChild: Element | null;
            append: (...nodes: (string | Node)[]) => void;
            prepend: (...nodes: (string | Node)[]) => void;
            querySelector: {
                <K_6 extends keyof HTMLElementTagNameMap>(selectors: K_6): HTMLElementTagNameMap[K_6] | null;
                <K_7 extends keyof SVGElementTagNameMap>(selectors: K_7): SVGElementTagNameMap[K_7] | null;
                <E_1 extends Element = Element>(selectors: string): E_1 | null;
            };
            querySelectorAll: {
                <K_8 extends keyof HTMLElementTagNameMap>(selectors: K_8): NodeListOf<HTMLElementTagNameMap[K_8]>;
                <K_9 extends keyof SVGElementTagNameMap>(selectors: K_9): NodeListOf<SVGElementTagNameMap[K_9]>;
                <E_2 extends Element = Element>(selectors: string): NodeListOf<E_2>;
            };
            readonly assignedSlot: HTMLSlotElement | null;
            oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
            oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
            onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
            readonly style: CSSStyleDeclaration;
            contentEditable: string;
            enterKeyHint: string;
            inputMode: string;
            readonly isContentEditable: boolean;
            onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
            onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
            onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
            oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragexit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
            ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onerror: OnErrorEventHandler;
            onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
            ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
            onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
            onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
            onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
            onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
            onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any) | null;
            onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
            onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
            onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
            ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
            onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
            onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
            autofocus: boolean;
            readonly dataset: DOMStringMap;
            nonce?: string | undefined;
            tabIndex: number;
            blur: () => void;
            focus: (options?: FocusOptions | undefined) => void;
        } | undefined): void;
        /**
         * Invoked each time the Component is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;
        /**
         * Invoked each time the Component is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;
        /**
         * Invoked each time one of the Component's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         */
        attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: string | null): void;
        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]): void;
        /**
         * Invoked each time one of a Component's property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        propertyChangedCallback<P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]): void;
        /**
         * Get the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @return The inner value of the property.
         */
        getInnerPropertyValue<P_2 extends keyof any>(propertyName: P_2): any[P_2];
        /**
         * Set the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @param value The inner value to set.
         */
        setInnerPropertyValue<P_4 extends keyof any>(propertyName: P_4, value: any[P_4]): void;
        /**
         * Observe a Component Property.
         *
         * @param propertyName The name of the Property to observe
         * @param observer The callback function
         */
        observe<P_5 extends keyof any>(propertyName: P_5, observer: PropertyObserver<any[P_5]>): void;
        /**
         * Unobserve a Component Property.
         *
         * @param propertyName The name of the Property to unobserve
         * @param observer The callback function to remove
         */
        unobserve<P_6 extends keyof any>(propertyName: P_6, observer: PropertyObserver<any[P_6]>): void;
        /**
         * Dispatch a custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchEvent(event: Event): boolean;
        /**
         * Dispatch a custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
        /**
         * Dispatch an async custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchAsyncEvent(event: Event): Promise<any[]>;
        /**
         * Dispatch an async custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchAsyncEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
        /**
         * Delegate an Event listener.
         *
         * @param eventName The event name to listen
         * @param selector The selector to delegate
         * @param callback The callback to trigger when an Event matches the delegation
         */
        delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined): void;
        /**
         * Remove an Event delegation.
         *
         * @param eventName The Event name to undelegate
         * @param selector The selector to undelegate
         * @param callback The callback to remove
         */
        undelegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback): void;
        /**
         * Render method of the Component.
         *
         * @return The instances of the rendered Components and/or Nodes
         */
        render(): Template | undefined;
        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;
        /**
         * Append a child to the Component.
         *
         * @param newChild The child to add.
         */
        appendChild<T_1 extends Node>(newChild: T_1): T_1;
        /**
         * Remove a child from the Component.
         *
         * @param {Node} oldChild The child to remove.
         */
        removeChild<T_3 extends Node>(oldChild: T_3): T_3;
        /**
         * Insert a child before another in the Component.
         *
         * @param newChild The child to insert.
         * @param refChild The referred Node.
         */
        insertBefore<T_5 extends Node>(newChild: T_5, refChild: Node | null): T_5;
        /**
         * Replace a child with another in the Component.
         *
         * @param newChild The child to insert.
         * @param oldChild The Node to replace.
         */
        replaceChild<T_7 extends Node>(newChild: Node, oldChild: T_7): T_7;
        /**
         * Insert a child at the given position.
         *
         * @param postion The position of the insertion.
         * @param insertedElement The child to insert.
         * @param slot Should insert a slot node.
         */
        insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null;
        /**
         * Set a Component attribute.
         *
         * @param ualifiedName The attribute name.
         * @param value The value to set.
         */
        setAttribute(qualifiedName: string, value: string): void;
        /**
         * Remove a Component attribute.
         *
         * @param qualifiedName The attribute name.
         */
        removeAttribute(qualifiedName: string): void;
        accessKey: string;
        readonly accessKeyLabel: string;
        autocapitalize: string;
        dir: string;
        draggable: boolean;
        hidden: boolean;
        innerText: string;
        lang: string;
        readonly offsetHeight: number;
        readonly offsetLeft: number;
        readonly offsetParent: Element | null;
        readonly offsetTop: number;
        readonly offsetWidth: number;
        spellcheck: boolean;
        title: string;
        translate: boolean;
        click(): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
        removeEventListener<K_1 extends keyof HTMLElementEventMap>(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any, options?: boolean | EventListenerOptions | undefined): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
        readonly attributes: NamedNodeMap;
        readonly classList: DOMTokenList;
        className: string;
        readonly clientHeight: number;
        readonly clientLeft: number;
        readonly clientTop: number;
        readonly clientWidth: number;
        id: string;
        readonly localName: string;
        readonly namespaceURI: string | null;
        onfullscreenchange: ((this: Element, ev: Event) => any) | null;
        onfullscreenerror: ((this: Element, ev: Event) => any) | null;
        outerHTML: string;
        readonly ownerDocument: Document;
        readonly prefix: string | null;
        readonly scrollHeight: number;
        scrollLeft: number;
        scrollTop: number;
        readonly scrollWidth: number;
        readonly shadowRoot: ShadowRoot | null;
        slot: string;
        readonly tagName: string;
        attachShadow(init: ShadowRootInit): ShadowRoot;
        closest<K_2 extends keyof HTMLElementTagNameMap>(selector: K_2): HTMLElementTagNameMap[K_2] | null;
        closest<K_3 extends keyof SVGElementTagNameMap>(selector: K_3): SVGElementTagNameMap[K_3] | null;
        closest<E extends Element = Element>(selector: string): E | null;
        getAttribute(qualifiedName: string): string | null;
        getAttributeNS(namespace: string | null, localName: string): string | null;
        getAttributeNames(): string[];
        getAttributeNode(qualifiedName: string): Attr | null;
        getAttributeNodeNS(namespace: string | null, localName: string): Attr | null;
        getBoundingClientRect(): DOMRect;
        getClientRects(): DOMRectList;
        getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
        getElementsByTagName<K_4 extends keyof HTMLElementTagNameMap>(qualifiedName: K_4): HTMLCollectionOf<HTMLElementTagNameMap[K_4]>;
        getElementsByTagName<K_5 extends keyof SVGElementTagNameMap>(qualifiedName: K_5): HTMLCollectionOf<SVGElementTagNameMap[K_5]>;
        getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
        getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
        hasAttribute(qualifiedName: string): boolean;
        hasAttributeNS(namespace: string | null, localName: string): boolean;
        hasAttributes(): boolean;
        hasPointerCapture(pointerId: number): boolean;
        insertAdjacentHTML(where: InsertPosition, html: string): void;
        insertAdjacentText(where: InsertPosition, text: string): void;
        matches(selectors: string): boolean;
        msGetRegionContent(): any;
        releasePointerCapture(pointerId: number): void;
        removeAttributeNS(namespace: string | null, localName: string): void;
        removeAttributeNode(attr: Attr): Attr;
        requestFullscreen(options?: FullscreenOptions | undefined): Promise<void>;
        requestPointerLock(): void;
        scroll(options?: ScrollToOptions | undefined): void;
        scroll(x: number, y: number): void;
        scrollBy(options?: ScrollToOptions | undefined): void;
        scrollBy(x: number, y: number): void;
        scrollIntoView(arg?: boolean | ScrollIntoViewOptions | undefined): void;
        scrollTo(options?: ScrollToOptions | undefined): void;
        scrollTo(x: number, y: number): void;
        setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
        setAttributeNode(attr: Attr): Attr | null;
        setAttributeNodeNS(attr: Attr): Attr | null;
        setPointerCapture(pointerId: number): void;
        toggleAttribute(qualifiedName: string, force?: boolean | undefined): boolean;
        webkitMatchesSelector(selectors: string): boolean;
        readonly baseURI: string;
        readonly childNodes: NodeListOf<ChildNode>;
        readonly firstChild: ChildNode | null;
        readonly lastChild: ChildNode | null;
        readonly nextSibling: ChildNode | null;
        readonly nodeName: string;
        readonly nodeType: number;
        nodeValue: string | null;
        readonly parentElement: HTMLElement | null;
        readonly parentNode: (Node & ParentNode) | null;
        readonly previousSibling: ChildNode | null;
        textContent: string | null;
        cloneNode(deep?: boolean | undefined): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node | null): boolean;
        getRootNode(options?: GetRootNodeOptions | undefined): Node;
        hasChildNodes(): boolean;
        isDefaultNamespace(namespace: string | null): boolean;
        isEqualNode(otherNode: Node | null): boolean;
        isSameNode(otherNode: Node | null): boolean;
        lookupNamespaceURI(prefix: string | null): string | null;
        lookupPrefix(namespace: string | null): string | null;
        normalize(): void;
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
        animate(keyframes: PropertyIndexedKeyframes | Keyframe[] | null, options?: number | KeyframeAnimationOptions | undefined): Animation;
        getAnimations(): Animation[];
        after(...nodes: (string | Node)[]): void;
        before(...nodes: (string | Node)[]): void;
        remove(): void;
        replaceWith(...nodes: (string | Node)[]): void;
        innerHTML: string;
        readonly nextElementSibling: Element | null;
        readonly previousElementSibling: Element | null;
        readonly childElementCount: number;
        readonly children: HTMLCollection;
        readonly firstElementChild: Element | null;
        readonly lastElementChild: Element | null;
        append(...nodes: (string | Node)[]): void;
        prepend(...nodes: (string | Node)[]): void;
        querySelector<K_6 extends keyof HTMLElementTagNameMap>(selectors: K_6): HTMLElementTagNameMap[K_6] | null;
        querySelector<K_7 extends keyof SVGElementTagNameMap>(selectors: K_7): SVGElementTagNameMap[K_7] | null;
        querySelector<E_1 extends Element = Element>(selectors: string): E_1 | null;
        querySelectorAll<K_8 extends keyof HTMLElementTagNameMap>(selectors: K_8): NodeListOf<HTMLElementTagNameMap[K_8]>;
        querySelectorAll<K_9 extends keyof SVGElementTagNameMap>(selectors: K_9): NodeListOf<SVGElementTagNameMap[K_9]>;
        querySelectorAll<E_2 extends Element = Element>(selectors: string): NodeListOf<E_2>;
        readonly assignedSlot: HTMLSlotElement | null;
        oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
        readonly style: CSSStyleDeclaration;
        contentEditable: string;
        enterKeyHint: string;
        inputMode: string;
        readonly isContentEditable: boolean;
        onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragexit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onerror: OnErrorEventHandler;
        onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any) | null;
        onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
        onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
        autofocus: boolean;
        readonly dataset: DOMStringMap;
        nonce?: string | undefined;
        tabIndex: number;
        blur(): void;
        focus(options?: FocusOptions | undefined): void;
    };
};
/**
 * The basic DNA Component constructor.
 */
export declare type ComponentConstructor<T extends HTMLElement> = ReturnType<typeof mixin> & Constructor<T>;
/**
 * The basic DNA Component interface.
 * It's a Custom Element, but with some extra useful method.
 * @see [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.
 */
export declare type ComponentInstance<T extends HTMLElement> = InstanceType<ComponentConstructor<T>>;
/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param base The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export declare const shim: <T extends {
    new (): HTMLElement;
    prototype: HTMLElement;
}>(base: T) => T;
/**
 * Get a native HTMLElement constructor to extend by its name.
 * @param name The name of the constructor (eg. "HTMLAnchorElement").
 * @return A proxy that extends the native constructor.
 */
export declare const extend: <T extends HTMLElement>(constructor: Constructor<T>) => ComponentConstructor<T>;
/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete life cycle implementation.
 * All DNA components **must** extends this class.
 */
export declare const Component: ComponentConstructor<HTMLElement>;
/**
 * Decorate and define component classes.
 * @param name The name of the custom element.
 * @param options The custom element options.
 * @return The decorated component class.
 */
export declare const customElement: (name: string, options?: ElementDefinitionOptions | undefined) => (classOrDescriptor: ComponentConstructor<HTMLElement> | ClassDescriptor) => any;
export {};
