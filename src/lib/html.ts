import { interpolate, InterpolateFunction } from './interpolate';
import { h, HyperFunction } from './h';
import { Template } from './render';
import { DOM } from './dom';

function isTemplateTag(node: any): node is HTMLTemplateElement {
    return node && node.tagName === 'TEMPLATE';
}

function innerCompile(template: HTMLElement): HyperFunction;
function innerCompile(template: Text): InterpolateFunction;
function innerCompile(template: Node[]): Array<HyperFunction | InterpolateFunction>;
function innerCompile(template: NodeList): Array<HyperFunction | InterpolateFunction>;
function innerCompile(template: HTMLTemplateElement | HTMLStyleElement | HTMLElement | Text | NodeList | Node[]): Template | Template[] {
    if (DOM.isElement(template)) {
        // the current node is an element
        // get the tag name
        const tag = template.localName;

        // use node's attributes as properties
        const properties: any = {};
        for (let i = 0; i < template.attributes.length; i++) {
            let attr = template.attributes[i];
            properties[attr.name] = interpolate(attr.value);
        }

        let childNodes: NodeList;
        if (isTemplateTag(template)) {
            childNodes = template.content.childNodes;
        } else {
            childNodes = template.childNodes;
        }

        // compile children and use their virtual DOM functions
        return h(tag, properties, ...innerCompile(childNodes));
    }

    if (DOM.isText(template)) {
        // the current node is text content
        return interpolate(template.textContent || '');
    }

    const children: Array<HTMLElement | Text> = [];
    for (let i = 0, len = template.length; i < len; i++) {
        let child = template[i];
        let nextChild = template[i + 1];
        if (DOM.isText(child)) {
            if ((i === 0 || !nextChild || DOM.isElement(nextChild)) && !(child.textContent as string).trim()) {
                continue;
            }
            children.push(child);
        } else if (DOM.isElement(child)) {
            children.push(child);
        }
    }

    // iterate nodes and convert them to virtual DOM using the internal function
    return children.map((child) => innerCompile(child as any));
}

/**
 * Compile a template string into virtual DOM template.
 *
 * @param template The template to parse
 * @return The virtual DOM template function
 */
export function html(template: string): InterpolateFunction;
export function html(template: HTMLTemplateElement): Template;
export function html(template: HTMLElement): HyperFunction;
export function html(template: Text): InterpolateFunction;
export function html(template: NodeList): Array<HyperFunction | InterpolateFunction>;
export function html(template: string | HTMLTemplateElement | HTMLStyleElement | HTMLElement | Text | NodeList): Template {
    let chunks: Array<HyperFunction | InterpolateFunction>;
    if (isTemplateTag(template)) {
        chunks = innerCompile(template.content.childNodes);
    } else if (DOM.isElement(template)) {
        return innerCompile(template as HTMLElement);
    } else if (DOM.isText(template)) {
        return innerCompile(template);
    } else if (typeof template === 'string') {
        return innerCompile(DOM.parse(template));
    } else {
        chunks = innerCompile(template);
    }

    if (chunks.length === 1) {
        return chunks[0];
    }

    return chunks;
}
