import { dashToCamel } from '../helpers/strings.js';

const ATTRIBUTES_CACHE = new WeakMap();

export function getNormalizedAttributes(Ctr) {
    return ATTRIBUTES_CACHE.get(Ctr) || (() => {
        let attrs = (Ctr.observedAttributes || [])
            .map((attr) => dashToCamel(attr));
        ATTRIBUTES_CACHE.set(Ctr, attrs);
        return attrs;
    })();
}
