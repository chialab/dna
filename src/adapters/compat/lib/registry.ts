import { DOM, extend, customElements } from '@chialab/dna';
import { mixin, BaseComponent } from './BaseComponent';
import { warnCode } from './deprecations';

Object.defineProperty(customElements, 'components', {
    configurable: false,
    get() {
        return this.registry;
    },
});

const define = customElements.define;
customElements.define = function(name, constructor, options) {
    if (!options || !options.extends) {
        return define.call(this, name, constructor, options);
    }
    let tag = options.extends;
    let builtinConstructor = DOM.createElement(tag).constructor as typeof HTMLElement;
    if ((constructor.prototype instanceof builtinConstructor)) {
        return define.call(this, name, constructor, options);
    }
    let proto = constructor;
    let superProto = constructor;
    while (proto !== BaseComponent) {
        superProto = proto;
        proto = Object.getPrototypeOf(proto);
    }
    warnCode('EXTEND_BUILTIN');
    let extendBuiltin = mixin(extend(builtinConstructor));
    Object.setPrototypeOf(superProto, extendBuiltin);
    (superProto as any).apply = Function.apply;
    (superProto as any).call = Function.call;
    Object.setPrototypeOf(superProto.prototype, extendBuiltin.prototype);
    return define.call(this, name, constructor, options);
};

export { customElements as registry };
