const BASE_URL = 'https://www.chialab.io/p/dna/3.0.0/migration';

export function warn(message: string, url?: string) {
    /* eslint-disable-next-line */
    console.warn(`${message}${url ? ` (${url})` : ''}`);
}

export function warnCode(code: keyof typeof Code) {
    warn(Code[code], `${BASE_URL}#${code.toLowerCase()}`);
}

export enum Code {
    PREFER_RENDER = '`template` getter has been deprecated in DNA 3.0, use `render`',
    PREFER_STYLE = '`css` getter has been deprecated in DNA 3.0, use `render`',
    PREFER_PROPERTY_DESCRIPTOR = '`prop` helper has been deprecated in DNA 3.0, use property descriptors',
    PREFER_LISTENERS = '`events` getter has been deprecated in DNA 3.0, use `listeners` getter',
    LISTENER_STRING_REFERENCE = 'string method reference in event listeners has been deprecated in DNA 3.0, use prototype reference',
    PREFER_OBSERVE = '`observeProperty` method has been deprecated in DNA 3.0, use `observe`',
    PREFER_UNOBSERVE = '`unobserveProperty` method has been deprecated in DNA 3.0, use `unobserve`',
    PREFER_DISPATCH_EVENT = '`trigger` method has been deprecated in DNA 3.0, use `dispatchEvent`',
    PREFER_DELEGATE_EVENT_LISTENER = '`delegate` method has been deprecated in DNA 3.0, use `delegateEventListener`',
    PREFER_UNDELEGATE_EVENT_LISTENER = '`undelegate` method has been deprecated in DNA 3.0, use `undelegateEventListener`',
    TEMPLATE_FUNCTIONS = 'template functions have been deprecated in DNA 3.0',
    TEMPLATE_EMPTY_VALUES = 'zero and empty strings are no more considered falsy values in DNA 3.0',
    PREFER_INSTANCE = '`node` getter, `getNodeComponent`, `getComponentNode` have been deprecated in DNA 3.0',
    AVOID_MIXINS = 'mixins had been deprecated in DNA 3.0, use `Component`',
    RENDER_HELPER = '`render` signature has changed in DNA 3.0, pass instance instead of constructor',
    PROXY_HELPER = '`proxy` helper have been deprecated in DNA 3.0',
    TRUST_HELPER = '`trust` helper has been deprecated in DNA 3.0, use `html` instaed',
    MIX_HELPER = '`mix` helper has been deprecated in DNA 3.0, import it from @chialab/proteins',
    EXTEND_BUILTIN = 'custom elements should extends the builtin constructor',
}
