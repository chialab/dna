declare module '@babel/runtime/helpers/decorate' {
    // biome-ignore lint/suspicious/noExplicitAny: We dont care about Babel types.
    function decorate<T>(decorators: any[], factory: (...args: any[]) => any, superClass: T, mixins?: any[]): T;

    export default decorate;
}
