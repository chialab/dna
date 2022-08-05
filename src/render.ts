import type { VClasses, VStyle, Template } from './JSX';
import type { ComponentInstance } from './Component';
import type { Store, UpdateRequest } from './FunctionComponent';
import type { Context } from './Context';
import htm from 'htm';
import { isNode, isElement, isText, isArray, getPropertyDescriptor } from './helpers';
import { h, isVFragment, isVObject, isVTag, isVComponent, isVSlot, isVFunction, isVNode } from './JSX';
import { customElements } from './CustomElementRegistry';
import { isComponent } from './Component';
import { DOM } from './DOM';
import { isThenable, getThenableState } from './Thenable';
import { isObservable, getObservableState } from './Observable';
import { css } from './css';
import { getProperty } from './property';
import { getHostContext, getContext, getOrCreateContext } from './Context';

const innerHtml = htm.bind(h);

/**
 * Compile a string into virtual DOM template.
 * @param string The string to compile.
 * @returns The virtual DOM template.
 */
export const compile = (string: string): Template => {
    const array = [string] as string[] & { raw?: string[] };
    array.raw = [string];
    return innerHtml(array as unknown as TemplateStringsArray);
};

function html(string: TemplateStringsArray, ...values: unknown[]): Template;
/**
 * @deprecated use `compile` function instead.
 */
function html(string: string): Template;
/**
 * Compile a template string into virtual DOM template.
 * @param string The string to compile.
 * @param values Values to interpolate.
 * @returns The virtual DOM template.
 */
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
* @returns A truthy value for valid items, a falsy for value for invalid ones.
*/
export type Filter = (item: Node) => boolean;

/**
 * Convert strings or classes map to a list of classes.
 * @param value The value to convert.
 * @returns A list of classes.
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
    return value.toString().trim().split(' ');
};

/**
 * Convert strings or styles map to a list of styles.
 * @param value The value to convert.
 * @returns A set of styles.
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
    (propertyKey === 'checked' || propertyKey === 'value') &&
    (element as HTMLElement).tagName === 'INPUT';

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
const isListenerProperty = (propertyKey: string): propertyKey is `on${string}` => propertyKey[0] === 'o' && propertyKey[1] === 'n';

/**
 * Get the current iterating node in rendering context.
 * @param context The rendering context.
 * @returns A node instance or null.
 */
const getCurrentNode = (context: Context) => (context.children[context.currentIndex as number] || null);

/**
 * Get the current iterating context in rendering context.
 * @param context The rendering context.
 * @returns A context or null.
 */
const getCurrentContext = (context: Context) => {
    const currentNode = getCurrentNode(context);
    if (!currentNode) {
        return null;
    }
    return getHostContext(currentNode) || getContext(currentNode) || null;
};

/**
 * Get a keyed node in the rendering context.
 * @param context The rendering context.
 * @param key The key to find.
 * @returns A node instance or null.
 */
const getKeyedNode = (context: Context, key: unknown) => {
    context = context.fragment || context;
    return context.oldKeys && context.oldKeys.get(key) || null;
};

/**
 * Check if a node instance is keyed in the rendering context.
 * @param context The rendering context.
 * @param node The node to check.
 * @returns True if keyed, false otherwise.
 */
const hasKeyedNode = (context: Context, node: Node) => {
    context = context.fragment || context;
    return context.oldKeyed ? context.oldKeyed.has(node) : null;
};

/**
 * Add keyed node to rendering context.
 * @param context The rendering context.
 * @param node The node to add.
 * @param key The key to add.
 */
const addKeyedNode = (context: Context, node: Node, key: unknown) => {
    context = context.fragment || context;
    context.keys = context.keys || new Map();
    context.keys.set(key, node);
};

/**
 * Render a a template into the root.
 * @param parent The root Node for the render.
 * @param slot Should handle slot children.
 * @param context The render context of the root.
 * @param root The render root.
 * @param rootContext The render root context.
 * @param template The template to render in Virtual DOM format.
 * @param filter The filter function for slotted nodes.
 * @returns The count of rendered children.
 */
const renderTemplate = (
    parent: Node,
    slot: boolean,
    context: Context,
    root: Node,
    rootContext: Context,
    template: Template,
    filter?: Filter
): number => {
    if (template == null || template === false) {
        return 0;
    }

    const isObject = typeof template === 'object';
    if (isObject && isArray(template)) {
        let childCount = 0;
        // call the render function for each child
        for (let i = 0, len = template.length; i < len; i++) {
            childCount += renderTemplate(
                parent,
                slot,
                context,
                root,
                rootContext,
                template[i],
                filter
            );
        }
        return childCount;
    }

    let templateNode: Node | undefined;
    let templateContext: Context | undefined;
    let templateChildren: Template[] | undefined;
    let templateNamespace = context.namespace as string;

    if (isObject && isVObject(template)) {
        if (isVFragment(template)) {
            return renderTemplate(
                parent,
                slot,
                context,
                root,
                rootContext,
                template.children,
                filter
            );
        }

        if (isVFunction(template)) {
            const { type: Function, key, properties, children } = template;
            const rootFragment = context.fragment;

            let placeholder: Node;
            let renderContext: Context;
            if (rootFragment) {
                placeholder = rootFragment.start as Node;
                renderContext = (getHostContext(placeholder) || getContext(placeholder)) as Context;
            } else if (key && (placeholder = getKeyedNode(context, key) as Node)) {
                renderContext = getOrCreateContext(placeholder);
            } else if (key == null
                && (renderContext = getCurrentContext(context) as Context)
                && (placeholder = getCurrentNode(context))
                && renderContext.Function === Function
                && !hasKeyedNode(context, placeholder)
            ) {
                //
            } else {
                placeholder = DOM.createComment(Function.name);
                renderContext = getOrCreateContext(placeholder);
                if (key != null) {
                    addKeyedNode(context, placeholder, key);
                }
            }

            const isAttached = () => context.children.indexOf(placeholder) !== -1;
            let running = true;
            const requestUpdate: UpdateRequest = renderContext.requestUpdate = () => {
                if (renderContext.requestUpdate !== requestUpdate) {
                    return (renderContext.requestUpdate as UpdateRequest)();
                }
                if (running) {
                    throw new Error('An update request is already running');
                }
                if (!isAttached()) {
                    return false;
                }
                internalRender(
                    parent,
                    template,
                    slot,
                    context,
                    root,
                    rootContext,
                    context.namespace,
                    renderContext
                );
                return true;
            };
            renderContext.Function = Function;
            renderContext.start = placeholder;
            renderContext.store = renderContext.store || new Map();
            context.fragment = undefined;

            const childCount = renderTemplate(
                parent,
                slot,
                context,
                root,
                rootContext,
                [
                    placeholder,
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
                ],
                filter
            );

            context.fragment = rootFragment;
            renderContext.end = context.children[context.currentIndex as number - 1];

            running = false;
            return childCount;
        }

        // if the current patch is a slot,
        if (isVSlot(template)) {
            const hostContext = getHostContext(root);
            if (!hostContext) {
                return 0;
            }
            const slotted = hostContext.children;
            const { properties, children } = template;
            const name = properties.name;
            const filter = (item: Node) => {
                const slotContext = getHostContext(item) || getContext(item);
                if (!slotContext || !slotContext.root || slotContext.root === root) {
                    if (isElement(item)) {
                        if (!name) {
                            return !(item as HTMLElement).getAttribute('slot');
                        }

                        return (item as HTMLElement).getAttribute('slot') === name;
                    }
                }

                return !name;
            };

            const childCount = renderTemplate(
                parent,
                slot,
                context,
                root,
                rootContext,
                slotted,
                filter
            );
            if (!childCount) {
                return renderTemplate(
                    parent,
                    slot,
                    context,
                    root,
                    rootContext,
                    children
                );
            }
            return childCount;
        }

        const { key, children, namespace: namespaceURI } = template;
        templateNamespace = namespaceURI || context.namespace as string;

        let currentNode: Node | null;
        let currentContext: Context | null;
        if (key != null) {
            templateNode = getKeyedNode(context, key) as Node;
        } else if ((currentNode = getCurrentNode(context))
            && (currentContext = getCurrentContext(context))
            && isElement(currentNode)
            && !hasKeyedNode(context, currentNode)
        ) {
            if (slot ? currentContext.root === parent : !currentContext.root) {
                if (isVComponent(template) && currentNode.constructor === template.type) {
                    templateNode = currentNode;
                    templateContext = currentContext;
                } else if (isVTag(template) && currentNode.tagName.toLowerCase() === template.type.toLowerCase()) {
                    templateNode = currentNode;
                    templateContext = currentContext;
                }
            }
        }

        if (!templateNode) {
            if (isVNode(template)) {
                templateNode = template.type;
            } else if (isVComponent(template)) {
                templateNode = new template.type();
            } else {
                templateNode = DOM.createElementNS(templateNamespace, template.type);
            }
        }

        if (key != null) {
            addKeyedNode(context, templateNode, key);
        }

        // update the Node properties
        templateContext = templateContext || getHostContext(templateNode) || getOrCreateContext(templateNode);
        const oldProperties = templateContext.properties.get(rootContext);
        const properties = template.properties;
        if (oldProperties) {
            for (const key in oldProperties) {
                if (!(key in properties)) {
                    properties[key as keyof typeof properties] = undefined;
                }
            }
        }
        templateContext.properties.set(rootContext, properties);

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
                const oldStyles = convertStyles(oldValue as VStyle);
                const newStyles = convertStyles(value as VStyle);
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
                const classList = (templateNode as HTMLElement).classList;
                const newClasses = convertClasses(value as VClasses);
                if (oldValue) {
                    const oldClasses = convertClasses(oldValue as VClasses);
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
            } else if (isListenerProperty(propertyKey) && !(propertyKey in templateNode.constructor.prototype)) {
                const eventName = propertyKey.substr(2);
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
                        const descriptor = (propertyKey in templateNode) && getPropertyDescriptor(templateNode, propertyKey);
                        if (!descriptor || !descriptor.get || descriptor.set) {
                            setValue(templateNode, propertyKey, value);
                        }
                    } else {
                        const property = getProperty(templateNode as ComponentInstance, propertyKey as keyof ComponentInstance);
                        if (property && property.fromAttribute) {
                            setValue(templateNode, propertyKey, (property.fromAttribute as Function).call(templateNode, value as string));
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

        templateChildren = children;
    } else if (isObject && isThenable(template)) {
        return renderTemplate(
            parent,
            slot,
            context,
            root,
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
            filter
        );
    } else if (isObject && isObservable(template)) {
        const observable = template;
        return renderTemplate(
            parent,
            slot,
            context,
            root,
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
            filter
        );
    } else if (isObject && isNode(template)) {
        templateNode = template;
        templateContext = templateContext || getHostContext(templateNode) || getOrCreateContext(templateNode);
    } else {
        const hostContext = getHostContext(root);
        if (typeof template === 'string' && hostContext && hostContext.host && (parent as HTMLElement).tagName === 'STYLE') {
            template = css(hostContext.host, template as string, customElements.tagNames[hostContext.host]);
            (parent as HTMLStyleElement).setAttribute('name', hostContext.host);
        }

        let currentNode: Node;
        let currentContext: Context | null;
        if ((currentNode = getCurrentNode(context))
            && (currentContext = getCurrentContext(context))
            && isText(currentNode)
        ) {
            templateNode = currentNode;
            templateContext = currentContext;
            if (templateNode.textContent != template) {
                templateNode.textContent = template as string;
            }
        } else {
            // convert non-Node template into Text
            templateNode = DOM.createTextNode(template as string);
            templateContext = getOrCreateContext(templateNode);
        }
    }

    if (!templateNode || !templateContext || (filter && !filter(templateNode))) {
        return 0;
    }

    // now, we are confident that the input is a Node,
    if (context.children.indexOf(templateNode) !== -1) {
        // the node is already in the child list
        // remove nodes until the correct instance
        let currentContext: Context | null;
        while ((currentContext = getCurrentContext(context)) && (templateContext !== currentContext)) {
            DOM.removeChild(parent, getCurrentNode(context), slot);
        }

        (context.currentIndex as number)++;
    } else {
        // we need to insert the new node into the tree
        DOM.insertBefore(parent, templateNode, getCurrentNode(context), slot);
        (context.currentIndex as number)++;
    }

    if (templateNode &&
        templateContext &&
        isElement(templateNode) &&
        templateChildren &&
        templateChildren.length) {
        // the Node has slotted children, trigger a new render context for them
        internalRender(
            templateNode,
            templateChildren,
            isComponent(templateNode),
            templateContext,
            root,
            rootContext,
            templateNamespace
        );
    }

    return 1;
};

/**
 * Render a set of nodes into the render root, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param parent The root Node for the render.
 * @param template The child (or the children) to render in Virtual DOM format or already generated.
 * @param slot Should handle slot children.
 * @param context The render context of the root.
 * @param root The current root node of the render.
 * @param rootContext The current root context of the render.
 * @param namespace The current namespace uri of the render.
 * @param fragment The fragment context to update.
 * @returns The resulting child nodes list.
 */
export const internalRender = (
    parent: Node,
    template: Template,
    slot = isComponent(parent),
    context: Context,
    root: Node,
    rootContext: Context = context,
    namespace: string = (parent as HTMLElement).namespaceURI || 'http://www.w3.org/1999/xhtml',
    fragment?: Context
) => {
    const childNodes = context.children;
    const previousFragment = context.fragment;
    const previousNamespace = context.namespace;
    const previousIndex = context.currentIndex;

    context.namespace = namespace;
    context.fragment = fragment;

    let lastNode: Node | undefined;
    if (fragment) {
        context.currentIndex = context.children.indexOf(fragment.start as Node);
        lastNode = fragment.end as Node;
        if (fragment.keys) {
            fragment.oldKeys = fragment.keys;
            fragment.oldKeyed = new Set(fragment.keys.values());
        }
        delete fragment.keys;
    } else {
        context.currentIndex = 0;
        if (context.keys) {
            context.oldKeys = context.keys;
            context.oldKeyed = new Set(context.keys.values());
        }
        delete context.keys;
    }

    renderTemplate(
        parent,
        slot,
        context,
        root,
        rootContext,
        template
    );

    // all children of the root have been handled,
    // we can start to cleanup the tree
    // remove all Nodes that are outside the result range
    const currentIndex = context.currentIndex as number;
    let lastIndex: number;
    if (lastNode) {
        lastIndex = childNodes.indexOf(lastNode) + 1;
    } else {
        lastIndex = childNodes.length;
    }
    while (currentIndex < lastIndex) {
        DOM.removeChild(parent, childNodes[--lastIndex], slot);
    }

    if (fragment) {
        delete fragment.oldKeys;
        delete fragment.oldKeyed;
        context.fragment = previousFragment;
        context.namespace = previousNamespace;
    } else {
        delete context.oldKeys;
        delete context.oldKeyed;
        context.fragment = previousFragment;
        context.namespace = previousNamespace;
        context.currentIndex = previousIndex;
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
 * @returns The resulting child Nodes.
 */
export const render = (input: Template, root: Node = DOM.createDocumentFragment(), slot: boolean = true): Node | Node[] | void => {
    const isComponentRoot = isComponent(root);
    const childNodes = internalRender(
        root,
        input,
        slot && isComponentRoot,
        slot && isComponentRoot ? getHostContext(root) as Context : getOrCreateContext(root),
        root
    );
    if (!isArray(input) && !(input != null && isVObject(input) && isVFragment(input)) && childNodes.length < 2) {
        return childNodes[0];
    }
    return childNodes.slice(0);
};
