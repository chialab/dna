import { IComponent } from '@chialab/dna';
import { warnCode } from './deprecations';

export function proxy(element: IComponent) {
    warnCode('PROXY_HELPER');
    return element;
}
