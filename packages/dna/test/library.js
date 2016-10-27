import { mix, BaseComponent } from '../dna-idom.js';
import { SkinTemplateMixin } from '../src/interop/skin.js';

export * from '../dna-idom.js';
export * from '../src/interop/skin.js';

export class TestComponent extends mix(BaseComponent).with(SkinTemplateMixin) {}
