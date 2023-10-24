import type { Realm } from '@chialab/quantum';
import { document } from '$env';
import { isComponent, type ComponentConstructor, type ComponentInstance } from './Component';
import { css } from './css';
import { type CustomElementConstructor } from './CustomElement';
import { getPropertyDescriptor, isArray, isNode } from './helpers';
import {
    isVComponent,
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
    type Store,
    type Template,
    type TreeProperties,
    type UpdateRequest,
} from './JSX';
import { getProperty, type Props } from './property';

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
    type: FunctionComponent | ComponentConstructor | string | null;
    root?: Context;
    owner?: Context;
    children: Context[];
    properties?: KeyedProperties & TreeProperties;
    requestUpdate?: UpdateRequest;
    store?: Store;
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
 * Set property value to a node.
 * @param node The node to update.
 * @param propertyKey The property key to update.
 * @param value The new value.
 * @param oldValue The old value.
 */
const setProperty = <T extends Node | HTMLElement, P extends string & keyof T>(
    node: T,
    propertyKey: P,
    value: T[P] | undefined,
    oldValue?: T[P]
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

    if (isReference || wasReference || isInputValue) {
        (node as unknown as Record<string, unknown>)[propertyKey] = value;
    } else if (isComponent(node)) {
        if (type === 'string') {
            const observedAttributes = (node.constructor as CustomElementConstructor).observedAttributes;
            if (!observedAttributes || observedAttributes.indexOf(propertyKey) === -1) {
                const descriptor = propertyKey in node && getPropertyDescriptor(node, propertyKey);
                if (!descriptor || !descriptor.get || descriptor.set) {
                    (node as unknown as Record<string, unknown>)[propertyKey] = value;
                }
            } else {
                const property = getProperty(node as ComponentInstance, propertyKey as keyof Props<ComponentInstance>);
                if (property && property.fromAttribute) {
                    (node as unknown as Record<string, unknown>)[propertyKey] = (
                        property.fromAttribute as Function
                    ).call(node, value as string);
                }
            }
        } else {
            (node as unknown as Record<string, unknown>)[propertyKey] = value;
        }
    }

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

    const currentChildren = context.children;

    let templateContext: Context | undefined;
    let templateChildren: Template[] | undefined;
    let templateNamespace = namespace;

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
            renderContext.store = renderContext.store || new Map();

            if (key != null) {
                fragment.keys = (fragment.keys || new Map()).set(key, renderContext);
            }

            let running = true;
            const requestUpdate: UpdateRequest = (renderContext.requestUpdate = () => {
                if (renderContext.requestUpdate !== requestUpdate) {
                    return (renderContext.requestUpdate as UpdateRequest)();
                }
                if (running) {
                    throw new Error('An update request is already running');
                }
                if (currentChildren.indexOf(renderContext) === -1) {
                    return false;
                }

                if (isComponent(rootContext.node) && realm) {
                    realm.requestUpdate(() => {
                        internalRender(context, template, realm, rootContext, namespace, renderContext);
                    });
                } else {
                    internalRender(context, template, realm, rootContext, namespace, renderContext);
                }
                return true;
            });

            renderTemplate(
                context,
                rootContext,
                Function(
                    {
                        children,
                        ...properties,
                    },
                    renderContext as Context & {
                        store: Store;
                        requestUpdate: UpdateRequest;
                    }
                ),
                namespace,
                keys,
                realm
            );

            renderContext.end = currentChildren[context._pos - 1];
            running = false;
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

        const { key, children, namespace: namespaceURI } = template;
        templateNamespace = namespaceURI || namespace;

        let currentContext: Context | null;
        if (key != null) {
            templateContext = keys?.get(key);
        } else if (
            (currentContext = currentChildren[context._pos]) &&
            currentContext.key == null &&
            currentContext.owner === rootContext
        ) {
            if (isVComponent(template) && currentContext.type === template.type) {
                templateContext = currentContext;
            } else if (
                isVTag(template) &&
                currentContext.kind === ContextKind.VNODE &&
                currentContext.type === template.type
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
            } else if (isVComponent(template)) {
                templateContext = createContext(
                    ContextKind.VNODE,
                    template.type,
                    new template.type(),
                    rootContext,
                    rootContext
                );
            } else {
                templateContext = createContext(
                    ContextKind.VNODE,
                    template.type,
                    document.createElementNS(templateNamespace, template.type),
                    rootContext,
                    rootContext
                );
            }
        }

        if (templateContext) {
            if (key != null) {
                templateContext.key = key;
                fragment.keys = (fragment.keys || new Map()).set(key, templateContext);
            }

            // update the Node properties
            const oldProperties = templateContext.properties as
                | undefined
                | (KeyedProperties & TreeProperties & EventProperties & ElementProperties);
            const properties = template.properties as KeyedProperties &
                TreeProperties &
                EventProperties &
                ElementProperties;

            templateContext.properties = properties;

            if (oldProperties) {
                for (const propertyKey in oldProperties) {
                    if (!(propertyKey in properties)) {
                        setProperty(
                            templateContext.node,
                            propertyKey as keyof Node,
                            undefined,
                            oldProperties[propertyKey as keyof typeof oldProperties] as Node[keyof Node]
                        );
                    }
                }
            }

            for (const propertyKey in properties) {
                switch (propertyKey) {
                    case 'children':
                    case 'key':
                    case 'is':
                    case 'xmlns':
                        break;
                    default:
                        setProperty(
                            templateContext.node,
                            propertyKey as keyof Node,
                            properties[propertyKey as keyof typeof properties] as Node[keyof Node],
                            oldProperties?.[propertyKey as keyof typeof oldProperties] as Node[keyof Node]
                        );
                }
            }
        }

        templateChildren = children;
    } else if (isNode(template)) {
        templateContext =
            templateContext ||
            currentChildren.find((child) => child.node === template) ||
            createContext(ContextKind.REF, null, template, rootContext);
    } else {
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
            templateContext = currentContext;
            if (templateContext.kind === ContextKind.LITERAL && templateContext.type != template) {
                templateContext.type = template;
                templateContext.node.nodeValue = template as string;
            }
        } else {
            // convert non-Node template into Text
            templateContext = createContext(
                ContextKind.LITERAL,
                template,
                document.createTextNode(template as string),
                rootContext,
                rootContext
            );
        }
    }

    if (!templateContext) {
        return;
    }

    // now, we are confident that the input is a Node,
    if (currentChildren.indexOf(templateContext) !== -1) {
        // the node is already in the child list
        // remove nodes until the correct instance
        let currentContext: Context | null;
        while ((currentContext = currentChildren[context._pos]) && templateContext !== currentContext) {
            context.node.removeChild(currentContext.node);
            currentChildren.splice(context._pos, 1);
        }
        context._pos++;
    } else {
        // we need to insert the new node into the tree
        context.node.insertBefore(templateContext.node, currentChildren[context._pos]?.node);
        currentChildren.splice(context._pos++, 0, templateContext);
    }

    if ((templateContext && templateChildren && templateChildren.length) || templateContext.root === rootContext) {
        internalRender(templateContext, templateChildren, realm, rootContext, templateNamespace);
    }
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
        if (
            child.node.parentNode === context.node ||
            (realm?.open && child.node.parentNode === realm.node && realm.root === context.node)
        ) {
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
