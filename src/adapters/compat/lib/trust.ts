import { html } from '@chialab/dna';
import { warnCode } from './deprecations';

export function trust(text: string) {
    warnCode('TRUST_HELPER');
    return html(text);
}
