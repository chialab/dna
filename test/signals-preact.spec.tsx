import * as DNA from '@chialab/dna';
import { computed, effect, Signal, signal, untracked } from '@preact/signals-core';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
// not part of the public API: the module is aliased to the same instance the package uses
import { effect as dnaEffect, hasSignals } from '../src/signals';

/**
 * Preact signals do not follow the TC39 proposal: the value is a property rather than
 * a method, and there is no watcher to arm. Rendering them is the four operations of a
 * `SignalAdapter`; the two factories are what lets the hooks create signals as well.
 */
const preactSignals: DNA.SignalAdapter = {
    isSignal: (value) => value instanceof Signal,
    get<T>(target: DNA.SignalLike<T>) {
        return (target as DNA.SignalValue<T>).value;
    },
    effect,
    untrack: untracked,
    state: (initialValue) => {
        const target = signal(initialValue);
        return [
            target,
            (newValue) => {
                target.value = newValue;
            },
        ];
    },
    // the options of the proposal have no counterpart here
    computed: (computation) => computed(computation),
};

describe(
    'signals with an adapter',
    () => {
        let wrapper: HTMLElement;

        beforeAll(() => {
            DNA.configureSignals(preactSignals);
        });

        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            document.body.removeChild(wrapper);
        });

        describe('configuration', () => {
            it('should detect the signals of the implementation', () => {
                expect(hasSignals()).toBe(true);
            });

            it('should accept the same adapter twice', () => {
                expect(() => DNA.configureSignals(preactSignals)).not.toThrow();
            });

            it('should refuse a second implementation', () => {
                expect(() => DNA.configureSignals({ ...preactSignals })).toThrow(
                    'A different Signal implementation is already in use'
                );
            });
        });

        describe('effect', () => {
            it('should run immediately and on change', () => {
                const count = signal(1);
                const spy = vi.fn();
                const dispose = dnaEffect(() => spy(count.value));

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenLastCalledWith(1);

                // this implementation pushes synchronously, there is nothing to flush
                count.value = 2;
                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenLastCalledWith(2);

                dispose();
                count.value = 3;
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should run the cleanup before each re-run and on dispose', () => {
                const count = signal(1);
                const cleanup = vi.fn();
                const dispose = dnaEffect(() => {
                    count.value;
                    return cleanup;
                });

                expect(cleanup).not.toHaveBeenCalled();

                count.value = 2;
                expect(cleanup).toHaveBeenCalledTimes(1);

                dispose();
                expect(cleanup).toHaveBeenCalledTimes(2);
            });

            it('should survive an effect created while another one is running', () => {
                const outer = signal(0);
                const inner = signal('a');
                const spy = vi.fn();

                dnaEffect(() => {
                    outer.value;
                    dnaEffect(() => spy(inner.value));
                });

                expect(spy).toHaveBeenCalledTimes(1);

                // re-running the outer effect must not dispose the inner one
                outer.value = 1;
                inner.value = 'b';
                expect(spy).toHaveBeenLastCalledWith('b');
            });
        });

        describe('content', () => {
            it('should render and update a signal', () => {
                const text = signal('hello');
                DNA.render(text, wrapper);
                expect(wrapper.textContent).toBe('hello');

                text.value = 'world';
                expect(wrapper.textContent).toBe('world');
            });

            it('should render and update a computed', () => {
                const count = signal(2);
                const double = computed(() => count.value * 2);
                DNA.render(<span>{double}</span>, wrapper);
                expect(wrapper.textContent).toBe('4');

                count.value = 5;
                expect(wrapper.textContent).toBe('10');
            });

            it('should render a signal holding a template', () => {
                const template = signal<DNA.Template>(<h1>one</h1>);
                DNA.render(<div>{template}</div>, wrapper);
                expect(wrapper.querySelector('h1')?.textContent).toBe('one');

                template.value = <h2>two</h2>;
                expect(wrapper.querySelector('h1')).toBeNull();
                expect(wrapper.querySelector('h2')?.textContent).toBe('two');
            });

            it('should stop updating a signal removed from the template', () => {
                const text = signal('hello');
                const visible = signal(true);
                DNA.render(<div>{visible.value ? text : null}</div>, wrapper);
                expect(wrapper.textContent).toBe('hello');

                DNA.render(<div>{null}</div>, wrapper);
                expect(wrapper.textContent).toBe('');

                text.value = 'world';
                expect(wrapper.textContent).toBe('');
            });
        });

        describe('attributes and properties', () => {
            it('should update only the bound attribute', () => {
                const label = signal('Save');
                DNA.render(
                    <button
                        type="button"
                        aria-label={label}>
                        text
                    </button>,
                    wrapper
                );

                const button = wrapper.querySelector('button') as HTMLButtonElement;
                expect(button.getAttribute('aria-label')).toBe('Save');

                label.value = 'Send';
                expect(button.getAttribute('aria-label')).toBe('Send');
                // the node is patched, never recreated
                expect(wrapper.querySelector('button')).toBe(button);
                expect(button.textContent).toBe('text');
            });

            it('should update a bound class', () => {
                const className = signal('');
                DNA.render(<div class={className} />, wrapper);

                const div = wrapper.querySelector('div') as HTMLDivElement;
                expect(div.className).toBe('');

                className.value = 'danger';
                expect(div.className).toBe('danger');

                className.value = '';
                expect(div.className).toBe('');
                expect(wrapper.querySelector('div')).toBe(div);
            });

            it('should release the binding when the node is removed', () => {
                const label = signal('Save');
                DNA.render(
                    <button
                        type="button"
                        aria-label={label}
                    />,
                    wrapper
                );
                const button = wrapper.querySelector('button') as HTMLButtonElement;

                DNA.render(null, wrapper);
                label.value = 'Send';
                expect(button.getAttribute('aria-label')).toBe('Save');
            });
        });

        describe('keyed children', () => {
            it('should reorder rows driven by a signal', () => {
                const rows = signal(['a', 'b', 'c']);
                const view = computed(() => rows.value.map((name) => <li key={name}>{name}</li>));

                DNA.render(<ul>{view}</ul>, wrapper);
                const list = wrapper.querySelector('ul') as HTMLUListElement;
                const [itemA, itemB, itemC] = Array.from(list.querySelectorAll('li'));
                expect(list.textContent).toBe('abc');

                rows.value = ['c', 'a', 'b'];
                expect(list.textContent).toBe('cab');
                expect(Array.from(list.querySelectorAll('li'))).toEqual([itemC, itemA, itemB]);
            });
        });
    },
    10 * 1000
);
