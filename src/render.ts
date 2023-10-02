import type { Realm } from '@chialab/quantum';
import htm from 'htm';
import { isComponent, type ComponentInstance } from './Component';
import { createContext, getChildNodeContext, getRootContext, type Context } from './Context';
import { css } from './css';
import { type Store, type UpdateRequest } from './FunctionComponent';
import { getPropertyDescriptor, isArray, isElement, isNode, isText } from './helpers';
import {
    h,
    isVComponent,
    isVFragment,
    isVFunction,
    isVNode,
    isVObject,
    isVSlot,
    isVTag,
    type ElementProperties,
    type EventProperties,
    type KeyedProperties,
    type Template,
    type TreeProperties,
} from './JSX';
import { getObservableState, isObservable } from './Observable';
import { getProperty, type Props } from './property';
import { getThenableState, isThenable } from './Thenable';

/**
 * Compile a template string into virtual DOM template.
 * @param string The string to compile.
 * @param values Values to interpolate.
 * @returns The virtual DOM template.
 */
export const html = htm.bind(h);

/**
 * Compile a string into virtual DOM template.
 * @param string The string to compile.
 * @returns The virtual DOM template.
 */
export const compile = (string: string): Template => {
    const array = [string] as string[] & { raw?: string[] };
    array.raw = [string];
    return html(array as unknown as TemplateStringsArray);
};

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
                acc[key] = true;
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
 * Check if the render engine is handling input values.
 * @param element The current node element.
 * @param propertyKey The changed property key.
 * @returns True if the render engine is handling input elements, false otherwise.
 */
const isRenderingInput = (element: Node, propertyKey: string): element is HTMLInputElement =>
    (propertyKey === 'checked' || propertyKey === 'value') && (element as HTMLElement).tagName === 'INPUT';

/**
 * Set a value to an HTML element.
 * @param element The node to update.
 * @param propertyKey The key to update.
 * @param value The value to set.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setValue = <T extends Node>(element: T, propertyKey: PropertyKey, value: any) => {
    element[propertyKey as keyof T] = value;
};

/**
 * Check if a property key is a listener key and it should be valued as event listener.
 * @param propertyKey The property to check.
 * @returns True if the property is a listener, false otherwise.
 */
const isListenerProperty = (propertyKey: string): propertyKey is `on${string}` =>
    propertyKey[0] === 'o' && propertyKey[1] === 'n';

/**
 * Get the current iterating node in rendering context.
 * @param context The child context.
 * @returns A context or null.
 */
const getCurrentContext = (context: Context) => context.children[context._pos] || null;

/**
 * Get the latest iterating node in rendering context.
 * @param context The latest child context.
 * @returns A context or null.
 */
const getLatestContext = (context: Context) => context.children[context._pos - 1] || null;

/**
 * Get a keyed child context in the rendering context.
 * @param context The rendering context.
 * @param key The key to find.
 * @returns A node instance or null.
 */
const getKeyedContext = (context: Context, key: unknown) => {
    context = context.fragment || context;
    return (context._keys && context._keys.get(key)) || null;
};

/**
 * Check if a child context instance is keyed in the rendering context.
 * @param context The rendering context.
 * @param child The child context to check.
 * @returns True if keyed, false otherwise.
 */
const hasKeyedContext = (context: Context, child: Context) => {
    context = context.fragment || context;
    return context._keyed ? context._keyed.has(child) : null;
};

/**
 * Add keyed child context to rendering context.
 * @param context The rendering context.
 * @param child The child context to add.
 * @param key The key to add.
 */
const addKeyedContext = (context: Context, child: Context, key: unknown) => {
    context = context.fragment || context;
    context.keys = context.keys || new Map();
    context.keys.set(key, child);
};

/**
 * Render a a template into the root.
 * @param context The render context of the root.
 * @param rootContext The render root context.
 * @param template The template to render in Virtual DOM format.
 * @param realm The realm to use for the render.
 * @returns The count of rendered children.
 */
const renderTemplate = (context: Context, rootContext: Context, template: Template, realm?: Realm): number => {
    if (template == null || template === false) {
        return 0;
    }

    const isObject = typeof template === 'object';
    if (isObject && isArray(template)) {
        let childCount = 0;
        // call the render function for each child
        for (let i = 0, len = template.length; i < len; i++) {
            childCount += renderTemplate(context, rootContext, template[i], realm);
        }
        return childCount;
    }

    let templateContext: Context | undefined;
    let templateChildren: Template[] | undefined;
    let templateNamespace = context.namespace as string;

    if (isObject && isVObject(template)) {
        if (isVFragment(template)) {
            return renderTemplate(context, rootContext, template.children, realm);
        }

        if (isVFunction(template)) {
            const { type: Function, key, properties, children } = template;
            const rootFragment = context.fragment;

            let rootNode: Node | undefined;
            if (rootFragment) {
                rootNode = rootFragment.node;
            } else if (key) {
                rootNode = getKeyedContext(context, key)?.node;
            } else if (
                getCurrentContext(context)?.Function === Function &&
                !hasKeyedContext(context, getCurrentContext(context))
            ) {
                rootNode = getCurrentContext(context)?.node;
            }

            renderTemplate(context, rootContext, rootNode || document.createComment(Function.name), realm);

            const renderContext = getLatestContext(context) as Context;
            if (key != null) {
                addKeyedContext(context, renderContext, key);
            }

            const isAttached = () => context.children.indexOf(renderContext) !== -1;
            let running = true;
            const requestUpdate: UpdateRequest = (renderContext.requestUpdate = () => {
                if (renderContext.requestUpdate !== requestUpdate) {
                    return (renderContext.requestUpdate as UpdateRequest)();
                }
                if (running) {
                    throw new Error('An update request is already running');
                }
                if (!isAttached()) {
                    return false;
                }

                if (isComponent(rootContext.node) && realm) {
                    realm.requestUpdate(() => {
                        internalRender(context, template, realm, rootContext, context.namespace, renderContext);
                    });
                } else {
                    internalRender(context, template, realm, rootContext, context.namespace, renderContext);
                }
                return true;
            });
            renderContext.Function = Function;
            renderContext.store = renderContext.store || new Map();
            context.fragment = undefined;

            const childCount = renderTemplate(
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
                    },
                    requestUpdate,
                    isAttached,
                    renderContext
                ),
                realm
            );

            context.fragment = rootFragment;
            renderContext.end = context.children[context._pos - 1];

            running = false;
            return childCount + 1;
        }

        // if the current patch is a slot,
        if (isVSlot(template)) {
            if (!isComponent(rootContext.node) || !realm) {
                return 0;
            }
            const { properties, children } = template;
            const name = properties.name;
            const slotted = realm.childNodesBySlot(name);
            const childCount = renderTemplate(context, rootContext, slotted, realm);
            if (!childCount) {
                return renderTemplate(context, rootContext, children, realm);
            }
            return childCount;
        }

        const { key, children, namespace: namespaceURI } = template;
        templateNamespace = namespaceURI || (context.namespace as string);

        let currentContext: Context | null;
        if (key != null) {
            templateContext = getKeyedContext(context, key) as Context;
        } else if (
            (currentContext = getCurrentContext(context)) &&
            isElement(currentContext.node) &&
            !hasKeyedContext(context, currentContext) &&
            currentContext.owner === rootContext
        ) {
            if (isVComponent(template) && currentContext.node.constructor === template.type) {
                templateContext = currentContext;
            } else if (isVTag(template) && currentContext.node.tagName.toLowerCase() === template.type.toLowerCase()) {
                templateContext = currentContext;
            }
        }

        if (!templateContext) {
            if (isVNode(template)) {
                templateContext =
                    getChildNodeContext(context, template.type) || createContext(template.type, rootContext);
            } else if (isVComponent(template)) {
                templateContext = createContext(new template.type(), rootContext, rootContext);
            } else {
                templateContext = createContext(
                    document.createElementNS(templateNamespace, template.type),
                    rootContext,
                    rootContext
                );
            }
        }

        if (templateContext) {
            const templateNode = templateContext.node;
            if (key != null) {
                addKeyedContext(context, templateContext, key);
            }

            // update the Node properties
            const oldProperties = (templateContext.properties || {}) as KeyedProperties &
                TreeProperties &
                EventProperties &
                ElementProperties;
            const properties = { ...template.properties } as KeyedProperties &
                TreeProperties &
                EventProperties &
                ElementProperties;
            if (oldProperties) {
                for (const key in oldProperties) {
                    if (!(key in properties)) {
                        properties[key as keyof typeof properties] = undefined;
                    }
                }
            }
            templateContext.properties = properties;

            let propertyKey: keyof typeof properties;
            for (propertyKey in properties) {
                const value = properties[propertyKey];
                const oldValue = oldProperties && oldProperties[propertyKey];
                if (oldValue === value) {
                    if (isRenderingInput(templateNode, propertyKey)) {
                        setValue(templateNode, propertyKey as unknown as 'value', value);
                    }
                    continue;
                }

                if (propertyKey === 'style') {
                    const style = (templateNode as HTMLElement).style;
                    const newStyles = (properties.style = convertStyles(value as string));
                    for (const propertyKey in oldValue as Record<string, string>) {
                        if (!(propertyKey in newStyles)) {
                            style.removeProperty(propertyKey);
                        }
                    }
                    for (const propertyKey in newStyles) {
                        style.setProperty(propertyKey, newStyles[propertyKey]);
                    }
                    continue;
                } else if (propertyKey === 'class') {
                    const classList = (templateNode as HTMLElement).classList;
                    const newClasses = (properties.class = convertClasses(value as string));
                    if (oldValue) {
                        for (const className in oldValue) {
                            if (!newClasses[className]) {
                                classList.remove(className);
                            }
                        }
                    }
                    for (const className in newClasses) {
                        if (newClasses[className] && !classList.contains(className)) {
                            classList.add(className);
                        }
                    }
                    continue;
                } else if (isListenerProperty(propertyKey) && !(propertyKey in templateNode.constructor.prototype)) {
                    const eventName = propertyKey.substring(2);
                    if (oldValue) {
                        (templateNode as HTMLElement).removeEventListener(eventName, oldValue as EventListener);
                    }
                    if (value) {
                        (templateNode as HTMLElement).addEventListener(eventName, value as EventListener);
                    }
                    continue;
                }

                const type = typeof value;
                const wasType = typeof oldValue;
                const isReference = (value && type === 'object') || type === 'function';
                const wasReference = (oldValue && wasType === 'object') || wasType === 'function';

                if (isReference || wasReference || isRenderingInput(templateNode, propertyKey)) {
                    setValue(templateNode, propertyKey, value);
                } else if (isVComponent(template)) {
                    if (type === 'string') {
                        const observedAttributes = template.type.observedAttributes;
                        if (!observedAttributes || observedAttributes.indexOf(propertyKey) === -1) {
                            const descriptor =
                                propertyKey in templateNode && getPropertyDescriptor(templateNode, propertyKey);
                            if (!descriptor || !descriptor.get || descriptor.set) {
                                setValue(templateNode, propertyKey, value);
                            }
                        } else {
                            const property = getProperty(
                                templateNode as ComponentInstance,
                                propertyKey as keyof Props<ComponentInstance>
                            );
                            if (property && property.fromAttribute) {
                                setValue(
                                    templateNode,
                                    propertyKey,
                                    (property.fromAttribute as Function).call(templateNode, value as string)
                                );
                            }
                        }
                    } else {
                        setValue(templateNode, propertyKey, value);
                    }
                }

                if (value == null || value === false) {
                    if ((templateNode as HTMLElement).hasAttribute(propertyKey)) {
                        (templateNode as HTMLElement).removeAttribute(propertyKey);
                    }
                } else if (!isReference) {
                    const attrValue = value === true ? '' : (value as string).toString();
                    if ((templateNode as HTMLElement).getAttribute(propertyKey) !== attrValue) {
                        (templateNode as HTMLElement).setAttribute(propertyKey, attrValue);
                    }
                }
            }
        }

        templateChildren = children;
    } else if (isObject && isThenable(template)) {
        return renderTemplate(
            context,
            rootContext,
            h((props, context) => {
                const status = getThenableState(template as Promise<unknown>);
                if (status.pending) {
                    (template as Promise<unknown>)
                        .catch(() => 1)
                        .then(() => {
                            context.requestUpdate();
                        });
                }
                return status.result as Template;
            }, null),
            realm
        );
    } else if (isObject && isObservable(template)) {
        const observable = template;
        return renderTemplate(
            context,
            rootContext,
            h((props, context) => {
                const status = getObservableState(observable);
                if (!status.complete) {
                    const subscription = observable.subscribe(
                        () => {
                            if (!context.requestUpdate()) {
                                subscription.unsubscribe();
                            }
                        },
                        () => {
                            if (!context.requestUpdate()) {
                                subscription.unsubscribe();
                            }
                        },
                        () => {
                            subscription.unsubscribe();
                        }
                    );
                }
                return status.current as Template;
            }, null),
            realm
        );
    } else if (isObject && isNode(template)) {
        templateContext =
            templateContext || getChildNodeContext(context, template) || createContext(template, rootContext);
    } else {
        if (
            typeof template === 'string' &&
            isComponent(rootContext.node) &&
            (context.node as HTMLElement).tagName === 'STYLE'
        ) {
            template = css(rootContext.node.is, template as string);
        }

        let currentContext: Context | null;
        if (
            (currentContext = getCurrentContext(context)) &&
            isText(currentContext.node) &&
            currentContext.owner === rootContext
        ) {
            templateContext = currentContext;
            if (templateContext.node.textContent != template) {
                templateContext.node.textContent = template as string;
            }
        } else {
            // convert non-Node template into Text
            templateContext = createContext(document.createTextNode(template as string), rootContext, rootContext);
        }
    }

    if (!templateContext) {
        return 0;
    }

    // now, we are confident that the input is a Node,
    if (context.children.indexOf(templateContext) !== -1) {
        // the node is already in the child list
        // remove nodes until the correct instance
        let currentContext: Context | null;
        while ((currentContext = getCurrentContext(context)) && templateContext !== currentContext) {
            context.node.removeChild(currentContext.node);
            context.children.splice(context._pos, 1);
        }
        context._pos++;
    } else {
        // we need to insert the new node into the tree
        context.node.insertBefore(templateContext.node, getCurrentContext(context)?.node);
        context.children.splice(context._pos++, 0, templateContext);
    }

    if (templateContext && isElement(templateContext.node)) {
        if ((templateChildren && templateChildren.length) || templateContext.root === rootContext) {
            internalRender(templateContext, templateChildren, realm, rootContext, templateNamespace);
        }
    }

    return 1;
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
    namespace: string = context.namespace || 'http://www.w3.org/1999/xhtml',
    fragment?: Context
) => {
    const contextChildren = context.children;
    const previousFragment = context.fragment;
    const previousNamespace = context.namespace;
    const previousIndex = context._pos;

    context.namespace = namespace;
    context.fragment = fragment;

    let endContext: Context | undefined;
    if (fragment) {
        context._pos = context.children.indexOf(fragment);
        endContext = fragment.end as Context;
        if (fragment.keys) {
            fragment._keys = fragment.keys;
            fragment._keyed = new Set(fragment.keys.values());
        }
        delete fragment.keys;
    } else {
        context._pos = 0;
        if (context.keys) {
            context._keys = context.keys;
            context._keyed = new Set(context.keys.values());
        }
        delete context.keys;
    }

    renderTemplate(context, rootContext, template, realm);

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

    if (fragment) {
        delete fragment._keys;
        delete fragment._keyed;
        context.fragment = previousFragment;
        context.namespace = previousNamespace;
    } else {
        delete context._keys;
        delete context._keyed;
        context.fragment = previousFragment;
        context.namespace = previousNamespace;
        context._pos = previousIndex;
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
