import { DOM } from './dom';
import { HyperFunction } from './h';
import { InterpolateFunction } from './interpolate';
import { scopeCSS } from './style';

/**
 * Symbol which contain the current node during render patch.
 */
const ITERATOR = Symbol();

/**
 * A Symbol which contains slotted children of a Component.
 */
const SLOTTED_SYMBOL = Symbol();

const FILTER_SYMBOL = Symbol();

/**
 * The scope symbol.
 */
const SCOPE_SYMBOL = Symbol();

export type TemplateFilter = (item: HTMLElement | Text) => boolean;

export type TemplateItem = HTMLElement | Text | Function | HyperFunction | InterpolateFunction | Promise<any> | string | boolean;

type IterableElement = {
    [ITERATOR]?: Node | null | undefined;
}

type Slotted = {
    [SLOTTED_SYMBOL]?: TemplateItem[];
};

type Filterable = { [FILTER_SYMBOL]?: TemplateFilter };

type Scoped = { [SCOPE_SYMBOL]?: Scope };

export type Template = TemplateItem | TemplateItem[];

export type Scope = {
    [key: string]: any;
    /**
     * Assign values to the Scope.
     *
     * @param values A set of values to set to the Scope
     */
    $assign(values: { [key: string]: any }): void;

    /**
     * Create a child Scope.
     */
    $child(): Scope;
} & HTMLElement;

export function createScope(prototype: any) {
    const scope = {} as Scope;
    scope.__proto__ = {
        $assign(this: Scope, values: { [key: string]: any }) {
            for (let propertyKey in values) {
                this[propertyKey] = values[propertyKey];
            }
        },

        $child() {
            // create a new Scope inheriting properties from the current one
            return Object.create(this);
        },

        __proto__: prototype,
    };

    return scope;
}

export function createFilterableTemplateItems(items: TemplateItem[], filter: TemplateFilter) {
    const filterableItems: TemplateItem[] & Filterable = (items || []).slice(0);
    filterableItems[FILTER_SYMBOL] = filter;
    return filterableItems;
}

export function getScope(prototype: any): Scope | undefined {
    const scopedPrototype: Scoped = prototype;
    return scopedPrototype[SCOPE_SYMBOL];
}

export function setScope(target: any, scope: Scope): void {
    const scopedTarget: Scoped = target;
    scopedTarget[SCOPE_SYMBOL] = scope;
}

export function getSlotted(target: any): TemplateItem[] {
    return target[SLOTTED_SYMBOL];
}

export function setSlotted(target: any, slotted: TemplateItem[]): void {
    target[SLOTTED_SYMBOL] = slotted;
}

function isStyleTag(node: any): node is HTMLStyleElement {
    return node && node.tagName === 'STYLE';
}

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param node The root Node for the render
 * @param input The child (or the children) to render in Virtual DOM format or already generated
 * @return The resulting child Nodes
 */
export function render(node: HTMLElement, input: Template, scope?: Scope, previousResult?: Template[], filter?: TemplateFilter): Template | Template[] | void {
    // `result` is private params for recursive render cycles
    let iterableNode: HTMLElement & IterableElement = node;
    let isFirstRender = !previousResult;
    let result = previousResult || [];
    if (isFirstRender) {
        // if the render just started, set the first Node as current iterator for comparison
        iterableNode[ITERATOR] = iterableNode.firstChild;
    }

    if (input != null && input !== false) {
        let scopableInput: Template & Scoped & Filterable = input;
        let inputScope = getScope(scopableInput) || scope || getScope(node) || createScope(node);
        // if the input is an Array
        if (Array.isArray(scopableInput)) {
            // call the render function for each child
            for (let i = 0, len = scopableInput.length; i < len; i++) {
                render(iterableNode, scopableInput[i], inputScope, result, scopableInput[FILTER_SYMBOL]);
            }
        // if it is a Function or a Callable instance
        } else if (typeof scopableInput === 'function') {
            render(iterableNode, scopableInput.call(inputScope, iterableNode[ITERATOR], filter), inputScope, result, filter);
        } else {
            // if it is "something" (eg a Node, a Component, a text etc)

            // add the input to the result
            let io = result.push(scopableInput);

            if (scopableInput instanceof Promise) {
                // wait for Promise resolution
                scopableInput.then((response) => {
                    // update the result
                    result.splice(io - 1, 1, response);
                    // and trigger a re-render
                    render(iterableNode, result as Template, undefined, undefined, filter);
                });
                // handle the pending Promise as empty text Node
                scopableInput = '';
            }

            let inputElement: Template & Slotted;
            if (isStyleTag(node) && DOM.hasAttribute(node, 'scoped') && typeof scopableInput === 'string') {
                let name: string = DOM.getAttribute(node, 'scoped') as string;
                if (!name) {
                    name = inputScope.is as string;
                }
                scopeCSS(node, name, scopableInput);
                inputElement = node.childNodes[0] as Text;
            } else if (DOM.isElement(scopableInput)) {
                inputElement = scopableInput;
            } else {
                // convert non-Node input into Text
                inputElement = DOM.createTextNode(scopableInput as string);
            }

            if (!filter || filter(inputElement)) {
                // get the current iterator for comparison
                const currentNode = iterableNode[ITERATOR];

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
                            iterableNode[ITERATOR] = currentNode.nextSibling;
                        } else {
                            // if current iterator is defined, insert the Node before it
                            DOM.insertBefore(iterableNode, inputElement, currentNode);
                        }
                    } else {
                        // append the new Node at the end of the parent
                        DOM.appendChild(iterableNode, inputElement);
                    }
                } else {
                    // move forward the iterator for comparison
                    iterableNode[ITERATOR] = currentNode.nextSibling;
                }

                if (DOM.isElement(inputElement)) {
                    const slotted = inputElement[SLOTTED_SYMBOL];
                    if (slotted && !DOM.isCustomElement(inputElement)) {
                        // the Node has slotted children, trigger a new render context for them
                        render(inputElement, slotted, inputScope);
                    }
                }
            }
        }
    }
    if (isFirstRender && result) {
        // all children of the root have been handled,
        // we can start to cleanup the tree
        let len = result.length;
        let childNodes = iterableNode.childNodes;
        // remove all Nodes that are outside the result range
        while (childNodes.length > len) {
            DOM.removeChild(iterableNode, childNodes[childNodes.length - 1]);
        }
        if (len === 0) {
            // no results, return void
            return;
        } else if (len === 1) {
            // single result, return the single entry
            return result[0];
        }
    }
    return result;
}
