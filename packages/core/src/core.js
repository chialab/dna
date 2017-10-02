import * as DOM from './lib/dom.js';
import { ComponentMixin } from './mixins/component.js';
import { PropertiesMixin } from './mixins/properties-component.js';
import { EventsMixin } from './mixins/events-component.js';
import { StyleMixin } from './mixins/style-component.js';
import { TemplateMixin } from './mixins/template-component.js';

/**
 * A set of DOM helpers for callbacks trigger when Custom Elements
 * are not supported by the browser.
 * @module DOM
 * @memberof DNA
 */
export { DOM };
/**
 * A set of core mixins.
 * @module MIXINS
 * @memberof DNA
 */
export const MIXINS = {
    ComponentMixin,
    PropertiesMixin,
    EventsMixin,
    StyleMixin,
    TemplateMixin,
};
export { mix } from './lib/mixins.js';
export { prop } from './lib/property.js';
