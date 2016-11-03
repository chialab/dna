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
import { OuterMixin } from './src/mixins/outer.js';
import { mix, MIXINS, BaseComponent as OriginalComponent } from '@dna/core';

MIXINS.SkinTemplateMixin = SkinTemplateMixin;
MIXINS.OuterMixin = OuterMixin;

export { mix, MIXINS };
export { Template };
export const IDOM = Template.IDOM;
export { registry, render, define, prop, shim, HELPERS, DOM } from '@dna/core';
export class BaseComponent extends mix(OriginalComponent).with(
    SkinTemplateMixin, OuterMixin
) {}
