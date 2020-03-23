import { CustomElement } from '@chialab/dna';
import { warnCode } from './deprecations';

export function proxy(element: CustomElement) {
    warnCode('PROXY_HELPER');
    return element;
}
