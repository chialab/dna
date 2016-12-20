import { registry } from './registry.js';

export function define(...args) {
    return registry.define(...args);
}
