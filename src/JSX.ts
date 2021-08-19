import type { TagNameMap } from './types';
import type { CustomElement } from './CustomElementRegistry';
import type { HyperElementProperties, HyperProperties, HyperObject } from './render';

declare global {
    namespace JSX {
        type Element = HyperObject;
        type ElementClass = CustomElement;
        type IntrinsicAttributes = HyperProperties;
        type IntrinsicClassAttributes = HyperProperties;
        type IntrinsicElements = {
            [T in keyof TagNameMap]: HyperElementProperties<TagNameMap[T]>;
        };
    }
}
