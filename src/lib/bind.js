export function bind(node, Ctr) {
    node.__proto__ = Ctr.prototype;
    Object.defineProperty(node, 'constructor', {
        value: Ctr,
        configurable: true,
        writable: true,
    });
    Ctr.prototype.constructor.call(node);
}
