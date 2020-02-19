import htm from 'htm/mini';
import { Template } from './Template';
import { InterpolationFunction, compile } from './InterpolationFunction';
import { HyperFunction } from './HyperFunction';
import { h } from './h';
import { DOM } from './DOM';

/**
 * Check if a node is a `<template>` element.
 * @param node The node to check.
 * @return The node is a `<template>` element.
 */
const isTemplateTag = (node: any): node is HTMLTemplateElement => node && node.tagName === 'TEMPLATE';

enum Namespaces {
    SVG = 'http://www.w3.org/2000/svg',
}

/**
 * Convert nodes into virtual DOM template.
 *
 * @param node The node to convert.
 * @return The virtual DOM template function.
 */
function innerCompile(node: HTMLElement, namespace?: Namespaces): HyperFunction;
function innerCompile(node: Text): InterpolationFunction;
function innerCompile(node: Node[], namespace?: Namespaces): Array<HyperFunction | InterpolationFunction>;
function innerCompile(node: NodeList, namespace?: Namespaces): Array<HyperFunction | InterpolationFunction>;
function innerCompile(node: HTMLElement | Text | NodeList | Node[], namespace?: Namespaces): Template | Template[] {
    if (DOM.isElement(node)) {
        // the current node is an element
        // get the tag name
        const tag = node.localName;

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
                properties[attr.name] = compile(attr.value);
            }
        }

        let childNodes: NodeList;
        if (isTemplateTag(node)) {
            childNodes = node.content.childNodes;
        } else {
            childNodes = node.childNodes;
        }

        // compile children and use their virtual DOM functions
        return h(tag, properties, ...innerCompile(childNodes, namespace));
    }

    if (DOM.isText(node)) {
        // the current node is text content
        return compile(node.textContent || '');
    }

    const children: Array<Element | Text> = [];
    for (let i = 0, len = node.length; i < len; i++) {
        let child = node[i];
        let nextChild = node[i + 1];
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
    return children.map((child) => innerCompile(child as any, namespace));
}

/**
 * Compile a template element into virtual DOM template.
 *
 * @param template The template to parse.
 * @return The virtual DOM template function.
 */
export const template = (template: HTMLTemplateElement): Template => innerCompile(template.content.childNodes);

/**
 * Compile a template string into virtual DOM template.
 *
 * @return The virtual DOM template function.
 */
export const html = htm.bind(h);
