import { CustomElement } from '@chialab/dna';

export function proxy(element: CustomElement) {
    /* eslint-disable-next-line */
    console.warn('proxy helper have been deprecated in DNA 3.0');
    return element;
}
