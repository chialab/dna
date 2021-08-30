import type { ElementTagNameMap } from './types';
import type { VProperties, Template } from './render';

declare global {
    namespace JSX {
        type Element = Template;
        type IntrinsicElements = {
            [K in keyof ElementTagNameMap]: VProperties<K>;
        }
    }
}
