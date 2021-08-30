import type { ElementTagNameMap, Attributes, IterableNodeList } from './types';
import type { CustomElement, CustomElementConstructor } from './CustomElementRegistry';
import type { Observable } from './Observable';
import type { ComponentInstance, Props } from './Component';
import htm from 'htm';
import { createSymbol, isNode, isElement, isArray, isText, indexOf, cloneChildNodes, getPropertyDescriptor } from './helpers';
import { isComponent } from './Component';
import { customElements, isCustomElementConstructor } from './CustomElementRegistry';
import { DOM } from './DOM';
import { isThenable, getThenableState } from './Thenable';
import { isObservable, getObservableState } from './Observable';
import { css } from './css';
import { getProperty } from './property';

const innerHtml = htm.bind(h);

/**
 * Identify virtual dom objects.
 */
export const V_SYM: unique symbol = createSymbol();

/**
 * A constructor alias used for JSX fragments </>.
 */
export const Fragment: unique symbol = createSymbol();

/**
 * Classes dictionary.
 */
export type VClasses = string
    | { [key: string]: boolean | undefined };

/**
 * Styles dictionary.
 */
export type VStyle = string
    | { [key: string]: string | undefined };

type VKeys = 'is'
    | 'slot'
    | 'key'
    | 'xmlns'
    | 'ref'
    | 'children'
    | 'class'
    | 'style';

/**
 * Properties that can be assigned to a node through the render engine.
 */
export type VProperties<T = {}> = Omit<
    T extends Element ? (Omit<Props<T>, keyof Attributes<'div', T>> & Attributes<'div', T>) :
    T extends keyof ElementTagNameMap ? (Omit<Props<ElementTagNameMap[T]>, keyof Attributes<T>> & Attributes<T>) :
    T extends FunctionComponent ? Parameters<T>[0] :
    T,
    VKeys | `on${string}`
> & {
    is?: string;
    slot?: string;
    key?: unknown;
    xmlns?: string;
    ref?: Element;
    children?: Template | Template[];
    class?: VClasses;
    style?: VStyle;
    [listener: `on${string}`]: EventListener | undefined;
};

/**
 * The interface of a JSX fragment node.
 */
export type VFragment = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag?: undefined;
    isFragment: true;
    isSlot?: false;
    key?: unknown;
    properties?: {};
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a functional component.
 */
export type VFunction<T extends FunctionComponent> = {
    Function: T;
    Component?: undefined;
    node?: undefined;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of an HTML node used as JSX tag.
 */
export type VElement<T extends Element> = {
    Function?: undefined;
    Component?: undefined;
    node: T;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a Component constructor used as JSX tag.
 */
export type VComponent<T extends CustomElementConstructor> = {
    Function?: undefined;
    Component: T;
    node?: undefined;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<InstanceType<T>>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of slot element.
 */
export type VSlot = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag: 'slot';
    isFragment?: false;
    isSlot: true;
    key?: unknown;
    properties: VProperties<'slot'>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a generic JSX tag.
 */
export type VTag<T extends keyof ElementTagNameMap> = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag: T;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * Generic virtual dom object.
 */
export type VObject = VFunction<FunctionComponent> |
    VComponent<CustomElementConstructor> |
    VElement<Element> |
    VSlot |
    VTag<keyof ElementTagNameMap> |
    VFragment;

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
export type Template =
    Element |
    Text |
    Node |
    VFragment |
    VFunction<FunctionComponent> |
    VComponent<CustomElementConstructor> |
    VElement<Element> |
    VSlot |
    VTag<keyof ElementTagNameMap> |
    Promise<unknown> |
    Observable<unknown> |
    string |
    number |
    boolean |
    undefined |
    null |
    Template[];

/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isVObject = (target: any): target is VObject => typeof target === 'object' && !!target[V_SYM];

/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 */
export const isVFragment = (target: VObject): target is VFragment => !!target.isFragment;

/**
 * Check if the current virtual node is a functional component.
 * @param target The node to check.
 */
export const isVFunction = (target: VObject): target is VFunction<FunctionComponent> => !!target.Function;

/**
 * Check if the current virtual node is a Component.
 * @param target The node to check.
 */
export const isVComponent = (target: VObject): target is VComponent<CustomElementConstructor> => !!target.Component;

/**
 * Check if the current virtual node is an HTML node instance.
 * @param target The node to check.
 */
export const isVNode = (target: VObject): target is VElement<Element> => !!target.node;

/**
 * Check if the current virtual node is a slot element.
 * @param target The node to check.
 */
export const isVSlot = (target: VObject): target is VSlot => !!target.isSlot;

/**
 * Check if the current virtual node is a generic tag to render.
 * @param target The node to check.
 */
export const isVTag = (target: VObject): target is VTag<'div'> => !!target.tag;

/**
 * Function factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 */
function h(tagOrComponent: typeof Fragment): VFragment;
function h(tagOrComponent: typeof Fragment, properties: null, ...children: Template[]): VFragment;
function h<T extends FunctionComponent>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VFunction<T>;
function h<T extends CustomElementConstructor>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VComponent<T>;
/**
 * @deprecated Use the `ref` property instead.
 */
function h<T extends Element>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VElement<T>;
function h(tagOrComponent: 'slot', properties?: VProperties<'slot'> | null, ...children: Template[]): VSlot;
function h<T extends keyof ElementTagNameMap>(tagOrComponent: T, properties?: VProperties<ElementTagNameMap[T]> | null, ...children: Template[]): VTag<T>;
function h(tagOrComponent: typeof Fragment | FunctionComponent | CustomElementConstructor | Element | keyof ElementTagNameMap, properties: VProperties | null = null, ...children: Template[]) {
    const { is, key, xmlns, ref } = (properties || {});

    if (tagOrComponent === Fragment) {
        return {
            isFragment: true,
            children,
            [V_SYM]: true,
        } as VFragment;
    }

    if (isElement(tagOrComponent)) {
        return {
            node: tagOrComponent,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VElement<typeof tagOrComponent>;
    }

    if (typeof tagOrComponent === 'function') {
        if (isCustomElementConstructor(tagOrComponent)) {
            return {
                Component: tagOrComponent,
                key,
                namespaceURI: xmlns,
                properties: properties || {},
                children,
                [V_SYM]: true,
            } as VComponent<typeof tagOrComponent>;
        }

        return {
            Function: tagOrComponent,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VFunction<typeof tagOrComponent>;
    }

    if (ref) {
        return {
            node: ref,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VElement<typeof ref>;
    }

    if (tagOrComponent === 'svg') {
        return {
            tag: tagOrComponent,
            key,
            namespaceURI: 'http://www.w3.org/2000/svg',
            properties,
            children,
            [V_SYM]: true,
        } as VTag<typeof tagOrComponent>;
    }

    if (tagOrComponent === 'slot') {
        return {
            tag: tagOrComponent,
            isSlot: true,
            key,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VSlot;
    }

    const Component = customElements.get(is || tagOrComponent);
    if (Component) {
        return {
            Component,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VComponent<typeof Component>;
    }

    return {
        tag: tagOrComponent,
        key,
        namespaceURI: xmlns,
        properties: properties || {},
        children,
        [V_SYM]: true,
    } as VTag<typeof tagOrComponent>;
}

export { h };

/**
 * Compile a string into virtual DOM template.
 *
 * @return The virtual DOM template.
 */
export const compile = (string: string): Template => {
    const array = [string] as string[] & { raw?: string[] };
    array.raw = [string];
    return innerHtml(array as unknown as TemplateStringsArray);
};

/**
 * Compile a template string into virtual DOM template.
 *
 * @return The virtual DOM template.
 */
function html(string: TemplateStringsArray, ...values: unknown[]): Template;
/**
 * @deprecated use compile function instead.
 */
function html(string: string): Template;
function html(string: string | TemplateStringsArray, ...values: unknown[]): Template {
    if (typeof string === 'string') {
        return compile(string);
    }
    return innerHtml(string, ...values);
}

export { html };

/**
* A filter function signature for template items.
*
* @param item The template item to check.
* @return A truthy value for valid items, a falsy for value for invalid ones.
*/
export type Filter = (item: Node) => boolean;

/**
 * A re-render function.
 */
export type UpdateRequest = () => boolean;

/**
 * A function that returns a template.
 *
 * @param props A set of properties with children.
 * @param context The current render context.
 * @return A template.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionComponent<P = any> = (
    props: P,
    context: Context<Node, P>,
    /**
     * @deprecated Use context.requestUpdate method.
     */
    requestUpdate: UpdateRequest,
    /**
     * @deprecated Use the returned value of the context.requestUpdate method.
     */
    isAttached: () => boolean,
    /**
     * @deprecated Use context.
     */
    sameContext: Context<Node, P>
) => Template;

/**
 * A symbol for node context.
 */
const CONTEXT_SYMBOL: unique symbol = createSymbol();

export type WithContext<T extends Node> = T & {
    [CONTEXT_SYMBOL]?: Context<T>;
};

/**
 * The node context interface.
 */
export type Context<T extends Node = Node, P = T extends Element ? Props<T> : {}, S = Map<string, unknown>> = {
    node: T;
    isElement?: boolean;
    isText?: boolean;
    tagName?: string;
    is?: string;
    key?: unknown;
    properties: [
        WeakMap<Context<T, P>, P>,
        WeakMap<Context<T, P>, P>,
    ];
    store: S;
    childNodes?: IterableNodeList;
    slotChildNodes?: IterableNodeList;
    Function?: FunctionComponent<P>;
    start?: Node;
    end?: Node;
    fragments: Context[];
    parent?: Context;
    root?: Context;
    requestUpdate?: UpdateRequest;
    __proto__: {
        readonly size: number;
        has: Map<string, unknown>['has'];
        get: Map<string, unknown>['get'];
        set: Map<string, unknown>['set'];
        delete: Map<string, unknown>['delete'];
        clear: Map<string, unknown>['clear'];
        forEach: Map<string, unknown>['forEach'];
    };
};

/**
 * Attach a context to an object.
 * @param target The object to context.
 * @param context The context to set.
 */
export const setContext = <T extends Node>(target: WithContext<T>, context: Context<T>): Context<T> => target[CONTEXT_SYMBOL] = context;

/**
 * Create a node context.
 * @param node The node scope of the context.
 * @return A context object for the node.
 */
export const createContext = <T extends Node>(node: T) => {
    const isElementNode = isElement(node);
    const isTextNode = !isElementNode && isText(node);
    const is = (node as unknown as CustomElement).is;
    const store = new Map() as Map<string, unknown>;
    return setContext(node, {
        node,
        isElement: isElementNode,
        isText: isTextNode,
        tagName: isElementNode ? (node as unknown as HTMLElement).tagName.toLowerCase() : undefined,
        childNodes: isElementNode ? node.childNodes as unknown as IterableNodeList : undefined,
        is,
        properties: [new WeakMap(), new WeakMap()],
        store,
        fragments: [],
        __proto__: {
            get size() {
                return store.size;
            },
            has: store.has.bind(store),
            get: store.get.bind(store),
            set: store.set.bind(store),
            delete: store.delete.bind(store),
            clear: store.clear.bind(store),
            forEach: store.forEach.bind(store),
        },
    }) as Context<T>;
};

/**
 * Get the context attached to an object.
 * @param target The scope of the context.
 * @return The context object (if it exists).
 */
export const getOrCreateContext = <T extends Node>(target: WithContext<T>) => (target[CONTEXT_SYMBOL] || createContext(target)) as Context<T>;

/**
 * Cleanup child fragments of a context.
 * @param context The fragment to empty.
 */
export const emptyFragments = <T extends Node>(context: Context<T>) => {
    const fragments = context.fragments;
    let len = fragments.length;
    while (len--) {
        emptyFragments(fragments.pop() as Context);
    }
    return fragments;
};

/**
 * A cache for converted class values.
 */
const CLASSES_CACHE: { [key: string]: string[] } = {};

/**
 * Convert strings or classes map to a list of classes.
 * @param value The value to convert.
 * @return A list of classes.
 */
const convertClasses = (value: VClasses | null | undefined) => {
    const classes: string[] = [];
    if (!value) {
        return classes;
    }
    if (typeof value === 'object') {
        for (const k in value) {
            if (value[k]) {
                classes.push(k);
            }
        }
        return classes;
    }
    return CLASSES_CACHE[value] = CLASSES_CACHE[value] || value.toString().trim().split(' ');
};

/**
 * A cache for converted style values.
 */
const STYLES_CACHE: { [key: string]: { [key: string]: string } } = {};

/**
 * Convert strings or styles map to a list of styles.
 * @param value The value to convert.
 * @return A set of styles.
 */
const convertStyles = (value: VStyle| null | undefined) => {
    const styles: { [key: string]: string } = {};
    if (!value) {
        return styles;
    }
    if (typeof value === 'object') {
        for (const propertyKey in value) {
            const camelName = propertyKey.replace(/[A-Z]/g, (match: string) =>
                `-${match.toLowerCase()}`
            );
            const propValue = value[propertyKey];
            if (propValue != null) {
                styles[camelName] = propValue;
            }
        }
        return styles;
    }
    return STYLES_CACHE[value] = STYLES_CACHE[value] || value
        .toString()
        .split(';')
        .reduce((ruleMap: { [key: string]: string }, ruleString: string) => {
            const rulePair = ruleString.split(':');
            if (rulePair.length > 1) {
                ruleMap[(rulePair.shift() as string).trim()] = rulePair.join(':').trim();
            }
            return ruleMap;
        }, styles);
};

/**
 * Check if the render engine is handling input values.
 * @param element The current node element.
 * @param propertyKey The changed property key.
 */
const isRenderingInput = (element: HTMLElement, propertyKey: string): element is HTMLInputElement =>
    (propertyKey === 'checked' || propertyKey === 'value') &&
    element.tagName === 'INPUT';

/**
 * Add missing keys to properties object.
 * @param previous The previous object.
 * @param actual The actual one.
 */
const fillEmptyValues = <T extends {}>(previous: T, actual: { [key: string]: unknown }) => {
    for (const key in previous) {
        if (!(key in actual)) {
            actual[key] = undefined;
        }
    }

    return actual as unknown as T;
};

/**
 * Set a value to an HTML element.
 * @param element The node to update.
 * @param propertyKey The key to update.
 * @param value The value to set.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setValue = <T extends HTMLElement>(element: T, propertyKey: PropertyKey, value: any) => {
    element[propertyKey as keyof T] = value;
};

/**
 * Check if a property key is a listener key and it should be valued as event listener.
 * @param propertyKey The property to check.
 */
const isListenerProperty = (propertyKey: string): propertyKey is `on${string}` => propertyKey[0] === 'o' && propertyKey[1] === 'n';

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param root The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param slot Should handle slot children.
 * @param context The render context of the root.
 * @param namespace The current namespace uri of the render.
 * @param rootContext The current custom element context of the render.
 * @param refContext The main context of the render.
 * @param fragment The fragment context to update.
 * @return The resulting child nodes list.
 */
export const internalRender = (
    root: Node,
    input: Template,
    slot = isComponent(root),
    context?: Context,
    namespace = (root as Element).namespaceURI || 'http://www.w3.org/1999/xhtml',
    rootContext?: Context,
    mainContext?: Context,
    fragment?: Context
) => {
    let renderContext = context || getOrCreateContext(root);
    const refContext = mainContext || renderContext;

    let childNodes: IterableNodeList;
    if (slot && renderContext.slotChildNodes) {
        childNodes = renderContext.slotChildNodes as IterableNodeList;
    } else {
        childNodes = renderContext.childNodes || (root.childNodes as unknown as IterableNodeList);
        if (renderContext.is) {
            rootContext = renderContext;
        }
    }
    if (!childNodes) {
        return childNodes;
    }

    let currentIndex: number;
    let currentFragment = fragment;
    let lastNode: Node|undefined;
    if (fragment) {
        currentIndex = indexOf.call(childNodes, fragment.start as Node);
        lastNode = fragment.end as Node;
    } else {
        emptyFragments(renderContext);
        currentIndex = 0;
    }
    let currentNode = childNodes.item(currentIndex) as Node;
    let currentContext = currentNode ? getOrCreateContext(currentNode) : null;

    const handleItems = (template: Template, filter?: Filter) => {
        if (template == null || template === false) {
            return;
        }

        if (isArray(template)) {
            // call the render function for each child
            for (let i = 0, len = template.length; i < len; i++) {
                handleItems(template[i], filter);
            }
            return;
        }

        let templateNode;
        let templateContext: Context | undefined;
        let templateChildren: Template[] | undefined;
        let templateNamespace = namespace;

        if (isVObject(template)) {
            if (isVFragment(template)) {
                handleItems(template.children, filter);
                return;
            }

            if (isVFunction(template)) {
                const { Function, key, properties, children } = template;
                const rootFragment = fragment;
                const previousContext = renderContext;
                const previousFragment = currentFragment;
                const fragments = renderContext.fragments;
                let placeholder: Node;
                if (fragment) {
                    placeholder = fragment.start as Node;
                } else if (currentContext && currentContext.Function === Function && currentContext.key === key) {
                    placeholder = currentContext.start as Node;
                } else {
                    placeholder = DOM.createComment(Function.name);
                }

                const renderFragmentContext = getOrCreateContext(placeholder);
                const isAttached = () => fragments.indexOf(renderFragmentContext) !== -1;
                let running = true;
                const requestUpdate: UpdateRequest = renderFragmentContext.requestUpdate = () => {
                    if (renderFragmentContext.requestUpdate !== requestUpdate) {
                        return (renderFragmentContext.requestUpdate as UpdateRequest)();
                    }
                    if (running) {
                        throw new Error('An update request is already running');
                    }
                    if (!isAttached()) {
                        return false;
                    }
                    internalRender(root, template, slot, previousContext, namespace, rootContext, refContext, renderFragmentContext);
                    return true;
                };
                emptyFragments(renderFragmentContext);
                renderFragmentContext.Function = Function;
                renderFragmentContext.start = placeholder;
                renderContext = renderFragmentContext;
                currentFragment = renderFragmentContext;
                fragment = undefined;

                handleItems(
                    [
                        placeholder,
                        Function(
                            {
                                children,
                                ...properties,
                            },
                            renderFragmentContext,
                            requestUpdate,
                            isAttached,
                            renderFragmentContext
                        ),
                    ],
                    filter
                );

                fragment = rootFragment;
                renderFragmentContext.end = childNodes.item(currentIndex - 1) as Node;
                renderContext = previousContext;
                currentFragment = previousFragment;

                if (!fragment) {
                    fragments.push(renderFragmentContext);
                } else {
                    fragments.splice(fragments.indexOf(fragment), 1, renderFragmentContext);
                    fragment = renderFragmentContext;
                }

                running = false;
                return;
            }

            // if the current patch is a slot,
            if (isVSlot(template)) {
                if (rootContext) {
                    const { properties, children } = template;
                    const slotChildNodes = rootContext.slotChildNodes;
                    if (slotChildNodes) {
                        for (let i = 0, len = slotChildNodes.length; i < len; i++) {
                            const node = slotChildNodes.item(i) as Node;
                            const context = getOrCreateContext(node);
                            if (!context.root) {
                                context.root = rootContext;
                            }
                        }
                    }

                    const name = properties.name;
                    const filter = (item: Node) => {
                        if (getOrCreateContext(item).root === rootContext) {
                            if (isElement(item)) {
                                if (!name) {
                                    return !item.getAttribute('slot');
                                }

                                return item.getAttribute('slot') === name;
                            }
                        }

                        return !name;
                    };

                    handleItems(slotChildNodes || [], filter);
                    if (!childNodes.length) {
                        handleItems(children);
                    }
                }
                return;
            }

            const { key, children, namespaceURI } = template;
            if (isVNode(template)) {
                templateNode = template.node;
            } else {
                templateNamespace = namespaceURI || namespace;

                checkKey: if (currentContext) {
                    let currentKey = currentContext.key;
                    if (currentKey != null && key != null && key !== currentKey) {
                        emptyFragments(currentContext);
                        DOM.removeChild(root, currentNode, slot);
                        currentNode = childNodes.item(currentIndex) as Node;
                        currentContext = currentNode ? getOrCreateContext(currentNode) : null;
                        if (!currentContext) {
                            break checkKey;
                        }
                        currentKey = currentContext.key;
                    }

                    if (currentFragment && currentNode) {
                        const io = indexOf.call(childNodes, currentNode);
                        const lastIo = indexOf.call(childNodes, currentFragment.end);
                        if (io !== -1 && io > lastIo) {
                            break checkKey;
                        }
                    }

                    if (key != null || currentKey != null) {
                        if (key === currentKey) {
                            templateNode = currentNode;
                            templateContext = currentContext;
                        }
                    } else if (isVComponent(template) && currentNode instanceof template.Component) {
                        templateNode = currentNode;
                        templateContext = currentContext;
                    } else if (isVTag(template) && currentContext.tagName === template.tag) {
                        templateNode = currentNode;
                        templateContext = currentContext;
                    }
                }

                if (!templateNode) {
                    if (isVComponent(template)) {
                        templateNode = new template.Component();
                    } else {
                        templateNode = DOM.createElementNS(templateNamespace, template.tag);
                    }
                }
            }

            // update the Node properties
            const templateElement = templateNode as HTMLElement;

            templateContext = templateContext || getOrCreateContext(templateNode);
            const map = templateContext.properties[slot ? 1 : 0];
            const oldProperties = (map.get(refContext) || {}) as VProperties<HTMLElement>;
            const properties = fillEmptyValues(oldProperties, template.properties);
            map.set(refContext, properties);
            if (key != null) {
                templateContext.key = key;
            }

            let propertyKey: keyof typeof properties;
            for (propertyKey in properties) {
                if (propertyKey === 'is' ||
                    propertyKey === 'key' ||
                    propertyKey === 'children' ||
                    propertyKey === 'xmlns' ||
                    propertyKey === 'ref'
                ) {
                    continue;
                }
                const value = properties[propertyKey];
                const oldValue = oldProperties[propertyKey];
                if (oldValue === value) {
                    if (isRenderingInput(templateElement, propertyKey)) {
                        setValue(templateElement, propertyKey as unknown as 'value', value);
                    }
                    continue;
                }

                if (propertyKey === 'style') {
                    const style = templateElement.style;
                    const oldStyles = convertStyles(oldProperties.style);
                    const newStyles = convertStyles(properties.style);
                    for (const propertyKey in oldStyles) {
                        if (!(propertyKey in newStyles)) {
                            style.removeProperty(propertyKey);
                        }
                    }
                    for (const propertyKey in newStyles) {
                        style.setProperty(propertyKey, newStyles[propertyKey]);
                    }
                    continue;
                } else if (propertyKey === 'class') {
                    const classList = templateElement.classList;
                    const newClasses = convertClasses(properties.class);
                    if (oldValue) {
                        const oldClasses = convertClasses(oldProperties.class);
                        for (let i = 0, len = oldClasses.length; i < len; i++) {
                            const className = oldClasses[i];
                            if (newClasses.indexOf(className) === -1) {
                                classList.remove(className);
                            }
                        }
                    }
                    for (let i = 0, len = newClasses.length; i < len; i++) {
                        const className = newClasses[i];
                        if (!classList.contains(className)) {
                            classList.add(className);
                        }
                    }
                    continue;
                } else if (isListenerProperty(propertyKey) && !(propertyKey in templateElement.constructor.prototype)) {
                    const eventName = propertyKey.substr(2);
                    if (oldValue) {
                        templateElement.removeEventListener(eventName, oldValue as EventListener);
                    }
                    if (value) {
                        templateElement.addEventListener(eventName, value as EventListener);
                    }
                    continue;
                }

                const type = typeof value;
                const wasType = typeof oldValue;
                const isReference = (value && type === 'object') || type === 'function';
                const wasReference = (oldValue && wasType === 'object') || wasType === 'function';

                if (isReference || wasReference || isRenderingInput(templateElement, propertyKey)) {
                    setValue(templateElement, propertyKey, value);
                } else if (isVComponent(template)) {
                    const Component = template.Component;
                    if (type === 'string') {
                        const observedAttributes = Component.observedAttributes;
                        if (!observedAttributes || observedAttributes.indexOf(propertyKey) === -1) {
                            const descriptor = (propertyKey in templateElement) && getPropertyDescriptor(templateElement, propertyKey);
                            if (!descriptor || !descriptor.get || descriptor.set) {
                                setValue(templateElement, propertyKey, value);
                            }
                        } else {
                            const property = getProperty(templateElement as ComponentInstance, propertyKey as keyof ComponentInstance);
                            if (property && property.fromAttribute) {
                                setValue(templateElement, propertyKey, (property.fromAttribute as Function).call(templateElement, value as string));
                            }
                        }
                    } else {
                        setValue(templateElement, propertyKey, value);
                    }
                }

                if (value == null || value === false) {
                    if (templateElement.hasAttribute(propertyKey)) {
                        templateElement.removeAttribute(propertyKey);
                    }
                } else if (!isReference) {
                    const attrValue = value === true ? '' : (value as string).toString();
                    if (templateElement.getAttribute(propertyKey) !== attrValue) {
                        templateElement.setAttribute(propertyKey, attrValue);
                    }
                }
            }

            templateChildren = children;
        } else if (isThenable(template)) {
            handleItems(h((props, context) => {
                const status = getThenableState(template as Promise<unknown>);
                if (status.pending) {
                    (template as Promise<unknown>)
                        .catch(() => 1)
                        .then(() => {
                            (context.requestUpdate as UpdateRequest)();
                        });
                }
                return status.result as Template;
            }, null), filter);
            return;
        } else if (isObservable(template)) {
            const observable = template;
            handleItems(h((props, context) => {
                const status = getObservableState(observable);
                if (!status.complete) {
                    const subscription = observable.subscribe(
                        () => {
                            if (!(context.requestUpdate as UpdateRequest)()) {
                                subscription.unsubscribe();
                            }
                        },
                        () => {
                            if (!(context.requestUpdate as UpdateRequest)()) {
                                subscription.unsubscribe();
                            }
                        },
                        () => {
                            subscription.unsubscribe();
                        }
                    );
                }
                return status.current as Template;
            }, null), filter);
            return;
        } else if (isNode(template)) {
            templateNode = template;
        } else  {
            if (typeof template === 'string' && rootContext && renderContext.tagName === 'style') {
                const is = rootContext.is as string;
                template = css(is, template as string, customElements.tagNames[is]);
                (root as HTMLStyleElement).setAttribute('name', is);
            }

            if (currentContext && currentContext.isText) {
                templateNode = currentNode as Text;
                if (templateNode.textContent != template) {
                    templateNode.textContent = template as string;
                }
            } else {
                // convert non-Node template into Text
                templateNode = DOM.createTextNode(template as string);
            }
        }

        if (filter && !filter(templateNode)) {
            return;
        }

        // now, we are confident that if the input is a Node or a Component,
        // check if Nodes are the same instance
        // (patch result should return same Node instances for compatible types)
        if (templateNode !== currentNode) {
            // they are different, so we need to insert the new Node into the tree
            // if current iterator is defined, insert the Node before it
            // otherwise append the new Node at the end of the parent
            DOM.insertBefore(root, templateNode, currentNode, slot);
            currentIndex++;
        } else {
            currentNode = childNodes.item(++currentIndex) as Node;
            currentContext = currentNode ? getOrCreateContext(currentNode) : null;
        }

        if (isElement(templateNode) &&
            templateChildren &&
            templateContext &&
            ((templateContext.parent && templateContext.parent === refContext) || templateChildren.length)) {
            templateContext.parent = refContext;
            // the Node has slotted children, trigger a new render context for them
            internalRender(
                templateNode as HTMLElement,
                templateChildren,
                isComponent(templateNode),
                templateContext,
                templateNamespace,
                rootContext,
                refContext
            );
        }
    };

    handleItems(input);

    // all children of the root have been handled,
    // we can start to cleanup the tree
    // remove all Nodes that are outside the result range
    let lastIndex: number;
    if (lastNode) {
        lastIndex = indexOf.call(childNodes, lastNode) + 1;
    } else {
        lastIndex = childNodes.length;
    }
    while (currentIndex < lastIndex) {
        const item = childNodes.item(--lastIndex) as Node;
        const context = getOrCreateContext(item);
        if (slot) {
            if (context.root === rootContext) {
                delete context.root;
            }
            if (context.parent === refContext) {
                delete context.parent;
            }
        }
        emptyFragments(context);
        DOM.removeChild(root, item, slot);
    }

    return childNodes;
};

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param root The root Node for the render.
 * @param slot Should render to slot children.
 * @return The resulting child Nodes.
 */
export const render = (input: Template, root: Node = DOM.createDocumentFragment(), slot: boolean = isComponent(root)): Node | Node[] | void => {
    const childNodes = internalRender(root, input, slot);
    if (!childNodes) {
        return;
    }
    if (childNodes.length < 2) {
        return childNodes[0];
    }
    return cloneChildNodes(childNodes);
};
