import { ClassFieldObserver, ClassFieldDescriptor } from './property';
import { DelegatedEventCallback } from './events';
import { Template, TemplateItems } from './Template';
import { Scope } from './Scope';

export type IComponent<T extends HTMLElement = HTMLElement> = T & {
    /**
     * The defined component name.
     */
    readonly is: string;

    /**
     * A set of properties to define to the node.
     */
    readonly properties?: {
        [key: string]: ClassFieldDescriptor | Function | Function[];
    };

    /**
     * A set of delegated events to bind to the node.
     */
    readonly listeners?: {
        [key: string]: DelegatedEventCallback;
    };

    /**
     * A set of delegated events to bind to the node.
     */
    readonly template: HTMLTemplateElement|undefined;

    /**
     * The render scope reference of the node.
     */
    readonly $: Scope|undefined;

    /**
     * A list of slot nodes.
     */
    slotChildNodes: TemplateItems;

    /**
     * A list of CSSStyleSheet to apply to the component.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * Invoked each time the Custom Element is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
     */
    connectedCallback(): void;

    /**
     * Invoked each time the Custom Element is disconnected from the document's DOM.
     */
    disconnectedCallback(): void;

    /**
     * Invoked each time one of the Custom Element's attributes is added, removed, or changed.
     *
     * @param attributeName The name of the updated attribute.
     * @param oldValue The previous value of the attribute.
     * @param newValue The new value for the attribute (null if removed).
     */
    attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: null | string): void;

    /**
     * Invoked each time one of the Custom Element's properties is added, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;

    /**
     * Invoke the Custom Element's rendering.
     */
    render(): Template;

    /**
     * Force an element to re-render.
     */
    forceUpdate(): void;

    /**
     * Retrieve property descriptor.
     * @param propertyKey The name of the property.
     * @return The class field descriptor.
     */
    getProperty(propertyKey: string): ClassFieldDescriptor | null;

    /**
     * Define an observed property.
     * @param propertyKey THe name of the class field.
     * @param descriptor The property descriptor.
     * @param symbol The symbol to use to store property value.
     * @return The symbol used to store property value.
     */
    defineProperty(propertyKey: string, descriptor: ClassFieldDescriptor, symbol?: symbol): symbol;

    /**
     * Initialize constructor properties.
     * @param props The propertie to set.
     */
    initProperties(props: { [key: string]: any; }): void;

    /**
     * Initialize instance property.
     *
     * @param propertyKey The property name.
     * @param symbol The property symbolic key.
     * @param descriptor The property descriptor.
     * @param initializer The initializer function of the decorator.
     * @return The current property value.
     */
    initProperty(propertyKey: string, symbol: symbol, descriptor: ClassFieldDescriptor, initializer?: Function): any;

    /**
     * Observe a Component Property.
     *
     * @param propertyName The name of the Property to observe.
     * @param callback The callback function.
     */
    observe(propertyName: string, callback: ClassFieldObserver): void;

    /**
     * Unobserve a Component Property.
     * @memberof PropertiesMixin
     *
     * @param propertyName The name of the Property to unobserve.
     * @param callback The callback function to remove.
     */
    unobserve(propertyName: string, callback: ClassFieldObserver): void;

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
    dispatchEvent(event: string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;

    /**
     * Dispatch an async custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchAsyncEvent(event: Event): Promise<any[]>; /* eslint-disable-line no-dupe-class-members */
    dispatchAsyncEvent(event: string, detail?: any, bubbles?: boolean, cancelable?: boolean, composed?: boolean): Promise<any[]>;

    /**
     * Delegate an Event listener.
     *
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     */
    delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback): void;

    /**
     * Remove an Event delegation.
     *
     * @param eventName The Event name to undelegate
     * @param selector The selector to undelegate
     * @param callback The callback to remove
     */
    undelegateEventListener(event?: string, selector?: string | null, callback?: DelegatedEventCallback): void;

    /**
     * Append a slot child to the Component.
     *
     * @param newChild The child to add.
     */
    appendSlotChild<T extends Node>(newChild: T): T;

    /**
     * Remove a slot child from the Component.
     *
     * @param {Node} oldChild The child to remove.
     */
    removeSlotChild<T extends Node>(oldChild: T): T;

    /**
     * Insert a slot child before another in the Component.
     *
     * @param newChild The child to insert.
     * @param refChild The referred Node.
     */
    insertSlotBefore<T extends Node>(newChild: T, refChild: Node | null): T;

    /**
     * Replace a slot child with another in the Component.
     *
     * @param newChild The child to insert.
     * @param oldChild The Node to replace.
     */
    replaceSlotChild<T extends Node>(newChild: Node, oldChild: T): T;
}

/* eslint-disable no-var */
/**
 * The basic DNA Component interface.
 * It's a Custom Element, but with some extra useful method.
 * @see [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.
 */
export declare var IComponent: {
    /**
     * An array containing the names of the attributes to observe.
     */
    readonly observedAttributes: string[];
    /**
     * The DNA Custom Element constructor.
     *
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    new(node?: HTMLElement, properties?: { [key: string]: any; }): IComponent;
    new(properties?: { [key: string]: any; }): IComponent;
    prototype: IComponent;
};
