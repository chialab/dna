import type { ElementTagNameMap } from './types';
import type { VProperties, VObject } from './render';

declare global {
    namespace JSX {
        type Element = VObject;
        type IntrinsicElements = {
            [K in keyof ElementTagNameMap]: VProperties<K>;
        }
    }
}
