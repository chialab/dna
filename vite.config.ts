import { fileURLToPath } from 'node:url';
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        UnpluginIsolatedDecl(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/frameworks/*.d.ts',
                    dest: 'frameworks',
                },
            ],
        }),
    ],
    build: {
        lib: {
            entry: {
                dna: 'src/index.ts',
                'jsx-runtime': 'src/jsx-runtime.ts',
            },
            formats: ['es'],
        },
        rollupOptions: {
            output: {
                dir: 'dist',
                entryFileNames: '[name].js',
                chunkFileNames: '[name]-[hash].js',
                format: 'es',
            },
        },
        sourcemap: true,
    },
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
