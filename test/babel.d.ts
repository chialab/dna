declare module '@babel/runtime/helpers/decorate' {
    function decorate<
        S,
        F extends (
            initialize: (instance: InstanceType<S>) => void,
            superClass: S
        ) => {
            F: new (
                // biome-ignore lint/suspicious/noExplicitAny: We dont care about Babel types.
                ...args: any[]
            ) => InstanceType<S>;
        },
    >(
        // biome-ignore lint/suspicious/noExplicitAny: We dont care about Babel types.
        decorators: any[],
        factory: F,
        superClass: S,
        // biome-ignore lint/suspicious/noExplicitAny: We dont care about Babel types.
        mixins?: any[]
    ): ReturnType<F>['F'];

    export default decorate;
}
