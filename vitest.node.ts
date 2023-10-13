import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config';

export default mergeConfig(
    vitestConfig,
    defineConfig({
        test: {
            environment: 'node',
            alias: {
                $env: './src/env.node.ts',
            },
        },
    })
);
