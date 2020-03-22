import { extend } from '../../../lib/Component';
import { createSymbolKey } from '../../../lib/symbols';

const symbol: unique symbol = createSymbolKey() as any;
const mixin = (constructor: typeof HTMLElement) => {
    if ((constructor as any)[symbol]) {
        return (constructor as any)[symbol];
    }
    /* eslint-disable-next-line */
    console.warn('mixins had been deprecated in DNA 3.0');
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
