import { DOM } from './DOM';
import { createSymbolKey } from './symbols';
import { CustomElement, isCustomElement } from './CustomElement';
import { Scope, createScope, getScope, setScope } from './scope';
import { Template, TemplateItem, TemplateItems, TemplateFilter, getTemplateItemsFilter, createFilterableTemplateItems } from './Template';
import { getSlotted, setSlotted } from './slotted';
import { isHyperNode } from './HyperNode';
import { isInterpolationFunction } from './InterpolationFunction';
import { css } from './css';

/**
 * A symbol to store node properties.
 */
const PRIVATE_CONTEXT_SYMBOL = createSymbolKey();


/**
 * Check if a node is a `<style>` element.
 *
 * @param node The node to check.
 * @return The node is a `<style>` element.
 */
const isStyleTag = (node: any): node is HTMLStyleElement => node && node.tagName === 'STYLE';

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
    const result: Node[] = [];

    // the current iterating node
    let currentNode = root.firstChild as Node;
    // the current element to insert
    let node: Element | Text | undefined;

    const handleItems = (template: TemplateItems|TemplateItem, scope: Scope, filter?: TemplateFilter) => {
        if (template == null || template === false) {
            return;
        }

        let inputScope = getScope(template) || scope;
        let inputFilter = getTemplateItemsFilter(template) || filter;
        if (Array.isArray(template)) {
            // call the render function for each child
            for (let i = 0, len = template.length; i < len; i++) {
                handleItems(template[i], inputScope, inputFilter);
            }
        } else {
            handleItem(template as TemplateItem, inputScope, inputFilter);
        }
    };

    const handleItem = (template: TemplateItem, scope: Scope, filter?: TemplateFilter) => {
        let newNode: Element | Text | undefined;

        // get the current iterator for comparison
        if (isInterpolationFunction(template)) {
            template = template.call(scope);
        } else if (isHyperNode(template)) {
            let { Component, tag, properties, children, key, isFragment, isTemplate, isSlot, isCustomElement, namespaceURI } = template;
            if (isFragment) {
                return handleItems(children, scope, filter);
            }

            if (key && isInterpolationFunction(key)) {
                key = key.call(scope);
            }

            // update the Node properties
            let props: any = {};
            for (let property in properties) {
                let value = properties[property];
                if (value && isInterpolationFunction(value)) {
                    // resolve interpolated properties
                    value = value.call(scope);
                }
                props[property] = value;
            }

            // if the current patch is a template,
            if (isTemplate) {
                // the Template instances are not rendered,
                // so it returns its children
                // check if the Template should handle the `if` property
                if ('if' in props && !props.if) {
                    // the condition is a falsy value, so it should not render anything
                    return;
                }
                // check if the Template should handle the `repeat` property
                if ('repeat' in props && children.length) {
                    const newChildren: TemplateItems = [];
                    // extract the `key` variable to use in the template
                    const keyVar = props.key || '$key';
                    // extract the `item` variable to use in the template
                    const itemVar = props.item || '$item';
                    const array = props.repeat;
                    // iterate the object or the array
                    for (let key in array) {
                        let item = array[key];
                        // augment the scope of the child
                        const childScope = createScope(scope, {
                            [keyVar]: key,
                            [itemVar]: item,
                        });
                        const clone = children.slice(0) as TemplateItems;
                        setScope(clone, childScope);
                        newChildren.push(clone as unknown as TemplateItem);
                    }
                    return handleItems(newChildren, scope, filter);
                }

                return handleItems(children, scope, filter);
            }

            if (isSlot) {
                let slottedChildren = getSlotted(scope);
                if (slottedChildren) {
                    let childScope = getScope(slottedChildren) || scope;
                    if (props.name) {
                        slottedChildren = createFilterableTemplateItems(slottedChildren, (item) => {
                            if (DOM.isElement(item)) {
                                return DOM.getAttribute(item, 'slot') === props.name;
                            }
                            return false;
                        });
                    } else {
                        slottedChildren = createFilterableTemplateItems(slottedChildren, (item) => {
                            if (DOM.isElement(item)) {
                                return !DOM.getAttribute(item, 'slot');
                            }
                            return true;
                        });
                    }

                    setScope(slottedChildren, childScope);
                    return handleItems(slottedChildren, scope, filter);
                }

                return handleItems([], scope, filter);
            }

            if (DOM.isElement(currentNode)) {
                let prevKey = (currentNode as any).key;
                if (prevKey != null && key != null && key !== prevKey) {
                    let prevCurrentNode = currentNode;
                    currentNode = currentNode.nextSibling as Node;
                    prevKey = currentNode && (currentNode as any).key;
                    DOM.removeChild(root, prevCurrentNode);
                }
                if (key === prevKey) {
                    if (Component && currentNode instanceof Component) {
                        newNode = currentNode;
                    } else if (tag && (currentNode as Element).localName === tag) {
                        newNode = currentNode as Element;
                    }
                }
            }
            if (!newNode) {
                if (Component) {
                    newNode = new Component();
                } else if (namespaceURI) {
                    newNode = DOM.createElementNS(namespaceURI, tag as string);
                } else {
                    newNode = DOM.createElement(tag as string);
                }
            }

            const childContext = (newNode as any)[PRIVATE_CONTEXT_SYMBOL] = (newNode as any)[PRIVATE_CONTEXT_SYMBOL] || {};

            // update the Node properties
            for (let propertyKey in childContext) {
                if (!(propertyKey in props)) {
                    props[propertyKey] = null;
                }
            }
            for (let propertyKey in props) {
                let value = props[propertyKey];

                if (isCustomElement) {
                    if ((newNode as any)[propertyKey] !== value) {
                        // the property should be update
                        (newNode as any)[propertyKey] = value;
                    }
                } else if (childContext[propertyKey] !== value) {
                    childContext[propertyKey] = value;
                    if (!namespaceURI) {
                        (newNode as any)[propertyKey] = value;
                    }
                }

                if (value == null || value === false) {
                    if (DOM.hasAttribute(newNode as Element, propertyKey)) {
                        DOM.removeAttribute(newNode as Element, propertyKey);
                    }
                } else if (typeof value !== 'object' && typeof value !== 'function' && propertyKey !== 'key') {
                    let attrValue = value === true ? '' : value;
                    if (DOM.getAttribute(newNode as Element, propertyKey) !== attrValue) {
                        DOM.setAttribute(newNode as Element, propertyKey, attrValue);
                    }
                }
            }

            if (key) {
                (newNode as any).key = key;
                scope[key] = newNode;
            }

            // store the Node children in order to reuse them
            // at the next render cycle
            const childrenInput = children.slice(0) as TemplateItems;
            setScope(childrenInput, scope);
            setSlotted(newNode, childrenInput);

            if (isCustomElement) {
                // notify the Component that its slotted Nodes has been updated
                (newNode as CustomElement).forceUpdate();
            }
        }

        if (!newNode) {
            if (isStyleTag(root) && typeof template === 'string' && scope.is) {
                template = css(scope.is as string, template);
            }

            if (DOM.isElement(template) || DOM.isText(template)) {
                newNode = template;
            } else {
                // convert non-Node template into Text
                newNode = DOM.createTextNode(template as string);
            }
        }

        if (filter && !filter(newNode)) {
            return;
        }

        // now, we are confident that if the input is a Node or a Component,
        // check if Nodes are the same instance
        // (patch result should return same Node instances for compatible types)
        if (newNode !== currentNode) {
            // they are different, so we need to insert the new Node into the tree
            if (currentNode) {
                if (DOM.isText(newNode) && DOM.isText(currentNode)) {
                    // just update the text content of the text node
                    let content = newNode.textContent;
                    if (currentNode.textContent !== content) {
                        currentNode.textContent = content;
                    }
                    newNode = currentNode as Text;
                    currentNode = currentNode.nextSibling as Node;
                } else {
                    // if current iterator is defined, insert the Node before it
                    DOM.insertBefore(root, newNode, currentNode);
                }
            } else {
                // append the new Node at the end of the parent
                DOM.appendChild(root, newNode);
            }
        } else {
            newNode = currentNode as HTMLElement;
            currentNode = currentNode.nextSibling as Node;
        }

        // add the input to the result
        result.push(newNode);

        if (DOM.isElement(newNode)) {
            const slotted = getSlotted(newNode);
            if (slotted && !isCustomElement(newNode)) {
                // the Node has slotted children, trigger a new render context for them
                render(newNode, slotted, scope);
            }
        }

        node = newNode;
    };

    handleItems(input, renderScope, filter);

    // all children of the root have been handled,
    // we can start to cleanup the tree
    let len = result.length;
    // remove all Nodes that are outside the result range
    if (root.lastChild) {
        while (root.lastChild != node) {
            DOM.removeChild(root, root.lastChild as Node);
        }
    }
    if (len === 0) {
        // no results, return void
        return;
    }
    if (len === 1) {
        // single result, return the single entry
        return result[0];
    }
    return result;
};
