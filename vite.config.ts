import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { type Plugin, defineConfig } from 'vitest/config';

const job = (() => {
    if (process.env.TRAVIS) {
        return `TRAVIS ${process.env.TRAVIS_BUILD_ID}#${process.env.TRAVIS_BUILD_NUMBER}`;
    }
    if (process.env.GITLAB_CI) {
        return `GITLAB ${process.env.CI_JOB_ID}#${process.env.CI_JOB_NAME}`;
    }
    if (process.env.GITHUB_ACTIONS) {
        return `GITHUB ${process.env.GITHUB_JOB}#${process.env.GITHUB_RUN_NUMBER}`;
    }

    return null;
})();

export default defineConfig({
    plugins: [svelte() as Plugin[], svelteTesting() as Plugin],
    esbuild: {
        include: /\.(m?(t|j)s|[jt]sx)$/,
        target: ['es2020'],
    },
    resolve: {
        conditions: ['browser'],
        alias: {
            '@chialab/dna/jsx-runtime': fileURLToPath(new URL('./src/jsx-runtime.ts', import.meta.url)),
            '@chialab/dna/jsx-dev-runtime': fileURLToPath(new URL('./src/jsx-runtime.ts', import.meta.url)),
            '@chialab/dna': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        },
    },
    test: {
        name: `DNA${job ? ` (${job})` : ''}`,
        dir: './test',
        include: ['./**/*.spec.{js,ts,tsx}'],
        fileParallelism: false,
        reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : [],
        coverage: {
            all: false,
            include: ['src/**/*'],
            reporter: ['clover', 'html'],
        },
        browser: {
            provider: 'playwright',
            headless: true,
            fileParallelism: false,
            instances: [
                {
                    browser: 'chromium',
                },
            ],
        },
    },
});
