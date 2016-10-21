export const registry = {
    components: {},
    define(name, Ctr, config) {
        this.components[name.toLowerCase()] = {
            Ctr,
            config,
        };
    },
    get(name) {
        return this.components[name.toLowerCase()];
    },
};
