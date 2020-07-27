import { isElement, isText, isArray, indexOf } from './helpers';
import { isComponent } from './Interfaces';
import { Template, TemplateItem, TemplateItems, TemplateFilter } from './Template';
import { isHyperNode, h } from './HyperNode';
import { DOM } from './DOM';
import { Context, getContext, createContext, emptyFragments } from './Context';
import { isThenable, getThenableState } from './Thenable';
import { isObservable, getObservableState, Observable } from './Observable';
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
 * @param namespace The current namespace uri of the render.
 * @param slot Should handle slot children.
 * @param rootContext The current custom element context of the render.
 * @param fragment The fragment context to update.
 * @return The resulting child nodes list.
 */
export const internalRender = (
    root: HTMLElement,
    input: Template,
    context?: Context,
    namespace = root.namespaceURI || 'http://www.w3.org/1999/xhtml',
    slot = false,
    rootContext?: Context,
    fragment?: Context
) => {
    let renderContext = context || getContext(root) || createContext(root);
    let childNodes: IterableNodeList;
    if (slot) {
        childNodes = renderContext.slotChildNodes as IterableNodeList;
    } else {
        childNodes = renderContext.childNodes as IterableNodeList;
        if (renderContext.is) {
            rootContext = renderContext;
        }
    }
    if (!childNodes) {
        return childNodes;
    }

    let rootRenderContent = rootContext || renderContext;
    let currentIndex: number;
    let renderFragments = renderContext.fragments;
    let rootKeys = rootRenderContent.rootKeys;
    let keys: { [key: string]: Node };
    let newKeys: typeof keys = {};
    let lastNode: Node|undefined;
    if (fragment) {
        currentIndex = indexOf.call(childNodes, fragment.first as Node);
        lastNode = fragment.last as Node;
        keys = fragment.keys;
    } else {
        emptyFragments(renderContext);
        currentIndex = 0;
        keys = renderContext.keys;
    }
    let currentNode = childNodes.item(currentIndex) as Node;
    let currentContext = currentNode ? (getContext(currentNode) || createContext(currentNode)) : null;

    const handleItems = (template: Template, filter?: TemplateFilter) => {
        if (template == null || template === false) {
            return;
        }

        let templateType = typeof template;
        let isObjectTemplate = templateType === 'object';
        let templateNode: Element | Text | undefined;
        let templateContext: Context|undefined;
        let templateChildren: TemplateItems | undefined;
        let templateNamespace = namespace;
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
                let previousCurrentIndex = currentIndex;
                let previousFragments = renderFragments;
                let previousKeys = keys;
                let data: { [key: string]: any };
                if (fragment) {
                    data = fragment.data;
                } else if (currentContext && currentContext.function === Function) {
                    emptyFragments(currentContext);
                    data = currentContext.data;
                } else {
                    data = {};
                }

                let renderFragmentContext: Context;
                let live = () => renderFragments.indexOf(renderFragmentContext) !== -1;
                renderFragments = [];
                keys = {};
                handleItems(
                    Function(
                        {
                            children,
                            ...properties,
                        },
                        data,
                        () => {
                            if (!live()) {
                                return false;
                            }
                            internalRender(root, template, renderContext, namespace, slot, rootContext, renderFragmentContext);
                            return true;
                        },
                        live,
                        renderContext
                    ) as TemplateItem,
                    filter
                );
                if (previousCurrentIndex === currentIndex) {
                    handleItems(DOM.createTextNode(''), filter);
                }
                let firstNode = childNodes.item(previousCurrentIndex) as Node;
                renderFragmentContext = getContext(firstNode) || createContext(firstNode);
                renderFragmentContext.data = data;
                renderFragmentContext.keys = keys;
                renderFragmentContext.function = Function;
                renderFragmentContext.first = firstNode;
                renderFragmentContext.last = childNodes.item(currentIndex - 1) as Node;
                renderFragmentContext.fragments.push(...renderFragments);
                renderFragments = previousFragments;
                keys = previousKeys;
                if (!fragment) {
                    renderFragments.push(renderFragmentContext);
                } else {
                    renderFragments.splice(renderFragments.indexOf(fragment), 1, renderFragmentContext);
                    fragment = renderFragmentContext;
                }
                return;
            }

            if (isFragment) {
                handleItems(children, filter);
                return;
            }

            // if the current patch is a slot,
            if (isSlot && rootContext) {
                let slottedChildren: Node[] = rootContext.slotChildNodes || [];
                let filter;
                if (properties.name) {
                    filter = (item: TemplateItem) => {
                        if (isElement(item)) {
                            return item.getAttribute('slot') === properties.name;
                        }
                        return false;
                    };
                } else {
                    filter = (item: TemplateItem) => {
                        if (isElement(item)) {
                            return !item.getAttribute('slot');
                        }
                        return true;
                    };
                }

                handleItems(slottedChildren, filter);
                return;
            }

            templateNamespace = namespaceURI || namespace;

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
            templateContext.key = key;

            if (childProperties) {
                for (let propertyKey in childProperties) {
                    if (!(propertyKey in properties)) {
                        properties[propertyKey] = null;
                    }
                }
            }

            for (let propertyKey in properties) {
                if (propertyKey === 'is' || propertyKey === 'key' || propertyKey === 'children') {
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
                        for (let i = 0, len = oldClasses.length; i < len; i++) {
                            let className = oldClasses[i];
                            if (newClasses.indexOf(className) === -1) {
                                classList.remove(className);
                            }
                        }
                    }
                    for (let i = 0, len = newClasses.length; i < len; i++) {
                        let className = newClasses[i];
                        if (!classList.contains(className)) {
                            classList.add(className);
                        }
                    }
                    continue;
                } else if (propertyKey[0] === 'o' && propertyKey[1] === 'n' && !(propertyKey in templateNode.constructor.prototype)) {
                    let eventName = propertyKey.substr(2);
                    if (oldValue) {
                        templateNode.removeEventListener(eventName, oldValue);
                    }
                    if (value) {
                        templateNode.addEventListener(eventName, value);
                    }
                }

                let type = typeof value;
                let isReference = (value && type === 'object') || type === 'function';

                if (isReference || Component) {
                    (templateNode as any)[propertyKey] = value;
                }

                if (value == null || value === false) {
                    if ((templateNode as Element).hasAttribute(propertyKey)) {
                        (templateNode as Element).removeAttribute(propertyKey);
                    }
                } else if (!isReference) {
                    let attrValue = value === true ? '' : value.toString();
                    if ((templateNode as Element).getAttribute(propertyKey) !== attrValue) {
                        (templateNode as Element).setAttribute(propertyKey, attrValue);
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
            handleItems(h((props, data, update) => {
                let status = getThenableState(template as Promise<unknown>);
                if (status.pending) {
                    (template as Promise<unknown>)
                        .catch(() => 1)
                        .then(() => {
                            update();
                        });
                }
                return status.result;
            }), filter);
            return;
        } else if (isObjectTemplate && isObservable(template)) {
            handleItems(h((props, context, update) => {
                let status = getObservableState(template);
                if (!status.complete) {
                    let subscription = (template as Observable<unknown>).subscribe(
                        () => {
                            if (!update()) {
                                subscription.unsubscribe();
                            }
                        },
                        () => {
                            if (!update()) {
                                subscription.unsubscribe();
                            }
                        },
                        () => {
                            subscription.unsubscribe();
                        }
                    );
                }
                return status.current;
            }), filter);
            return;
        } else {
            if (templateType === 'string' && rootContext && renderContext.tagName === 'style') {
                let is = rootContext.is as string;
                template = css(is, template as string);
                root.setAttribute('name', is);
            }

            if (currentContext && currentContext.isText && !currentContext.function) {
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

        if (isElementTemplate && templateChildren && templateContext) {
            let key = templateContext.key;
            if (key) {
                rootKeys[key] = newKeys[key] = keys[key] = templateNode;
            }
            // the Node has slotted children, trigger a new render context for them
            internalRender(
                templateNode as HTMLElement,
                templateChildren,
                templateContext,
                templateNamespace,
                isComponentTemplate,
                rootContext
            );

            let templateKeys = templateContext.keys;
            for (let key in templateKeys) {
                rootKeys[key] = newKeys[key] = keys[key] = templateKeys[key];
            }
        }
    };

    handleItems(input);

    for (let key in keys) {
        if (!(key in newKeys)) {
            delete keys[key];
            delete rootKeys[key];
        }
    }

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
        DOM.removeChild(root, childNodes.item(--lastIndex) as Node, slot);
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
    if (!childNodes) {
        return;
    }
    if (childNodes.length < 2) {
        return childNodes[0];
    }
    return cloneChildNodes(childNodes);
};
