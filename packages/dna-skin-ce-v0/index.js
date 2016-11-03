/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Skin template and Custom Elements v0 spec.
 */
import { SkinTemplateMixin } from 'dna-skin/src/mixins/skin.js';
import { mix, MIXINS, BaseComponent as OriginalComponent } from 'dna-custom-elements-v0';

MIXINS.SkinTemplateMixin = SkinTemplateMixin;

export { mix, MIXINS };
export { Template, IDOM } from 'dna-skin';
export { registry, render, define, prop, shim, HELPERS } from 'dna-custom-elements-v0';
export class BaseComponent extends mix(OriginalComponent).with(SkinTemplateMixin) {}
