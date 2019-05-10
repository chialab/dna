import * as DNA from '../dist/esm/dna';

export function getModule() {
    if (typeof window !== 'undefined') {
        return DNA;
    }
    return require('../dist/node/dna');
}
