import type { ElementTagNameMap } from './types';
import type { VProperties } from './render';

declare global {
    namespace JSX {
        type IntrinsicElements = {
            [K in keyof ElementTagNameMap]: VProperties<K>;
        }
    }
}
