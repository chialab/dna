import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue(), svelte(), svelteTesting()],
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
    optimizeDeps: {
        include: ['vue'],
    },
    test: {
        dir: './test',
        include: ['./**/*.spec.{js,ts,tsx}'],
        fileParallelism: false,
        reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : [],
        coverage: {
            all: false,
            provider: 'istanbul',
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
                {
                    browser: 'webkit',
                },
            ],
        },
    },
});
