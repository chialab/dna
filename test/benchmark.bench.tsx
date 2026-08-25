import { bench, describe, expect } from 'vitest';
import { apps, isolate } from './benchmark.apps';

const SAMPLING = {
    time: 0,
    iterations: Number(import.meta.env.VITE_BENCH_SAMPLES ?? 15),
    warmupTime: 0,
    warmupIterations: 3,
};

// 01 — create 1,000 rows
describe('create rows (1k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.run();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.clear();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(1000);
                    };
                },
            }
        );
    }
});

// 02 — replace all 1,000 rows
describe('replace all rows (1k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.run();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.run();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(1000);
                    };
                },
            }
        );
    }
});

// 03 — update every 10th row of 1,000
describe('partial update (1k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.update();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.run();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(1000);
                    };
                },
            }
        );
    }
});

// 04 — select a row out of 1,000
describe('select row (1k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.selectRow();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.run();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(1000);
                        // an implementation that marked no row rendered nothing, and would
                        // be reported as a very fast one
                        expect(app.host.querySelectorAll('tbody > tr.danger').length).toBe(1);
                    };
                },
            }
        );
    }
});

// 05 — swap two rows out of 1,000
describe('swap rows (1k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.swapRows();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.run();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(1000);
                    };
                },
            }
        );
    }
});

// 06 — remove one row out of 1,000. The count it is checked against is what catches a
// `beforeEach` that stopped running: the second sample would start from 999 rows
describe('remove row (1k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.removeRow();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.run();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(999);
                    };
                },
            }
        );
    }
});

// 07 — create 10,000 rows
describe('create many rows (10k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.runLots();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.clear();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(10000);
                    };
                },
            }
        );
    }
});

// 08 — append 1,000 rows to a table of 10,000, the other operation whose count would
// catch a `beforeEach` that stopped running
describe('append rows to large table (1k on 10k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.add();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.runLots();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(11000);
                    };
                },
            }
        );
    }
});

// 09 — clear a table of 1,000 rows
describe('clear rows (1k)', () => {
    for (const app of apps) {
        bench(
            app.name,
            () => {
                app.clear();
            },
            {
                ...SAMPLING,
                setup(task) {
                    isolate(app);
                    task.opts.beforeEach = () => {
                        app.run();
                    };
                    task.opts.afterEach = () => {
                        expect(app.host.querySelectorAll('tbody > tr').length).toBe(0);
                    };
                },
            }
        );
    }
});
