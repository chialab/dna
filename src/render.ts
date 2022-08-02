import type { VProperties, VClasses, VStyle, Template } from './JSX';
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
import { getHostContext, getContext, getOrCreateHostContext, getOrCreateContext } from './Context';

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
 * @deprecated use compile function instead.
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
 * Cleanup child fragments of a context.
 * @param context The fragment to empty.
 * @returns The cleaned up fragment list.
 */
export const emptyFragments = (context: Context) => {
    const fragments = context.fragments;
    if (fragments) {
        let len = fragments.length;
        while (len--) {
            emptyFragments(fragments.pop() as Context);
        }
    }
};

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
 * Add missing keys to properties object.
 * @param previous The previous object.
 * @param actual The actual one.
 * @returns The merged object.
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
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param root The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param slot Should handle slot children.
 * @param context The render context of the root.
 * @param rootContext The current custom element context of the render.
 * @param namespace The current namespace uri of the render.
 * @param fragment The fragment context to update.
 * @returns The resulting child nodes list.
 */
export const internalRender = (
    root: Node,
    input: Template,
    slot = isComponent(root),
    context: Context,
    rootContext: Context,
    namespace = (root as HTMLElement).namespaceURI || 'http://www.w3.org/1999/xhtml',
    fragment?: Context
) => {
    const childNodes = context.children;
    const oldKeys = context.keys;
    const oldKeyed = oldKeys && new Set(oldKeys.values());
    delete context.keys;

    let currentIndex: number;
    let currentFragment = fragment;
    let lastNode: Node | undefined;
    if (fragment) {
        currentIndex = childNodes.indexOf(fragment.start as Node);
        lastNode = fragment.end as Node;
    } else {
        emptyFragments(context);
        currentIndex = 0;
    }

    let currentNode = childNodes[currentIndex];
    let currentContext = currentNode && (getHostContext(currentNode) || getContext(currentNode));

    const handleItems = (template: Template, filter?: Filter): number => {
        if (template == null || template === false) {
            return 0;
        }

        const isObject = typeof template === 'object';
        if (isObject && isArray(template)) {
            let childCount = 0;
            // call the render function for each child
            for (let i = 0, len = template.length; i < len; i++) {
                childCount += handleItems(template[i], filter);
            }
            return childCount;
        }

        let templateNode: Node | undefined;
        let templateContext: Context | undefined;
        let templateChildren: Template[] | undefined;
        let templateNamespace = namespace;

        if (isObject && isVObject(template)) {
            if (isVFragment(template)) {
                return handleItems(template.children, filter);
            }

            if (isVFunction(template)) {
                const { Function, key, properties, children } = template;
                const rootFragment = fragment;
                const previousContext = context;
                const previousFragment = currentFragment;
                const fragments = context.fragments = context.fragments || [];

                let placeholder: Node;
                if (fragment) {
                    placeholder = fragment.start as Node;
                } else if (key && oldKeys && (placeholder = oldKeys.get(key) as Node)) {
                    //
                } else if (key == null && currentContext && currentContext.Function === Function) {
                    placeholder = currentContext.start as Node;
                } else {
                    placeholder = DOM.createComment(Function.name);
                    if (key != null) {
                        context.keys = context.keys || new Map();
                        context.keys.set(key, placeholder);
                    }
                }

                const renderContext = getOrCreateContext(placeholder);
                const isAttached = () => fragments.indexOf(renderContext) !== -1;
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
                        root,
                        template,
                        slot,
                        previousContext,
                        rootContext,
                        namespace,
                        renderContext
                    );
                    return true;
                };
                emptyFragments(renderContext);
                renderContext.Function = Function;
                renderContext.start = placeholder;
                renderContext.store = renderContext.store || new Map();
                context = renderContext;
                currentFragment = renderContext;
                fragment = undefined;

                const childCount = handleItems(
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

                fragment = rootFragment;
                renderContext.end = childNodes[currentIndex - 1];
                context = previousContext;
                currentFragment = previousFragment;

                if (!fragment) {
                    fragments.push(renderContext);
                } else {
                    fragments.splice(fragments.indexOf(fragment), 1, renderContext);
                    fragment = renderContext;
                }

                running = false;
                return childCount;
            }

            // if the current patch is a slot,
            if (isVSlot(template)) {
                const slotChildNodes = rootContext.children;
                const { properties, children } = template;
                const name = properties.name;
                const filter = (item: Node) => {
                    const slotContext = getHostContext(item) || getContext(item);
                    if (!slotContext || !slotContext.root || slotContext.root === rootContext) {
                        if (isElement(item)) {
                            if (!name) {
                                return !(item as HTMLElement).getAttribute('slot');
                            }

                            return (item as HTMLElement).getAttribute('slot') === name;
                        }
                    }

                    return !name;
                };

                const childCount = handleItems(slotChildNodes, filter);
                if (!childCount) {
                    return handleItems(children);
                }
                return childCount;
            }

            const { key, children, namespace: namespaceURI } = template;
            templateNamespace = namespaceURI || namespace;

            if (key != null) {
                templateNode = oldKeys && oldKeys.get(key) as Node;
            } else if (currentContext && isElement(currentNode) && (!oldKeyed || !oldKeyed.has(currentNode))) {
                if (slot ? currentContext.root === context : !currentContext.root) {
                    if (isVComponent(template) && currentNode.constructor === template.Component) {
                        templateNode = currentNode;
                        templateContext = currentContext;
                    } else if (isVTag(template) && currentNode.tagName.toLowerCase() === template.tag.toLowerCase()) {
                        templateNode = currentNode;
                        templateContext = currentContext;
                    }
                }
            }

            if (!templateNode) {
                if (isVNode(template)) {
                    templateNode = template.node;
                } else if (isVComponent(template)) {
                    templateNode = new template.Component();
                } else {
                    templateNode = DOM.createElementNS(templateNamespace, template.tag);
                }
            }

            if (key != null) {
                context.keys = context.keys || new Map();
                context.keys.set(key, templateNode);
            }

            // update the Node properties
            templateContext = templateContext || getHostContext(templateNode) || getOrCreateContext(templateNode);
            const oldProperties = templateContext.properties.get(rootContext) as VProperties<Node> | undefined;
            const properties = (oldProperties ? fillEmptyValues(oldProperties, template.properties) : template.properties) as VProperties<Node>;
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
                    const Component = template.Component;
                    if (type === 'string') {
                        const observedAttributes = Component.observedAttributes;
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
            return handleItems(h((props, context) => {
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
        } else if (isObject && isObservable(template)) {
            const observable = template;
            return handleItems(h((props, context) => {
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
        } else if (isObject && isNode(template)) {
            templateNode = template;
            templateContext = templateContext || getHostContext(templateNode) || getOrCreateContext(templateNode);
        } else {
            if (typeof template === 'string' && rootContext.host && (root as HTMLElement).tagName === 'STYLE') {
                template = css(rootContext.host, template as string, customElements.tagNames[rootContext.host]);
                (root as HTMLStyleElement).setAttribute('name', rootContext.host);
            }

            if (isText(currentNode) && currentContext) {
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

        // now, we are confident that if the input is a Node or a Component,
        // check if Nodes are the same instance
        // (patch result should return same Node instances for compatible types)
        if (currentContext !== templateContext) {
            if (childNodes.indexOf(templateNode) !== -1) {
                while (currentContext && templateContext !== currentContext) {
                    if (slot && currentContext.root === context) {
                        currentContext.root = undefined;
                    }
                    DOM.removeChild(root, currentNode, slot);
                    currentNode = childNodes[currentIndex];
                    currentContext = currentNode && (getHostContext(currentNode) || getContext(currentNode));
                }

                currentNode = childNodes[++currentIndex];
                currentContext = currentNode && (getHostContext(currentNode) || getContext(currentNode));
            } else {
                // they are different, so we need to insert the new Node into the tree
                // if current iterator is defined, insert the Node before it
                // otherwise append the new Node at the end of the parent
                if (slot && !templateContext.root) {
                    templateContext.root = context;
                }
                DOM.insertBefore(root, templateNode, currentNode, slot);
                currentIndex++;
            }
        } else {
            currentNode = childNodes[++currentIndex];
            currentContext = currentNode && (getHostContext(currentNode) || getContext(currentNode));
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
                rootContext,
                templateNamespace
            );
        }

        return 1;
    };

    handleItems(input);

    // all children of the root have been handled,
    // we can start to cleanup the tree
    // remove all Nodes that are outside the result range
    let lastIndex: number;
    if (lastNode) {
        lastIndex = childNodes.indexOf(lastNode) + 1;
    } else {
        lastIndex = childNodes.length;
    }
    while (currentIndex < lastIndex) {
        const node = childNodes[--lastIndex];
        const context = getOrCreateContext(node);
        emptyFragments(context);
        if (slot && context.root === context) {
            context.root = undefined;
        }
        DOM.removeChild(root, node, slot);
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
        isComponentRoot ? getHostContext(root) as Context : getOrCreateContext(root)
    );
    if (childNodes.length < 2) {
        return childNodes[0];
    }
    return childNodes;
};
