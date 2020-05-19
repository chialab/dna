import 'core-js/es/symbol';
import 'core-js/es/object/assign';
import 'core-js/es/array/find';

if (typeof Symbol() !== 'symbol') {
    /**
     * IE11/Decorators workaround
     * @see https://github.com/babel/babel/issues/9999
     */
    let num = 0;
    Symbol.prototype[Symbol.toPrimitive] = () => `__sym__${num++}__`;
}

export async function getModule() {
    if (typeof window === 'undefined') {
        return require(eval('\'@chialab/dna\''));
    }
    return await import('@chialab/dna');
}

export function spyFunction(fn = () => {}) {
    const spied = function(...args) {
        spied.response = fn.call(this, ...args);
        spied.invoked = true;
        spied.count++;
    };
    spied.invoked = false;
    spied.count = 0;
    return spied;
}

export function spyPromise(promise) {
    const spied = new Promise((resolve, reject) => {
        promise
            .then((data) => {
                spied.resolved = true;
                spied.pending = false;
                spied.response = data;
                resolve(data);
            })
            .catch((data) => {
                spied.rejected = true;
                spied.pending = false;
                spied.response = data;
                reject(data);
            });
    });
    spied.resolved = false;
    spied.rejected = false;
    spied.pending = true;
    return spied;
}

export function wait(time = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}

let count = 0;
export function getComponentName() {
    return `test-element-${count++}`;
}
