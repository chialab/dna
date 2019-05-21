import * as DNA from '../dist/esm/dna.js';

export async function getModule() {
    if (typeof window === 'undefined') {
        const { adapter } = await import('../dist/adapters/node.js');
        adapter(DNA);
    }
    return DNA;
}
