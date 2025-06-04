import type { ComponentInstance } from './Component';

/**
 * An alias type fot the previous quantum implementation.
 * @deprecated Use component prototype instead.
 */
export class Realm {
    private node: ComponentInstance;
    private callbacks: (() => void)[] = [];

    constructor(element: ComponentInstance) {
        this.node = element;
    }

    /**
     * @deprecated Use element's `slotChildNodes` property instead.
     */
    get childNodes(): Node[] {
        return [...this.node.slotChildNodes];
    }

    /**
     * @deprecated Use element's `childNodesBySlot` method instead.
     */
    childNodesBySlot(name?: string | null): Node[] {
        return this.node.childNodesBySlot(name);
    }

    /**
     * @deprecated This method is useless and does not do anything. You can unwrap the callback invocation directly.
     */
    requestUpdate<T>(callback: () => T): T {
        return callback();
    }

    /**
     * @deprecated Refer to element's `childListChangedCallback` method instead.
     */
    observe(callback: () => void): void {
        this.callbacks.push(callback);
    }

    notify(): void {
        for (const callback of this.callbacks) {
            callback();
        }
    }
}
