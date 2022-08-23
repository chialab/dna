import { h, Fragment } from './dist/esm/dna.js';

export { h, Fragment };
export const jsx = (tagOrComponent, properties = {}, key) => {
    if (key) {
        properties.key = key;
    }
    return h(tagOrComponent, properties);
};
export const jsxs = jsx;
