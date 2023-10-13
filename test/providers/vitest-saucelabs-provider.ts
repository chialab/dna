import type { Awaitable } from '@vitest/utils';
import ip from 'ip';
import Saucelabs, { type SauceConnectInstance, type SauceLabsOptions } from 'saucelabs';
import { remote, type Browser, type RemoteOptions } from 'webdriverio';

/**
 * A Saucelabs provider for vitest.
 */
export default class SaucelabsProvider {
    name = 'saucelabs';

    protected testName: string;
    protected saucelabs: Saucelabs;
    protected sauceOptions: Partial<SauceLabsOptions>;
    protected capabilities: RemoteOptions['capabilities'];
    protected tunnelIdentifier: string;

    private _browserPromise: Promise<Browser> | null = null;
    private _tunnelPromise: Promise<SauceConnectInstance> | null = null;

    getSupportedBrowsers() {
        return Object.assign([], {
            includes: (value: string) => value.startsWith('sauce:'),
        });
    }

    initialize(ctx, { browser }) {
        const saucelabsConfig = ctx.browser.config.saucelabs || {};

        this.testName = ctx.config.name;
        const sauceOptions = (this.sauceOptions = {
            user: process.env.SAUCE_USERNAME as string,
            key: process.env.SAUCE_ACCESS_KEY as string,
            ...saucelabsConfig.options,
        });
        this.capabilities = saucelabsConfig.capabilities[browser.replace('sauce:', '')];
        if (!this.capabilities) {
            throw new Error(`Missing capabilities for browser name ${browser}`);
        }

        this.tunnelIdentifier = `vitest-${Date.now()}`;
        this.saucelabs = new Saucelabs(sauceOptions);
    }

    protected async startTunnel() {
        if (this._tunnelPromise) {
            return this._tunnelPromise;
        }

        return (this._tunnelPromise = this.saucelabs.startSauceConnect({
            tunnelIdentifier: this.tunnelIdentifier,
            noSslBumpDomains: 'all',
        }));
    }

    async openBrowser() {
        if (this._browserPromise) {
            return this._browserPromise;
        }

        return (this._browserPromise = Promise.resolve().then(async () => {
            await this.startTunnel();
            return remote({
                logLevel: 'error',
                capabilities: {
                    ...this.capabilities,
                    'sauce:options': {
                        name: this.testName,
                        build: this.testName,
                        tunnelIdentifier: this.tunnelIdentifier,
                    },
                },
                user: this.sauceOptions.user,
                key: this.sauceOptions.key,
            });
        }));
    }

    async openPage(url: string) {
        const browser = await this.openBrowser();
        const networkAddress = ip.address();
        if (networkAddress) {
            url = url.replace(/(localhost|127\.0\.0\.1|0\.0\.0\.0)/, networkAddress);
        }

        await browser.navigateTo(url);
    }

    // TODO
    // @see https://github.com/vitest-dev/vitest/blob/eac7776521bcf4e335771b1ab4f823f40ad9c4ff/packages/vitest/src/node/browser/webdriver.ts#L74
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catchError(_cb: (error: Error) => Awaitable<void>) {
        return () => {};
    }

    async close() {
        try {
            if (this._tunnelPromise) {
                const tunnel = await this._tunnelPromise;
                await tunnel.close();
            }
        } catch {
            //
        }
        try {
            if (this._browserPromise) {
                const browser = await this._browserPromise;
                await browser.deleteSession();
            }
        } catch {
            //
        }
        // TODO
        // @see https://github.com/vitest-dev/vitest/blob/eac7776521bcf4e335771b1ab4f823f40ad9c4ff/packages/vitest/src/node/browser/webdriver.ts#L83
        process.exit();
    }
}
