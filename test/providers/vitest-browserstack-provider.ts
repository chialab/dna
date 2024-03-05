import { Local, type Options } from 'browserstack-local';
import ip from 'ip';
import type { BrowserProvider, BrowserProviderInitializationOptions, WorkspaceProject } from 'vitest/node';
import { remote, type RemoteOptions } from 'webdriverio';

/**
 * A BrowserStack provider for vitest.
 */
export default class BrowserStackProvider implements BrowserProvider {
    name = 'browserstack';

    protected ctx: WorkspaceProject;
    protected testName: string;
    protected bs: Local;
    protected bsOptions: Partial<Options>;
    protected capabilities: RemoteOptions['capabilities'];

    private _browserPromise: Promise<WebdriverIO.Browser> | null = null;
    private _tunnelPromise: Promise<() => Promise<void>> | null = null;

    getSupportedBrowsers() {
        return Object.assign([], {
            includes: (value: string) => value.startsWith('browserstack:'),
        });
    }

    initialize(ctx: WorkspaceProject, options: BrowserProviderInitializationOptions) {
        this.ctx = ctx;

        const { config, browser } = ctx;
        if (!browser) {
            throw new Error('BrowserStack provider requires a browser configuration');
        }

        this.testName = config.name;

        const { browser: browserName } = options;
        const browserstackConfig = browser.config.browserstack || {};
        if (!browserstackConfig.capabilities) {
            throw new Error('Missing capabilities in browserstack configuration');
        }

        this.bsOptions = {
            force: true,
            forceLocal: true,
            user: process.env.BROWSERSTACK_USERNAME as string,
            key: process.env.BROWSERSTACK_ACCESS_KEY as string,
            localIdentifier: `vitest-${Date.now()}`,
            ...(browserstackConfig.options || {}),
        };
        this.capabilities = browserstackConfig.capabilities[browserName.replace('browserstack:', '')];
        if (!this.capabilities) {
            throw new Error(`Missing capabilities for browser name ${browserName}`);
        }
        this.bs = new Local();
    }

    protected async startTunnel() {
        if (this._tunnelPromise) {
            return this._tunnelPromise;
        }

        return (this._tunnelPromise = new Promise((resolve, reject) => {
            this.bs.start(this.bsOptions, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(
                        () =>
                            new Promise((resolve) => {
                                this.bs.stop(() => resolve());
                            })
                    );
                }
            });
        }));
    }

    async openBrowser() {
        if (this._browserPromise) {
            return this._browserPromise;
        }

        return (this._browserPromise = Promise.resolve().then(async () => {
            await this.startTunnel();

            const capabilities = {
                ...this.capabilities,
                'bstack:options': {
                    ...this.capabilities['bstack:options'],
                    local: true,
                    buildName: this.testName,
                    localIdentifier: this.bsOptions.localIdentifier,
                },
            };

            const browser = await remote({
                logLevel: 'error',
                capabilities,
                user: this.bsOptions.user as string,
                key: this.bsOptions.key as string,
            });

            return browser;
        }));
    }

    async openPage(url: string) {
        const browser = await this.openBrowser();
        const networkAddress = ip.address();
        if (networkAddress) {
            url = url.replace(/(localhost|127\.0\.0\.1|0\.0\.0\.0)/, networkAddress);
        }

        await browser.navigateTo(url);

        const title = await browser.getTitle();
        if (title !== 'Vitest Browser Runner') {
            throw new Error('Failed to open url');
        }
    }

    async close() {
        try {
            if (this._tunnelPromise) {
                const closeTunnel = await this._tunnelPromise;
                await closeTunnel();
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

        /**
         * TODO
         * @see https://github.com/vitest-dev/vitest/blob/eac7776521bcf4e335771b1ab4f823f40ad9c4ff/packages/vitest/src/node/browser/webdriver.ts#L83
         */
        process.exit();
    }
}
