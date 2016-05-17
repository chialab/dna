'use strict';

module.exports = function(karma) {
    karma.set({
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 1,
        browserNoActivityTimeout: 4 * 60 * 1000,
        captureTimeout: 4 * 60 * 1000,
    });
};
