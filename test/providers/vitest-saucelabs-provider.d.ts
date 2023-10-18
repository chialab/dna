import type { SauceConnectOptions, SauceLabsOptions } from 'saucelabs';
import type { RemoteOptions } from 'webdriverio';

interface SaucelabsConfig {
    options?: Partial<SauceLabsOptions>;
    connect?: Partial<SauceConnectOptions>;
    capabilities?: Record<string, RemoteOptions['capabilities']>;
}

declare module 'vite' {
    interface UserConfig {
        saucelabs?: SaucelabsConfig;
    }
}
