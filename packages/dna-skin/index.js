/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Skin template.
 */

import { mix, BaseComponent as OriginalComponent } from 'dna-components';
import { SkinTemplateMixin } from './src/mixins/skin.js';

export * from 'dna-components';
export { SkinTemplateMixin };
export class BaseComponent extends mix(OriginalComponent).with(SkinTemplateMixin) {}
