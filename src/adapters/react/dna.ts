import { window } from '@chialab/dna';
import { wrap } from './lib/wrap';

Object.defineProperty(window.HTMLElement, 'React', {
    get() {
        return wrap(this);
    },
});

export * from '@chialab/dna';
export * from './lib/convertReactNodes';
