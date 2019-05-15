export async function getModule() {
    if (typeof window !== 'undefined') {
        return await import('../dist/esm/dna.js');
    }
    return await import('../dist/node/dna');
}
