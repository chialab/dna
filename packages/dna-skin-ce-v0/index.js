/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Skin template and Custom Elements v0 spec.
 */
import { SkinTemplateMixin } from '@dnajs/skin/src/mixins/skin.js';
import { mix, MIXINS, BaseComponent as OriginalComponent } from '@dnajs/custom-elements-v0';

MIXINS.SkinTemplateMixin = SkinTemplateMixin;

export { mix, MIXINS };
export { Template, IDOM } from '@dnajs/skin';
export { registry, render, define, prop, shim, HELPERS } from '@dnajs/custom-elements-v0';
export class BaseComponent extends mix(OriginalComponent).with(
    SkinTemplateMixin
) {}
