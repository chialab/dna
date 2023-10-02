import { fileURLToPath } from 'node:url';

const BROWSER_ENV = fileURLToPath(new URL('./src/env.browser.ts', import.meta.url));
const NODE_ENV = fileURLToPath(new URL('./src/env.node.ts', import.meta.url));

/**
 * @type {import('@chialab/rna-config-loader').ProjectConfig}
 */
const config = {
    entrypoints: [
        {
            input: 'src/index.ts',
            output: 'dist/esm/dna.js',
            format: 'esm',
            platform: 'browser',
            alias: {
                $env: BROWSER_ENV,
            },
        },
        {
            input: 'src/index.ts',
            output: 'dist/browser/dna.js',
            format: 'esm',
            platform: 'browser',
            alias: {
                $env: BROWSER_ENV,
            },
        },
        {
            input: 'src/index.ts',
            output: 'dist/node/dna.js',
            format: 'esm',
            platform: 'node',
            alias: {
                $env: NODE_ENV,
            },
        },
        {
            input: 'src/index.ts',
            output: 'dist/cjs/dna.cjs',
            format: 'cjs',
            platform: 'node',
            alias: {
                $env: NODE_ENV,
            },
        },
    ],
    // minify: true,
};

export default config;
