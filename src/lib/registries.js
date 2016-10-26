import { isFunction, isString } from './typeof.js';

export const REGISTRIES = {
    native: self.customElements,
    custom: {
        components: {},
        define(name, Ctr, config = {}) {
            this.components[name.toLowerCase()] = {
                is: name,
                Ctr,
                config,
            };
        },
        get(name) {
            if (isString(name)) {
                return this.components[name.toLowerCase()];
            } else if (isFunction(name)) {
                for (let k in this.components) {
                    let desc = this.components[k];
                    if (desc.Ctr === name) {
                        return desc;
                    }
                }
            }
        },
    },
};

REGISTRIES.default = REGISTRIES.native;
