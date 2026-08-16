import * as DNA from '@chialab/dna';
import { Signal } from 'signal-polyfill';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
// not part of the public API: the module is aliased to the same instance the package uses
import { effect, hasSignals, isSignal, untrack } from '../src/signals';

/**
 * Wait for the signal effects to be flushed.
 * Effects run in a microtask, since the watcher notification cannot read signals.
 */
const flushSignals = () => new Promise((resolve) => setTimeout(resolve, 0));

describe(
    'signals',
    () => {
        let wrapper: HTMLElement;

        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            document.body.removeChild(wrapper);
        });

        // This block must run before `configureSignals`, in order to cover the
        // behavior of a project that never registers an implementation.
        describe('without an implementation', () => {
            it('should not detect signals', () => {
                expect(hasSignals()).toBe(false);
                expect(isSignal(new Signal.State(1))).toBe(false);
            });

            it('should run untracked callbacks', () => {
                expect(untrack(() => 42)).toBe(42);
            });

            it('should render a signal as a plain value', () => {
                DNA.render(new Signal.State('hello'), wrapper);
                expect(wrapper.textContent).toBe('[object Object]');
            });
        });

        describe('with an implementation', () => {
            beforeAll(() => {
                DNA.configureSignals(Signal);
            });

            describe('configuration', () => {
                it('should detect signals', () => {
                    expect(hasSignals()).toBe(true);
                    expect(isSignal(new Signal.State(1))).toBe(true);
                    expect(isSignal(new Signal.Computed(() => 1))).toBe(true);
                    expect(isSignal(1)).toBe(false);
                    expect(isSignal(null)).toBe(false);
                    expect(isSignal({ get: () => 1 })).toBe(false);
                });

                it('should accept the same implementation twice', () => {
                    expect(() => DNA.configureSignals(Signal)).not.toThrow();
                });

                it('should refuse a second implementation', () => {
                    expect(() => DNA.configureSignals({} as DNA.SignalNamespace)).toThrow(
                        'A different Signal implementation is already in use'
                    );
                });
            });

            describe('effect', () => {
                it('should run immediately and on change', async () => {
                    const signal = new Signal.State(1);
                    const spy = vi.fn();
                    const dispose = effect(() => spy(signal.get()));

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenLastCalledWith(1);

                    signal.set(2);
                    // effects are asynchronous
                    expect(spy).toHaveBeenCalledTimes(1);

                    await flushSignals();
                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(spy).toHaveBeenLastCalledWith(2);

                    dispose();
                    signal.set(3);
                    await flushSignals();
                    expect(spy).toHaveBeenCalledTimes(2);
                });

                it('should run the cleanup before each re-run and on dispose', async () => {
                    const signal = new Signal.State(1);
                    const cleanup = vi.fn();
                    const dispose = effect(() => {
                        signal.get();
                        return cleanup;
                    });

                    expect(cleanup).not.toHaveBeenCalled();

                    signal.set(2);
                    await flushSignals();
                    expect(cleanup).toHaveBeenCalledTimes(1);

                    dispose();
                    expect(cleanup).toHaveBeenCalledTimes(2);
                });

                it('should keep running after multiple changes', async () => {
                    const signal = new Signal.State(0);
                    const spy = vi.fn();
                    effect(() => spy(signal.get()));

                    for (let i = 1; i <= 3; i++) {
                        signal.set(i);
                        await flushSignals();
                    }

                    // the watcher must be re-armed after every notification
                    expect(spy).toHaveBeenCalledTimes(4);
                    expect(spy).toHaveBeenLastCalledWith(3);
                });

                it('should not run when the value does not change', async () => {
                    const signal = new Signal.State(1);
                    const spy = vi.fn();
                    effect(() => spy(signal.get()));

                    signal.set(1);
                    await flushSignals();
                    expect(spy).toHaveBeenCalledTimes(1);
                });
            });

            describe('content', () => {
                it('should render and update a signal', async () => {
                    const signal = new Signal.State('hello');
                    DNA.render(signal, wrapper);
                    expect(wrapper.textContent).toBe('hello');

                    signal.set('world');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('world');
                });

                it('should render a computed', async () => {
                    const count = new Signal.State(2);
                    const double = new Signal.Computed(() => count.get() * 2);
                    DNA.render(<span>{double}</span>, wrapper);
                    expect(wrapper.textContent).toBe('4');

                    count.set(5);
                    await flushSignals();
                    expect(wrapper.textContent).toBe('10');
                });

                it('should render a signal holding a template', async () => {
                    const signal = new Signal.State<DNA.Template>(<h1>one</h1>);
                    DNA.render(<div>{signal}</div>, wrapper);
                    expect(wrapper.querySelector('h1')?.textContent).toBe('one');

                    signal.set(<h2>two</h2>);
                    await flushSignals();
                    expect(wrapper.querySelector('h1')).toBeNull();
                    expect(wrapper.querySelector('h2')?.textContent).toBe('two');
                });

                it('should anchor the binding with a marker comment', () => {
                    // like every function component, the signal renderer is anchored to a
                    // comment node: it shows up in `innerHTML`, as it does for `$await`
                    const signal = new Signal.State('value');
                    DNA.render(<div>{signal}</div>, wrapper);
                    expect(wrapper.innerHTML).toBe('<div><!--SignalFunction-->value</div>');
                });

                it('should render a signal holding a function', async () => {
                    const fn = () => 'fn';
                    const signal = new Signal.State<unknown>(fn);
                    DNA.render(<div>{signal}</div>, wrapper);
                    expect(wrapper.textContent).toBe(String(fn));

                    signal.set('plain');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('plain');
                });

                it('should update only the bound fragment', async () => {
                    const signal = new Signal.State('a');
                    DNA.render(
                        <div>
                            <span>static</span>
                            <i>{signal}</i>
                        </div>,
                        wrapper
                    );

                    const staticNode = wrapper.querySelector('span');
                    expect(wrapper.querySelector('i')?.textContent).toBe('a');

                    signal.set('b');
                    await flushSignals();
                    expect(wrapper.querySelector('i')?.textContent).toBe('b');
                    // the sibling node has not been recreated
                    expect(wrapper.querySelector('span')).toBe(staticNode);
                });

                it('should render sibling signals independently', async () => {
                    const first = new Signal.State('1');
                    const second = new Signal.State('2');
                    DNA.render(
                        <div>
                            {first}-{second}
                        </div>,
                        wrapper
                    );
                    expect(wrapper.textContent).toBe('1-2');

                    first.set('3');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('3-2');

                    second.set('4');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('3-4');
                });

                it('should stop updating once unmounted', async () => {
                    const signal = new Signal.State('in');
                    const show = { value: true };
                    const template = () => <div>{show.value ? signal : 'out'}</div>;

                    DNA.render(template(), wrapper);
                    expect(wrapper.textContent).toBe('in');

                    show.value = false;
                    DNA.render(template(), wrapper);
                    expect(wrapper.textContent).toBe('out');

                    signal.set('changed');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('out');
                });
            });

            describe('properties', () => {
                it('should bind an attribute', async () => {
                    const signal = new Signal.State('first');
                    DNA.render(<div id={signal} />, wrapper);

                    const node = wrapper.children[0];
                    expect(node.getAttribute('id')).toBe('first');

                    signal.set('second');
                    await flushSignals();
                    expect(node.getAttribute('id')).toBe('second');
                    // the node has not been recreated
                    expect(wrapper.children[0]).toBe(node);
                });

                it('should remove the attribute on a nullish value', async () => {
                    const signal = new Signal.State<string | undefined>('value');
                    DNA.render(
                        <div
                            role="note"
                            aria-label={signal}
                        />,
                        wrapper
                    );

                    const node = wrapper.children[0];
                    expect(node.getAttribute('aria-label')).toBe('value');

                    signal.set(undefined);
                    await flushSignals();
                    expect(node.hasAttribute('aria-label')).toBe(false);
                });

                it('should bind classes', async () => {
                    const signal = new Signal.State<Record<string, boolean>>({ active: true });
                    DNA.render(<div class={signal} />, wrapper);

                    const node = wrapper.children[0];
                    expect(node.classList.contains('active')).toBe(true);

                    signal.set({ active: false, done: true });
                    await flushSignals();
                    expect(node.classList.contains('active')).toBe(false);
                    expect(node.classList.contains('done')).toBe(true);
                });

                it('should bind styles', async () => {
                    const signal = new Signal.State<Record<string, string>>({ color: 'red' });
                    DNA.render(<div style={signal} />, wrapper);

                    const node = wrapper.children[0] as HTMLElement;
                    expect(node.style.color).toBe('red');

                    signal.set({ color: 'blue' });
                    await flushSignals();
                    expect(node.style.color).toBe('blue');
                });

                it('should bind an event listener', async () => {
                    const first = vi.fn();
                    const second = vi.fn();
                    const signal = new Signal.State<EventListener>(first);
                    DNA.render(
                        <button
                            type="button"
                            on:click={signal}
                        />,
                        wrapper
                    );

                    const node = wrapper.children[0] as HTMLButtonElement;
                    node.click();
                    expect(first).toHaveBeenCalledTimes(1);

                    signal.set(second);
                    await flushSignals();
                    node.click();
                    expect(first).toHaveBeenCalledTimes(1);
                    expect(second).toHaveBeenCalledTimes(1);
                });

                it('should release the binding when the value is no longer a signal', async () => {
                    const signal = new Signal.State('bound');
                    const template = (value: unknown) => <div id={value as string} />;

                    DNA.render(template(signal), wrapper);
                    const node = wrapper.children[0];
                    expect(node.getAttribute('id')).toBe('bound');

                    DNA.render(template('static'), wrapper);
                    expect(node.getAttribute('id')).toBe('static');

                    signal.set('ignored');
                    await flushSignals();
                    expect(node.getAttribute('id')).toBe('static');
                });

                it('should keep the binding across parent re-renders', async () => {
                    const signal = new Signal.State('bound');
                    const template = (label: string) => (
                        <div>
                            <span>{label}</span>
                            <i id={signal} />
                        </div>
                    );

                    DNA.render(template('one'), wrapper);
                    const node = wrapper.querySelector('i') as HTMLElement;

                    DNA.render(template('two'), wrapper);
                    expect(wrapper.querySelector('span')?.textContent).toBe('two');
                    expect(wrapper.querySelector('i')).toBe(node);

                    // the binding survived the parent re-render
                    signal.set('updated');
                    await flushSignals();
                    expect(node.getAttribute('id')).toBe('updated');
                });

                it('should release the bindings of a removed subtree', async () => {
                    const signal = new Signal.State('bound');
                    const template = (show: boolean) => (
                        <div>
                            {show ? (
                                <section>
                                    <p>
                                        <span id={signal} />
                                    </p>
                                </section>
                            ) : null}
                        </div>
                    );

                    DNA.render(template(true), wrapper);
                    const node = wrapper.querySelector('span') as HTMLElement;
                    expect(node.getAttribute('id')).toBe('bound');

                    DNA.render(template(false), wrapper);
                    expect(wrapper.querySelector('span')).toBeNull();

                    signal.set('changed');
                    await flushSignals();
                    expect(node.getAttribute('id')).toBe('bound');
                });

                it('should release the binding of a keyed node dropped while reordering', async () => {
                    const items = ['a', 'b', 'c'].map((key) => ({ key, signal: new Signal.State(`${key}1`) }));
                    const template = (list: typeof items) => (
                        <div>
                            {list.map((item) => (
                                <span
                                    key={item.key}
                                    id={item.signal}
                                />
                            ))}
                        </div>
                    );

                    DNA.render(template(items), wrapper);
                    const [nodeA, nodeB] = Array.from(wrapper.querySelectorAll('span'));
                    expect(nodeB.getAttribute('id')).toBe('b1');

                    // "c" moves to the front and "b" is dropped: `b` is detached while
                    // reordering, so it never goes through the trailing cleanup
                    DNA.render(template([items[2], items[0]]), wrapper);
                    expect(Array.from(wrapper.querySelectorAll('span'))).toEqual([
                        wrapper.children[0].children[0],
                        nodeA,
                    ]);

                    items[1].signal.set('b2');
                    items[0].signal.set('a2');
                    await flushSignals();

                    // the dropped node is no longer bound
                    expect(nodeB.getAttribute('id')).toBe('b1');
                    // the reordered one still is
                    expect(nodeA.getAttribute('id')).toBe('a2');
                });

                it('should release the binding when the node is removed', async () => {
                    const signal = new Signal.State('bound');
                    const template = (show: boolean) => <div>{show ? <span id={signal} /> : null}</div>;

                    DNA.render(template(true), wrapper);
                    const node = wrapper.querySelector('span') as HTMLElement;
                    expect(node.getAttribute('id')).toBe('bound');

                    DNA.render(template(false), wrapper);
                    expect(wrapper.querySelector('span')).toBeNull();

                    signal.set('changed');
                    await flushSignals();
                    expect(node.getAttribute('id')).toBe('bound');
                });
            });

            describe('components', () => {
                it('should render a signal inside a component template', async () => {
                    const signal = new Signal.State('hello');

                    @DNA.customElement('test-signals-1')
                    class TestElement extends DNA.Component {
                        render() {
                            return <h1>{signal}</h1>;
                        }
                    }

                    const element = new TestElement();
                    wrapper.appendChild(element);
                    const heading = element.querySelector('h1');
                    expect(heading?.textContent).toBe('hello');

                    signal.set('world');
                    await flushSignals();
                    expect(element.querySelector('h1')).toBe(heading);
                    expect(heading?.textContent).toBe('world');
                });

                it('should bind a signal to a component property', async () => {
                    @DNA.customElement('test-signals-2')
                    class TestChild extends DNA.Component {
                        @DNA.property()
                        label = '';

                        render() {
                            return <span>{this.label}</span>;
                        }
                    }

                    const signal = new Signal.State('one');
                    DNA.render(<test-signals-2 label={signal} />, wrapper);

                    const child = wrapper.children[0] as TestChild;
                    expect(child.label).toBe('one');
                    expect(child.innerHTML).toBe('<span>one</span>');

                    signal.set('two');
                    await flushSignals();
                    expect(child.label).toBe('two');
                    expect(child.innerHTML).toBe('<span>two</span>');
                });

                it('should keep property updates synchronous', () => {
                    @DNA.customElement('test-signals-3')
                    class TestElement extends DNA.Component {
                        @DNA.property()
                        title = '';

                        render() {
                            return <h1>{this.title}</h1>;
                        }
                    }

                    const element = new TestElement();
                    wrapper.appendChild(element);

                    element.title = 'sync';
                    // no await: DNA still renders synchronously on property assignment
                    expect(element.innerHTML).toBe('<h1>sync</h1>');
                });

                it('should render the component once per signal change', async () => {
                    const signal = new Signal.State(0);
                    const updated = vi.fn();

                    @DNA.customElement('test-signals-4')
                    class TestElement extends DNA.Component {
                        render() {
                            return <span>{signal}</span>;
                        }

                        updatedCallback() {
                            updated();
                        }
                    }

                    const element = new TestElement();
                    wrapper.appendChild(element);
                    const initial = updated.mock.calls.length;

                    signal.set(1);
                    await flushSignals();

                    // the signal updates its own fragment, the component is not re-rendered
                    expect(updated.mock.calls.length).toBe(initial);
                    expect(element.textContent).toBe('1');
                });

                it('should stop updating a disconnected component', async () => {
                    const signal = new Signal.State('in');

                    @DNA.customElement('test-signals-5')
                    class TestElement extends DNA.Component {
                        render() {
                            return <h1>{signal}</h1>;
                        }
                    }

                    const element = new TestElement();
                    wrapper.appendChild(element);
                    expect(element.textContent).toBe('in');

                    wrapper.removeChild(element);
                    signal.set('out');
                    await flushSignals();
                    expect(element.textContent).toBe('');
                });
            });

            describe('useSignal', () => {
                it('should create a signal preserved across renders', async () => {
                    const seen: unknown[] = [];
                    const Test: DNA.FunctionComponent<{ tag: string }> = ({ tag }, { useSignal, useSignalValue }) => {
                        const [count, setCount] = useSignal(0);
                        seen.push(count);

                        return (
                            <button
                                type="button"
                                on:click={() => setCount((current) => current + 1)}>
                                {tag}:{useSignalValue(count)}
                            </button>
                        );
                    };

                    DNA.render(<Test tag="a" />, wrapper);
                    const node = wrapper.querySelector('button') as HTMLButtonElement;
                    expect(node.textContent).toBe('a:0');

                    node.click();
                    await flushSignals();
                    expect(node.textContent).toBe('a:1');

                    // a render driven from the outside keeps the very same signal
                    DNA.render(<Test tag="b" />, wrapper);
                    expect(node.textContent).toBe('b:1');
                    expect(new Set(seen).size).toBe(1);
                });

                it('should honour the signal options', async () => {
                    let handle: DNA.SignalHandle<{ id: number }> | undefined;
                    const Test: DNA.FunctionComponent = (props, { useSignal }) => {
                        handle = useSignal({ id: 0 }, { equals: (a, b) => a.id === b.id });

                        return null;
                    };

                    DNA.render(<Test />, wrapper);
                    const [created, setCreated] = handle as DNA.SignalHandle<{ id: number }>;
                    const spy = vi.fn();
                    const dispose = effect(() => spy((created as DNA.SignalGetter<{ id: number }>).get()));
                    expect(spy).toHaveBeenCalledTimes(1);

                    // a different object with the same id counts as unchanged
                    setCreated({ id: 0 });
                    await flushSignals();
                    expect(spy).toHaveBeenCalledTimes(1);

                    setCreated({ id: 1 });
                    await flushSignals();
                    expect(spy).toHaveBeenCalledTimes(2);
                    dispose();
                });
            });

            describe('useComputed', () => {
                it('should derive from the signals it reads', async () => {
                    const count = new Signal.State(2);
                    const Test: DNA.FunctionComponent = (props, { useComputed }) => {
                        const double = useComputed(() => count.get() * 2);

                        return <span>{double}</span>;
                    };

                    DNA.render(<Test />, wrapper);
                    expect(wrapper.textContent).toBe('4');

                    count.set(5);
                    await flushSignals();
                    expect(wrapper.textContent).toBe('10');
                });

                it('should read signals of any shape through the given reader', async () => {
                    const count = new Signal.State(3);
                    const Test: DNA.FunctionComponent = (props, { useComputed }) => {
                        // `read` works whatever shape the registered implementation gives signals
                        const double = useComputed((read) => read(count) * 2);

                        return <span>{double}</span>;
                    };

                    DNA.render(<Test />, wrapper);
                    expect(wrapper.textContent).toBe('6');

                    count.set(4);
                    await flushSignals();
                    expect(wrapper.textContent).toBe('8');
                });

                it('should be recreated when the dependencies change', async () => {
                    const count = new Signal.State(2);
                    const Test: DNA.FunctionComponent<{ factor: number }> = ({ factor }, { useComputed }) => {
                        const scaled = useComputed(() => count.get() * factor, [factor]);

                        return <span>{scaled}</span>;
                    };

                    DNA.render(<Test factor={2} />, wrapper);
                    expect(wrapper.textContent).toBe('4');

                    DNA.render(<Test factor={10} />, wrapper);
                    expect(wrapper.textContent).toBe('20');

                    count.set(3);
                    await flushSignals();
                    expect(wrapper.textContent).toBe('30');
                });

                it('should keep the same signal across renders', () => {
                    const seen: unknown[] = [];
                    const Test: DNA.FunctionComponent<{ tag: string }> = ({ tag }, { useComputed }) => {
                        seen.push(useComputed(() => tag));

                        return null;
                    };

                    DNA.render(<Test tag="a" />, wrapper);
                    DNA.render(<Test tag="b" />, wrapper);
                    expect(seen.length).toBe(2);
                    expect(new Set(seen).size).toBe(1);
                });
            });

            describe('useSignalValue', () => {
                it('should read a signal and follow it', async () => {
                    const signal = new Signal.State('hello');
                    const Test: DNA.FunctionComponent = (props, { useSignalValue }) => (
                        <span>{useSignalValue(signal)}</span>
                    );

                    DNA.render(<Test />, wrapper);
                    const node = wrapper.querySelector('span');
                    expect(node?.textContent).toBe('hello');

                    signal.set('world');
                    await flushSignals();
                    expect(wrapper.querySelector('span')).toBe(node);
                    expect(node?.textContent).toBe('world');
                });

                it('should render a different template on change', async () => {
                    // the value is in hand, so it can drive the shape of the template and not
                    // just fill a hole in it
                    const flag = new Signal.State(true);
                    const Test: DNA.FunctionComponent = (props, { useSignalValue }) =>
                        useSignalValue(flag) ? <em>yes</em> : <strong>no</strong>;

                    DNA.render(<Test />, wrapper);
                    expect(wrapper.querySelector('em')?.textContent).toBe('yes');

                    flag.set(false);
                    await flushSignals();
                    expect(wrapper.querySelector('em')).toBeNull();
                    expect(wrapper.querySelector('strong')?.textContent).toBe('no');
                });

                it('should not re-render the whole component', async () => {
                    const signal = new Signal.State(0);
                    const updated = vi.fn();
                    const Test: DNA.FunctionComponent = (props, { useSignalValue }) => (
                        <span>{useSignalValue(signal)}</span>
                    );

                    @DNA.customElement('test-signals-hooks-1')
                    class TestElement extends DNA.Component {
                        render() {
                            return <Test />;
                        }

                        updatedCallback() {
                            updated();
                        }
                    }

                    const element = new TestElement();
                    wrapper.appendChild(element);
                    const renders = updated.mock.calls.length;

                    signal.set(1);
                    await flushSignals();
                    expect(element.textContent).toBe('1');
                    expect(updated.mock.calls.length).toBe(renders);
                });

                it('should read a signal holding a function', async () => {
                    const fn = () => 'fn';
                    const signal = new Signal.State<unknown>(fn);
                    const read: unknown[] = [];
                    const Test: DNA.FunctionComponent = (props, { useSignalValue }) => {
                        read.push(useSignalValue(signal));
                        return null;
                    };

                    DNA.render(<Test />, wrapper);
                    expect(read).toEqual([fn]);

                    signal.set('plain');
                    await flushSignals();
                    expect(read).toEqual([fn, 'plain']);
                });

                it('should follow a different signal when the one it reads changes', async () => {
                    const first = new Signal.State('first');
                    const second = new Signal.State('second');
                    const Test: DNA.FunctionComponent<{ signal: DNA.SignalLike<string> }> = (
                        { signal },
                        { useSignalValue }
                    ) => <span>{useSignalValue(signal)}</span>;

                    DNA.render(<Test signal={first} />, wrapper);
                    expect(wrapper.textContent).toBe('first');

                    DNA.render(<Test signal={second} />, wrapper);
                    expect(wrapper.textContent).toBe('second');

                    second.set('updated');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('updated');

                    // the previous signal is no longer followed
                    first.set('ignored');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('updated');
                });

                it('should stop following once unmounted', async () => {
                    const signal = new Signal.State('in');
                    const reads = vi.fn();
                    // a computed only recomputes while something watches it: the spy tells
                    // whether the subscription is still alive
                    const watched = new Signal.Computed(() => {
                        reads();
                        return signal.get();
                    });
                    const Test: DNA.FunctionComponent = (props, { useSignalValue }) => (
                        <span>{useSignalValue(watched)}</span>
                    );

                    DNA.render(<Test />, wrapper);
                    expect(reads).toHaveBeenCalledTimes(1);

                    signal.set('still');
                    await flushSignals();
                    expect(reads).toHaveBeenCalledTimes(2);

                    DNA.render(null, wrapper);
                    signal.set('out');
                    await flushSignals();
                    expect(reads).toHaveBeenCalledTimes(2);
                });
            });

            describe('useSignalEffect', () => {
                it('should run immediately and on change', async () => {
                    const signal = new Signal.State(1);
                    const spy = vi.fn();
                    const Test: DNA.FunctionComponent = (props, { useSignalEffect }) => {
                        useSignalEffect(() => spy(signal.get()));
                        return null;
                    };

                    DNA.render(<Test />, wrapper);
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenLastCalledWith(1);

                    signal.set(2);
                    await flushSignals();
                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(spy).toHaveBeenLastCalledWith(2);
                });

                it('should run the cleanup and stop once unmounted', async () => {
                    const signal = new Signal.State(1);
                    const spy = vi.fn();
                    const cleanup = vi.fn();
                    const Test: DNA.FunctionComponent = (props, { useSignalEffect }) => {
                        useSignalEffect(() => {
                            spy(signal.get());
                            return cleanup;
                        });
                        return null;
                    };

                    DNA.render(<Test />, wrapper);
                    signal.set(2);
                    await flushSignals();
                    expect(cleanup).toHaveBeenCalledTimes(1);

                    DNA.render(null, wrapper);
                    expect(cleanup).toHaveBeenCalledTimes(2);

                    signal.set(3);
                    await flushSignals();
                    expect(spy).toHaveBeenCalledTimes(2);
                });

                it('should be recreated when the dependencies change', async () => {
                    const signal = new Signal.State('a');
                    const spy = vi.fn();
                    const Test: DNA.FunctionComponent<{ tag: string }> = ({ tag }, { useSignalEffect }) => {
                        useSignalEffect(() => spy(tag, signal.get()), [tag]);
                        return null;
                    };

                    DNA.render(<Test tag="one" />, wrapper);
                    expect(spy).toHaveBeenLastCalledWith('one', 'a');

                    DNA.render(<Test tag="two" />, wrapper);
                    expect(spy).toHaveBeenLastCalledWith('two', 'a');

                    signal.set('b');
                    await flushSignals();
                    // only the effect of the last render is alive
                    expect(spy).toHaveBeenCalledTimes(3);
                    expect(spy).toHaveBeenLastCalledWith('two', 'b');
                });
            });

            describe('$signal', () => {
                it('should render a signal explicitly', async () => {
                    const signal = new Signal.State('explicit');
                    DNA.render(<div>{DNA.$signal(signal)}</div>, wrapper);
                    expect(wrapper.textContent).toBe('explicit');

                    signal.set('updated');
                    await flushSignals();
                    expect(wrapper.textContent).toBe('updated');
                });
            });
        });
    },
    10 * 1000
);
