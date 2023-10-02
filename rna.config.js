/**
 * @type {import('@chialab/rna-config-loader').ProjectConfig}
 */
const config = {
    entrypoints: [
        {
            input: 'src/index.ts',
            output: 'dist/esm/dna.js',
            format: 'esm',
            platform: 'neutral',
        },
        {
            input: 'src/index.browser.ts',
            output: 'dist/browser/dna.js',
            format: 'esm',
            platform: 'browser',
        },
        {
            input: 'src/index.node.ts',
            output: 'dist/node/dna.js',
            format: 'esm',
            platform: 'node',
        },
        {
            input: 'src/index.node.ts',
            output: 'dist/cjs/dna.cjs',
            format: 'cjs',
            platform: 'node',
        },
    ],
    minify: true,
};

export default config;
