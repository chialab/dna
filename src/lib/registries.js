export const REGISTRIES = {
    native: self.customElements,
    custom: {
        components: {},
        define(name, Ctr, config = {}) {
            this.components[name.toLowerCase()] = {
                Ctr,
                config,
            };
        },
        get(name) {
            return this.components[name.toLowerCase()];
        },
    },
};

REGISTRIES.default = REGISTRIES.native;
