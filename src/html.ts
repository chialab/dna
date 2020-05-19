import htm from 'htm';
import { Template } from './Template';
import { Context, createContext } from './Context';
import { h, HyperNode } from './HyperNode';
import { isElement, isText } from './DOM';
import { until } from './directives';
import { Observable } from './Observable';

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
export const interpolate = (expression: string, context: Context): any => {
    // split the expression into chunks
    const chunks = expression.trim().split(PARSE_REGEX);
    // the generated function body
    let body = 'with(this) var _=[';

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
        .join(',');

    body += '];return(_.length>1)?_:_[0]';

    return new Function(body).call(context);
};

/**
 * Convert nodes into virtual DOM template.
 *
 * @param node The node to convert.
 * @return The virtual DOM template function.
 */
function innerCompile(context: Context, node: HTMLElement, namespace?: Namespaces): HyperNode;
function innerCompile(context: Context, node: Text): string;
function innerCompile(context: Context, node: Node[], namespace?: Namespaces): HyperNode[];
function innerCompile(context: Context, node: NodeList, namespace?: Namespaces): HyperNode[];
function innerCompile(context: Context, node: HTMLElement | Text | NodeList | Node[], namespace?: Namespaces): Template | Template[] {
    if (isElement(node)) {
        // the current node is an element
        // get the tag name
        const tag = node.localName;

        if (tag === 'template') {
            if (node.hasAttribute('if')) {
                const ifStatemenet = interpolate(node.getAttribute('if') as string, context);
                if (!ifStatemenet) {
                    return [];
                }
            }

            const children = getTemplateChildren(node as HTMLTemplateElement);

            let newChildren: Template[] = [];
            if (node.hasAttribute('until')) {
                return until(
                    interpolate(node.getAttribute('until') as string, context),
                    innerCompile(context, children)
                );
            } else if (node.hasAttribute('then')) {
                let as = node.getAttribute('as') || '$resolved';
                let promise = interpolate(node.getAttribute('then') as string, context) as Promise<unknown>;
                return promise
                    .then((result: any) => {
                        context[as] = result;
                        return innerCompile(context, children);
                    });
            } else if (node.hasAttribute('catch')) {
                let as = node.getAttribute('as') || '$rejected';
                let promise = interpolate(node.getAttribute('catch') as string, context) as Promise<unknown>;
                return promise
                    .catch((error: Error) => {
                        context[as] = error;
                        return innerCompile(context, children);
                    });
            } else if (node.hasAttribute('pipe')) {
                let as = node.getAttribute('as') || '$value';
                let observable = interpolate(node.getAttribute('pipe') as string, context) as Observable<unknown>;
                return observable
                    .pipe((value) => {
                        context[as] = value;
                        return innerCompile(context, children);
                    });
            } else if (node.hasAttribute('repeat')) {
                // extract the `key` variable to use in the template
                let keyVar = node.getAttribute('key') || '$key';
                // extract the `item` variable to use in the template
                let itemVar = node.getAttribute('item') || '$item';
                let array = interpolate(node.getAttribute('repeat') as string, context);
                for (let key in array) {
                    let item = array[key];
                    // augment the context of the child
                    let childContext = createContext(context, {
                        [keyVar]: key,
                        [itemVar]: item,
                    });

                    newChildren.push(innerCompile(childContext, children));
                }
            } else {
                newChildren = innerCompile(context, children);
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
                properties[attr.name] = interpolate(attr.value, context);
            }
        }

        // compile children and use their virtual DOM functions
        return h(tag, properties, ...innerCompile(context, node.childNodes, namespace));
    }

    if (isText(node)) {
        // the current node is text content
        return interpolate(node.textContent || '', context);
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
    return children.map((child) => innerCompile(context, child as any, namespace));
}

/**
 * Compile a template element into virtual DOM template.
 *
 * @param template The template to parse.
 * @return The virtual DOM template function.
 */
export const template = (template: HTMLTemplateElement, context: Context): Template => innerCompile(context, getTemplateChildren(template));

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
