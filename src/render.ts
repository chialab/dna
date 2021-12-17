import type { IterableNodeList } from './helpers';
import type { VProperties, VClasses, VStyle, Template } from './JSX';
import type { ComponentInstance } from './Component';
import type { UpdateRequest } from './FunctionComponent';
import type { Keyed, Context } from './Context';
import htm from 'htm';
import { isNode, isElement, isArray, indexOf, contains, cloneChildNodes, getPropertyDescriptor } from './helpers';
import { h, isVFragment, isVObject, isVTag, isVComponent, isVSlot, isVFunction, isVNode } from './JSX';
import { isComponent } from './Component';
import { customElements } from './CustomElementRegistry';
import { DOM } from './DOM';
import { isThenable, getThenableState } from './Thenable';
import { isObservable, getObservableState } from './Observable';
import { css } from './css';
import { getProperty } from './property';
import { getOrCreateContext, getContextProperties, setContextProperties } from './Context';

const innerHtml = htm.bind(h);

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
 * @param rootContext The current custom element context of the render.
 * @param namespace The current namespace uri of the render.
 * @param fragment The fragment context to update.
 * @return The resulting child nodes list.
 */
export const internalRender = (
    root: Node,
    input: Template,
    slot = isComponent(root),
    context: Context = getOrCreateContext(root),
    rootContext: Context = (isComponent(root) ? getOrCreateContext(root) : context) as Context,
    namespace = (root as Element).namespaceURI || 'http://www.w3.org/1999/xhtml',
    fragment?: Context
) => {
    let childNodes: IterableNodeList;
    if (slot && (root as ComponentInstance).slotChildNodes) {
        childNodes = (root as ComponentInstance).slotChildNodes as IterableNodeList;
    } else {
        childNodes = context.childNodes || (root.childNodes as unknown as IterableNodeList);
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
        emptyFragments(context);
        currentIndex = 0;
    }
    let currentNode = childNodes.item(currentIndex) as Node;
    let currentContext = currentNode ? getOrCreateContext(currentNode) : null;
    let currentProperties = currentContext ? getContextProperties(currentContext, rootContext, slot) : null;

    const oldKeyed = context.keyed || new Map();
    const keyed: Keyed = context.keyed = new Map();

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
        let templateProperties: VProperties<Node> | undefined;
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
                const previousContext = context;
                const previousFragment = currentFragment;
                const fragments = context.fragments;
                let placeholder: Node;
                if (fragment) {
                    placeholder = fragment.start as Node;
                } else if (currentContext &&
                    currentProperties &&
                    currentContext.Function === Function &&
                    currentProperties.key === key) {
                    placeholder = currentContext.start as Node;
                } else {
                    placeholder = DOM.createComment(Function.name);
                }

                const renderFragmentContext = getOrCreateContext(placeholder);
                const isAttached = contains.bind(null, fragments, renderFragmentContext);
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
                    internalRender(
                        root,
                        template,
                        slot,
                        previousContext,
                        rootContext,
                        namespace,
                        renderFragmentContext
                    );
                    return true;
                };
                emptyFragments(renderFragmentContext);
                renderFragmentContext.Function = Function;
                renderFragmentContext.start = placeholder;
                context = renderFragmentContext;
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
                context = previousContext;
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
                if (rootContext.slotChildNodes) {
                    const { properties, children } = template;
                    const slotChildNodes = rootContext.slotChildNodes;
                    for (let i = 0, len = slotChildNodes.length; i < len; i++) {
                        const node = slotChildNodes.item(i) as Node;
                        const context = getOrCreateContext(node);
                        if (!context.root) {
                            context.root = rootContext;
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
            templateNamespace = namespaceURI || namespace;
            if (currentContext && currentProperties) {
                const currentKey = currentProperties.key;
                if (oldKeyed.has(key)) {
                    templateNode = oldKeyed.get(key) as Node;
                    templateContext = getOrCreateContext(templateNode);
                    templateProperties = getContextProperties(templateContext, rootContext, slot);
                } else if (currentKey != null && currentKey !== key) {
                    //
                } else if (isVComponent(template) && currentNode instanceof template.Component) {
                    templateNode = currentNode;
                    templateContext = currentContext;
                    templateProperties = currentProperties;
                } else if (isVTag(template) && currentContext.tagName === template.tag) {
                    templateNode = currentNode;
                    templateContext = currentContext;
                    templateProperties = currentProperties;
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

            if (key) {
                keyed.set(key, templateNode);
            }

            // update the Node properties
            const templateElement = templateNode as HTMLElement;

            templateContext = templateContext || getOrCreateContext(templateNode);
            templateProperties = templateProperties || getContextProperties(templateContext, rootContext, slot);
            const properties = fillEmptyValues(templateProperties, template.properties);
            setContextProperties(templateContext, rootContext, slot, properties);

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
                const oldValue = templateProperties[propertyKey];
                if (oldValue === value) {
                    if (isRenderingInput(templateElement, propertyKey)) {
                        setValue(templateElement, propertyKey as unknown as 'value', value);
                    }
                    continue;
                }

                if (propertyKey === 'style') {
                    const style = templateElement.style;
                    const oldStyles = convertStyles(templateProperties.style);
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
                        const oldClasses = convertClasses(templateProperties.class);
                        for (let i = 0, len = oldClasses.length; i < len; i++) {
                            const className = oldClasses[i];
                            if (!contains(newClasses, className)) {
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
                        if (!observedAttributes || !contains(observedAttributes, propertyKey)) {
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
            if (typeof template === 'string' && rootContext.is && context.tagName === 'style') {
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
        if (contains(childNodes, templateNode)) {
            while (templateNode !== currentNode) {
                DOM.removeChild(root, currentNode, slot);
                currentNode = childNodes.item(currentIndex) as Node;
            }
            currentNode = childNodes.item(++currentIndex) as Node;
            currentContext = currentNode ? getOrCreateContext(currentNode) : null;
            currentProperties = currentContext ? getContextProperties(currentContext, rootContext, slot) : null;
        } else {
            // they are different, so we need to insert the new Node into the tree
            // if current iterator is defined, insert the Node before it
            // otherwise append the new Node at the end of the parent
            DOM.insertBefore(root, templateNode, currentNode, slot);
            currentIndex++;
        }

        if (isElement(templateNode) &&
            templateChildren &&
            templateContext &&
            templateChildren.length) {
            // the Node has slotted children, trigger a new render context for them
            internalRender(
                templateNode as HTMLElement,
                templateChildren,
                isComponent(templateNode),
                templateContext,
                rootContext,
                templateNamespace
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
