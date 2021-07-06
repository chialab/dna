import type { MethodsOf } from './types';
import type { ComponentInstance } from './Component';
import { HTMLElement } from './helpers';
/**
 * Async event interface.
 */
export declare type AsyncEvent = Event & {
    respondWith(callback: () => Promise<unknown>): void;
};
/**
 * Describe the signature of a delegated event callback.
 * @param event The original DOM event.
 * @param target The matched delegated element.
 */
export declare type DelegatedEventCallback = (event: Event, target?: Node) => unknown;
/**
 * A descriptor for an event delegation.
 */
export declare type DelegatedEventDescriptor = AddEventListenerOptions & {
    target?: EventTarget;
    callback: DelegatedEventCallback;
};
/**
 * Property configuration for properties accessor.
 */
export declare type ListenerConfig = DelegatedEventCallback | DelegatedEventDescriptor;
/**
 * Delegate an Event listener.
 *
 * @param element The root element for the delegation
 * @param eventName The event name to listen
 * @param selector The selector to delegate
 * @param callback The callback to trigger when an Event matches the delegation
 * @param options An options object that specifies characteristics about the event listener. @see [MDN]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
 */
export declare const delegateEventListener: (element: Element, eventName: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined) => void;
/**
 * Remove an Event delegation.
 *
 * @param element The root element of the delegation
 * @param eventName The Event name to undelegate
 * @param selector The selector to undelegate
 * @param callback The callback to remove
 */
export declare const undelegateEventListener: (element: Element, eventName: string, selector: string | null, callback: DelegatedEventCallback) => void;
/**
 * Dispatch a custom Event.
 *
 * @param element The dispatcher node.
 * @param event The event to dispatch or the name of the synthetic event to create.
 * @param detail Detail object of the event.
 * @param bubbles Should the event bubble.
 * @param cancelable Should the event be cancelable.
 * @param composed Is the event composed.
 */
export declare const dispatchEvent: (element: Element, event: Event | string, detail?: CustomEventInit['detail'], bubbles?: boolean, cancelable?: boolean, composed?: boolean) => boolean;
/**
 * Dispatch an async custom Event.
 *
 * @param element The dispatcher node.
 * @param event The event to dispatch or the name of the synthetic event to create.
 * @param detail Detail object of the event.
 * @param bubbles Should the event bubble.
 * @param cancelable Should the event be cancelable.
 * @param composed Is the event composed.
 */
export declare const dispatchAsyncEvent: (element: Element, event: Event | string, detail?: CustomEventInit['detail'], bubbles?: boolean, cancelable?: boolean, composed?: boolean) => Promise<unknown[]>;
/**
 * A Symbol which contains all listeners instances of a component constructor.
 */
declare const LISTENERS_SYMBOL: unique symbol;
/**
 * An object with listeners.
 */
declare type WithListeners<T> = T & {
    [LISTENERS_SYMBOL]?: Listener[];
};
/**
 * The listener interface.
 */
declare type Listener = {
    event: string;
    selector: string | null;
    target: EventTarget | null;
    callback: DelegatedEventCallback;
    options?: AddEventListenerOptions;
};
/**
 * Retrieve all listeners descriptors.
 * @param constructor The component constructor.
 * @return A list of listeners.
 */
export declare const getListeners: (prototype: WithListeners<ComponentInstance<HTMLElement>>) => Listener[];
/**
 * Add an event listener to the prototype.
 * @param prototype The component prototype.
 * @param eventName The name of the event to listen.
 * @param callback The event callback.
 * @param options The event listener options.
 */
export declare function defineListener(prototype: WithListeners<ComponentInstance<HTMLElement>>, eventName: string, target: EventTarget | null, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions): void;
/**
 * Define component listeners.
 * @param prototype The component prototype.
 */
export declare const defineListeners: (prototype: ComponentInstance<HTMLElement>) => void;
/**
 * Add a property observer to a component prototype.
 * @param targetOrClassElement The component prototype.
 * @param propertyKey The property name to watch.
 * @param methodKey The method name.
 */
export declare const createListener: <T_4 extends {
    readonly is: string;
    readonly isConnected: boolean;
    readonly slotChildNodes: import("./types").IterableNodeList | undefined;
    initialize(properties?: {
        readonly is: string;
        readonly isConnected: boolean;
        readonly slotChildNodes: import("./types").IterableNodeList | undefined;
        initialize: (properties?: any | undefined) => void;
        connectedCallback: () => void;
        disconnectedCallback: () => void;
        attributeChangedCallback: (attributeName: string, oldValue: string | null, newValue: string | null) => void;
        stateChangedCallback: <P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]) => void;
        propertyChangedCallback: <P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]) => void;
        getInnerPropertyValue: <P_2 extends keyof any>(propertyName: P_2) => any[P_2];
        setInnerPropertyValue: <P_3 extends keyof any>(propertyName: P_3, value: any[P_3]) => void;
        observe: <P_4 extends keyof any>(propertyName: P_4, observer: import("./property").PropertyObserver<any[P_4]>) => void;
        unobserve: <P_5 extends keyof any>(propertyName: P_5, observer: import("./property").PropertyObserver<any[P_5]>) => void;
        dispatchEvent: {
            (event: Event): boolean;
            (event: string, detail?: any, bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
        };
        dispatchAsyncEvent: {
            (event: Event): Promise<any[]>;
            (event: string, detail?: any, bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
        };
        delegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined) => void;
        undelegateEventListener: (event: string, selector: string | null, callback: DelegatedEventCallback) => void;
        render: () => import("./render").Template;
        forceUpdate: () => void;
        appendChild: <T extends Node>(newChild: T) => T;
        removeChild: <T_1 extends Node>(oldChild: T_1) => T_1;
        insertBefore: <T_2 extends Node>(newChild: T_2, refChild: Node | null) => T_2;
        replaceChild: <T_3 extends Node>(newChild: Node, oldChild: T_3) => T_3;
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
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void;
    stateChangedCallback<P extends keyof any>(propertyName: P, oldValue: any[P] | undefined, newValue: any[P]): void;
    propertyChangedCallback<P_1 extends keyof any>(propertyName: P_1, oldValue: any[P_1] | undefined, newValue: any[P_1]): void;
    getInnerPropertyValue<P_2 extends keyof any>(propertyName: P_2): any[P_2];
    setInnerPropertyValue<P_3 extends keyof any>(propertyName: P_3, value: any[P_3]): void;
    observe<P_4 extends keyof any>(propertyName: P_4, observer: import("./property").PropertyObserver<any[P_4]>): void;
    unobserve<P_5 extends keyof any>(propertyName: P_5, observer: import("./property").PropertyObserver<any[P_5]>): void;
    dispatchEvent(event: Event): boolean;
    dispatchEvent(event: string, detail?: any, bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): boolean;
    dispatchAsyncEvent(event: Event): Promise<any[]>;
    dispatchAsyncEvent(event: string, detail?: any, bubbles?: boolean | undefined, cancelable?: boolean | undefined, composed?: boolean | undefined): Promise<any[]>;
    delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions | undefined): void;
    undelegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback): void;
    render(): import("./render").Template;
    forceUpdate(): void;
    appendChild<T extends Node>(newChild: T): T;
    removeChild<T_1 extends Node>(oldChild: T_1): T_1;
    insertBefore<T_2 extends Node>(newChild: T_2, refChild: Node | null): T_2;
    replaceChild<T_3 extends Node>(newChild: Node, oldChild: T_3): T_3;
    insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null;
    setAttribute(qualifiedName: string, value: string): void;
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
} & HTMLElement, P_6 extends MethodsOf<T_4>>(targetOrClassElement: T_4, eventName: string, target: EventTarget | null, selector: string | null, options: AddEventListenerOptions, methodKey?: P_6 | undefined) => any;
/**
 * A decorator for listening DOM events.
 *
 * @param eventName The name of the event to listen.
 * @param options Options to pass to addEventListener.
 * @return The decorator initializer.
 */
declare function listen(eventName: string, options?: AddEventListenerOptions): Function;
declare function listen(eventName: string, selector: string, options?: AddEventListenerOptions): Function;
declare function listen(eventName: string, target: EventTarget, options?: AddEventListenerOptions): Function;
export { listen };
