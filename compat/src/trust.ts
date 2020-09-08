import { html } from '@chialab/dna';
import { warnCode } from './deprecations';

/**
 * Trust some content and render it as HTML.
 * @deprecated since version 3.0
 * @param text The content data to inject.
 * @return The converted template item.
 */
export function trust(text: string) {
    warnCode('TRUST_HELPER');
    return html(text);
}
