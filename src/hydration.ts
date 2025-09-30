const queue = new Set<() => void>();
let hydrating = false;

export function afterHydration(fn: () => void): void {
    if (hydrating) {
        queue.add(fn);
    } else {
        fn();
    }
}

export function isHydrating(value?: boolean): boolean {
    if (value != null) {
        if (hydrating !== value) {
            hydrating = value;
            if (!hydrating) {
                for (const fn of queue) {
                    fn();
                }
                queue.clear();
            }
        }
    }
    return hydrating;
}
