/* eslint-env mocha */

export async function getModule() {
    if (typeof window === 'undefined') {
        return await import('../dist/adapters/node.js');
    }
    return await import('../dist/esm/dna.js');
}
