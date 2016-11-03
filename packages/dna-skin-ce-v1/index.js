/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Skin template and Custome Elements spec.
 */
import { mix, shim, MIXINS } from '@dnajs/custom-elements-v1';
import { SkinTemplateMixin } from '@dnajs/skin/src/mixins/skin.js';
import Template from 'skin-template';

MIXINS.SkinTemplateMixin = SkinTemplateMixin;

export { Template };
export const IDOM = Template.IDOM;
export { mix, shim, MIXINS };
export { registry, render, define, prop, HELPERS } from '@dnajs/custom-elements-v1';

export class BaseComponent extends mix(
    shim(self.HTMLElement)
).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    MIXINS.SkinTemplateMixin,
    MIXINS.OuterMixin
) {}
