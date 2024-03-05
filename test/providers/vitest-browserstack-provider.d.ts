import type { Options } from 'browserstack-local';
import type { RemoteOptions } from 'webdriverio';

interface BrowserStackConfig {
    options?: Partial<Options>;
    capabilities?: Record<string, RemoteOptions['capabilities']>;
}

declare module 'vite' {
    interface ResolvedConfig {
        browserstack?: BrowserStackConfig;
    }
}
