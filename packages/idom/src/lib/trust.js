/**
 * @class TrustedData
 * @private
 * Handle trusted content.
 */
export class TrustedData {
    /**
     * Create a TrustedData instance.
     * @param {String} data The content data.
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Render the content as string.
     * @return {String}
     */
    toString() {
        return `${this.data}`;
    }
}

/**
 * Trust some content and render it as HTML.
 * @memberof DNA
 *
 * @param {String} data The content data to inject.
 * @return {TrustedData} The trusted data reference.
 */
export function trust(data) {
    return new TrustedData(data);
}
