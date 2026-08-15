import * as DNA from '@chialab/dna';
import { computed, effect, Signal, signal, untracked } from '@preact/signals-core';

export type Row = { id: number; label: string };
export type SignalRow = { id: number; label: Signal<string>; className: Signal<string> };
export type App = {
    name: string;
    host: HTMLElement;
    run(): void;
    runLots(): void;
    add(): void;
    update(): void;
    clear(): void;
    swapRows(): void;
    selectRow(): void;
    removeRow(): void;
};
type HookActions = {
    run(): void;
    runLots(): void;
    add(): void;
    update(): void;
    clear(): void;
    swapRows(): void;
    select(id: number): void;
    remove(id: number): void;
    data: Row[];
};
type State = { data: Row[]; selected: number | undefined };

const adjectives = [
    'pretty',
    'large',
    'big',
    'small',
    'tall',
    'short',
    'long',
    'handsome',
    'plain',
    'quaint',
    'clean',
    'elegant',
    'easy',
    'angry',
    'crazy',
    'helpful',
    'mushy',
    'odd',
    'unsightly',
    'adorable',
    'important',
    'inexpensive',
    'cheap',
    'expensive',
    'fancy',
];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = [
    'table',
    'chair',
    'house',
    'bbq',
    'desk',
    'car',
    'pony',
    'cookie',
    'sandwich',
    'burger',
    'pizza',
    'mouse',
    'keyboard',
];

let seed = 1;
const random = (max: number) => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return Math.round((seed / 0x7fffffff) * 1000) % max;
};

const buildLabel = () =>
    `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`;

let nextId = 1;
const buildData = (count: number): Row[] => {
    const data = new Array<Row>(count);
    for (let i = 0; i < count; i++) {
        data[i] = { id: nextId++, label: buildLabel() };
    }
    return data;
};

/**
 * A node of its own for each implementation, so that one cannot be measured against a
 * document the others have filled.
 * @returns The render root.
 */
const createHost = () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    return host;
};

/**
 * The floor every other implementation is read against: no framework, rows cloned from a
 * template and patched by hand.
 * @returns The implementation.
 */
const vanilla = (): App => {
    const host = createHost();
    const table = document.createElement('table');
    table.className = 'table table-hover table-striped test-data';
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    host.appendChild(table);

    const template = document.createElement('tr');
    template.innerHTML =
        "<td class='col-md-1'> </td><td class='col-md-4'><a> </a></td>" +
        "<td class='col-md-1'><a><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td>" +
        "<td class='col-md-6'></td>";

    let data: Row[] = [];
    let nodes: HTMLTableRowElement[] = [];
    let selectedNode: HTMLTableRowElement | undefined;

    const createRow = (row: Row) => {
        const tr = template.cloneNode(true) as HTMLTableRowElement;
        const first = tr.firstChild as HTMLElement;
        const anchor = (first.nextSibling as HTMLElement).firstChild as HTMLElement;
        (first.firstChild as Text).nodeValue = String(row.id);
        (anchor.firstChild as Text).nodeValue = row.label;
        return tr;
    };

    // only the rows the store gained are built, which is what makes an append an append
    const appendRows = () => {
        for (let i = nodes.length, len = data.length; i < len; i++) {
            const tr = createRow(data[i]);
            nodes[i] = tr;
            tbody.appendChild(tr);
        }
    };

    const removeAllRows = () => {
        tbody.textContent = '';
        nodes = [];
    };

    const unselect = () => {
        if (selectedNode) {
            selectedNode.className = '';
            selectedNode = undefined;
        }
    };

    return {
        name: 'vanilla',
        host,
        run() {
            removeAllRows();
            data = buildData(1000);
            appendRows();
            unselect();
        },
        runLots() {
            removeAllRows();
            data = buildData(10000);
            appendRows();
            unselect();
        },
        add() {
            data = data.concat(buildData(1000));
            appendRows();
        },
        update() {
            for (let i = 0, len = data.length; i < len; i += 10) {
                data[i].label += ' !!!';
                (nodes[i].childNodes[1].childNodes[0].firstChild as Text).nodeValue = data[i].label;
            }
        },
        clear() {
            data = [];
            removeAllRows();
            unselect();
        },
        swapRows() {
            if (data.length > 998) {
                const row = data[1];
                data[1] = data[998];
                data[998] = row;
                tbody.insertBefore(nodes[998], nodes[2]);
                tbody.insertBefore(nodes[1], nodes[999]);
                const node = nodes[998];
                nodes[998] = nodes[1];
                nodes[1] = node;
            }
        },
        selectRow() {
            unselect();
            selectedNode = nodes[1];
            selectedNode.className = 'danger';
        },
        removeRow() {
            nodes[1].remove();
            nodes.splice(1, 1);
            data.splice(1, 1);
            unselect();
        },
    };
};

/**
 * The implementation that gives every row a key, so that the renderer moves the nodes of
 * a reorder instead of rewriting them.
 * @returns The implementation.
 */
const dnaKeyed = (): App => {
    const host = createHost();
    let actions: HookActions | undefined;

    const Benchmark: DNA.FunctionComponent = (_props, { useState }) => {
        const [state, setState] = useState<State>({ data: [], selected: undefined });
        const { data, selected } = state;

        const run = () => setState({ data: buildData(1000), selected: undefined });
        const runLots = () => setState({ data: buildData(10000), selected: undefined });
        const add = () => setState((current) => ({ ...current, data: current.data.concat(buildData(1000)) }));
        const clear = () => setState({ data: [], selected: undefined });
        const select = (id: number) => setState((current) => ({ ...current, selected: id }));

        const update = () =>
            setState((current) => {
                const rows = current.data;
                for (let i = 0, len = rows.length; i < len; i += 10) {
                    rows[i].label += ' !!!';
                }
                return { ...current };
            });

        const swapRows = () =>
            setState((current) => {
                const rows = current.data;
                if (rows.length > 998) {
                    const row = rows[1];
                    rows[1] = rows[998];
                    rows[998] = row;
                }
                return { ...current };
            });

        const remove = (id: number) =>
            setState((current) => {
                const rows = current.data;
                for (let i = 0, len = rows.length; i < len; i++) {
                    if (rows[i].id === id) {
                        rows.splice(i, 1);
                        break;
                    }
                }
                return { ...current };
            });

        actions = { run, runLots, add, update, clear, swapRows, select, remove, data };

        return (
            <table class="table table-hover table-striped test-data">
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            class={{
                                danger: item.id === selected,
                            }}>
                            <td class="col-md-1">{item.id}</td>
                            <td class="col-md-4">
                                {/* biome-ignore lint/a11y/useValidAnchor: the markup of the benchmark */}
                                <a
                                    data-action="select"
                                    data-id={item.id}>
                                    {item.label}
                                </a>
                            </td>
                            <td class="col-md-1">
                                {/* biome-ignore lint/a11y/useValidAnchor: the markup of the benchmark */}
                                {/* biome-ignore lint/a11y/useAnchorContent: the markup of the benchmark */}
                                <a>
                                    <span
                                        class="glyphicon glyphicon-remove"
                                        aria-hidden="true"
                                        data-action="remove"
                                        data-id={item.id}
                                    />
                                </a>
                            </td>
                            <td class="col-md-6" />
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    DNA.render(<Benchmark />, host);

    const app = () => {
        if (!actions) {
            throw new Error('the keyed app did not publish its actions');
        }
        return actions;
    };

    return {
        name: 'dna keyed',
        host,
        run: () => app().run(),
        runLots: () => app().runLots(),
        add: () => app().add(),
        update: () => app().update(),
        clear: () => app().clear(),
        swapRows: () => app().swapRows(),
        selectRow: () => {
            const { select, data } = app();
            select(data[1].id);
        },
        removeRow: () => {
            const { remove, data } = app();
            remove(data[1].id);
        },
    };
};

/**
 * The same implementation without keys, where the renderer matches the rows by position
 * and patches whatever it finds at each one.
 * @returns The implementation.
 */
const dnaNonKeyed = (): App => {
    const host = createHost();
    let actions: HookActions | undefined;

    const Benchmark: DNA.FunctionComponent = (_props, { useState }) => {
        const [state, setState] = useState<State>({ data: [], selected: undefined });
        const { data, selected } = state;

        const run = () => setState({ data: buildData(1000), selected: undefined });
        const runLots = () => setState({ data: buildData(10000), selected: undefined });
        const add = () => setState((current) => ({ ...current, data: current.data.concat(buildData(1000)) }));
        const clear = () => setState({ data: [], selected: undefined });
        const select = (id: number) => setState((current) => ({ ...current, selected: id }));

        const update = () =>
            setState((current) => {
                const rows = current.data;
                for (let i = 0, len = rows.length; i < len; i += 10) {
                    rows[i].label += ' !!!';
                }
                return { ...current };
            });

        const swapRows = () =>
            setState((current) => {
                const rows = current.data;
                if (rows.length > 998) {
                    const row = rows[1];
                    rows[1] = rows[998];
                    rows[998] = row;
                }
                return { ...current };
            });

        const remove = (id: number) =>
            setState((current) => {
                const rows = current.data;
                for (let i = 0, len = rows.length; i < len; i++) {
                    if (rows[i].id === id) {
                        rows.splice(i, 1);
                        break;
                    }
                }
                return { ...current };
            });

        actions = { run, runLots, add, update, clear, swapRows, select, remove, data };

        return (
            <table class="table table-hover table-striped test-data">
                <tbody>
                    {data.map((item) => (
                        <tr class={item.id === selected ? 'danger' : ''}>
                            <td class="col-md-1">{item.id}</td>
                            <td class="col-md-4">
                                {/* biome-ignore lint/a11y/useValidAnchor: the markup of the benchmark */}
                                <a
                                    data-action="select"
                                    data-id={item.id}>
                                    {item.label}
                                </a>
                            </td>
                            <td class="col-md-1">
                                {/* biome-ignore lint/a11y/useValidAnchor: the markup of the benchmark */}
                                {/* biome-ignore lint/a11y/useAnchorContent: the markup of the benchmark */}
                                <a>
                                    <span
                                        class="glyphicon glyphicon-remove"
                                        aria-hidden="true"
                                        data-action="remove"
                                        data-id={item.id}
                                    />
                                </a>
                            </td>
                            <td class="col-md-6" />
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    DNA.render(<Benchmark />, host);

    const app = () => {
        if (!actions) {
            throw new Error('the non-keyed app did not publish its actions');
        }
        return actions;
    };

    return {
        name: 'dna non-keyed',
        host,
        run: () => app().run(),
        runLots: () => app().runLots(),
        add: () => app().add(),
        update: () => app().update(),
        clear: () => app().clear(),
        swapRows: () => app().swapRows(),
        selectRow: () => {
            const { select, data } = app();
            select(data[1].id);
        },
        removeRow: () => {
            const { remove, data } = app();
            remove(data[1].id);
        },
    };
};

/**
 * The implementation that holds the list in a signal and renders once: replacing the list
 * patches the `<tbody>` alone, and a label or a selection touches only the nodes bound to
 * the signals that changed.
 * @returns The implementation.
 */
const dnaSignals = (): App => {
    const host = createHost();

    const rows = signal<SignalRow[]>([]);
    let selected: SignalRow | undefined;

    const view = computed(() =>
        rows.value.map((item) => (
            <tr
                key={item.id}
                class={item.className}>
                <td class="col-md-1">{item.id}</td>
                <td class="col-md-4">
                    {/* biome-ignore lint/a11y/useValidAnchor: the markup of the benchmark */}
                    <a
                        data-action="select"
                        data-id={item.id}>
                        {item.label}
                    </a>
                </td>
                <td class="col-md-1">
                    {/* biome-ignore lint/a11y/useValidAnchor: the markup of the benchmark */}
                    {/* biome-ignore lint/a11y/useAnchorContent: the markup of the benchmark */}
                    <a>
                        <span
                            class="glyphicon glyphicon-remove"
                            aria-hidden="true"
                            data-action="remove"
                            data-id={item.id}
                        />
                    </a>
                </td>
                <td class="col-md-6" />
            </tr>
        ))
    );

    const unselect = () => {
        if (selected) {
            selected.className.value = '';
            selected = undefined;
        }
    };

    const buildSignalData = (count: number): SignalRow[] => {
        const data = new Array<SignalRow>(count);
        for (let i = 0; i < count; i++) {
            data[i] = { id: nextId++, label: signal(buildLabel()), className: signal('') };
        }
        return data;
    };

    DNA.render(
        <table class="table table-hover table-striped test-data">
            <tbody>{view}</tbody>
        </table>,
        host
    );

    return {
        name: 'dna signals',
        host,
        run() {
            unselect();
            rows.value = buildSignalData(1000);
        },
        runLots() {
            unselect();
            rows.value = buildSignalData(10000);
        },
        add() {
            rows.value = rows.value.concat(buildSignalData(1000));
        },
        update() {
            const current = rows.value;
            for (let i = 0, len = current.length; i < len; i += 10) {
                const label = current[i].label;
                label.value = `${label.value} !!!`;
            }
        },
        clear() {
            unselect();
            rows.value = [];
        },
        swapRows() {
            const current = rows.value;
            if (current.length > 998) {
                const next = current.slice();
                next[1] = current[998];
                next[998] = current[1];
                rows.value = next;
            }
        },
        selectRow() {
            unselect();
            selected = rows.value[1];
            selected.className.value = 'danger';
        },
        removeRow() {
            const current = rows.value;
            const next = current.slice();
            next.splice(1, 1);
            rows.value = next;
        },
    };
};

DNA.configureSignals({
    isSignal: (value) => value instanceof Signal,
    get<T>(target: DNA.SignalLike<T>) {
        return (target as DNA.SignalValue<T>).value;
    },
    effect,
    untrack: untracked,
} satisfies DNA.SignalAdapter);

export const apps: App[] = [vanilla(), dnaKeyed(), dnaNonKeyed(), dnaSignals()];
export const isolate = (app: App) => {
    for (const other of apps) {
        if (other !== app) {
            other.clear();
        }
    }
};
