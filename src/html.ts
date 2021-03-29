import type { Template } from './Template';
import htm from 'htm';
import { h } from './HyperNode';

const innerHtml = htm.bind(h);

/**
 * Compile a template string into virtual DOM template.
 *
 * @return The virtual DOM template function.
 */
export const html = (string: string | TemplateStringsArray, ...values: unknown[]): Template => {
    if (typeof string === 'string') {
        let array = [string];
        (array as any).raw = [string];
        string = array as unknown as TemplateStringsArray;
    }
    return innerHtml(string, ...values);
};
