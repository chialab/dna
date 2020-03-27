import { DOM, isElement, isText, isComponent } from './DOM';
import { createSymbolKey } from './symbols';
import { Scope, createScope, getScope, setScope } from './Scope';
import { Template, TemplateItem, TemplateItems, TemplateFilter } from './Template';
import { getSlotted, setSlotted } from './slotted';
import { isHyperNode } from './HyperNode';
import { css } from './css';

/**
 * Alias to Array.isArray.
 */
const isArray = Array.isArray;

/**
 * A symbol to store node properties.
 */
const PRIVATE_CONTEXT_SYMBOL = createSymbolKey();

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param root The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param scope The render scope object.
 * @return The resulting child Nodes.
 */
export const render = (root: HTMLElement, input: Template, scope?: Scope, filter?: TemplateFilter): Node | Node[] | void => {
    const renderScope = scope && createScope(scope) || getScope(root) || createScope(root);
    const isStyle = root.localName === 'style';
    const rootNamespaceURI = root.namespaceURI;

    // the current iterating node
    let currentNode = root.firstChild as Node;
    // the current element to insert
    let node: Element | Text | undefined;
    // result list
    let results: Node[] = [];

    const handleItems = (template: Template, scope: Scope, results: Node[], filter?: TemplateFilter): Node[] => {
        if (template == null || template === false) {
            return results;
        }

        if (isArray(template)) {
            scope = getScope(template) || scope;
            // call the render function for each child
            for (let i = 0, len = template.length; i < len; i++) {
                handleItems(template[i], scope, results, filter);
            }
            return results;
        }

        let newNode: Element | Text | undefined;
        let newChildren: TemplateItems | undefined;
        let isObject = typeof template === 'object';

        if (isObject && isHyperNode(template)) {
            let { Component, tag, properties, children, key, isFragment, isSlot, namespaceURI } = template;
            if (isFragment) {
                return handleItems(children, scope, results, filter);
            }

            // if the current patch is a slot,
            if (isSlot) {
                let slottedChildren = (getSlotted(scope) || []).slice(0);
                let childScope = getScope(slottedChildren) || scope;
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

                setScope(slottedChildren, childScope);
                return handleItems(slottedChildren, scope, results, filter);
            }

            // create the node
            let isNew = true;
            if (isElement(currentNode)) {
                let prevKey = (currentNode as any).key;
                if (prevKey != null && key != null && key !== prevKey) {
                    let prevCurrentNode = currentNode;
                    currentNode = currentNode.nextSibling as Node;
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
                    scope[key] = newNode;
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
                let changed = !(propertyKey in childContext) || value !== childContext[propertyKey];
                if (!isNew && !changed) {
                    continue;
                }

                if (changed) {
                    childContext[propertyKey] = value;
                    if (!namespaceURI) {
                        (newNode as any)[propertyKey] = value;
                    }
                }

                if (value == null || value === false) {
                    if (!isNew && DOM.hasAttribute(newNode as Element, propertyKey)) {
                        DOM.removeAttribute(newNode as Element, propertyKey);
                    }
                } else {
                    let type = typeof value;
                    if (type !== 'object' && type !== 'function') {
                        let attrValue = value === true ? '' : value;
                        if (isNew || DOM.getAttribute(newNode as Element, propertyKey) !== attrValue) {
                            DOM.setAttribute(newNode as Element, propertyKey, attrValue);
                        }
                    }
                }
            }

            // store the Node children in order to reuse them
            // at the next render cycle
            setScope(children, scope);
            newChildren = children;
        } else if (isObject && (isElement(template) || isText(template))) {
            newNode = template;
        } else {
            if (isStyle && typeof template === 'string' && scope.is) {
                template = css(scope.is as string, template);
                root.setAttribute('name', scope.is);
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
            DOM.insertBefore(root, newNode, currentNode);
        } else {
            currentNode = currentNode.nextSibling as Node;
        }

        results.push(newNode);

        if (isElement(newNode) && newChildren) {
            if (isComponent(newNode)) {
                setSlotted(newNode, handleItems(newChildren, newNode, []));
                // notify the Component that its slotted Nodes has been updated
                newNode.forceUpdate();
            } else {
                // the Node has slotted children, trigger a new render context for them
                render(newNode as HTMLElement, newChildren, scope);
            }
        }

        node = newNode;

        return results;
    };

    handleItems(input, renderScope, results, filter);

    // all children of the root have been handled,
    // we can start to cleanup the tree
    // remove all Nodes that are outside the result range
    while (root.lastChild != node) {
        DOM.removeChild(root, root.lastChild as Node);
    }

    let len = results.length;
    if (len === 0) {
        return;
    }
    if (len === 1) {
        return results[0];
    }
    return results as Node[];
};
