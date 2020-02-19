import { DOM } from './DOM';
import { isCustomElement } from './CustomElement';
import { Scope, createScope, getScope } from './scope';
import { Template, TemplateFilter, getTemplateItemsFilter } from './Template';
import { getSlotted } from './Slotted';
import { isHyperFunction } from './HyperFunction';
import { isInterpolationFunction } from './InterpolationFunction';
import { css } from './css';

/**
 * This represent the state of a render context.
 */
export type RenderContext = {
    /**
     * A flag for the running status of the render.
     */
    running?: true,

    /**
     * The current iterating status.
     */
    iterating: {
        node: Node,
    },

    /**
     * A list of result nodes for the render.
     */
    result: Template[],

    /**
     * A template filter for result nodes.
     */
    filter?: TemplateFilter,
};

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
 * @param node The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param scope The render scope object.
 * @return The resulting child Nodes.
 */
export const render = (node: HTMLElement, input: Template, scope?: Scope, context?: RenderContext): Template | Template[] | void => {
    const renderScope = scope && createScope(scope) || getScope(node) || createScope(node);
    const renderContext: RenderContext = {
        result: [],
        iterating: {
            node: node.firstChild as Node,
        },
        ...context,
    };

    if (input != null && input !== false) {
        const inputScope = getScope(input) || renderScope;
        const inputContext: RenderContext = {
            running: true,
            result: renderContext.result,
            iterating: renderContext.iterating,
            filter: getTemplateItemsFilter(input) || renderContext.filter,
        };
        const { result, iterating } = inputContext;
        // if the input is an Array
        if (Array.isArray(input)) {
            // call the render function for each child
            for (let i = 0, len = input.length; i < len; i++) {
                render(node, input[i], inputScope, inputContext);
            }
            // if it is an InterpolatedFunction or a HyperFunction
        } else if (isInterpolationFunction(input)) {
            render(node, input.call(inputScope), inputScope, inputContext);
        } else if (isHyperFunction(input)) {
            render(node, input.call(inputScope, iterating.node as Element), inputScope, inputContext);
        } else {
            // if it is "something" (eg a Node, a Component, a text etc)
            let inputElement: Template;
            if (isStyleTag(node) && DOM.hasAttribute(node, 'scoped') && typeof input === 'string') {
                let name: string = DOM.getAttribute(node, 'scoped') as string;
                if (!name) {
                    name = inputScope.is as string;
                }
                node.textContent = css(name, input);
                inputElement = node.childNodes[0] as Text;
            } else if (DOM.isElement(input) || DOM.isText(input)) {
                inputElement = input;
            } else {
                // convert non-Node input into Text
                inputElement = DOM.createTextNode(input as string);
            }

            if (!inputContext.filter || inputContext.filter(inputElement)) {
                // add the input to the result
                result.push(input);

                // get the current iterator for comparison
                const currentNode = iterating.node;

                // now, we are confident that if the input is a Node or a Component,
                // check if Nodes are the same instance
                // (patch result should return same Node instances for compatible types)
                if (inputElement !== currentNode) {
                    // they are different, so we need to insert the new Node into the tree
                    if (currentNode) {
                        if (DOM.isText(inputElement) && DOM.isText(currentNode)) {
                            // just update the text content of the text node
                            let content = inputElement.textContent;
                            if (currentNode.textContent !== content) {
                                currentNode.textContent = content;
                            }
                            iterating.node = currentNode.nextSibling as Node;
                        } else {
                            // if current iterator is defined, insert the Node before it
                            DOM.insertBefore(node, inputElement, currentNode);
                        }
                    } else {
                        // append the new Node at the end of the parent
                        DOM.appendChild(node, inputElement);
                    }
                } else {
                    // move forward the iterator for comparison
                    iterating.node = currentNode.nextSibling as Node;
                }

                if (DOM.isElement(inputElement)) {
                    const slotted = getSlotted(inputElement);
                    if (slotted && !isCustomElement(inputElement)) {
                        // the Node has slotted children, trigger a new render context for them
                        render(inputElement, slotted, inputScope, {
                            result: [],
                            iterating: {
                                node: inputElement.firstChild as Node,
                            },
                        });
                    }
                }
            }
        }
    }

    const { running, result } = renderContext;
    if (!running && result) {
        // all children of the root have been handled,
        // we can start to cleanup the tree
        let len = result.length;
        let childNodes = node.childNodes;
        // remove all Nodes that are outside the result range
        while (childNodes.length > len) {
            DOM.removeChild(node, childNodes[childNodes.length - 1]);
        }
        if (len === 0) {
            // no results, return void
            return;
        }
        if (len === 1) {
            // single result, return the single entry
            return result[0];
        }
    }
    return result;
};
