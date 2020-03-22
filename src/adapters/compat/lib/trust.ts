import { html } from '@chialab/dna';

export function trust(text: string) {
    /* eslint-disable-next-line */
    console.warn('trust helper has been deprecated in DNA 3.0');
    return html(text);
}
