import { ComponentInterface } from '@chialab/dna';
import { warnCode } from './deprecations';

export function proxy(element: ComponentInterface<any>) {
    warnCode('PROXY_HELPER');
    return element;
}
