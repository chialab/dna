import { shim } from './shim';
import { mixin } from './mixin';
import { DOM } from './dom';

/**
 * Cache extended cosntructors.
 */
const CONSTRUCTOR_CACHE: {
    [key: string]: typeof HTMLElement,
} = {};

/**
 * Create a base Component starting from a native constructor.
 * @param tagName The tag name of the native constructor.
 * @return A class which extends the native constructor with DNA features.
 */
export function extend<T extends typeof HTMLElement>(tagName: string) {
    if (CONSTRUCTOR_CACHE[tagName]) {
        return CONSTRUCTOR_CACHE[tagName] as T;
    }
    const constructor = mixin(shim(DOM.createElement(tagName).constructor as unknown as T));
    CONSTRUCTOR_CACHE[tagName] = constructor;
    return constructor;
}
