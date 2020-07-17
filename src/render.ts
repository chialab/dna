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
 * @return The resulting child nodes list.
 */
export const internalRender = (
    root: HTMLElement,
    input: Template,
    filter?: TemplateFilter,
    rootContext?: Context,
    rootNamespaceURI = root.namespaceURI || 'http://www.w3.org/1999/xhtml',
    slot = false) => {
    let renderContext = getContext(root) || createContext(root);
    let rootRenderContext = rootContext || renderContext;
    let childNodes: IterableNodeList;
    if (slot) {
        childNodes = renderContext.slotChildNodes as IterableNodeList;
    } else {
        childNodes = renderContext.childNodes;
    }
    let currentIndex = 0;
    let currentNode = childNodes.item(currentIndex) as Node;

    // promises list
    let oldKeys: string[] = [];
    let oldPromises: Promise<any>[] = [];
    let oldSubscriptions: Subscription[] = [];
    let keys = renderContext.keys;
    let promises = renderContext.promises;
    let subscriptions = renderContext.subscriptions;
    let rootPromises = rootRenderContext.promises;
    let rootSubscriptions = rootRenderContext.subscriptions;
    while (keys.length) oldKeys.unshift(keys.pop());
    while (promises.length) oldPromises.unshift(promises.pop() as Promise<any>);
    while (subscriptions.length) oldSubscriptions.unshift(subscriptions.pop() as Subscription);

    const handleItems = (template: Template, filter?: TemplateFilter) => {
        if (template == null || template === false) {
            return;
        }

        let templateType = typeof template;
        let isObjectTemplate = templateType === 'object';
        let templateNode: Element | Text | undefined;
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
                handleItems(Function(properties), filter);
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

            if (currentNode) {
                let prevKey = (currentNode as any).key;
                if (prevKey != null && key != null && key !== prevKey) {
                    let prevCurrentNode = currentNode;
                    currentNode = childNodes.item(currentIndex + 1) as Node;
                    prevKey = currentNode && (currentNode as any).key;
                    DOM.removeChild(root, prevCurrentNode, slot);
                }
                if (key != null || prevKey != null) {
                    if (key === prevKey) {
                        isElementTemplate = true;
                        templateNode = currentNode as Element;
                        isComponentTemplate = !!Component && isComponent(templateNode);
                    }
                } else if (Component && currentNode instanceof Component) {
                    isElementTemplate = true;
                    isComponentTemplate = true;
                    templateNode = currentNode;
                } else if (tag && (currentNode as Element).localName === tag) {
                    isElementTemplate = true;
                    templateNode = currentNode as Element;
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

                if (key) {
                    (templateNode as any).key = key;
                    keys.push(key.toString());
                    Object.defineProperty(rootRenderContext, key, {
                        configurable: true,
                        writable: false,
                        value: templateNode,
                    });
                }
            }

            // update the Node properties
            let childContext: Context = getContext(templateNode) || createContext(templateNode as HTMLElement);
            let childProperties = childContext.props as any;
            childContext.props = properties;

            for (let propertyKey in childProperties) {
                if (!(propertyKey in properties)) {
                    properties[propertyKey] = null;
                }
            }

            for (let propertyKey in properties) {
                if (propertyKey === 'is' || propertyKey === 'key') {
                    continue;
                }
                let oldValue = childProperties[propertyKey];
                let value = properties[propertyKey];

                if (oldValue === value) {
                    continue;
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
                promises.push(template);
                template
                    .catch(() => 1)
                    .then(() => {
                        if (!status.aborted && rootPromises.indexOf(template as Promise<unknown>) !== -1) {
                            internalRender(root, input, filter, rootRenderContext, rootNamespaceURI, slot);
                        }
                    });
            }
            handleItems(status.result, filter);
            return;
        } else if (isObjectTemplate && isObservable(template)) {
            let status = getObservableState(template);
            if (!status.complete) {
                let subscription = template.subscribe(() => {
                    internalRender(root, input, filter, rootRenderContext, rootNamespaceURI, slot);
                }, () => {
                    internalRender(root, input, filter, rootRenderContext, rootNamespaceURI, slot);
                }, () => {
                    subscription.unsubscribe();
                });
                subscriptions.push(subscription);
            }
            handleItems(status.current, filter);
            return;
        } else {
            if (templateType === 'string' && rootRenderContext.is && root.localName === 'style') {
                template = css(rootRenderContext.is as string, template as string);
                root.setAttribute('name', rootRenderContext.is);
            }

            if (isText(currentNode)) {
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
            currentNode = childNodes.item(++currentIndex)  as Node;
        }

        if (isElementTemplate && templateChildren) {
            // the Node has slotted children, trigger a new render context for them
            internalRender(
                templateNode as HTMLElement,
                templateChildren,
                undefined,
                rootRenderContext,
                templateNamespace,
                isComponentTemplate
            );
        }
    };

    handleItems(input, filter);

    if (oldKeys.length) {
        oldKeys.forEach((key) => {
            if (keys.indexOf(key) === -1) {
                delete rootRenderContext[key];
            }
        });
    }

    if (oldPromises.length) {
        oldPromises.forEach((promise) => {
            if (promises.indexOf(promise) === -1) {
                abort(promise);
                let io = rootPromises.indexOf(promise);
                if (io !== -1) {
                    rootPromises.splice(io, 1);
                }
            }
        });
    }
    if (promises.length && promises !== rootPromises) {
        promises.forEach((promise) => {
            rootPromises.push(promise);
        });
    }

    if (oldSubscriptions.length) {
        oldSubscriptions.forEach((subscription) => {
            if (subscriptions.indexOf(subscription) === -1) {
                subscription.unsubscribe();
                let io = rootSubscriptions.indexOf(subscription);
                if (io !== -1) {
                    rootSubscriptions.splice(io, 1);
                }
            }
        });
    }
    if (subscriptions.length && subscriptions !== rootSubscriptions) {
        subscriptions.forEach((subscription) => {
            rootSubscriptions.push(subscription);
        });
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
