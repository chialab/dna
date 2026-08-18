import * as DNA from '@chialab/dna';

export type Row = { id: number; label: string };
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

export const apps: App[] = [dnaKeyed(), dnaNonKeyed()];
export const isolate = (app: App) => {
    for (const other of apps) {
        if (other !== app) {
            other.clear();
        }
    }
};
