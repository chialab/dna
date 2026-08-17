import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// not part of the public API: the module is aliased to the same instance the package uses
import { batch, Computed, effect, isSignal, State, untrack } from '../src/Signal';

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

        describe('State', () => {
            it('should read and write a value', () => {
                const count = new State(1);
                expect(count.get()).toBe(1);

                count.set(2);
                expect(count.get()).toBe(2);
            });

            it('should read without depending on the value', () => {
                const count = new State(1);
                const spy = vi.fn();
                effect(() => spy(count.peek()));

                count.set(2);
                expect(spy).toHaveBeenCalledTimes(1);
            });

            it('should ignore a write of the same value', () => {
                const count = new State(1);
                const spy = vi.fn();
                effect(() => spy(count.get()));

                count.set(1);
                expect(spy).toHaveBeenCalledTimes(1);
            });

            it('should honour a custom equality', () => {
                const point = new State({ x: 0 }, { equals: (a, b) => a.x === b.x });
                const spy = vi.fn();
                effect(() => spy(point.get().x));

                point.set({ x: 0 });
                expect(spy).toHaveBeenCalledTimes(1);

                point.set({ x: 1 });
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should treat NaN as unchanged, like Object.is', () => {
                const value = new State(Number.NaN);
                const spy = vi.fn();
                effect(() => spy(value.get()));

                value.set(Number.NaN);
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });

        describe('Computed', () => {
            it('should derive from the signals it reads', () => {
                const count = new State(2);
                const double = new Computed(() => count.get() * 2);
                expect(double.get()).toBe(4);

                count.set(5);
                expect(double.get()).toBe(10);
            });

            it('should not run until it is read', () => {
                const count = new State(1);
                const computation = vi.fn(() => count.get() * 2);
                const double = new Computed(computation);

                expect(computation).not.toHaveBeenCalled();
                expect(double.get()).toBe(2);
                expect(computation).toHaveBeenCalledTimes(1);
            });

            it('should not run again while nobody reads it', () => {
                const count = new State(1);
                const computation = vi.fn(() => count.get() * 2);
                const double = new Computed(computation);
                double.get();

                for (let i = 2; i <= 5; i++) {
                    count.set(i);
                }
                expect(computation).toHaveBeenCalledTimes(1);

                expect(double.get()).toBe(10);
                expect(computation).toHaveBeenCalledTimes(2);
            });

            it('should cache the value between reads', () => {
                const count = new State(1);
                const computation = vi.fn(() => count.get() * 2);
                const double = new Computed(computation);

                double.get();
                double.get();
                double.get();
                expect(computation).toHaveBeenCalledTimes(1);
            });

            it('should stop an effect when the result does not change', () => {
                const count = new State(1);
                const parity = new Computed(() => count.get() % 2);
                const spy = vi.fn();
                effect(() => spy(parity.get()));
                expect(spy).toHaveBeenCalledTimes(1);

                // a different source value, the same derived one
                count.set(3);
                expect(spy).toHaveBeenCalledTimes(1);

                count.set(2);
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should follow dependencies that change from one run to the next', () => {
                const toggle = new State(true);
                const left = new State('left');
                const right = new State('right');
                const value = new Computed(() => (toggle.get() ? left.get() : right.get()));
                const spy = vi.fn();
                effect(() => spy(value.get()));
                expect(spy).toHaveBeenLastCalledWith('left');

                // the branch that is not taken is not a dependency
                right.set('other');
                expect(spy).toHaveBeenCalledTimes(1);

                toggle.set(false);
                expect(spy).toHaveBeenLastCalledWith('other');

                left.set('unread');
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should chain', () => {
                const count = new State(1);
                const double = new Computed(() => count.get() * 2);
                const quadruple = new Computed(() => double.get() * 2);
                expect(quadruple.get()).toBe(4);

                count.set(3);
                expect(quadruple.get()).toBe(12);
            });

            it('should throw when it depends on itself', () => {
                // biome-ignore lint/suspicious/noExplicitAny: the cycle is the point of the test
                const cycle: Computed<any> = new Computed(() => cycle.get());
                expect(() => cycle.get()).toThrow('Signal computation depends on itself');
            });
        });

        describe('effect', () => {
            it('should run immediately and on every change', () => {
                const count = new State(1);
                const spy = vi.fn();
                effect(() => spy(count.get()));

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenLastCalledWith(1);

                count.set(2);
                // synchronously, before the assignment returns
                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenLastCalledWith(2);
            });

            it('should run the cleanup before each run and on dispose', () => {
                const count = new State(1);
                const cleanup = vi.fn();
                const dispose = effect(() => {
                    count.get();
                    return cleanup;
                });
                expect(cleanup).not.toHaveBeenCalled();

                count.set(2);
                expect(cleanup).toHaveBeenCalledTimes(1);

                dispose();
                expect(cleanup).toHaveBeenCalledTimes(2);
            });

            it('should keep running through a run of changes', () => {
                const count = new State(0);
                const spy = vi.fn();
                effect(() => spy(count.get()));

                for (let i = 1; i <= 3; i++) {
                    count.set(i);
                }

                expect(spy).toHaveBeenCalledTimes(4);
                expect(spy).toHaveBeenLastCalledWith(3);
            });

            it('should stop once disposed', () => {
                const count = new State(1);
                const spy = vi.fn();
                const dispose = effect(() => spy(count.get()));
                dispose();

                count.set(2);
                expect(spy).toHaveBeenCalledTimes(1);
            });

            it('should be safe to dispose twice', () => {
                const cleanup = vi.fn();
                const dispose = effect(() => cleanup);
                dispose();
                dispose();
                expect(cleanup).toHaveBeenCalledTimes(1);
            });

            it('should run once for a change reaching it through many paths', () => {
                const count = new State(1);
                const double = new Computed(() => count.get() * 2);
                const triple = new Computed(() => count.get() * 3);
                const spy = vi.fn();
                effect(() => spy(double.get() + triple.get()));
                expect(spy).toHaveBeenLastCalledWith(5);

                count.set(2);
                // one run, with both derived values already up to date
                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenLastCalledWith(10);
            });

            it('should see the new value of every source it reads', () => {
                const first = new State(1);
                const second = new State(10);
                const seen: number[] = [];
                effect(() => {
                    seen.push(first.get() + second.get());
                });

                batch(() => {
                    first.set(2);
                    second.set(20);
                });

                expect(seen).toEqual([11, 22]);
            });

            it('should let an effect create another one', () => {
                const outer = new State(1);
                const inner = new State(1);
                const spy = vi.fn();

                effect(() => {
                    outer.get();
                    effect(() => spy(inner.get()));
                });
                expect(spy).toHaveBeenCalledTimes(1);

                inner.set(2);
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should throw when it keeps writing its own source', () => {
                const count = new State(0);
                expect(() =>
                    effect(() => {
                        count.set(count.get() + 1);
                    })
                ).toThrow('Signal effects did not settle');
            });
        });

        describe('batch', () => {
            it('should run the effects once', () => {
                const first = new State(1);
                const second = new State(2);
                const spy = vi.fn();
                effect(() => spy(first.get() + second.get()));

                batch(() => {
                    first.set(10);
                    second.set(20);
                });

                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenLastCalledWith(30);
            });

            it('should return the value of the callback', () => {
                expect(batch(() => 42)).toBe(42);
            });

            it('should flush even when the callback throws', () => {
                const count = new State(1);
                const spy = vi.fn();
                effect(() => spy(count.get()));

                expect(() =>
                    batch(() => {
                        count.set(2);
                        throw new Error('boom');
                    })
                ).toThrow('boom');
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should nest', () => {
                const count = new State(1);
                const spy = vi.fn();
                effect(() => spy(count.get()));

                batch(() => {
                    count.set(2);
                    batch(() => {
                        count.set(3);
                    });
                    expect(spy).toHaveBeenCalledTimes(1);
                });
                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenLastCalledWith(3);
            });
        });

        describe('untrack', () => {
            it('should read without depending on the value', () => {
                const tracked = new State(1);
                const hidden = new State(1);
                const spy = vi.fn();
                effect(() => spy(tracked.get() + untrack(() => hidden.get())));

                hidden.set(2);
                expect(spy).toHaveBeenCalledTimes(1);

                tracked.set(2);
                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenLastCalledWith(4);
            });

            it('should restore tracking afterwards', () => {
                const before = new State(1);
                const after = new State(1);
                const spy = vi.fn();
                effect(() => {
                    before.get();
                    untrack(() => 0);
                    spy(after.get());
                });

                after.set(2);
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should return the value of the callback', () => {
                expect(untrack(() => 42)).toBe(42);
            });
        });

        describe('isSignal', () => {
            it('should recognise its own signals', () => {
                expect(isSignal(new State(1))).toBe(true);
                expect(isSignal(new Computed(() => 1))).toBe(true);
                expect(isSignal(1)).toBe(false);
                expect(isSignal(null)).toBe(false);
                expect(isSignal({ get: () => 1 })).toBe(false);
            });
        });

        describe('graph', () => {
            it('should release the sources of a disposed effect', () => {
                const count = new State(1);
                const dispose = effect(() => {
                    count.get();
                });
                expect(count.sinks.size).toBe(1);

                dispose();
                expect(count.sinks.size).toBe(0);
            });

            it('should release the sources it stops reading', () => {
                const toggle = new State(true);
                const value = new State(1);
                effect(() => {
                    if (toggle.get()) {
                        value.get();
                    }
                });
                expect(value.sinks.size).toBe(1);

                toggle.set(false);
                expect(value.sinks.size).toBe(0);
            });

            it('should link a source read twice only once', () => {
                const count = new State(1);
                effect(() => {
                    count.get() + count.get();
                });
                expect(count.sinks.size).toBe(1);
            });
        });

        describe('content', () => {
            it('should render and update a signal', () => {
                const signal = new State('hello');
                DNA.render(signal, wrapper);
                expect(wrapper.textContent).toBe('hello');

                signal.set('world');
                expect(wrapper.textContent).toBe('world');
            });

            it('should render a computed', () => {
                const count = new State(2);
                const double = new Computed(() => count.get() * 2);
                DNA.render(<span>{double}</span>, wrapper);
                expect(wrapper.textContent).toBe('4');

                count.set(5);
                expect(wrapper.textContent).toBe('10');
            });

            it('should render a signal holding a template', () => {
                const signal = new State<DNA.Template>(<h1>one</h1>);
                DNA.render(<div>{signal}</div>, wrapper);
                expect(wrapper.querySelector('h1')?.textContent).toBe('one');

                signal.set(<h2>two</h2>);
                expect(wrapper.querySelector('h1')).toBeNull();
                expect(wrapper.querySelector('h2')?.textContent).toBe('two');
            });

            it('should anchor the binding with a marker comment', () => {
                // like every function component, the signal renderer is anchored to a
                // comment node: it shows up in `innerHTML`, as it does for `$await`
                const signal = new State('value');
                DNA.render(<div>{signal}</div>, wrapper);
                expect(wrapper.innerHTML).toBe('<div><!--SignalFunction-->value</div>');
            });

            it('should render a signal holding a function', () => {
                const fn = () => 'fn';
                const signal = new State<unknown>(fn);
                DNA.render(<div>{signal}</div>, wrapper);
                expect(wrapper.textContent).toBe(String(fn));

                signal.set('plain');
                expect(wrapper.textContent).toBe('plain');
            });

            it('should update only the bound fragment', () => {
                const signal = new State('a');
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
                expect(wrapper.querySelector('i')?.textContent).toBe('b');
                // the sibling node has not been recreated
                expect(wrapper.querySelector('span')).toBe(staticNode);
            });

            it('should render sibling signals independently', () => {
                const first = new State('1');
                const second = new State('2');
                DNA.render(
                    <div>
                        {first}-{second}
                    </div>,
                    wrapper
                );
                expect(wrapper.textContent).toBe('1-2');

                first.set('3');
                expect(wrapper.textContent).toBe('3-2');

                second.set('4');
                expect(wrapper.textContent).toBe('3-4');
            });

            it('should stop updating once unmounted', () => {
                const signal = new State('in');
                const show = { value: true };
                const template = () => <div>{show.value ? signal : 'out'}</div>;

                DNA.render(template(), wrapper);
                expect(wrapper.textContent).toBe('in');

                show.value = false;
                DNA.render(template(), wrapper);
                expect(wrapper.textContent).toBe('out');

                signal.set('changed');
                expect(wrapper.textContent).toBe('out');
            });
        });

        describe('properties', () => {
            it('should bind an attribute', () => {
                const signal = new State('first');
                DNA.render(<div id={signal} />, wrapper);

                const node = wrapper.children[0];
                expect(node.getAttribute('id')).toBe('first');

                signal.set('second');
                expect(node.getAttribute('id')).toBe('second');
                // the node has not been recreated
                expect(wrapper.children[0]).toBe(node);
            });

            it('should remove the attribute on a nullish value', () => {
                const signal = new State<string | undefined>('value');
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
                expect(node.hasAttribute('aria-label')).toBe(false);
            });

            it('should bind classes', () => {
                const signal = new State<Record<string, boolean>>({ active: true });
                DNA.render(<div class={signal} />, wrapper);

                const node = wrapper.children[0];
                expect(node.classList.contains('active')).toBe(true);

                signal.set({ active: false, done: true });
                expect(node.classList.contains('active')).toBe(false);
                expect(node.classList.contains('done')).toBe(true);
            });

            it('should bind styles', () => {
                const signal = new State<Record<string, string>>({ color: 'red' });
                DNA.render(<div style={signal} />, wrapper);

                const node = wrapper.children[0] as HTMLElement;
                expect(node.style.color).toBe('red');

                signal.set({ color: 'blue' });
                expect(node.style.color).toBe('blue');
            });

            it('should bind an event listener', () => {
                const first = vi.fn();
                const second = vi.fn();
                const signal = new State<EventListener>(first);
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
                node.click();
                expect(first).toHaveBeenCalledTimes(1);
                expect(second).toHaveBeenCalledTimes(1);
            });

            it('should release the binding when the value is no longer a signal', () => {
                const signal = new State('bound');
                const template = (value: unknown) => <div id={value as string} />;

                DNA.render(template(signal), wrapper);
                const node = wrapper.children[0];
                expect(node.getAttribute('id')).toBe('bound');

                DNA.render(template('static'), wrapper);
                expect(node.getAttribute('id')).toBe('static');

                signal.set('ignored');
                expect(node.getAttribute('id')).toBe('static');
            });

            it('should keep the binding across parent re-renders', () => {
                const signal = new State('bound');
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
                expect(node.getAttribute('id')).toBe('updated');
            });

            it('should release the bindings of a removed subtree', () => {
                const signal = new State('bound');
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
                expect(node.getAttribute('id')).toBe('bound');
            });

            it('should release the binding of a keyed node dropped while reordering', () => {
                const items = ['a', 'b', 'c'].map((key) => ({ key, signal: new State(`${key}1`) }));
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
                expect(Array.from(wrapper.querySelectorAll('span'))).toEqual([wrapper.children[0].children[0], nodeA]);

                items[1].signal.set('b2');
                items[0].signal.set('a2');

                // the dropped node is no longer bound
                expect(nodeB.getAttribute('id')).toBe('b1');
                // the reordered one still is
                expect(nodeA.getAttribute('id')).toBe('a2');
            });

            it('should release the binding when the node is removed', () => {
                const signal = new State('bound');
                const template = (show: boolean) => <div>{show ? <span id={signal} /> : null}</div>;

                DNA.render(template(true), wrapper);
                const node = wrapper.querySelector('span') as HTMLElement;
                expect(node.getAttribute('id')).toBe('bound');

                DNA.render(template(false), wrapper);
                expect(wrapper.querySelector('span')).toBeNull();

                signal.set('changed');
                expect(node.getAttribute('id')).toBe('bound');
            });
        });

        describe('components', () => {
            it('should render a signal inside a component template', () => {
                const signal = new State('hello');

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
                expect(element.querySelector('h1')).toBe(heading);
                expect(heading?.textContent).toBe('world');
            });

            it('should bind a signal to a component property', () => {
                @DNA.customElement('test-signals-2')
                class TestChild extends DNA.Component {
                    @DNA.property()
                    label = '';

                    render() {
                        return <span>{this.label}</span>;
                    }
                }

                const signal = new State('one');
                DNA.render(<test-signals-2 label={signal} />, wrapper);

                const child = wrapper.children[0] as TestChild;
                expect(child.label).toBe('one');
                expect(child.innerHTML).toBe('<span>one</span>');

                signal.set('two');
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

            it('should render the component once per signal change', () => {
                const signal = new State(0);
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

                // the signal updates its own fragment, the component is not re-rendered
                expect(updated.mock.calls.length).toBe(initial);
                expect(element.textContent).toBe('1');
            });

            it('should stop updating a disconnected component', () => {
                const signal = new State('in');

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
                expect(element.textContent).toBe('');
            });
        });

        describe('useSignal', () => {
            it('should create a signal preserved across renders', () => {
                const seen: unknown[] = [];
                const Test: DNA.FunctionComponent<{ tag: string }> = ({ tag }, { useSignal, useSignalValue }) => {
                    const count = useSignal(0);
                    seen.push(count);

                    return (
                        <button
                            type="button"
                            on:click={() => count.set(count.peek() + 1)}>
                            {tag}:{useSignalValue(count)}
                        </button>
                    );
                };

                DNA.render(<Test tag="a" />, wrapper);
                const node = wrapper.querySelector('button') as HTMLButtonElement;
                expect(node.textContent).toBe('a:0');

                node.click();
                expect(node.textContent).toBe('a:1');

                // a render driven from the outside keeps the very same signal
                DNA.render(<Test tag="b" />, wrapper);
                expect(node.textContent).toBe('b:1');
                expect(new Set(seen).size).toBe(1);
            });

            it('should honour the signal options', () => {
                let created: State<{ id: number }> | undefined;
                const Test: DNA.FunctionComponent = (props, { useSignal }) => {
                    created = useSignal({ id: 0 }, { equals: (a, b) => a.id === b.id });

                    return null;
                };

                DNA.render(<Test />, wrapper);
                const signal = created as State<{ id: number }>;
                const spy = vi.fn();
                const dispose = effect(() => spy(signal.get()));
                expect(spy).toHaveBeenCalledTimes(1);

                // a different object with the same id counts as unchanged
                signal.set({ id: 0 });
                expect(spy).toHaveBeenCalledTimes(1);

                signal.set({ id: 1 });
                expect(spy).toHaveBeenCalledTimes(2);
                dispose();
            });
        });

        describe('useComputed', () => {
            it('should derive from the signals it reads', () => {
                const count = new State(2);
                const Test: DNA.FunctionComponent = (props, { useComputed }) => {
                    const double = useComputed(() => count.get() * 2);

                    return <span>{double}</span>;
                };

                DNA.render(<Test />, wrapper);
                expect(wrapper.textContent).toBe('4');

                count.set(5);
                expect(wrapper.textContent).toBe('10');
            });

            it('should be recreated when the dependencies change', () => {
                const count = new State(2);
                const Test: DNA.FunctionComponent<{ factor: number }> = ({ factor }, { useComputed }) => {
                    const scaled = useComputed(() => count.get() * factor, [factor]);

                    return <span>{scaled}</span>;
                };

                DNA.render(<Test factor={2} />, wrapper);
                expect(wrapper.textContent).toBe('4');

                DNA.render(<Test factor={10} />, wrapper);
                expect(wrapper.textContent).toBe('20');

                count.set(3);
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
            it('should read a signal and follow it', () => {
                const signal = new State('hello');
                const Test: DNA.FunctionComponent = (props, { useSignalValue }) => (
                    <span>{useSignalValue(signal)}</span>
                );

                DNA.render(<Test />, wrapper);
                const node = wrapper.querySelector('span');
                expect(node?.textContent).toBe('hello');

                signal.set('world');
                expect(wrapper.querySelector('span')).toBe(node);
                expect(node?.textContent).toBe('world');
            });

            it('should render a different template on change', () => {
                // the value is in hand, so it can drive the shape of the template and not
                // just fill a hole in it
                const flag = new State(true);
                const Test: DNA.FunctionComponent = (props, { useSignalValue }) =>
                    useSignalValue(flag) ? <em>yes</em> : <strong>no</strong>;

                DNA.render(<Test />, wrapper);
                expect(wrapper.querySelector('em')?.textContent).toBe('yes');

                flag.set(false);
                expect(wrapper.querySelector('em')).toBeNull();
                expect(wrapper.querySelector('strong')?.textContent).toBe('no');
            });

            it('should not re-render the whole component', () => {
                const signal = new State(0);
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
                expect(element.textContent).toBe('1');
                expect(updated.mock.calls.length).toBe(renders);
            });

            it('should read a signal holding a function', () => {
                const fn = () => 'fn';
                const signal = new State<unknown>(fn);
                const read: unknown[] = [];
                const Test: DNA.FunctionComponent = (props, { useSignalValue }) => {
                    read.push(useSignalValue(signal));
                    return null;
                };

                DNA.render(<Test />, wrapper);
                expect(read).toEqual([fn]);

                signal.set('plain');
                expect(read).toEqual([fn, 'plain']);
            });

            it('should follow a different signal when the one it reads changes', () => {
                const first = new State('first');
                const second = new State('second');
                const Test: DNA.FunctionComponent<{ signal: DNA.Signal.ReadonlySignal<string> }> = (
                    { signal },
                    { useSignalValue }
                ) => <span>{useSignalValue(signal)}</span>;

                DNA.render(<Test signal={first} />, wrapper);
                expect(wrapper.textContent).toBe('first');

                DNA.render(<Test signal={second} />, wrapper);
                expect(wrapper.textContent).toBe('second');

                second.set('updated');
                expect(wrapper.textContent).toBe('updated');

                // the previous signal is no longer followed
                first.set('ignored');
                expect(wrapper.textContent).toBe('updated');
            });

            it('should stop following once unmounted', () => {
                const signal = new State('in');
                const reads = vi.fn();
                // a computed only recomputes while something watches it: the spy tells
                // whether the subscription is still alive
                const watched = new Computed(() => {
                    reads();
                    return signal.get();
                });
                const Test: DNA.FunctionComponent = (props, { useSignalValue }) => (
                    <span>{useSignalValue(watched)}</span>
                );

                DNA.render(<Test />, wrapper);
                expect(reads).toHaveBeenCalledTimes(1);

                signal.set('still');
                expect(reads).toHaveBeenCalledTimes(2);

                DNA.render(null, wrapper);
                signal.set('out');
                expect(reads).toHaveBeenCalledTimes(2);
            });
        });

        describe('useSignalEffect', () => {
            it('should run immediately and on change', () => {
                const signal = new State(1);
                const spy = vi.fn();
                const Test: DNA.FunctionComponent = (props, { useSignalEffect }) => {
                    useSignalEffect(() => spy(signal.get()));
                    return null;
                };

                DNA.render(<Test />, wrapper);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenLastCalledWith(1);

                signal.set(2);
                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenLastCalledWith(2);
            });

            it('should run the cleanup and stop once unmounted', () => {
                const signal = new State(1);
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
                expect(cleanup).toHaveBeenCalledTimes(1);

                DNA.render(null, wrapper);
                expect(cleanup).toHaveBeenCalledTimes(2);

                signal.set(3);
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should be recreated when the dependencies change', () => {
                const signal = new State('a');
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
                // only the effect of the last render is alive
                expect(spy).toHaveBeenCalledTimes(3);
                expect(spy).toHaveBeenLastCalledWith('two', 'b');
            });
        });

        describe('$signal', () => {
            it('should render a signal explicitly', () => {
                const signal = new State('explicit');
                DNA.render(<div>{DNA.$signal(signal)}</div>, wrapper);
                expect(wrapper.textContent).toBe('explicit');

                signal.set('updated');
                expect(wrapper.textContent).toBe('updated');
            });
        });
    },
    10 * 1000
);
