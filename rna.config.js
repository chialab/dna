/**
 * @type {import('@chialab/rna-config-loader').ProjectConfig}
 */
const config = {
    entrypoints: [
        {
            input: 'src/index.ts',
            output: 'dist/esm/dna.js',
            format: 'esm',
            minify: true,
            platform: 'browser',
        },
        {
            input: 'src/index.ts',
            output: 'dist/node/dna.js',
            format: 'esm',
            minify: true,
            platform: 'node',
        },
        {
            input: 'src/index.ts',
            output: 'dist/cjs/dna.cjs',
            format: 'cjs',
            minify: true,
            platform: 'node',
        },
    ],
};

export default config;
