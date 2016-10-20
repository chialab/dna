/* eslint-env mocha */

export function debounce(callback) {
    before((done) => {
        callback();
        setTimeout(() => done(), 500);
    });
}
