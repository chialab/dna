import { dispatch } from './lib/dispatch.js';
import * as DOM_HELPERS from './lib/dom.js';
import { ComponentMixin } from './mixins/component.js';
import { PropertiesMixin } from './mixins/properties-component.js';
import { EventsMixin } from './mixins/events-component.js';
import { StyleMixin } from './mixins/style-component.js';
import { TemplateMixin } from './mixins/template-component.js';

export const DOM = DOM_HELPERS;
export const MIXINS = {
    ComponentMixin,
    PropertiesMixin,
    EventsMixin,
    StyleMixin,
    TemplateMixin,
};
export const HELPERS = {
    dispatch,
};
export { mix } from './lib/mixins.js';
export { prop } from './lib/property.js';
export { shim } from './lib/shim.js';
export * from './lib/typeof.js';
