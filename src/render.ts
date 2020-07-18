import { isComponent } from './Interfaces';
import { Template, TemplateItem, TemplateItems, TemplateFilter } from './Template';
import { isHyperNode } from './HyperNode';
import { DOM, isElement, isText, getAttributeImpl, hasAttributeImpl } from './DOM';
import { Context, getContext, createContext } from './Context';
import { isThenable, getThenableState, abort } from './Thenable';
import { Subscription, isObservable, getObservableState } from './Observable';
import { isArray } from './helpers';
import { cloneChildNodes, IterableNodeList } from './NodeList';
import { css } from './css';

/**
 * A cache for converted class values.
 */
const CLASSES_CACHE: { [key: string]: string[] } = {};

/**
 * A cache for converted style values.
 */
const STYLES_CACHE: { [key: string]: { [key: string]: any } } = {};

/**
 * Convert strings or classes map to a list of classes.
 * @param value The value to convert.
 * @return A list of classes.
 */
const convertClasses = (value: any) => {
    let classes: string[] = [];
    if (!value) {
        return classes;
    }
    if (typeof value === 'object') {
        for (let k in value) {
            if (value[k]) {
                classes.push(k);
            }
        }
        return classes;
    }
    return classes = CLASSES_CACHE[value] = CLASSES_CACHE[value] || value.toString().trim().split(' ');
};

/**
 * Convert strings or styles map to a list of styles.
 * @param value The value to convert.
 * @return A set of styles.
 */
const convertStyles = (value: any) => {
    let styles: { [key: string]: string } = {};
    if (!value) {
        return styles;
    }
    if (typeof value === 'object') {
        for (let propertyKey in value) {
            let camelName = propertyKey.replace(/[A-Z]/g, (match: string) =>
                `-${match.toLowerCase()}`
            );
            styles[camelName] = value[propertyKey];
        }
        return styles;
    }
    return styles = STYLES_CACHE[value] = STYLES_CACHE[value] || value
        .toString()
        .split(';')
        .reduce((ruleMap: { [key: string]: string }, ruleString: string) => {
            let rulePair = ruleString.split(':');
            if (rulePair.length == 2) {
                ruleMap[rulePair[0].trim()] = rulePair[1].trim();
            }
            return ruleMap;
        }, styles);
};

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param root The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param context The render context of the root.
 * @param rootContext The render context of the main render.
 * @param rootNamespaceURI The current namespace uri of the render.
 * @param slot Should handle slot children.
 * @return The resulting child nodes list.
 */
export const internalRender = (
    root: HTMLElement,
    input: Template,
    context?: Context,
    rootContext?: Context,
    rootNamespaceURI = root.namespaceURI || 'http://www.w3.org/1999/xhtml',
    slot = false) => {
    let renderContext = context || getContext(root) || createContext(root);
    let rootRenderContext = rootContext || renderContext;
    let childNodes: IterableNodeList;
    if (slot) {
        childNodes = renderContext.slotChildNodes as IterableNodeList;
    } else {
        childNodes = renderContext.childNodes as IterableNodeList;
    }
    let currentIndex = 0;
    let currentNode = childNodes.item(currentIndex) as Node;
    let currentContext = currentNode ? (getContext(currentNode) || createContext(currentNode)) : null;
    let updateRender = () => internalRender(root, input, renderContext, rootRenderContext, rootNamespaceURI, slot);

    // promises list
    let oldKeys: string[]|undefined;
    let oldPromises: Promise<any>[]|undefined;
    let oldSubscriptions: Subscription[]|undefined;
    let keys = renderContext.keys;
    let promises = renderContext.promises;
    let subscriptions = renderContext.subscriptions;
    let rootPromises = rootRenderContext.promises;
    let rootSubscriptions = rootRenderContext.subscriptions;
    if (keys) {
        oldKeys = [];
        while (keys.length) oldKeys.unshift(keys.pop());
    }
    if (promises) {
        oldPromises = [];
        while (promises.length) oldPromises.unshift(promises.pop() as Promise<any>);
    }
    if (subscriptions) {
        oldSubscriptions = [];
        while (subscriptions.length) oldSubscriptions.unshift(subscriptions.pop() as Subscription);
    }

    const handleItems = (template: Template, filter?: TemplateFilter) => {
        if (template == null || template === false) {
            return;
        }

        let templateType = typeof template;
        let isObjectTemplate = templateType === 'object';
        let templateNode: Element | Text | undefined;
        let templateContext: Context|undefined;
        let templateChildren: TemplateItems | undefined;
        let templateNamespace = rootNamespaceURI;
        let isElementTemplate = false;
        let isComponentTemplate = false;

        if (isObjectTemplate && isArray(template)) {
            // call the render function for each child
            for (let i = 0, len = template.length; i < len; i++) {
                handleItems(template[i], filter);
            }
            return;
        } else if (isObjectTemplate && isHyperNode(template)) {
            let { Component, Function, tag, properties, children, key, isFragment, isSlot, namespaceURI } = template;

            if (Function) {
                handleItems(Function({
                    children,
                    ...properties,
                }, renderContext, updateRender), filter);
                return;
            }

            if (isFragment) {
                handleItems(children, filter);
                return;
            }

            // if the current patch is a slot,
            if (isSlot) {
                let slottedChildren: Node[] = rootRenderContext.slotChildNodes || [];
                let filter;
                if (properties.name) {
                    filter = (item: TemplateItem) => {
                        if (isElement(item)) {
                            return getAttributeImpl.call(item, 'slot') === properties.name;
                        }
                        return false;
                    };
                } else {
                    filter = (item: TemplateItem) => {
                        if (isElement(item)) {
                            return !getAttributeImpl.call(item, 'slot');
                        }
                        return true;
                    };
                }

                handleItems(slottedChildren, filter);
                return;
            }

            templateNamespace = namespaceURI || rootNamespaceURI;

            check_key: if (currentContext) {
                let currentKey = currentContext.key;
                if (currentKey != null && key != null && key !== currentKey) {
                    DOM.removeChild(root, currentNode, slot);
                    currentNode = childNodes.item(currentIndex) as Node;
                    currentContext = currentNode ? (getContext(currentNode) || createContext(currentNode)) : null;
                    if (!currentContext) {
                        break check_key;
                    }
                    currentKey = currentContext.key;
                }
                if (key != null || currentKey != null) {
                    if (key === currentKey) {
                        isElementTemplate = true;
                        templateNode = currentNode as Element;
                        templateContext = currentContext;
                        isComponentTemplate = !!Component && isComponent(templateNode);
                    }
                } else if (Component && currentNode instanceof Component) {
                    isElementTemplate = true;
                    isComponentTemplate = isComponent(currentNode);
                    templateNode = currentNode;
                    templateContext = currentContext;
                } else if (tag && currentContext.tagName === tag) {
                    isElementTemplate = true;
                    templateNode = currentNode as Element;
                    templateContext = currentContext;
                }
            }

            if (!templateNode) {
                isElementTemplate = true;

                if (Component) {
                    templateNode = new Component();
                    isComponentTemplate = isComponent(templateNode);
                } else {
                    templateNode = DOM.createElementNS(templateNamespace, tag as string);
                }
            }

            // update the Node properties
            templateContext = templateContext || getContext(templateNode) || createContext(templateNode as HTMLElement);
            let childProperties = templateContext.props;
            templateContext.props = properties;

            if (key) {
                templateContext.key = key;
                if (keys) {
                    keys.push(key);
                } else {
                    keys = renderContext.keys = [key];
                }
                Object.defineProperty(rootRenderContext, key, {
                    configurable: true,
                    writable: false,
                    value: templateNode,
                });
            }

            if (childProperties) {
                for (let propertyKey in childProperties) {
                    if (!(propertyKey in properties)) {
                        properties[propertyKey] = null;
                    }
                }
            }

            for (let propertyKey in properties) {
                if (propertyKey === 'is' || propertyKey === 'key') {
                    continue;
                }
                let value = properties[propertyKey];
                let oldValue;
                if (childProperties) {
                    oldValue = childProperties[propertyKey];
                    if (oldValue === value) {
                        continue;
                    }
                }

                if (propertyKey === 'style') {
                    let style = (templateNode as HTMLElement).style;
                    let oldStyles = convertStyles(oldValue);
                    let newStyles = convertStyles(value);
                    for (let propertyKey in oldStyles) {
                        if (!(propertyKey in newStyles)) {
                            style.removeProperty(propertyKey);
                        }
                    }
                    for (let propertyKey in newStyles) {
                        style.setProperty(propertyKey, newStyles[propertyKey]);
                    }
                    continue;
                } else if (propertyKey === 'class') {
                    let classList = (templateNode as HTMLElement).classList;
                    let newClasses: string[] = convertClasses(value);
                    if (oldValue) {
                        let oldClasses: string[] = convertClasses(oldValue);
                        oldClasses.forEach((className: string) => {
                            if (newClasses.indexOf(className) === -1) {
                                classList.remove(className);
                            }
                        });
                    }
                    newClasses.forEach((className: string) => {
                        if (!classList.contains(className)) {
                            classList.add(className);
                        }
                    });
                    continue;
                }

                let type = typeof value;
                let isReference = (value && type === 'object') || type === 'function';

                if (isReference || Component) {
                    (templateNode as any)[propertyKey] = value;
                }

                if (value == null || value === false) {
                    if (hasAttributeImpl.call(templateNode as Element, propertyKey)) {
                        DOM.removeAttribute(templateNode as Element, propertyKey);
                    }
                } else if (!isReference) {
                    let attrValue = value === true ? '' : value.toString();
                    if (getAttributeImpl.call(templateNode as Element, propertyKey) !== attrValue) {
                        DOM.setAttribute(templateNode as Element, propertyKey, attrValue);
                    }
                }
            }

            templateChildren = children;
        } else if (isObjectTemplate && isElement(template)) {
            templateNode = template;
            isElementTemplate = true;
            isComponentTemplate = isComponent(templateNode);
        } else if (isObjectTemplate && isText(template)) {
            templateNode = template;
        } else if (isObjectTemplate && isThenable(template)) {
            let status = getThenableState(template);
            if (status.pending) {
                if (promises) {
                    promises.push(template);
                } else {
                    promises = renderContext.promises = [template];
                }
                template
                    .catch(() => 1)
                    .then(() => {
                        if (!status.aborted && (rootPromises as Promise<any>[]).indexOf(template as Promise<unknown>) !== -1) {
                            updateRender();
                        }
                    });
            }
            handleItems(status.result, filter);
            return;
        } else if (isObjectTemplate && isObservable(template)) {
            let status = getObservableState(template);
            if (!status.complete) {
                let subscription = template.subscribe(
                    () => updateRender(),
                    () => updateRender(),
                    () => {
                        subscription.unsubscribe();
                    }
                );
                if (subscriptions) {
                    subscriptions.push(subscription);
                } else {
                    subscriptions = renderContext.subscriptions = [subscription];
                }
            }
            handleItems(status.current, filter);
            return;
        } else {
            if (templateType === 'string' && rootRenderContext.is && renderContext.tagName === 'style') {
                template = css(rootRenderContext.is as string, template as string);
                root.setAttribute('name', rootRenderContext.is);
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
            currentContext = currentNode ? (getContext(currentNode) || createContext(currentNode)) : null;
        }

        if (isElementTemplate && templateChildren) {
            // the Node has slotted children, trigger a new render context for them
            internalRender(
                templateNode as HTMLElement,
                templateChildren,
                templateContext,
                rootRenderContext,
                templateNamespace,
                isComponentTemplate
            );
        }
    };

    handleItems(input);

    if (oldKeys) {
        for (let i = 0, len = oldKeys.length; i < len; i++) {
            let key = oldKeys[i];
            if ((keys as string[]).indexOf(key) === -1) {
                delete rootRenderContext[key];
            }
        }
    }

    if (oldPromises) {
        for (let i = 0, len = oldPromises.length; i < len; i++) {
            let promise = oldPromises[i];
            if ((promises as Promise<any>[]).indexOf(promise) === -1) {
                abort(promise);
                let io = (rootPromises as Promise<any>[]).indexOf(promise);
                if (io !== -1) {
                    (rootPromises as Promise<any>[]).splice(io, 1);
                }
            }
        }
    }
    if (promises && promises !== rootPromises) {
        if (!rootPromises) {
            rootPromises = rootRenderContext.promises = [];
        }
        for (let i = 0, len = promises.length; i < len; i++) {
            let promise = promises[i];
            rootPromises.push(promise);
        }
    }

    if (oldSubscriptions) {
        for (let i = 0, len = oldSubscriptions.length; i < len; i++) {
            let subscription = oldSubscriptions[i];
            if ((subscriptions as Subscription[]).indexOf(subscription) === -1) {
                subscription.unsubscribe();
                let io = (rootSubscriptions as Subscription[]).indexOf(subscription);
                if (io !== -1) {
                    (rootSubscriptions as Subscription[]).splice(io, 1);
                }
            }
        }
    }
    if (subscriptions && subscriptions !== rootSubscriptions) {
        if (!rootSubscriptions) {
            rootSubscriptions = rootRenderContext.subscriptions = [];
        }
        for (let i = 0, len = subscriptions.length; i < len; i++) {
            let subscription = subscriptions[i];
            rootSubscriptions.push(subscription);
        }
    }

    // all children of the root have been handled,
    // we can start to cleanup the tree
    // remove all Nodes that are outside the result range
    while (currentNode) {
        DOM.removeChild(root, currentNode, slot);
        currentNode = childNodes.item(currentIndex) as Node;
    }
    return childNodes;
};

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param root The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @return The resulting child Nodes.
 */
export const render = (root: HTMLElement, input: Template): Node | Node[] | void => {
    let childNodes = internalRender(root, input);
    if (childNodes.length < 2) {
        return childNodes[0];
    }
    return cloneChildNodes(childNodes);
};

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 * It await pending rendering promises.
 *
 * @param root The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @return The resulting child Nodes.
 */
export const renderAsync = async (root: HTMLElement, input: Template): Promise<Node | Node[] | void> => {
    let rootContext = getContext(root) || createContext(root);
    let result = render(root, input);
    let promises: Promise<any>[] = rootContext.promises || [];
    while (promises.length) {
        await Promise.all(promises);
    }
    return result;
};
