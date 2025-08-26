import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: {
        include: /\.(m?(t|j)s|[jt]sx)$/,
        target: ['es2020'],
    },
    resolve: {
        alias: {
            '@chialab/dna/jsx-runtime': fileURLToPath(new URL('./src/jsx-runtime.ts', import.meta.url)),
            '@chialab/dna/jsx-dev-runtime': fileURLToPath(new URL('./src/jsx-runtime.ts', import.meta.url)),
            '@chialab/dna': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        },
    },
    test: {
        dir: './test',
        typecheck: {
            enabled: true,
            tsconfig: 'test/tsconfig.json',
        },
        fileParallelism: false,
        reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : [],
        coverage: {
            all: false,
            provider: 'istanbul',
            include: ['src/**/*'],
            reporter: ['clover', 'html'],
        },
    },
});
