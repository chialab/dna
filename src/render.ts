import type { Realm } from '@chialab/quantum';
import { isComponent, type ComponentConstructor, type ComponentInstance } from './Component';
import { css } from './css';
import { getPropertyDescriptor, isArray } from './helpers';
import { HooksManager, type HooksState } from './Hooks';
import {
    isVFragment,
    isVFunction,
    isVNode,
    isVObject,
    isVSlot,
    isVTag,
    type ElementProperties,
    type EventProperties,
    type FunctionComponent,
    type KeyedProperties,
    type Template,
    type TreeProperties,
} from './JSX';
import { getProperty } from './property';

/**
 * A symbol for node render context.
 */
const CONTEXT_SYMBOL: unique symbol = Symbol();

enum ContextKind {
    LITERAL = 0,
    VNODE = 1,
    REF = 2,
}

/**
 * The node context interface.
 */
export type Context = {
    node: Node;
    kind: ContextKind;
    type: FunctionComponent | string | null;
    root?: Context;
    owner?: Context;
    children: Context[];
    properties?: KeyedProperties & TreeProperties & Record<string, unknown>;
    state?: HooksState;
    end?: Context;
    key?: unknown;
    keys?: Map<unknown, Context>;
    _pos: number;
};

/**
 * Create a node context.
 * @param kind The kind of the context.
 * @param type The type of the context.
 * @param node The node scope of the context.
 * @param root The render root context.
 * @param owner The render owner context.
 * @returns A context object for the node.
 */
export const createContext = (
    kind: ContextKind,
    type: Context['type'],
    node: Node,
    root?: Context,
    owner?: Context
): Context => ({
    node,
    kind,
    type,
    root,
    owner,
    children: [],
    _pos: 0,
});

/**
 * Get (or create) the root context attached to a node.
 * @param node The scope of the context.
 * @returns The context object (if it exists).
 */
export const getRootContext = <T extends Node>(
    node: T & {
        [CONTEXT_SYMBOL]?: Context;
    }
) => (node[CONTEXT_SYMBOL] = node[CONTEXT_SYMBOL] || createContext(ContextKind.REF, null, node));

/**
 * Convert strings or classes map to a list of classes.
 * @param value The value to convert.
 * @returns A list of classes.
 */
const convertClasses = (value: string | Record<string, boolean | undefined> | null | undefined) => {
    if (!value) {
        return {};
    }
    if (typeof value === 'object') {
        return value;
    }
    return value
        .toString()
        .trim()
        .split(' ')
        .reduce(
            (acc, key) => {
                acc[key.trim()] = true;
                return acc;
            },
            {} as Record<string, boolean>
        );
};

/**
 * Convert strings or styles map to a list of styles.
 * @param value The value to convert.
 * @returns A set of styles.
 */
const convertStyles = (value: string | Record<string, string | undefined> | null | undefined) => {
    const styles: { [key: string]: string } = {};
    if (!value) {
        return styles;
    }
    if (typeof value === 'object') {
        for (const propertyKey in value) {
            const camelName = propertyKey.replace(/[A-Z]/g, (match: string) => `-${match.toLowerCase()}`);
            const propValue = value[propertyKey];
            if (propValue != null) {
                styles[camelName] = propValue;
            }
        }
        return styles;
    }
    return value
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
 * Check if a property should be ignored.
 * @param propertyKey The property key to check.
 * @returns `true` if the property should be ignored.
 */
const shouldIgnoreProperty = (propertyKey: string) => ['children', 'key', 'is', 'xmlns'].includes(propertyKey);

/**
 * Check if a property is writable.
 * @param element The element to check.
 * @param propertyKey The property to check.
 * @returns True if writable, false otherwise.
 */
const isWritableProperty = (element: Node, propertyKey: string) => {
    const descriptor = getPropertyDescriptor(element, propertyKey);
    return !descriptor || !descriptor.get || descriptor.set;
};

/**
 * Set property value to a node.
 * @param node The node to update.
 * @param propertyKey The property key to update.
 * @param value The new value.
 * @param oldValue The old value.
 * @param constructor The constructor of the node.
 */
const setProperty = <T extends Node | HTMLElement, P extends string & keyof T>(
    node: T,
    propertyKey: P,
    value: T[P] | undefined,
    oldValue?: T[P],
    constructor?: ComponentConstructor
) => {
    const isInputValue =
        (propertyKey === 'checked' || propertyKey === 'value') && (node as HTMLElement).tagName === 'INPUT';

    if (oldValue === value && !isInputValue) {
        return;
    }

    if (propertyKey === 'style') {
        if ((node as HTMLElement).getAttribute('style') != oldValue) {
            oldValue = convertStyles(oldValue as string) as T[P];
            value = convertStyles(value as string) as T[P];
        }

        if (typeof value === 'string') {
            (node as HTMLElement).setAttribute('style', value as string);
        } else {
            const style = (node as HTMLElement).style;
            for (const propertyKey in oldValue as Record<string, string>) {
                if (!(propertyKey in (value as Record<string, string>))) {
                    style.removeProperty(propertyKey);
                }
            }
            for (const propertyKey in value) {
                style.setProperty(propertyKey, (value as Record<string, string>)[propertyKey]);
            }
        }
        return;
    }
    if (propertyKey === 'class') {
        if ((node as HTMLElement).className !== (oldValue || '')) {
            oldValue = convertClasses(oldValue as string) as T[P];
            value = convertClasses(value as string) as T[P];
        }

        if (typeof value === 'string') {
            (node as HTMLElement).className = value as string;
        } else {
            const classList = (node as HTMLElement).classList;
            if (oldValue) {
                for (const className in oldValue) {
                    if (!(value as Record<string, boolean>)[className]) {
                        classList.remove(className);
                    }
                }
            }
            for (const className in value as Record<string, boolean>) {
                if ((value as Record<string, boolean>)[className] && !classList.contains(className)) {
                    classList.add(className);
                }
            }
        }
        return;
    }
    if (propertyKey[0] === 'o' && propertyKey[1] === 'n' && !(propertyKey in node.constructor.prototype)) {
        const eventName = propertyKey.substring(2);
        if (oldValue) {
            (node as HTMLElement).removeEventListener(eventName, oldValue as EventListener);
        }
        if (value) {
            (node as HTMLElement).addEventListener(eventName, value as EventListener);
        }
        return;
    }

    const type = typeof value;
    const wasType = typeof oldValue;
    const isReference = (value && type === 'object') || type === 'function';
    const wasReference = (oldValue && wasType === 'object') || wasType === 'function';
    const isProtoProperty = type !== 'string' && propertyKey in node && isWritableProperty(node, propertyKey);

    if (isReference || wasReference || isInputValue || isProtoProperty) {
        (node as unknown as Record<string, unknown>)[propertyKey] = value;
    } else if (constructor) {
        const observedAttributes = constructor.observedAttributes;
        if (!observedAttributes?.includes(propertyKey)) {
            if (isWritableProperty(node, propertyKey)) {
                (node as unknown as Record<string, unknown>)[propertyKey] = value;
            }
        } else {
            const property = getProperty(node as ComponentInstance, propertyKey as keyof ComponentInstance);
            if (property?.fromAttribute) {
                (node as unknown as Record<string, unknown>)[propertyKey] = (property.fromAttribute as Function).call(
                    node,
                    value as string
                );
            }
        }
    }

    if (!isProtoProperty) {
        if (value == null || value === false) {
            if ((node as HTMLElement).hasAttribute(propertyKey)) {
                (node as HTMLElement).removeAttribute(propertyKey);
            }
        } else if (!isReference) {
            const attrValue = value === true ? '' : (value as string).toString();
            if ((node as HTMLElement).getAttribute(propertyKey) !== attrValue) {
                (node as HTMLElement).setAttribute(propertyKey, attrValue);
            }
        }
    }
};

/**
 * Insert a node into the render tree.
 * @param parentContext The parent context.
 * @param childContext The child context.
 */
const insertNode = (parentContext: Context, childContext: Context) => {
    const { node: parentNode, _pos: pos } = parentContext;
    const currentChildren = parentContext.children;
    if (currentChildren.includes(childContext)) {
        // the node is already in the child list
        // remove nodes until the correct instance
        let currentContext: Context | null;
        while ((currentContext = currentChildren[pos]) && childContext !== currentContext) {
            parentNode.removeChild(currentContext.node);
            currentChildren.splice(pos, 1);
        }
    } else {
        // we need to insert the new node into the tree
        parentNode.insertBefore(childContext.node, currentChildren[pos]?.node);
        currentChildren.splice(pos, 0, childContext);
    }
    parentContext._pos++;
};

/**
 * Render a a template into the root.
 * @param context The render context of the root.
 * @param rootContext The render root context.
 * @param template The template to render in Virtual DOM format.
 * @param namespace The current namespace uri of the render.
 * @param keys The current keys map of the render.
 * @param realm The realm to use for the render.
 * @param fragment The fragment context to update.
 */
const renderTemplate = (
    context: Context,
    rootContext: Context,
    template: Template,
    namespace: string,
    keys: Map<unknown, Context> | undefined,
    realm?: Realm,
    fragment: Context = context
) => {
    if (template == null || template === false) {
        return;
    }

    if (isArray(template)) {
        const len = template.length;
        if (len === 0) {
            return;
        }
        if (len === 1) {
            renderTemplate(context, rootContext, template[0], namespace, keys, realm, fragment);
            return;
        }

        // call the render function for each child
        for (let i = 0; i < len; i++) {
            renderTemplate(context, rootContext, template[i], namespace, keys, realm, fragment);
        }
        return;
    }

    const document = context.node.ownerDocument as Document;
    const currentChildren = context.children;

    if (isVObject(template)) {
        if (isVFragment(template)) {
            renderTemplate(context, rootContext, template.children, namespace, keys, realm, fragment);
            return;
        }

        if (isVFunction(template)) {
            const { type: Function, key, properties, children } = template;

            let rootNode: Node | undefined;
            let currentContext: Context | null = null;
            if (key) {
                rootNode = keys?.get(key)?.node;
            } else if (
                (currentContext = currentChildren[context._pos]) &&
                currentContext.type === Function &&
                currentContext.key == null
            ) {
                rootNode = currentContext.node;
            }

            renderTemplate(
                context,
                rootContext,
                rootNode || document.createComment(Function.name),
                namespace,
                keys,
                realm,
                fragment
            );

            const renderContext = currentChildren[context._pos - 1];
            renderContext.type = Function;

            const hooks = new HooksManager((renderContext.state = renderContext.state || []));
            if (key != null) {
                fragment.keys = (fragment.keys || new Map()).set(key, renderContext);
            }

            renderTemplate(
                context,
                rootContext,
                Function(
                    {
                        children,
                        ...properties,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        useState(initialValue: any) {
                            const [value, setInternal] = hooks.useState(initialValue);

                            return [
                                value,
                                (newValue: typeof initialValue, requestUpdate?: boolean) => {
                                    if (!setInternal(newValue)) {
                                        return;
                                    }
                                    if (requestUpdate === false) {
                                        return;
                                    }
                                    if (!currentChildren.includes(renderContext)) {
                                        return;
                                    }
                                    if (isComponent(rootContext.node) && realm) {
                                        realm.requestUpdate(() => {
                                            internalRender(
                                                context,
                                                template,
                                                realm,
                                                rootContext,
                                                namespace,
                                                renderContext
                                            );
                                        });
                                    } else {
                                        internalRender(context, template, realm, rootContext, namespace, renderContext);
                                    }
                                },
                            ];
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        useMemo(factory: () => any, deps: unknown[] = []) {
                            return hooks.useMemo(factory, deps);
                        },
                    }
                ),
                namespace,
                keys,
                realm
            );

            renderContext.end = currentChildren[context._pos - 1];
            return;
        }

        // if the current patch is a slot,
        if (isVSlot(template)) {
            if (!isComponent(rootContext.node) || !realm) {
                return;
            }
            const { properties, children } = template;
            const name = properties?.name;
            const slotted = realm.childNodesBySlot(name);
            if (slotted.length) {
                renderTemplate(context, rootContext, slotted, namespace, keys, realm, fragment);
            } else if (children) {
                renderTemplate(context, rootContext, children, namespace, keys, realm, fragment);
            }
            return;
        }

        const { key, children, namespace: namespaceURI = namespace } = template;
        const properties = template.properties as KeyedProperties &
            TreeProperties &
            EventProperties &
            ElementProperties;

        let templateContext: Context | undefined;
        let currentContext: Context | null;
        if (key != null) {
            templateContext = keys?.get(key);
        } else if (
            (currentContext = currentChildren[context._pos]) &&
            currentContext.key == null &&
            currentContext.owner === rootContext
        ) {
            if (
                isVTag(template) &&
                currentContext.kind === ContextKind.VNODE &&
                currentContext.type === template.type &&
                currentContext.properties?.is === properties?.is
            ) {
                templateContext = currentContext;
            }
        }

        if (!templateContext) {
            if (isVNode(template)) {
                const node = template.type;
                templateContext =
                    currentChildren.find((child) => child.node === node) ||
                    createContext(ContextKind.REF, null, template.type, rootContext);
            } else {
                const constructor = customElements?.get(properties?.is ?? template.type);
                templateContext = createContext(
                    ContextKind.VNODE,
                    template.type,
                    constructor ? new constructor() : document.createElementNS(namespaceURI, template.type),
                    rootContext,
                    rootContext
                );
            }
        }

        const node = templateContext.node;
        if (key != null) {
            templateContext.key = key;
            fragment.keys = (fragment.keys || new Map()).set(key, templateContext);
        }

        // update node properties
        const oldProperties = templateContext.properties as
            | undefined
            | (KeyedProperties & TreeProperties & EventProperties & ElementProperties);
        templateContext.properties = properties;

        let constructor: ComponentConstructor | undefined;
        if (isComponent(node)) {
            constructor = (node as ComponentInstance).constructor as ComponentConstructor;
            node.collectUpdatesStart();
        }

        if (oldProperties) {
            for (const propertyKey in oldProperties) {
                if (!(propertyKey in properties) && !shouldIgnoreProperty(propertyKey)) {
                    setProperty(
                        node,
                        propertyKey as keyof Node,
                        undefined,
                        oldProperties[propertyKey as keyof typeof oldProperties] as Node[keyof Node],
                        constructor
                    );
                }
            }
        }

        for (const propertyKey in properties) {
            if (!shouldIgnoreProperty(propertyKey)) {
                setProperty(
                    node,
                    propertyKey as keyof Node,
                    properties[propertyKey as keyof typeof properties] as Node[keyof Node],
                    oldProperties?.[propertyKey as keyof typeof oldProperties] as Node[keyof Node],
                    constructor
                );
            }
        }

        if (constructor) {
            (node as ComponentInstance).collectUpdatesEnd();
        }

        insertNode(context, templateContext);

        if ((templateContext && children && children.length) || templateContext.root === rootContext) {
            internalRender(templateContext, children, realm, rootContext, namespaceURI, undefined);
        }
        return;
    }
    if (template instanceof Node) {
        insertNode(
            context,
            currentChildren.find((child) => child.node === template) ||
                createContext(ContextKind.REF, null, template, rootContext)
        );
        return;
    }

    template = String(template);
    if (isComponent(rootContext.node) && (context.node as HTMLElement).tagName === 'STYLE') {
        template = css(rootContext.node.is, template as string);
    }

    let currentContext: Context | null;
    if (
        (currentContext = currentChildren[context._pos]) &&
        currentContext.kind === ContextKind.LITERAL &&
        currentContext.owner === rootContext
    ) {
        if (currentContext.kind === ContextKind.LITERAL && currentContext.type != template) {
            currentContext.type = template;
            currentContext.node.nodeValue = template as string;
        }
        insertNode(context, currentContext);
        return;
    }

    // convert non-Node template into Text
    insertNode(
        context,
        createContext(
            ContextKind.LITERAL,
            template,
            document.createTextNode(template as string),
            rootContext,
            rootContext
        )
    );
};

/**
 * Render a set of nodes into the render root, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param context The render context of the root.
 * @param template The child (or the children) to render in Virtual DOM format or already generated.
 * @param realm The realm to use for the render.
 * @param rootContext The current root context of the render.
 * @param namespace The current namespace uri of the render.
 * @param fragment The fragment context to update.
 * @returns The resulting child nodes list.
 */
export const internalRender = (
    context: Context,
    template: Template,
    realm?: Realm,
    rootContext: Context = context,
    namespace = 'http://www.w3.org/1999/xhtml',
    fragment?: Context
) => {
    const contextChildren = context.children;

    let endContext: Context | undefined;
    let currentKeys: Map<unknown, Context> | undefined;
    if (fragment) {
        context._pos = context.children.indexOf(fragment);
        endContext = fragment.end as Context;
        currentKeys = fragment.keys;
        delete fragment.keys;
    } else {
        context._pos = 0;
        currentKeys = context.keys;
        delete context.keys;
    }

    renderTemplate(context, rootContext, template, namespace, currentKeys, realm, fragment);

    // all children of the root have been handled,
    // we can start to cleanup the tree
    // remove all Nodes that are outside the result range
    const currentIndex = context._pos;
    let end: number;
    if (endContext) {
        end = contextChildren.indexOf(endContext) + 1;
    } else {
        end = contextChildren.length;
    }

    while (currentIndex <= --end) {
        const [child] = contextChildren.splice(end, 1);
        const parentNode = child.node.parentNode;
        if (parentNode === context.node || (realm?.open && parentNode === realm.node && realm.root === context.node)) {
            context.node.removeChild(child.node);
        }
    }

    return contextChildren;
};

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param root The root Node for the render.
 * @returns The resulting child Nodes.
 */
export const render = (input: Template, root: Node = document.createDocumentFragment()): Node | Node[] | void => {
    const childNodes = internalRender(getRootContext(root), input).map((child) => child.node);
    if (!isArray(input) && !(input != null && isVObject(input) && isVFragment(input)) && childNodes.length < 2) {
        return childNodes[0];
    }
    return childNodes;
};
