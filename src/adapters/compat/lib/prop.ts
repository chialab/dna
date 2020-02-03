class CompatProperty {
    types: Function[];

    constructor(types: Function[]) {
        this.types = types;
    }

    validate() {
        return this;
    }

    attribute() {
        return this;
    }

    getter() {
        return this;
    }

    setter() {
        return this;
    }
}

export function prop(types: Function | Function[]) {
    if (!Array.isArray(types)) {
        return new CompatProperty([types]);
    }
    return new CompatProperty(types);
}

prop.STRING = new CompatProperty([String]);
prop.NUMBER = new CompatProperty([Number]);
prop.BOOLEAN = new CompatProperty([Boolean]);
