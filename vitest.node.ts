import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config';

export default mergeConfig(
    vitestConfig,
    defineConfig({
        resolve: {
            alias: {
                $env: './src/env.node.ts',
            },
        },
        test: {
            environment: 'node',
        },
    })
);
