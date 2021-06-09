import type { Context, PropertiesMap } from './Context';
import type { Template, TemplateItem, TemplateItems, TemplateFilter, TemplateFunction } from './Template';
import type { Observable } from './Observable';
import type { IterableNodeList } from './NodeList';
import type { HyperClasses, HyperStyles } from './HyperNode';
import { isElement, isText, isComment, isArray, indexOf } from './helpers';
import { isComponent } from './Interfaces';
import { customElements } from './CustomElementRegistry';
import { isHyperNode, h } from './HyperNode';
import { DOM } from './DOM';
import { getContext, emptyFragments } from './Context';
import { isThenable, getThenableState } from './Thenable';
import { isObservable, getObservableState } from './Observable';
import { cloneChildNodes } from './NodeList';
import { css } from './css';

/**
 * A cache for converted class values.
 */
const CLASSES_CACHE: { [key: string]: string[] } = {};

/**
 * A cache for converted style values.
 */
const STYLES_CACHE: { [key: string]: { [key: string]: string } } = {};

/**
 * Convert strings or classes map to a list of classes.
 * @param value The value to convert.
 * @return A list of classes.
 */
const convertClasses = (value: HyperClasses) => {
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
const convertStyles = (value: HyperStyles) => {
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
            if (rulePair.length > 1) {
                ruleMap[(rulePair.shift() as string).trim()] = rulePair.join(':').trim();
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
 * @param slot Should handle slot children.
 * @param context The render context of the root.
 * @param namespace The current namespace uri of the render.
 * @param rootContext The current custom element context of the render.
 * @param refContext The main context of the render.
 * @param fragment The fragment context to update.
 * @return The resulting child nodes list.
 */
export const internalRender = (
    root: Node,
    input: Template,
    slot = isComponent(root),
    context?: Context,
    namespace = root.namespaceURI || 'http://www.w3.org/1999/xhtml',
    rootContext?: Context,
    mainContext?: Context,
    fragment?: Context
) => {
    let renderContext = context || getContext(root);
    let childNodes: IterableNodeList;
    if (slot && renderContext.slotChildNodes) {
        childNodes = renderContext.slotChildNodes as IterableNodeList;
    } else {
        childNodes = renderContext.childNodes || (root.childNodes as unknown as IterableNodeList);
        if (renderContext.is) {
            rootContext = renderContext;
        }
    }
    if (!childNodes) {
        return childNodes;
    }

    let currentIndex: number;
    let currentFragment = fragment;
    let lastNode: Node|undefined;
    if (fragment) {
        currentIndex = indexOf.call(childNodes, fragment.first as Node);
        lastNode = fragment.last as Node;
    } else {
        emptyFragments(renderContext);
        currentIndex = 0;
    }
    let currentNode = childNodes.item(currentIndex) as Node;
    let currentContext = currentNode ? getContext(currentNode) : null;
    let refContext = mainContext || renderContext;

    const handleItems = (template: Template, filter?: TemplateFilter) => {
        if (template == null || template === false) {
            return;
        }

        let templateType = typeof template;
        let isObjectTemplate = templateType === 'object';
        let templateNode: Node | undefined;
        let templateContext: Context | undefined;
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
            let { node, Component, Function, tag, properties, children, key, isFragment, isSlot, namespaceURI } = template;

            if (Function) {
                let rootFragment = fragment;
                let previousContext = renderContext;
                let previousFragment = currentFragment;
                let fragments = renderContext.fragments;
                let state: Map<string, unknown>;
                let placeholder: Node;
                if (fragment) {
                    state = fragment.state;
                    placeholder = fragment.first as Node;
                } else if (currentContext && currentContext.function === Function) {
                    state = currentContext.state;
                    placeholder = currentContext.first as Node;
                } else {
                    state = new Map();
                    placeholder = DOM.createComment(Function.name);
                }

                let renderFragmentContext = getContext(placeholder);
                emptyFragments(renderFragmentContext);
                renderFragmentContext.state = state;
                renderFragmentContext.function = Function;
                renderFragmentContext.first = placeholder;
                renderFragmentContext.isAlive = function() {
                    return fragments.indexOf(this) !== -1;
                };
                renderFragmentContext.requestUpdate = function() {
                    if (!((this.isAlive as Function))()) {
                        return false;
                    }
                    internalRender(root, template, slot, previousContext, namespace, rootContext, refContext, renderFragmentContext);
                    return true;
                };

                renderContext = renderFragmentContext;
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
                            state,
                            () => (renderFragmentContext.requestUpdate as Function)(),
                            () => (renderFragmentContext.isAlive as Function)(),
                            renderContext
                        ) as TemplateItem,
                    ],
                    filter
                );

                fragment = rootFragment;
                renderFragmentContext.last = childNodes.item(currentIndex - 1) as Node;
                renderContext = previousContext;
                currentFragment = previousFragment;

                if (!fragment) {
                    fragments.push(renderFragmentContext);
                } else {
                    fragments.splice(fragments.indexOf(fragment), 1, renderFragmentContext);
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
                let slotChildNodes = rootContext.slotChildNodes;
                if (slotChildNodes) {
                    for (let i = 0, len = slotChildNodes.length; i < len; i++) {
                        let node = slotChildNodes.item(i);
                        let context = getContext(node);
                        if (!context.root) {
                            context.root = rootContext;
                        }
                    }
                }

                let name = properties.name;
                let filter = (item: Node) => {
                    if (getContext(item).root === rootContext) {
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
                return;
            }

            if (node) {
                templateNode = node;
                isElementTemplate = isElement(node);
                isComponentTemplate = isElementTemplate && isComponent(node);
            } else {
                templateNamespace = namespaceURI || namespace;

                checkKey: if (currentContext) {
                    let currentKey = currentContext.key;
                    if (currentKey != null && key != null && key !== currentKey) {
                        DOM.removeChild(root, currentNode, slot);
                        currentNode = childNodes.item(currentIndex) as Node;
                        currentContext = currentNode ? getContext(currentNode) : null;
                        if (!currentContext) {
                            break checkKey;
                        }
                        currentKey = currentContext.key;
                    }

                    if (currentFragment && currentNode) {
                        let io = indexOf.call(childNodes, currentNode);
                        let lastIo = indexOf.call(childNodes, currentFragment.last);
                        if (io !== -1 && io > lastIo) {
                            break checkKey;
                        }
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
                        templateNode = DOM.createElementNS(templateNamespace, tag as keyof HTMLElementTagNameMap);
                    }
                }
            }

            // update the Node properties
            templateContext = templateContext || getContext(templateNode);

            let map = templateContext.props[slot ? 1 : 0] as PropertiesMap;
            let childProperties = map.get(refContext);
            map.set(refContext, properties);
            if (key != null) {
                templateContext.key = key;
            }

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
                    if (oldValue === value && propertyKey !== 'checked' && propertyKey !== 'value') {
                        continue;
                    }
                }

                if (propertyKey === 'style') {
                    let style = (templateNode as HTMLElement).style;
                    let oldStyles = convertStyles(oldValue as HyperStyles);
                    let newStyles = convertStyles(value as HyperStyles);
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
                    let newClasses = convertClasses(value as HyperClasses);
                    if (oldValue) {
                        let oldClasses = convertClasses(oldValue as HyperClasses);
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
                        templateNode.removeEventListener(eventName, oldValue as EventListener);
                    }
                    if (value) {
                        templateNode.addEventListener(eventName, value as EventListener);
                    }
                    continue;
                }

                let type = typeof value;
                let wasType = typeof oldValue;
                let isReference = (value && type === 'object') || type === 'function';
                let wasReference = (oldValue && wasType === 'object') || wasType === 'function';

                if ((isReference || wasReference) || ((propertyKey === 'checked' || propertyKey === 'value') && (templateNode as HTMLElement).tagName === 'INPUT')) {
                    (templateNode as any)[propertyKey] = value;
                } else if (Component) {
                    if (type === 'string') {
                        let observedAttributes: string[] = Component.observedAttributes;
                        if (!observedAttributes || observedAttributes.indexOf(propertyKey) === -1) {
                            (templateNode as any)[propertyKey] = value;
                        }
                    } else {
                        (templateNode as any)[propertyKey] = value;
                    }
                }

                if (value == null || value === false) {
                    if ((templateNode as Element).hasAttribute(propertyKey)) {
                        (templateNode as Element).removeAttribute(propertyKey);
                    }
                } else if (!isReference) {
                    let attrValue = value === true ? '' : (value as string).toString();
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
        } else if (isObjectTemplate && isComment(template)) {
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
                return status.result as TemplateItem;
            }), filter);
            return;
        } else if (isObjectTemplate && isObservable(template)) {
            handleItems(h(((props, context, update) => {
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
            }) as TemplateFunction), filter);
            return;
        } else {
            if (templateType === 'string' && rootContext && renderContext.tagName === 'style') {
                let is = rootContext.is as string;
                template = css(is, template as string, customElements.tagNames[is]);
                (root as HTMLStyleElement).setAttribute('name', is);
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
            currentContext = currentNode ? getContext(currentNode) : null;
        }

        if (isElementTemplate &&
            templateChildren &&
            templateContext &&
            ((templateContext.parent && templateContext.parent === refContext) || templateChildren.length)) {
            templateContext.parent = refContext;
            // the Node has slotted children, trigger a new render context for them
            internalRender(
                templateNode as HTMLElement,
                templateChildren,
                isComponentTemplate,
                templateContext,
                templateNamespace,
                rootContext,
                refContext
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
        let item = childNodes.item(--lastIndex) as Node;
        if (slot) {
            let context = getContext(item);
            if (context.root === rootContext) {
                delete context.root;
            }
            if (context.parent === refContext) {
                delete context.parent;
            }
        }
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
    let childNodes = internalRender(root, input, slot);
    if (!childNodes) {
        return;
    }
    if (childNodes.length < 2) {
        return childNodes[0];
    }
    return cloneChildNodes(childNodes);
};
