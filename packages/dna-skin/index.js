/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Skin template.
 */
import Template from 'skin-template';
import { SkinTemplateMixin } from './src/mixins/skin.js';
import { mix, MIXINS, BaseComponent as OriginalComponent } from 'dna-components';

MIXINS.SkinTemplateMixin = SkinTemplateMixin;

export { mix, MIXINS };
export { Template };
export { registry, render, define, prop, shim, HELPERS, DOM } from 'dna-components';
export class BaseComponent extends mix(OriginalComponent).with(SkinTemplateMixin) {}
