import { Local, type Options } from 'browserstack-local';
import ip from 'ip';
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
 * A BrowserStack provider for vitest.
 */
export default class BrowserStackProvider {
    name = 'browserstack';

    /**
     * Vitest does not exposes WorkspaceProject
     * @see https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/workspace.ts
     */
    protected ctx: any;
    protected testName: string;
    protected bs: Local;
    protected bsOptions: Partial<Options>;
    protected capabilities: RemoteOptions['capabilities'];

    private _browserPromise: Promise<Browser> | null = null;
    private _tunnelPromise: Promise<() => Promise<void>> | null = null;

    getSupportedBrowsers() {
        return Object.assign([], {
            includes: (value: string) => value.startsWith('browserstack:'),
        });
    }

    initialize({ ctx, config, browser }, { browser: browserName }) {
        this.ctx = ctx;
        this.testName = config.name;

        const browserstackConfig = browser.config.browserstack || {};
        this.bsOptions = {
            force: true,
            forceLocal: true,
            user: process.env.BROWSERSTACK_USERNAME as string,
            key: process.env.BROWSERSTACK_ACCESS_KEY as string,
            localIdentifier: `vitest-${Date.now()}`,
            ...browserstackConfig.options,
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

        await browser.executeScript('browserstack_executor: {"action": "acceptSsl"}', []);
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

                // const { user, key } = this.browserstackOptions;
                // if (user && key) {
                //     const files = this.ctx.state.getFiles();
                //     const passed = !!files.length && !hasFailed(Array.from(files));
                //     await fetch(`https://saucelabs.com/rest/v1/${user}/jobs/${browser.sessionId}`, {
                //         method: 'PUT',
                //         headers: {
                //             'Authorization': `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}`,
                //             'Content-Type': 'application/json',
                //         },
                //         body: JSON.stringify({
                //             passed,
                //         }),
                //     });
                // }
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