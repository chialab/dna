import { mix, BaseComponent } from '../src/dna-idom.js';
import { SkinTemplateMixin } from '../src/interop/skin.js';

export * from '../src/dna-idom.js';
export * from '../src/interop/skin.js';

export class TestComponent extends mix(BaseComponent).with(SkinTemplateMixin) {}
