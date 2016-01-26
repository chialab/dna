'use strict';

/**
 * Config class
 * @class DNAConfig
 */
class DNAConfig {}

/**
 * @property {Boolean} useWebComponents Should register components as WebComponents.
 */
DNAConfig.useWebComponents = (typeof window !== 'undefined' && (typeof window.WebComponents !== 'undefined' || typeof window.CustomElements !== 'undefined'));

/**
 * @property {Boolean} useVirtualDOM Should use [`virtual-dom`](https://github.com/Matt-Esch/virtual-dom) for template render.
 */
DNAConfig.useVirtualDOM = (typeof window !== 'undefined' && typeof window.virtualDom !== 'undefined');

/**
 * @property {Boolean} autoUpdateView Should the Component auto update own view.
 */
DNAConfig.autoUpdateView = true;

export { DNAConfig }
