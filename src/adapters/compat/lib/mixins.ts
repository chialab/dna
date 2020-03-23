import { extend } from '@chialab/dna';
import { createSymbolKey } from '../../../lib/symbols';
import { warnCode } from './deprecations';

const symbol: unique symbol = createSymbolKey() as any;
const mixin = (constructor: typeof HTMLElement) => {
    if ((constructor as any)[symbol]) {
        return (constructor as any)[symbol];
    }
    warnCode('AVOID_MIXINS');
    return (constructor as any)[symbol] = extend(constructor);
};

export const IDOMMixin = mixin;
export const MIXINS = {
    ComponentMixin: mixin,
    PropertiesMixin: mixin,
    EventsMixin: mixin,
    TemplateMixin: mixin,
    StyleMixin: mixin,
    IDOMMixin,
};
