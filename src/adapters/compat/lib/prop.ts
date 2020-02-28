class CompatProperty {
    types: Function[];

    constructor(types: Function[]) {
        this.types = types;
    }

    validate() {
        return this;
    }

    attribute(attributeName: string) {
        (this as any).attribute = attributeName;
        return this;
    }

    getter(getter: Function) {
        (this as any).getter = getter;
        return this;
    }

    setter(setter: Function) {
        (this as any).setter = setter;
        return this;
    }
}

export function prop(types: Function | Function[]) {
    if (!Array.isArray(types)) {
        return new CompatProperty([types]);
    }
    return new CompatProperty(types);
}

Object.defineProperty(prop, 'STRING', {
    get() {
        return new CompatProperty([String]);
    },
});

Object.defineProperty(prop, 'NUMBER', {
    get() {
        return new CompatProperty([Number]);
    },
});

Object.defineProperty(prop, 'BOOLEAN', {
    get() {
        return new CompatProperty([Boolean]);
    },
});
