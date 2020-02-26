import htm from 'htm';
import { Template } from './Template';
import { Scope, createScope } from './Scope';
import { h, HyperNode } from './HyperNode';
import { isElement, isText } from './DOM';

enum Namespaces {
    SVG = 'http://www.w3.org/2000/svg',
}

/**
 * Get child of a template element.
 * @param node The template node.
 * @return The template children.
 */
const getTemplateChildren = (node: HTMLTemplateElement) => {
    if (node.content) {
        return node.content.childNodes;
    }
    return node.childNodes;
};


/**
 * Split a string into chunks, where even indexes are real strings and odd indexes are expressions.
 */
const PARSE_REGEX = /\{\{(.*?)\}\}/g;

/**
 * Escape single quote from expressions.
 *
 * @param text The text to escape
 */
const escape = (text: string): string => text.replace(/'/g, '\\\'').replace(/\n/g, '\\n');

/**
 * Create an InterpolationFunction.
 *
 * @param expression The expression to compile.
 * @return The result of the interpolation.
 */
export const interpolate = (expression: string, scope: Scope): any => {
    // split the expression into chunks
    const chunks = expression.trim().split(PARSE_REGEX);
    // the generated function body
    let body = 'with(this) return ';

    body += chunks
        .map((match, index) => {
            if (!match) {
                return;
            }
            if (index % 2 === 0) {
                // even indexes are just strings
                return `'${escape(match)}'`;
            }
            return `(${match})`;
        })
        .filter((statement) => !!statement)
        .join('+');

    body += ';';

    return new Function(body).call(scope);
};

/**
 * Convert nodes into virtual DOM template.
 *
 * @param node The node to convert.
 * @return The virtual DOM template function.
 */
function innerCompile(scope: Scope, node: HTMLElement, namespace?: Namespaces): HyperNode;
function innerCompile(scope: Scope, node: Text): string;
function innerCompile(scope: Scope, node: Node[], namespace?: Namespaces): HyperNode[];
function innerCompile(scope: Scope, node: NodeList, namespace?: Namespaces): HyperNode[];
function innerCompile(scope: Scope, node: HTMLElement | Text | NodeList | Node[], namespace?: Namespaces): Template | Template[] {
    if (isElement(node)) {
        // the current node is an element
        // get the tag name
        const tag = node.localName;

        if (tag === 'template') {
            if (node.hasAttribute('if')) {
                const ifStatemenet = interpolate(node.getAttribute('if') as string, scope);
                if (!ifStatemenet) {
                    return [];
                }
            }

            const children = getTemplateChildren(node as HTMLTemplateElement);

            let newChildren: Template[] = [];
            if (node.hasAttribute('repeat')) {
                // extract the `key` variable to use in the template
                const keyVar = node.getAttribute('key') || '$key';
                // extract the `item` variable to use in the template
                const itemVar = node.getAttribute('item') || '$item';
                const array = interpolate(node.getAttribute('repeat') as string, scope);
                for (let key in array) {
                    let item = array[key];
                    // augment the scope of the child
                    let childScope = createScope(scope, {
                        [keyVar]: key,
                        [itemVar]: item,
                    });

                    newChildren.push(innerCompile(childScope, children));
                }
            } else {
                newChildren = innerCompile(scope, children);
            }
            return newChildren;
        }

        if (tag === 'svg') {
            namespace = Namespaces.SVG;
        }

        // use node's attributes as properties
        const properties: any = {
            namespaceURI: namespace,
        };
        for (let i = 0; i < node.attributes.length; i++) {
            let attr = node.attributes[i];
            if (attr.value === '') {
                properties[attr.name] = true;
            } else {
                properties[attr.name] = interpolate(attr.value, scope);
            }
        }

        // compile children and use their virtual DOM functions
        return h(tag, properties, ...innerCompile(scope, node.childNodes, namespace));
    }

    if (isText(node)) {
        // the current node is text content
        return interpolate(node.textContent || '', scope);
    }

    const children: Array<Element | Text> = [];
    for (let i = 0, len = node.length; i < len; i++) {
        let child = node[i];
        let nextChild = node[i + 1];
        if (isText(child)) {
            if ((i === 0 || !nextChild || isElement(nextChild)) && !(child.textContent as string).trim()) {
                continue;
            }
            children.push(child);
        } else if (isElement(child)) {
            children.push(child);
        }
    }

    // iterate nodes and convert them to virtual DOM using the internal function
    return children.map((child) => innerCompile(scope, child as any, namespace));
}

/**
 * Compile a template element into virtual DOM template.
 *
 * @param template The template to parse.
 * @return The virtual DOM template function.
 */
export const template = (template: HTMLTemplateElement, scope: Scope): Template => innerCompile(scope, getTemplateChildren(template));

const innerHtml = htm.bind(h);

/**
 * Compile a template string into virtual DOM template.
 *
 * @return The virtual DOM template function.
 */
export const html = (string: string | TemplateStringsArray, ...values: any[]): Template => {
    if (typeof string === 'string') {
        const array = [string];
        (array as any).raw = [string];
        string = array as unknown as TemplateStringsArray;
    }
    return innerHtml(string, ...values);
};
