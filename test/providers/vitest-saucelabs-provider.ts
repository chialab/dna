import ip from 'ip';
import Saucelabs, { type SauceConnectInstance, type SauceConnectOptions, type SauceLabsOptions } from 'saucelabs';
import type { Task } from 'vitest';
import { remote, type Browser, type RemoteOptions } from 'webdriverio';

/**
 * Check if a test of the suite has failed.
 * @param suite List of tasks.
 * @returns Whetever the suite failed or not.
 * @see https://github.com/vitest-dev/vitest/blob/main/packages/runner/src/utils/tasks.ts
 */
function hasFailed(suite: Task[]): boolean {
    return suite.some((s) => !s.result || s.result.state === 'fail' || (s.type === 'suite' && hasFailed(s.tasks)));
}

/**
 * A Saucelabs provider for vitest.
 */
export default class SaucelabsProvider {
    name = 'saucelabs';

    /**
     * Vitest does not exposes WorkspaceProject
     * @see https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/workspace.ts
     */
    protected ctx: any;
    protected testName: string;
    protected saucelabs: Saucelabs;
    protected sauceOptions: Partial<SauceLabsOptions>;
    protected connectOptions: Partial<SauceConnectOptions>;
    protected capabilities: RemoteOptions['capabilities'];

    private _browserPromise: Promise<Browser> | null = null;
    private _tunnelPromise: Promise<SauceConnectInstance> | null = null;
    private _heartbeat: ReturnType<typeof setInterval>;

    getSupportedBrowsers() {
        return Object.assign([], {
            includes: (value: string) => value.startsWith('sauce:'),
        });
    }

    initialize({ ctx, config, browser }, { browser: browserName }) {
        this.ctx = ctx;
        this.testName = config.name;

        const saucelabsConfig = browser.config.saucelabs || {};
        const sauceOptions = (this.sauceOptions = {
            user: process.env.SAUCE_USERNAME as string,
            key: process.env.SAUCE_ACCESS_KEY as string,
            ...saucelabsConfig.options,
        });
        this.connectOptions = {
            tunnelIdentifier: `vitest-${Date.now()}`,
            noSslBumpDomains: 'all',
            ...saucelabsConfig.connect,
        };
        this.capabilities = saucelabsConfig.capabilities[browserName.replace('sauce:', '')];
        if (!this.capabilities) {
            throw new Error(`Missing capabilities for browser name ${browserName}`);
        }
        this.saucelabs = new Saucelabs(sauceOptions);
    }

    protected async startTunnel() {
        if (this._tunnelPromise) {
            return this._tunnelPromise;
        }

        return (this._tunnelPromise = this.saucelabs.startSauceConnect(this.connectOptions));
    }

    protected setupHeartbeat(browser: Browser) {
        this._heartbeat = setInterval(async () => {
            try {
                await browser.getTitle();
            } catch (e) {
                if (this._heartbeat != null) {
                    clearInterval(this._heartbeat);
                }
            }
        }, 60 * 1000);
    }

    async openBrowser() {
        if (this._browserPromise) {
            return this._browserPromise;
        }

        return (this._browserPromise = Promise.resolve().then(async () => {
            await this.startTunnel();

            const capabilities =
                'version' in this.capabilities
                    ? {
                          ...this.capabilities,
                          name: this.testName,
                          build: this.testName,
                          tunnelIdentifier: this.connectOptions.tunnelIdentifier,
                      }
                    : {
                          ...this.capabilities,
                          'sauce:options': {
                              name: this.testName,
                              build: this.testName,
                              tunnelIdentifier: this.connectOptions.tunnelIdentifier,
                          },
                      };

            const browser = await remote({
                logLevel: 'error',
                capabilities,
                user: this.sauceOptions.user,
                key: this.sauceOptions.key,
            });

            this.setupHeartbeat(browser);

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

    /**
     * TODO
     * @returns A callback.
     * @see https://github.com/vitest-dev/vitest/blob/eac7776521bcf4e335771b1ab4f823f40ad9c4ff/packages/vitest/src/node/browser/webdriver.ts#L74
     */
    catchError() {
        return () => {};
    }

    async close() {
        if (this._heartbeat != null) {
            clearInterval(this._heartbeat);
        }

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

                const { user, key } = this.sauceOptions;
                if (user && key) {
                    const files = this.ctx.state.getFiles();
                    const passed = !!files.length && !hasFailed(Array.from(files));
                    await fetch(`https://saucelabs.com/rest/v1/${user}/jobs/${browser.sessionId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            passed,
                        }),
                    });
                }
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
