import { isComponent } from './Interfaces';
import { Template, TemplateItem, TemplateItems, TemplateFilter } from './Template';
import { isHyperNode } from './HyperNode';
import { DOM, isElement, isText } from './DOM';
import { Context, createContext, getContext, setContext } from './Context';
import { isThenable, getThenableState, abort } from './Thenable';
import { Subscription, isObservable, getObservableState } from './Observable';
import { createSymbolKey } from './symbols';
import { css } from './css';
import { ComponentInterface } from '@chialab/dna';

/**
 * Alias to Array.isArray.
 */
const isArray = Array.isArray;

/**
 * A symbol to store node properties.
 */
const PRIVATE_CONTEXT_SYMBOL = createSymbolKey();

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
 * @param context The render context object.
 * @return The resulting child Nodes.
 */
export const render = (root: HTMLElement, input: Template, context?: Context, rootContext?: Context, filter?: TemplateFilter, slot = false): Node | Node[] | void => {
    const renderContext = context || getContext(root) || createContext(root);
    const rootRenderContext = rootContext || renderContext;
    const isStyle = root.localName === 'style';
    const rootNamespaceURI = root.namespaceURI;
    // result list
    const results: Node[] = [];

    let childNodes: Node[] = (slot && (root as ComponentInterface<any>).slotChildNodes) || root.childNodes;
    // the current iterating node
    let currentIndex = 0;
    let currentNode = childNodes[currentIndex] as Node;

    // promises list
    let promises: Promise<unknown>[] = renderContext.promises = renderContext.promises || [];
    let subscriptions: Subscription[] = renderContext.subscriptions = renderContext.subscriptions || [];
    let rootPromises = rootRenderContext.promises as Promise<unknown>[];
    let rootSubscriptions = rootRenderContext.subscriptions as Subscription[];
    promises.forEach((promise) => {
        abort(promise);
        rootPromises.splice(rootPromises.indexOf(promise), 1);
    });
    subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
        rootSubscriptions.splice(rootSubscriptions.indexOf(subscription), 1);
    });
    promises.splice(0, promises.length);
    subscriptions.splice(0, subscriptions.length);

    const handleItems = (template: Template, templateContext: Context, filter?: TemplateFilter) => {
        if (template == null || template === false) {
            return;
        }

        let isObject = typeof template === 'object';
        let newNode: Element | Text | undefined;
        let newChildren: TemplateItems | undefined;

        if (isObject && isArray(template)) {
            templateContext = getContext(template) || templateContext;
            // call the render function for each child
            for (let i = 0, len = template.length; i < len; i++) {
                handleItems(template[i], templateContext, filter);
            }
            return;
        } else if (isObject && isHyperNode(template)) {
            let { Component, Function, tag, properties, children, key, isFragment, isSlot, namespaceURI } = template;

            if (Function) {
                handleItems(Function(properties, templateContext), templateContext, filter);
                return;
            }

            if (isFragment) {
                handleItems(children, templateContext, filter);
                return;
            }

            // if the current patch is a slot,
            if (isSlot) {
                let slottedChildren = ((templateContext as ComponentInterface<any>).slotChildNodes || []).slice(0);
                let childContext = getContext(slottedChildren) || templateContext;
                let filter;
                if (properties.name) {
                    filter = (item: TemplateItem) => {
                        if (isElement(item)) {
                            return DOM.getAttribute(item, 'slot') === properties.name;
                        }
                        return false;
                    };
                } else {
                    filter = (item: TemplateItem) => {
                        if (isElement(item)) {
                            return !DOM.getAttribute(item, 'slot');
                        }
                        return true;
                    };
                }

                setContext(slottedChildren, childContext);
                handleItems(slottedChildren, templateContext, filter);
                return;
            }

            // create the node
            let isNew = true;
            if (isElement(currentNode)) {
                let prevKey = (currentNode as any).key;
                if (prevKey != null && key != null && key !== prevKey) {
                    let prevCurrentNode = currentNode;
                    currentNode = childNodes[currentIndex + 1] as Node;
                    prevKey = isElement(currentNode) && (currentNode as any).key;
                    DOM.removeChild(root, prevCurrentNode);
                }
                if (key != null || prevKey != null) {
                    if (key === prevKey) {
                        isNew = false;
                        newNode = currentNode as Element;
                    }
                } else if (Component && currentNode instanceof Component) {
                    isNew = false;
                    newNode = currentNode;
                } else if (tag && (currentNode as Element).localName === tag) {
                    isNew = false;
                    newNode = currentNode as Element;
                }
            }

            if (!newNode) {
                if (Component) {
                    newNode = new Component();
                } else {
                    let currentNamespace = namespaceURI || rootNamespaceURI;
                    if (currentNamespace) {
                        newNode = DOM.createElementNS(currentNamespace, tag as string);
                    } else {
                        newNode = DOM.createElement(tag as string);
                    }
                }

                if (key) {
                    (newNode as any).key = key;
                    Object.defineProperty(templateContext, key, {
                        configurable: true,
                        writable: false,
                        value: newNode,
                    });
                }
            }

            // update the Node properties
            const childContext: any = (newNode as any)[PRIVATE_CONTEXT_SYMBOL] = (newNode as any)[PRIVATE_CONTEXT_SYMBOL] || {};
            for (let propertyKey in childContext) {
                if (!(propertyKey in properties)) {
                    properties[propertyKey] = null;
                }
            }
            for (let propertyKey in properties) {
                let value = properties[propertyKey];
                let oldValue = childContext[propertyKey];
                let type = typeof value;
                let isReference = type === 'object' || type === 'function';
                let changed = !(propertyKey in childContext) || value !== oldValue;

                childContext[propertyKey] = value;

                if (!changed) {
                    continue;
                }

                if (propertyKey === 'style') {
                    let style = (newNode as HTMLElement).style;
                    let oldStyles = childContext.styles || {};
                    let newStyles = convertStyles(value);
                    for (let propertyKey in oldStyles) {
                        if (!(propertyKey in newStyles)) {
                            style.removeProperty(propertyKey);
                        }
                    }
                    for (let propertyKey in newStyles) {
                        style.setProperty(propertyKey, newStyles[propertyKey]);
                    }
                    childContext.styles = newStyles;
                    continue;
                } else if (propertyKey === 'class') {
                    let classList = (newNode as HTMLElement).classList;
                    let oldClasses: string[] = childContext.classes || [];
                    let newClasses: string[] = convertClasses(value);
                    oldClasses.forEach((className: string) => {
                        if (newClasses.indexOf(className) === -1) {
                            classList.remove(className);
                        }
                    });
                    newClasses.forEach((className: string) => {
                        if (!classList.contains(className)) {
                            classList.add(className);
                        }
                    });
                    childContext.classes = newClasses;
                    continue;
                }

                if (Component || isReference) {
                    (newNode as any)[propertyKey] = value;
                }

                if (value == null || value === false) {
                    if (!isNew && DOM.hasAttribute(newNode as Element, propertyKey)) {
                        DOM.removeAttribute(newNode as Element, propertyKey);
                    }
                } else if (!isReference) {
                    let attrValue = value === true ? '' : value;
                    if (isNew || DOM.getAttribute(newNode as Element, propertyKey) !== attrValue) {
                        DOM.setAttribute(newNode as Element, propertyKey, attrValue);
                    }
                }
            }

            // store the Node children in order to reuse them
            // at the next render cycle
            setContext(children, templateContext);
            newChildren = children;
        } else if (isObject && (isElement(template) || isText(template))) {
            newNode = template;
        } else if (isObject && isThenable(template)) {
            let status = getThenableState(template);
            if (status.pending) {
                promises.push(template);
                if (rootPromises !== promises) {
                    rootPromises.push(template);
                }
                template
                    .catch(() => 1)
                    .then(() => {
                        if (!status.aborted && rootPromises.indexOf(template as Promise<unknown>) !== -1) {
                            render(root, input, context, rootRenderContext, filter, slot);
                        }
                    });
            }
            handleItems(status.result, templateContext, filter);
            return;
        } else if (isObject && isObservable(template)) {
            let status = getObservableState(template);
            if (!status.complete) {
                let subscription = template.subscribe(() => {
                    render(root, input, context, rootRenderContext, filter, slot);
                }, () => {
                    render(root, input, context, rootRenderContext, filter, slot);
                }, () => {
                    subscription.unsubscribe();
                });
                subscriptions.push(subscription);
                if (rootSubscriptions !== subscriptions) {
                    rootSubscriptions.push(subscription);
                }
            }
            handleItems(status.current, templateContext, filter);
            return;
        } else {
            if (isStyle && typeof template === 'string' && templateContext.is) {
                template = css(templateContext.is as string, template);
                root.setAttribute('name', templateContext.is);
            }

            if (isText(currentNode)) {
                newNode = currentNode as Text;
                if (currentNode.textContent != template) {
                    newNode.textContent = template as string;
                }
            } else {
                // convert non-Node template into Text
                newNode = DOM.createTextNode(template as string);
            }
        }

        if (filter && !filter(newNode)) {
            return results;
        }

        // now, we are confident that if the input is a Node or a Component,
        // check if Nodes are the same instance
        // (patch result should return same Node instances for compatible types)
        if (newNode !== currentNode) {
            // they are different, so we need to insert the new Node into the tree
            // if current iterator is defined, insert the Node before it
            // otherwise append the new Node at the end of the parent
            DOM.insertBefore(root, newNode, currentNode, slot);
            currentIndex++;
        } else {
            currentNode = childNodes[++currentIndex]  as Node;
        }

        results.push(newNode);

        if (isElement(newNode) && newChildren) {
            // the Node has slotted children, trigger a new render context for them
            render(newNode as HTMLElement, newChildren, createContext(templateContext), rootRenderContext, undefined, isComponent(newNode));
        }

        return;
    };

    handleItems(input, renderContext, filter);

    // all children of the root have been handled,
    // we can start to cleanup the tree
    // remove all Nodes that are outside the result range
    let length = childNodes.length;
    while (length > currentIndex) {
        DOM.removeChild(root, childNodes[--length] as Node, slot);
    }

    if (results.length < 2) {
        return results[0];
    }
    return results as Node[];
};
