import { Component } from '@chialab/dna';
import { warnCode } from './deprecations';

export function proxy(element: Component) {
    warnCode('PROXY_HELPER');
    return element;
}
