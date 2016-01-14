'use strict';

/**
 * Config class
 * @class DNAConfig
 */
class DNAConfig {}

/**
 * @property {Boolean} useWebComponents Should register components as WebComponents.
 */
DNAConfig.useWebComponents = (typeof window !== 'undefined' && typeof window.WebComponents !== 'undefined');

export { DNAConfig }
