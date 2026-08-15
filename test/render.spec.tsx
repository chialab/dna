import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe(
    'render',
    () => {
        let wrapper: HTMLElement;
        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            document.body.removeChild(wrapper);
        });

        describe('render', () => {
            it('should render string', () => {
                expect(DNA.render('hello')).toHaveProperty('textContent', 'hello');
            });

            it('should render HTML string as simple string', () => {
                expect(DNA.render('<h1>hello</h1>')).toHaveProperty('textContent', '<h1>hello</h1>');
            });

            it('should render number', () => {
                expect(DNA.render(42)).toHaveProperty('textContent', '42');
            });

            it('should render boolean', () => {
                expect(DNA.render(true)).toHaveProperty('textContent', 'true');
                expect(DNA.render(false)).toBeUndefined();
            });

            it('should render undefined', () => {
                expect(DNA.render(undefined)).toBeUndefined();
            });

            it('should render null', () => {
                expect(DNA.render(null)).toBeUndefined();
            });

            it('should render hyper function', () => {
                const ul = DNA.render(
                    <ul class="list">
                        <li>One</li>
                        <li>Two</li>
                    </ul>
                ) as HTMLElement;
                expect(ul.childNodes).toHaveLength(2);
                expect(ul.querySelector('li:nth-child(1)')).toHaveProperty('textContent', 'One');
                expect(ul.querySelector('li:nth-child(2)')).toHaveProperty('textContent', 'Two');
            });

            it('should render a text node', () => {
                expect(DNA.render(document.createTextNode('Hello'))).toHaveProperty('textContent', 'Hello');
            });

            it('should render an element node', () => {
                expect(DNA.render(document.createElement('div'))).toHaveProperty('tagName', 'DIV');
            });

            it('should render an element node using the `ref` property', () => {
                const div = document.createElement('div');
                div.setAttribute('class', 'test');
                div.innerHTML = '<span>test</span>';
                DNA.render(
                    <div>
                        <div
                            ref={div}
                            id="test"
                        />
                    </div>
                );
                expect(div).toHaveProperty('id', 'test');
                expect(div).toHaveProperty('className', 'test');
                expect(div).toHaveProperty('textContent', 'test');
                expect(div.childNodes).toHaveLength(1);
                expect(div.parentNode).toHaveProperty('tagName', 'DIV');
            });

            it('should render an element node using the `h` helper', () => {
                const div = document.createElement('div');
                div.setAttribute('class', 'test');
                div.innerHTML = '<span>test</span>';
                DNA.render(DNA.html`<div><${div} id="test" /></div>`);
                expect(div).toHaveProperty('id', 'test');
                expect(div).toHaveProperty('className', 'test');
                expect(div).toHaveProperty('textContent', 'test');
                expect(div.childNodes).toHaveLength(1);
                expect(div.parentNode).toHaveProperty('tagName', 'DIV');
            });

            it('should render an element node using the `h` helper inside a component', () => {
                @DNA.customElement('test-render-1')
                class TestElement extends DNA.Component {
                    render() {
                        return this.childNodesBySlot().map((node) => DNA.html`<div ref=${node} id="test" />`);
                    }
                }

                @DNA.customElement('test-render-2')
                class TestElement2 extends DNA.Component {
                    render() {
                        return (
                            <test-render-1>
                                <div
                                    class="test"
                                    key={0}>
                                    test
                                </div>
                                <div
                                    class="test"
                                    key={1}>
                                    test
                                </div>
                            </test-render-1>
                        );
                    }
                }

                const root = DNA.render(<test-render-2 />, wrapper) as TestElement2;
                const element = wrapper.querySelector('test-render-1') as TestElement;
                const divs = [element.children[0], element.children[1]];
                // force renders in order to check if keyed elements are respected
                root.forceUpdate();
                element.forceUpdate();
                expect(element).toBe(wrapper.querySelector('test-render-1'));
                expect(element.children[0]).toBe(divs[0]);
                expect(element.children[1]).toBe(divs[1]);

                divs.forEach((div) => {
                    expect(div).toHaveProperty('id', 'test');
                    expect(div).toHaveProperty('className', 'test');
                    expect(div).toHaveProperty('textContent', 'test');
                    expect(div.childNodes).toHaveLength(1);
                });
            });

            it('should render mixed content', () => {
                DNA.render(
                    <>
                        {'hello'}
                        {'world'}
                        {true}
                        <ul class="list">
                            <li>One</li>
                            <li>Two</li>
                        </ul>
                        {document.createTextNode('Hello')}
                        {document.createElement('div')}
                    </>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(6);
            });

            it('should render component function', () => {
                const Test: DNA.FunctionComponent = () => (
                    <>
                        {'hello'}
                        {'world'}
                        {true}
                        <ul class="list">
                            <li>One</li>
                            <li>Two</li>
                        </ul>
                        {document.createTextNode('Hello')}
                        {document.createElement('div')}
                    </>
                );

                DNA.render(<Test />, wrapper);
                expect(wrapper.childNodes).toHaveLength(7);
            });

            it('should render component function with keys', () => {
                const Test: DNA.FunctionComponent = () => (
                    <>
                        {'hello'} {'world'}
                    </>
                );
                DNA.render(
                    <>
                        <Test key={1} />
                        <Test key={2} />
                    </>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(8);
                const [, , , , comment, text1, , text2] = Array.from(wrapper.childNodes);
                DNA.render(<Test key={2} />, wrapper);
                expect(wrapper.childNodes).toHaveLength(4);
                expect(wrapper.childNodes[0]).toBe(comment);
                expect(wrapper.childNodes[1]).toBe(text1);
                expect(wrapper.childNodes[3]).toBe(text2);
            });

            it('should re-render component function only', async () => {
                const render1 = vi.fn();
                const render2 = vi.fn();

                const Test: DNA.FunctionComponent = () => {
                    render1();
                    return 'hello';
                };

                const Clock: DNA.FunctionComponent = (props, { useState }) => {
                    render2();
                    const [count, setCount] = useState(1);
                    if (count === 1) {
                        setTimeout(() => {
                            setCount(count + 1);
                        }, 200);
                    }

                    return count;
                };

                DNA.render(
                    <>
                        <Test />
                        <Clock />
                    </>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(4);
                expect(wrapper.childNodes[1]).toHaveProperty('textContent', 'hello');
                expect(wrapper.childNodes[3]).toHaveProperty('textContent', '1');
                await new Promise((r) => setTimeout(r, 500));
                expect(wrapper.childNodes[1]).toHaveProperty('textContent', 'hello');
                expect(wrapper.childNodes[3]).toHaveProperty('textContent', '2');
                expect(render1).toHaveBeenCalledOnce();
                expect(render2).toHaveBeenCalledTimes(2);
            });

            it('should re-render component function only with keys', async () => {
                const render1 = vi.fn();
                const render2 = vi.fn();

                const Test: DNA.FunctionComponent = () => {
                    render1();
                    return 'hello';
                };

                const Counter: DNA.FunctionComponent = (props, { useState }) => {
                    render2();
                    const [count, setCount] = useState(1);
                    return (
                        <button
                            type="button"
                            onclick={() => setCount(count + 1)}>
                            {count}
                        </button>
                    );
                };

                DNA.render(
                    <>
                        <Test key={1} />
                        <Counter key={2} />
                    </>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(4);
                expect(wrapper.childNodes[1]).toHaveProperty('textContent', 'hello');
                expect(wrapper.childNodes[3]).toHaveProperty('textContent', '1');
                const button = wrapper.childNodes[3] as HTMLButtonElement;
                button.click();
                expect(wrapper.childNodes[1]).toHaveProperty('textContent', 'hello');
                expect(wrapper.childNodes[3]).toHaveProperty('textContent', '2');
                expect(wrapper.childNodes[3]).toBe(button);
                expect(render1).toHaveBeenCalledOnce();
                expect(render2).toHaveBeenCalledTimes(2);
            });

            it('should add nodes', () => {
                const list = DNA.render(
                    <ul class="list">
                        <li>One</li>
                        <li>Two</li>
                    </ul>,
                    wrapper
                ) as HTMLElement;
                const children = list.childNodes;
                expect(children).toHaveLength(2);
                DNA.render(
                    <ul class="list">
                        <li>One</li>
                        <li>Two</li>
                        <li>Three</li>
                        <li>Four</li>
                    </ul>,
                    wrapper
                );
                const newChildren = list.childNodes;
                expect(newChildren).toHaveLength(4);
                expect(children[0]).toBe(newChildren[0]);
                expect(children[1]).toBe(newChildren[1]);
            });

            it('should remove nodes', () => {
                DNA.render(
                    <ul class="list">
                        <li>One</li>
                        <li>Two</li>
                        <li>Three</li>
                        <li>Four</li>
                    </ul>,
                    wrapper
                );
                const list = wrapper.querySelector('ul.list') as HTMLElement;
                const children = Array.from(list.childNodes);
                expect(children).toHaveLength(4);
                DNA.render(
                    <ul class="list">
                        <li>One</li>
                        <li>Two</li>
                    </ul>,
                    wrapper
                );
                const newChildren = list.childNodes;
                expect(newChildren).toHaveLength(2);
                expect(children[0]).toBe(newChildren[0]);
                expect(children[1]).toBe(newChildren[1]);
            });

            it('should not thrown if element has been removed by a DOM operation outside of render cycle', () => {
                DNA.render(
                    <ul class="list">
                        <li>One</li>
                        <li>Two</li>
                        <li>Three</li>
                        <li>Four</li>
                    </ul>,
                    wrapper
                );
                const ul = wrapper.querySelector('ul.list') as HTMLElement;
                ul.removeChild(ul.lastChild as Node);
                expect(() => {
                    DNA.render(
                        <ul class="list">
                            <li>One</li>
                            <li>Two</li>
                            <li>Three</li>
                        </ul>,
                        wrapper
                    );
                }).not.toThrow();
                expect(ul.childNodes).toHaveLength(3);
            });

            it('should remove nodes inside component', () => {
                const Parent = DNA.define(
                    'test-render-14',
                    class extends DNA.Component {
                        render() {
                            return this.childNodesBySlot().map((node) => <div ref={node as HTMLElement} />);
                        }
                    }
                );
                DNA.define('test-render-15', class extends DNA.Component {});
                const list = new Parent();
                wrapper.appendChild(list);
                DNA.render(
                    <>
                        <test-render-15>One</test-render-15>
                        <test-render-15>Two</test-render-15>
                        <test-render-15>Three</test-render-15>
                        <test-render-15>Four</test-render-15>
                    </>,
                    list
                );
                const children = Array.from(list.childNodes);
                expect(children).toHaveLength(4);
                DNA.render(
                    <>
                        <test-render-15>One</test-render-15>
                        <test-render-15>Two</test-render-15>
                    </>,
                    list
                );
                const newChildren = list.childNodes;
                expect(newChildren).toHaveLength(2);
                expect(children[0]).toBe(newChildren[0]);
                expect(children[1]).toBe(newChildren[1]);
            });

            it('should update nodes', () => {
                DNA.render(
                    <ul class="list">
                        <li>One</li>
                        <li>Two</li>
                        <li>Three</li>
                        <li>Four</li>
                        <li>{5}</li>
                        <li>6</li>
                    </ul>,
                    wrapper
                );
                const list = wrapper.querySelector('ul.list') as HTMLElement;
                const children = list.childNodes;
                expect(children[0]).toHaveProperty('textContent', 'One');
                expect(children[1]).toHaveProperty('textContent', 'Two');
                expect(children[2]).toHaveProperty('textContent', 'Three');
                expect(children[3]).toHaveProperty('textContent', 'Four');
                expect(children[4]).toHaveProperty('textContent', '5');
                expect(children[5]).toHaveProperty('textContent', '6');
                DNA.render(
                    <ul class="list">
                        <li>Seven</li>
                        <li>Eight</li>
                        <li>Nine</li>
                        <li>Ten</li>
                        <li>{11}</li>
                        <li>{12}</li>
                    </ul>,
                    wrapper
                );
                const newChildren = list.childNodes;
                expect(children[0]).toBe(newChildren[0]);
                expect(children[1]).toBe(newChildren[1]);
                expect(children[2]).toBe(newChildren[2]);
                expect(children[3]).toBe(newChildren[3]);
                expect(children[4]).toBe(newChildren[4]);
                expect(children[5]).toBe(newChildren[5]);
                expect(children[0]).toHaveProperty('textContent', 'Seven');
                expect(children[1]).toHaveProperty('textContent', 'Eight');
                expect(children[2]).toHaveProperty('textContent', 'Nine');
                expect(children[3]).toHaveProperty('textContent', 'Ten');
                expect(children[4]).toHaveProperty('textContent', '11');
                expect(children[5]).toHaveProperty('textContent', '12');
            });

            it('should update add and remove attributes', () => {
                DNA.render(
                    <div
                        // @ts-expect-error We are testing if the attribute is handled
                        prop1="test1"
                        prop2={2}
                    />,
                    wrapper
                );
                const element = wrapper.children[0];
                expect(element.getAttribute('prop1')).toBe('test1');
                expect(element.getAttribute('prop2')).toBe('2');
                DNA.render(
                    <div
                        // @ts-expect-error We are testing if the attribute is handled
                        prop1="test1"
                        prop3={true}
                    />,
                    wrapper
                );
                expect(element.getAttribute('prop1')).toBe('test1');
                expect(element.getAttribute('prop2')).toBeNull();
                expect(element.getAttribute('prop3')).toBe('');
            });

            it('should add and remove native listeners', () => {
                const listener = vi.fn();
                DNA.render(<div onclick={listener} />, wrapper);
                const element = wrapper.children[0] as HTMLElement;
                expect(listener).not.toHaveBeenCalled();
                element.click();
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledOnce();
                DNA.render(<div onclick={undefined} />, wrapper);
                element.click();
                expect(listener).toHaveBeenCalledOnce();
            });

            it('should add and remove custom listeners', () => {
                const listener = vi.fn();
                DNA.render(<div on:custom={listener} />, wrapper);
                const element = wrapper.children[0] as HTMLElement;
                expect(listener).not.toHaveBeenCalled();
                DNA.dispatchEvent(element, 'custom');
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledOnce();
                DNA.render(<div on:custom={undefined} />, wrapper);
                element.click();
                expect(listener).toHaveBeenCalledOnce();
            });

            it('should update native properties', () => {
                DNA.render(
                    <form>
                        <input
                            type="radio"
                            name="test"
                            value="1"
                            checked={false}
                        />
                        <input
                            type="radio"
                            name="test"
                            value="2"
                            checked={false}
                        />
                    </form>,
                    wrapper
                );
                const element = wrapper.querySelector('input[value="2"]') as HTMLInputElement;
                expect(element.getAttribute('checked')).toBeNull();
                expect(element.checked).toBe(false);
                element.checked = true;
                expect(element.checked).toBe(true);
                DNA.render(
                    <form>
                        <input
                            type="radio"
                            name="test"
                            value="1"
                            checked={false}
                        />
                        <input
                            type="radio"
                            name="test"
                            value="2"
                            checked={false}
                        />
                    </form>,
                    wrapper
                );
                expect(element.getAttribute('checked')).toBeNull();
                expect(element.checked).toBe(false);

                DNA.render(
                    <img
                        src=""
                        alt=""
                    />,
                    wrapper
                );
                const img = wrapper.querySelector('img') as HTMLImageElement;
                expect(img.draggable).toBe(true);
                DNA.render(
                    <img
                        src=""
                        alt=""
                        draggable={false}
                    />,
                    wrapper
                );
                expect(img.draggable).toBe(false);

                expect(() => DNA.render(<svg width={12} />, wrapper)).not.throw();
                const svg = wrapper.querySelector('svg') as SVGSVGElement;
                expect(svg.getAttribute('width')).toBe('12');
            });

            it('should convert observed attributes', () => {
                @DNA.customElement('test-render-3')
                class TestElement extends DNA.Component {
                    @DNA.property({
                        type: Number,
                    })
                    number?: number;
                }

                const element = DNA.render(<test-render-3 number={2} />, wrapper) as TestElement;
                expect(element.number).toBe(2);
            });

            it('should assign properties and attributes to component', () => {
                @DNA.customElement('test-render-4')
                class TestElement extends DNA.Component {
                    @DNA.property({
                        type: Number,
                    })
                    number?: number;

                    @DNA.property({
                        type: String,
                        attribute: 'camel-case',
                    })
                    camelCase?: string;

                    declare string?: string;
                    declare object?: object;
                }

                const element = DNA.render(
                    <test-render-4
                        number={2}
                        camelCase="test"
                        string="2"
                        object={{}}
                        data-test="3"
                    />,
                    wrapper
                ) as TestElement;
                expect(element.number).toBe(2);
                expect(element.string).toBeUndefined();
                expect(element.camelCase).toBe('test');
                expect(element.getAttribute('camelCase')).toBeNull();
                expect(element.getAttribute('camel-case')).toBe('test');
                expect(element.getAttribute('string')).toBe('2');
                expect(element.object).toBeTypeOf('object');
                expect(element.getAttribute('object')).toBeNull();
                // @ts-expect-error We are testing if the property has not been set
                expect(element['data-test']).toBeUndefined();
                expect(element.getAttribute('data-test')).toBe('3');
                expect(element.dataset.test).toBe('3');
            });

            it('should update add and remove classes', () => {
                DNA.render(<div class="test1" />, wrapper);
                const element = wrapper.children[0];
                expect(element.getAttribute('class')).toBe('test1');
                element.classList.add('test2');
                expect(element.getAttribute('class')).toBe('test1 test2');
                DNA.render(
                    <div
                        class={{
                            test3: true,
                        }}
                    />,
                    wrapper
                );
                expect(element.getAttribute('class')).toBe('test2 test3');
                DNA.render(<div />, wrapper);
                expect(element.getAttribute('class')).toBe(null);
            });

            it('should split a class string on any whitespace when diffing it', () => {
                DNA.render(<div class={{ test1: true }} />, wrapper);
                const element = wrapper.children[0];
                DNA.render(<div class={'test2\n\ttest3  test4'} />, wrapper);
                expect(element.classList.contains('test1')).toBe(false);
                expect(element.classList.contains('test2')).toBe(true);
                expect(element.classList.contains('test3')).toBe(true);
                expect(element.classList.contains('test4')).toBe(true);
            });

            it('should update add and remove styles', () => {
                const element = DNA.render(<div style="color: red;" />, wrapper) as HTMLDivElement;
                element.style.fontFamily = 'sans-serif';
                expect(['rgb(255, 0, 0)', 'red']).toContain(window.getComputedStyle(element).color);
                expect(['sans-serif']).toContain(window.getComputedStyle(element).fontFamily);
                DNA.render(<div style={{ backgroundColor: 'blue' }} />, wrapper);
                expect(['rgb(0, 0, 0)', '']).toContain(window.getComputedStyle(element).color);
                expect(['rgb(0, 0, 255)', 'blue']).toContain(window.getComputedStyle(element).backgroundColor);
                expect(['sans-serif']).toContain(window.getComputedStyle(element).fontFamily);
                DNA.render(<div style="font-weight: bold;" />, wrapper);
                expect(['rgb(0, 0, 0)', '']).toContain(window.getComputedStyle(element).color);
                expect(['rgba(0, 0, 0, 0)', '', 'transparent']).toContain(
                    window.getComputedStyle(element).backgroundColor
                );
                expect(['700', 'bold']).toContain(window.getComputedStyle(element).fontWeight);
                expect(['sans-serif']).toContain(window.getComputedStyle(element).fontFamily);
                DNA.render(<div />, wrapper);
                expect(['rgb(0, 0, 0)', '']).toContain(window.getComputedStyle(element).color);
            });

            it('should remove the classes of the previous render when switching notation', () => {
                const element = DNA.render(<div class="test1" />, wrapper) as HTMLDivElement;
                expect(element.getAttribute('class')).toBe('test1');
                DNA.render(
                    <div
                        class={{
                            test2: true,
                        }}
                    />,
                    wrapper
                );
                expect(element.getAttribute('class')).toBe('test2');
            });

            it('should remove the styles of the previous render when switching notation', () => {
                const element = DNA.render(<div style="color: red;" />, wrapper) as HTMLDivElement;
                expect(['rgb(255, 0, 0)', 'red']).toContain(window.getComputedStyle(element).color);
                DNA.render(
                    <div
                        style={{
                            backgroundColor: 'blue',
                        }}
                    />,
                    wrapper
                );
                expect(['rgb(0, 0, 255)', 'blue']).toContain(window.getComputedStyle(element).backgroundColor);
                expect(['rgb(0, 0, 0)', '']).toContain(window.getComputedStyle(element).color);
            });

            it('should preserve the case of a custom property', () => {
                const element = DNA.render(
                    <div
                        style={{
                            '--fooBar': 'red',
                        }}
                    />,
                    wrapper
                ) as HTMLDivElement;
                expect(element.style.getPropertyValue('--fooBar')).toBe('red');
                expect(element.style.getPropertyValue('--foo-bar')).toBe('');
                DNA.render(<div style={{}} />, wrapper);
                expect(element.style.getPropertyValue('--fooBar')).toBe('');
            });

            it('should handle repeated whitespace in a class list', () => {
                const element = DNA.render(<div class="test1  test2" />, wrapper) as HTMLDivElement;
                element.classList.add('test3');
                DNA.render(
                    <div
                        class={{
                            test4: true,
                        }}
                    />,
                    wrapper
                );
                expect(element.getAttribute('class')).toBe('test3 test4');
            });

            it('should render svgs', () => {
                DNA.render(
                    <div>
                        <svg aria-hidden="true">
                            <g>
                                <rect
                                    width="100"
                                    height="100"
                                />
                                <foreignObject>
                                    <body xmlns="http://www.w3.org/1999/xhtml">
                                        <p>Test</p>
                                    </body>
                                </foreignObject>
                            </g>
                        </svg>
                    </div>,
                    wrapper
                );
                const div = wrapper.querySelector('div') as HTMLDivElement;
                const svg = wrapper.querySelector('svg') as SVGSVGElement;
                const g = wrapper.querySelector('g') as SVGGElement;
                const rect = wrapper.querySelector('rect') as SVGRectElement;
                const foreign = wrapper.querySelector('foreignObject') as SVGForeignObjectElement;
                const body = wrapper.querySelector('body') as HTMLBodyElement;
                const p = wrapper.querySelector('p') as HTMLParagraphElement;
                expect(div.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
                expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(g.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(rect.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(foreign.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(body.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
                expect(p.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
            });

            it('should render plain objects', () => {
                const obj = {
                    toString() {
                        return 'Test';
                    },
                };
                DNA.render(<div>{obj}</div>, wrapper);
                const element = wrapper.children[0];
                expect(element.childNodes).toHaveLength(1);
                expect(element).toHaveProperty('textContent', 'Test');
            });

            it('should not set svgs properties', () => {
                const svg = DNA.render(
                    <svg aria-hidden="true">
                        <line
                            x1="0"
                            y1="100"
                            x2="100"
                            y2="200"
                        />
                    </svg>,
                    wrapper
                ) as SVGSVGElement;
                const line = svg.querySelector('line') as SVGLineElement;
                expect(line.getAttribute('x1')).toBe('0');
                expect(line.getAttribute('y1')).toBe('100');
                expect(line.getAttribute('x2')).toBe('100');
                expect(line.getAttribute('y2')).toBe('200');
            });

            it('should not empty nodes when no slotted children has been passed', () => {
                DNA.render(<div />, wrapper);
                const element = wrapper.children[0];
                expect(element.childNodes).toHaveLength(0);
                element.appendChild(document.createElement('span'));
                expect(element.childNodes).toHaveLength(1);
                DNA.render(<div />, wrapper);
                expect(element.childNodes).toHaveLength(1);
            });

            it('should not reuse slotted children', () => {
                @DNA.customElement('test-render-5')
                class TestElement extends DNA.Component {
                    @DNA.property({
                        type: Boolean,
                    })
                    more = false;

                    render() {
                        return (
                            <>
                                <div class="child1" />
                                <div class="child2" />
                                {this.more && <div class="child3" />}
                                <slot />
                            </>
                        );
                    }
                }

                const element = DNA.render(
                    <test-render-5>
                        <div />
                    </test-render-5>,
                    wrapper
                ) as TestElement;
                expect(element.childNodes).toHaveLength(3);
                const [slotted] = element.childNodesBySlot();
                const [div1, div2, div3] = Array.from(element.childNodes);
                DNA.render(
                    <test-render-5 more>
                        <div />
                    </test-render-5>,
                    wrapper
                );
                expect(element.childNodes).toHaveLength(4);
                const [slotted2] = element.childNodesBySlot();
                const [div4, div5, div6, div7] = Array.from(element.childNodes);
                expect(slotted).toBe(slotted2);
                expect(div1).toBe(div4);
                expect(div2).toBe(div5);
                expect(div3).toBe(div7);
                expect(div4).toHaveProperty('className', 'child1');
                expect(div5).toHaveProperty('className', 'child2');
                expect(div6).toHaveProperty('className', 'child3');
                expect(div7).toHaveProperty('className', '');
            });

            it('should not reuse slotted text', () => {
                @DNA.customElement('test-render-6')
                class TestElement extends DNA.Component {
                    @DNA.property({
                        type: Boolean,
                    })
                    showPrefix = false;

                    render() {
                        return (
                            <>
                                {this.showPrefix && 'Prefix:'}
                                <slot />
                            </>
                        );
                    }
                }

                const element = DNA.render(<test-render-6>Text</test-render-6>, wrapper) as TestElement;
                expect(element.childNodes).toHaveLength(1);
                const [slotted] = element.childNodesBySlot();
                const [textNode] = Array.from(element.childNodes);
                DNA.render(<test-render-6 showPrefix>Text</test-render-6>, wrapper);
                expect(element.childNodes).toHaveLength(2);
                const [prefixNode, newTextNode] = Array.from(element.childNodes);
                expect(slotted).toBe(element.childNodesBySlot()[0]);
                expect(textNode).toBe(newTextNode);
                expect(prefixNode).toHaveProperty('textContent', 'Prefix:');
                expect(newTextNode).toHaveProperty('textContent', 'Text');
                DNA.render(<test-render-6 showPrefix={false}>Text</test-render-6>, wrapper);
                expect(element.childNodes).toHaveLength(1);
            });

            it('should handle emptied slot nodes', () => {
                @DNA.customElement('test-render-7')
                class TestElement extends DNA.Component {
                    @DNA.property({
                        type: Boolean,
                    })
                    showSlotted = true;

                    render() {
                        if (this.showSlotted) {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                        return <div />;
                    }
                }

                const element = DNA.render(<test-render-7>Text</test-render-7>, wrapper) as TestElement;
                const div = element.childNodes[0];
                expect(element.childNodesBySlot()).toHaveLength(1);
                expect(div.childNodes).toHaveLength(1);
                DNA.render(<test-render-7 showSlotted={false}>Text</test-render-7>, wrapper);
                expect(element.childNodesBySlot()).toHaveLength(1);
                expect(div.childNodes).toHaveLength(0);
            });

            it('should return a shallow clone of child list', () => {
                const list = DNA.render(
                    <>
                        <div />
                        <div />
                        <div />
                    </>,
                    wrapper
                );
                expect(list).toHaveLength(3);
                const newList = DNA.render(
                    <>
                        <div />
                        <div />
                    </>,
                    wrapper
                );
                expect(newList).toHaveLength(2);
                expect(list).toHaveLength(3);
            });

            it('should not replace contents when initializing parent and child components', () => {
                const Parent = DNA.define(
                    'test-render-8',
                    class extends DNA.Component {
                        render() {
                            return this.childNodesBySlot()
                                .filter((elem) => !!(elem as HTMLElement).tagName)
                                .map((elem) => (
                                    <div
                                        data-test="test"
                                        ref={elem as HTMLElement}
                                    />
                                ));
                        }
                    }
                );
                const Child = DNA.define(
                    'test-render-9',
                    class extends DNA.Component {
                        render() {
                            return <slot />;
                        }
                    }
                );

                const parent = new Parent();
                const child = new Child();
                child.appendChild(document.createTextNode('Hello'));
                parent.insertBefore(child, null);
                wrapper.appendChild(parent);
                expect(child).toHaveProperty('textContent', 'Hello');
                expect(child.dataset).toHaveProperty('test', 'test');
            });

            it('should resuse refs context', () => {
                @DNA.customElement('test-render-10')
                class TestElement extends DNA.Component {
                    @DNA.property({
                        type: Boolean,
                    })
                    showList = true;

                    @DNA.property({
                        type: Array,
                    })
                    items: string[] = [];

                    list = this.ownerDocument.createElement('ul');

                    render() {
                        if (this.showList) {
                            return (
                                <ul ref={this.list}>
                                    {this.items.map((item) => (
                                        <li>{item}</li>
                                    ))}
                                </ul>
                            );
                        }
                    }
                }

                const element = new TestElement();
                element.items = ['one', 'two', 'three'];
                wrapper.appendChild(element);
                expect(element.list.childNodes).toHaveLength(3);
                expect(element.list.childNodes[0]).toHaveProperty('textContent', 'one');
                expect(element.list.childNodes[1]).toHaveProperty('textContent', 'two');
                expect(element.list.childNodes[2]).toHaveProperty('textContent', 'three');
                element.showList = false;
                element.items = ['four', 'five'];
                expect(element.list.isConnected).toBe(false);
                element.showList = true;
                expect(element.list.childNodes).toHaveLength(2);
                expect(element.list.childNodes[0]).toHaveProperty('textContent', 'four');
                expect(element.list.childNodes[1]).toHaveProperty('textContent', 'five');
            });

            it('should clean up render state when removed', () => {
                @DNA.customElement('test-render-11')
                class TestElement extends DNA.Component {
                    @DNA.property({
                        type: Boolean,
                    })
                    showList = true;

                    @DNA.property({
                        type: Array,
                    })
                    items: string[] = [];

                    list = this.ownerDocument.createElement('ul');

                    render() {
                        if (this.showList) {
                            return (
                                <div class="wrapper">
                                    <ul ref={this.list}>
                                        {this.items.map((item) => (
                                            <li>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        }
                    }
                }

                const element = new TestElement();
                element.items = ['one', 'two', 'three'];
                wrapper.appendChild(element);
                expect(element.list.childNodes).toHaveLength(3);
                wrapper.removeChild(element);
                expect(element.list.childNodes).toHaveLength(0);
                wrapper.appendChild(element);
                expect(element.list.childNodes).toHaveLength(3);
            });

            it('should set is attribute if not custom element', () => {
                @DNA.customElement('test-render-13', {
                    extends: 'div',
                })
                class TestElement extends DNA.HTML.Div {}

                DNA.render(
                    <>
                        {/* @ts-ignore */}
                        <div is="test-render-13" />
                        {/* @ts-ignore */}
                        <div is="unknown-element" />
                    </>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(2);
                const [testElement, unknownElement] = Array.from(wrapper.childNodes) as HTMLElement[];
                expect(testElement).toHaveProperty('tagName', 'DIV');
                expect(testElement).toHaveProperty('is', 'test-render-13');
                expect(testElement).toBeInstanceOf(TestElement);
                expect(unknownElement).toHaveProperty('tagName', 'DIV');
                expect(unknownElement).not.toHaveProperty('is');
                expect(unknownElement.getAttribute('is')).toBe('unknown-element');
            });

            it('should correctly handle not initialized realms (CE polyfill)', () => {
                @DNA.customElement('test-render-16', {
                    extends: 'div',
                })
                class TestElement extends DNA.HTML.Div {}

                const Template = (toggle: boolean) => (
                    <div is="test-render-16">{toggle ? <span>Test2</span> : 'Test'}</div>
                );
                const element = DNA.render(Template(false), wrapper) as TestElement;
                expect(element).toHaveProperty('tagName', 'DIV');
                expect(element).toHaveProperty('is', 'test-render-16');
                expect(element).toBeInstanceOf(TestElement);
                expect(element.slotChildNodes).toHaveLength(1);
                expect(element.slotChildNodes[0]).toBeInstanceOf(Text);
                expect(element).toHaveProperty('textContent', 'Test');
                DNA.render(Template(true), wrapper) as TestElement;
                expect(element.slotChildNodes).toHaveLength(1);
                expect(element.slotChildNodes[0]).toBeInstanceOf(HTMLSpanElement);
                expect(element).toHaveProperty('textContent', 'Test2');
            });
        });

        describe('directives', () => {
            it('should render parsed HTML', () => {
                const Template = ({ html }: { html: string }) => <div>{DNA.$parse(html)}</div>;
                DNA.render(<Template html="<span>Test</span>" />, wrapper);
                const div = wrapper.childNodes[1];
                expect(div.childNodes).toHaveLength(2);
                const span = div.childNodes[1] as HTMLSpanElement;
                expect(span).toHaveProperty('tagName', 'SPAN');
                expect(span).toHaveProperty('textContent', 'Test');
                DNA.render(<Template html="<span>Test</span>" />, wrapper);
                expect(div.childNodes[1]).toBe(span);
            });

            it('should await promises', async () => {
                const Template = ({ promise }: { promise: Promise<string> }) => <div>{DNA.$await(promise)}</div>;
                let resolver: ((value: string) => void) | undefined;
                const promise = new Promise<string>((resolve) => {
                    resolver = resolve;
                });
                DNA.render(<Template promise={promise} />, wrapper);
                const div = wrapper.childNodes[1];
                expect(div.childNodes).toHaveLength(1);
                expect(div.textContent).toBe('');
                resolver?.('Test');
                await vi.waitFor(() => {
                    expect(div.childNodes).toHaveLength(2);
                    expect(div).toHaveProperty('textContent', 'Test');
                });
            });

            it('should handle rejected promises', async () => {
                const Template = ({ promise }: { promise: Promise<string> }) => <div>{DNA.$await(promise)}</div>;
                let rejecter: ((value: Error) => void) | undefined;
                const promise = new Promise<string>((resolve, reject) => {
                    rejecter = reject;
                });
                DNA.render(<Template promise={promise} />, wrapper);
                const div = wrapper.childNodes[1];
                expect(div.childNodes).toHaveLength(1);
                expect(div.textContent).toBe('');
                rejecter?.(new Error('Test'));
                await vi.waitFor(() => {
                    expect(div.childNodes).toHaveLength(2);
                    expect(div).toHaveProperty('textContent', 'Error: Test');
                });
            });

            it('should show placeholder until promise is resolved', async () => {
                const Template = ({ promise }: { promise: Promise<string> }) => (
                    <div>{DNA.$until(promise, 'Loading...')}</div>
                );
                let resolver: ((value: string) => void) | undefined;
                const promise = new Promise<string>((resolve) => {
                    resolver = resolve;
                });
                DNA.render(<Template promise={promise} />, wrapper);
                const div = wrapper.childNodes[1];
                expect(div.childNodes).toHaveLength(2);
                expect(div.childNodes[1]).toHaveProperty('textContent', 'Loading...');
                resolver?.('Test');
                await vi.waitFor(() => {
                    expect(div.childNodes).toHaveLength(1);
                    expect(div).toHaveProperty('textContent', '');
                });
            });

            it('should show placeholder until promise is rejected', async () => {
                const Template = ({ promise }: { promise: Promise<string> }) => (
                    <div>{DNA.$until(promise, 'Loading...')}</div>
                );
                let rejecter: ((value: Error) => void) | undefined;
                const promise = new Promise<string>((resolve, reject) => {
                    rejecter = reject;
                });
                DNA.render(<Template promise={promise} />, wrapper);
                const div = wrapper.childNodes[1];
                expect(div.childNodes).toHaveLength(2);
                expect(div.childNodes[1]).toHaveProperty('textContent', 'Loading...');
                rejecter?.(new Error('Test'));
                await vi.waitFor(() => {
                    expect(div.childNodes).toHaveLength(1);
                    expect(div).toHaveProperty('textContent', '');
                });
            });
        });

        describe('hooks', () => {
            it('should re-render on state change', () => {
                const render = vi.fn();
                const Test: DNA.FunctionComponent = (props, { useState }) => {
                    const [count, setCount] = useState(0);
                    render();

                    return (
                        <button
                            type="button"
                            onclick={() => {
                                setCount(count + 1);
                            }}>
                            {count}
                        </button>
                    );
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0] as HTMLButtonElement;
                expect(button).toHaveProperty('textContent', '0');
                expect(render).toHaveBeenCalled();
                expect(render).toHaveBeenCalledOnce();

                button.click();
                expect(wrapper).toHaveProperty('textContent', '1');
                expect(render).toHaveBeenCalled();
                expect(render).toHaveBeenCalledTimes(2);

                DNA.render(<Test />, wrapper);
                expect(button).toHaveProperty('textContent', '1');
            });

            it('should update state using a function', () => {
                const Test: DNA.FunctionComponent = (props, { useState }) => {
                    const [count, setCount] = useState(0);

                    return (
                        <button
                            type="button"
                            onclick={() => {
                                setCount((current) => current + 1);
                                setCount((current) => current + 1);
                            }}>
                            {count}
                        </button>
                    );
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0] as HTMLButtonElement;
                expect(button).toHaveProperty('textContent', '0');

                button.click();
                expect(wrapper).toHaveProperty('textContent', '2');
            });

            it('should keep a mutable reference across renders', () => {
                const Test: DNA.FunctionComponent = (props, { useState, useRef }) => {
                    const [count, setCount] = useState(0);
                    const renders = useRef(0);
                    renders.current++;

                    return (
                        <button
                            type="button"
                            onclick={() => {
                                setCount(count + 1);
                            }}>
                            {`${count}:${renders.current}`}
                        </button>
                    );
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0] as HTMLButtonElement;
                expect(button).toHaveProperty('textContent', '0:1');

                button.click();
                expect(wrapper).toHaveProperty('textContent', '1:2');
            });

            it('should memo a callback', () => {
                let dep = 1;
                const callbacks: (() => number)[] = [];
                const Test: DNA.FunctionComponent = (props, { useCallback }) => {
                    callbacks.push(useCallback(() => dep, [dep]));

                    return <button type="button">{dep}</button>;
                };

                DNA.render(<Test />, wrapper);
                DNA.render(<Test />, wrapper);
                expect(callbacks).toHaveLength(2);
                expect(callbacks[1]).toBe(callbacks[0]);

                dep = 2;
                DNA.render(<Test />, wrapper);
                expect(callbacks).toHaveLength(3);
                expect(callbacks[2]).not.toBe(callbacks[0]);
                expect(callbacks[2]()).toBe(2);
            });

            it('should memo calculated value', () => {
                const factory = vi.fn(() => 1);
                const Test: DNA.FunctionComponent = (props, { useMemo }) => {
                    const value = useMemo(factory);

                    return <button type="button">{value}</button>;
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0];
                expect(button).toHaveProperty('textContent', '1');
                expect(factory).toHaveBeenCalled();
                expect(factory).toHaveBeenCalledOnce();

                DNA.render(<Test />, wrapper);
                expect(wrapper).toHaveProperty('textContent', '1');
                expect(factory).toHaveBeenCalledOnce();
            });

            it('should memo calculated value with deps', () => {
                let dep = 1;
                const factory = vi.fn(() => dep);
                const Test: DNA.FunctionComponent = (props, { useMemo }) => {
                    const value = useMemo(factory, [dep]);

                    return <button type="button">{value}</button>;
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0];
                expect(button).toHaveProperty('textContent', '1');
                expect(factory).toHaveBeenCalled();
                expect(factory).toHaveBeenCalledOnce();

                dep = 2;
                DNA.render(<Test />, wrapper);
                expect(wrapper).toHaveProperty('textContent', '2');
                expect(factory).toHaveBeenCalledTimes(2);
            });

            it('should memo a created element', () => {
                const Test: DNA.FunctionComponent = (props, { useElement }) => {
                    const element = useElement('canvas');
                    element.setAttribute('data-count', `${+(element.getAttribute('data-count') ?? 0) + 1}`);

                    return element;
                };

                DNA.render(<Test />, wrapper);
                const canvas = wrapper.children[0];
                expect(canvas).toBeInstanceOf(HTMLCanvasElement);
                expect(canvas).toHaveProperty('dataset.count', '1');

                DNA.render(<Test />, wrapper);
                expect(wrapper.children[0]).toBe(canvas);
                expect(canvas).toHaveProperty('dataset.count', '2');
            });

            it('should re-create an element when tag name changes', () => {
                let tagName = 'canvas';
                const Test: DNA.FunctionComponent = (props, { useElement }) => useElement(tagName);

                DNA.render(<Test />, wrapper);
                const canvas = wrapper.children[0];
                expect(canvas).toBeInstanceOf(HTMLCanvasElement);

                tagName = 'video';
                DNA.render(<Test />, wrapper);
                expect(wrapper.children[0]).not.toBe(canvas);
                expect(wrapper.children[0]).toBeInstanceOf(HTMLVideoElement);
            });

            it('should run an effect on render', () => {
                const effect = vi.fn(() => wrapper.querySelector('button'));
                const Test: DNA.FunctionComponent = (props, { useEffect }) => {
                    useEffect(() => {
                        effect();
                    });

                    return <button type="button">Click me</button>;
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0];
                DNA.render(<Test />, wrapper);

                expect(effect).toHaveBeenCalled();
                expect(effect).toHaveBeenCalledOnce();
                expect(effect).toHaveReturnedWith(button);
            });

            it('should re-run an effect on render if dependency change', () => {
                const effect = vi.fn(() => wrapper.querySelector('button'));
                const Test: DNA.FunctionComponent<{
                    dep: number;
                }> = ({ dep }, { useEffect }) => {
                    useEffect(() => {
                        effect();
                    }, [dep]);

                    return <button type="button">Click me</button>;
                };

                DNA.render(<Test dep={1} />, wrapper);
                DNA.render(<Test dep={1} />, wrapper);
                DNA.render(<Test dep={2} />, wrapper);
                DNA.render(<Test dep={2} />, wrapper);

                expect(effect).toHaveBeenCalled();
                expect(effect).toHaveBeenCalledTimes(2);
            });

            it('should re-run an effect on on fragment re-render', () => {
                const effect = vi.fn();
                const Test: DNA.FunctionComponent = (props, { useState, useEffect }) => {
                    const [dep, setDep] = useState(1);
                    useEffect(() => {
                        effect();
                    }, [dep]);

                    return (
                        <button
                            type="button"
                            onclick={() => {
                                setDep(dep + 1);
                            }}>
                            Click me
                        </button>
                    );
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0] as HTMLButtonElement;
                button.click();

                expect(effect).toHaveBeenCalled();
                expect(effect).toHaveBeenCalledTimes(2);
            });

            it('should run an effect once when it renders its own fragment again', () => {
                const runs: string[] = [];
                const Test: DNA.FunctionComponent = (props, { useState, useEffect }) => {
                    const [count, setCount] = useState(0);
                    useEffect(() => {
                        runs.push(`first:${count}`);
                        if (count === 0) {
                            setCount(1);
                        }
                    }, [count]);
                    useEffect(() => {
                        runs.push(`second:${count}`);
                    }, [count]);

                    return <span>{count}</span>;
                };

                DNA.render(<Test />, wrapper);

                // the first effect renders the fragment again, and that render runs its own
                // effects right away: the ones of this pass are picked up again afterwards,
                // where they left off, and never a second time
                expect(runs).toEqual(['first:0', 'first:1', 'second:1', 'second:0']);
                expect(wrapper.textContent).toBe('1');
            });

            it('should keep the hooks aligned when the fragment renders again while it is rendering', () => {
                const factory = vi.fn(() => 'id');
                const Test: DNA.FunctionComponent = (props, { useState, useMemo }) => {
                    const [ready, setReady] = useState(false);
                    if (!ready) {
                        setReady(true);
                    }
                    const id = useMemo(factory, []);

                    return <span>{`${ready}:${id}`}</span>;
                };

                DNA.render(<Test />, wrapper);

                // the render started by the setter walked the very same hooks: the ones that
                // come after it must still find the state of this pass, and not a slot of
                // their own past the end of it
                expect(factory).toHaveBeenCalledOnce();

                DNA.render(<Test />, wrapper);
                expect(factory).toHaveBeenCalledOnce();
                expect(wrapper.textContent).toBe('true:id');
            });

            it('should hand the same hooks to every render of a fragment', () => {
                const received: unknown[] = [];
                const Test: DNA.FunctionComponent = (props, hooks) => {
                    received.push(hooks);

                    return <span>Test</span>;
                };

                DNA.render(<Test />, wrapper);
                DNA.render(<Test />, wrapper);

                expect(received).toHaveLength(2);
                expect(received[0]).toBe(received[1]);
            });

            it('should keep the identity of a state setter across renders', () => {
                const setters: unknown[] = [];
                const values: number[] = [];
                const Test: DNA.FunctionComponent = (props, { useState }) => {
                    const [count, setCount] = useState(0);
                    setters.push(setCount);
                    values.push(count);

                    return (
                        <button
                            type="button"
                            onclick={() => setCount(count + 1)}>
                            {count}
                        </button>
                    );
                };

                DNA.render(<Test />, wrapper);
                (wrapper.children[0] as HTMLButtonElement).click();

                expect(values).toEqual([0, 1]);
                expect(setters).toHaveLength(2);
                expect(setters[0]).toBe(setters[1]);
            });

            it('should run cleanup if dep changed', () => {
                const cleanup = vi.fn();
                const Test: DNA.FunctionComponent = (props, { useState, useEffect }) => {
                    const [dep, setDep] = useState(1);
                    useEffect(() => cleanup, [dep]);

                    return (
                        <button
                            type="button"
                            onclick={() => {
                                setDep(dep + 1);
                            }}>
                            Click me
                        </button>
                    );
                };

                DNA.render(<Test />, wrapper);
                expect(cleanup).not.toHaveBeenCalled();
                const button = wrapper.children[0] as HTMLButtonElement;
                button.click();
                expect(cleanup).toHaveBeenCalled();
                expect(cleanup).toHaveBeenCalledOnce();
            });

            it('should run cleanup if node removed', () => {
                const cleanup = vi.fn();
                const Test: DNA.FunctionComponent = (props, { useEffect }) => {
                    useEffect(() => cleanup);

                    return <button type="button">Click me</button>;
                };

                DNA.render(<Test />, wrapper);
                expect(cleanup).not.toHaveBeenCalled();
                DNA.render(null, wrapper);
                expect(cleanup).toHaveBeenCalled();
                expect(cleanup).toHaveBeenCalledOnce();
            });

            it('should run cleanup if a keyed node is dropped while reordering', () => {
                const cleanups: string[] = [];
                const Test: DNA.FunctionComponent<{ name: string }> = ({ name }, { useEffect }) => {
                    useEffect(
                        () => () => {
                            cleanups.push(name);
                        },
                        []
                    );

                    return <span>{name}</span>;
                };
                const template = (names: string[]) => (
                    <div>
                        {names.map((name) => (
                            <Test
                                key={name}
                                name={name}
                            />
                        ))}
                    </div>
                );

                DNA.render(template(['a', 'b', 'c']), wrapper);
                expect(cleanups).toEqual([]);

                // "c" moves to the front and "b" is dropped: both "a" and "b" are detached
                // while reordering, so they never go through the trailing cleanup.
                // Only "b" is really gone, "a" is re-attached at another position.
                DNA.render(template(['c', 'a']), wrapper);
                expect(cleanups).toEqual(['b']);
            });

            it('should preserve the state of a keyed function component while reordering', () => {
                const Test: DNA.FunctionComponent<{ name: string }> = ({ name }, { useState }) => {
                    const [count, setCount] = useState(0);

                    return (
                        <button
                            type="button"
                            onclick={() => setCount(count + 1)}>
                            {name}:{count}
                        </button>
                    );
                };
                const template = (names: string[]) => (
                    <div>
                        {names.map((name) => (
                            <Test
                                key={name}
                                name={name}
                            />
                        ))}
                    </div>
                );

                DNA.render(template(['a', 'b']), wrapper);
                (wrapper.querySelectorAll('button')[0] as HTMLButtonElement).click();
                expect(wrapper.textContent).toBe('a:1b:0');

                DNA.render(template(['b', 'a']), wrapper);
                expect(wrapper.textContent).toBe('b:0a:1');
            });

            it('should reorder the keyed children of a function component that re-renders alone', () => {
                let setNames: (names: string[]) => void = () => {};
                const List: DNA.FunctionComponent<{ names: string[] }> = ({ names }, { useState }) => {
                    const [current, setCurrent] = useState(names);
                    setNames = setCurrent;

                    return current.map((name) => <li key={name}>{name}</li>);
                };

                DNA.render(
                    <ul>
                        <List names={['a', 'b', 'c']} />
                    </ul>,
                    wrapper
                );

                const list = wrapper.querySelector('ul') as HTMLUListElement;
                const [itemA, itemB, itemC] = Array.from(list.querySelectorAll('li'));
                expect(list.textContent).toBe('abc');

                // the function component patches its own fragment: the keyed items must be
                // moved around, not created again
                setNames(['c', 'a', 'b']);
                expect(list.textContent).toBe('cab');
                expect(Array.from(list.querySelectorAll('li'))).toEqual([itemC, itemA, itemB]);

                // dropping a key removes its node, the others are still the same
                setNames(['b', 'c']);
                expect(list.textContent).toBe('bc');
                expect(Array.from(list.querySelectorAll('li'))).toEqual([itemB, itemC]);

                // and a render of the whole tree finds them again as well
                DNA.render(
                    <ul>
                        <List names={['c', 'b']} />
                    </ul>,
                    wrapper
                );
                expect(list.textContent).toBe('bc');
                expect(Array.from(list.querySelectorAll('li'))).toEqual([itemB, itemC]);
            });

            it('should generate an unique id', () => {
                const Test: DNA.FunctionComponent = (props, { useId }) => {
                    const id = useId(props.suffix ?? 'test');
                    const otherId = useId('test');

                    return (
                        <>
                            <button
                                id={id}
                                type="button">
                                Click me
                            </button>
                            <button
                                id={otherId}
                                type="button">
                                Click me
                            </button>
                        </>
                    );
                };

                DNA.render(<Test />, wrapper);
                const button = wrapper.children[0] as HTMLButtonElement;
                const otherButton = wrapper.children[1] as HTMLButtonElement;
                expect(button.id).toBe('fn-test-1-1-test');
                expect(otherButton.id).toBe('fn-test-1-2-test');
                DNA.render(<Test />, wrapper);
                expect(button.id).toBe('fn-test-1-1-test');
                expect(otherButton.id).toBe('fn-test-1-2-test');
                DNA.render(<Test suffix="changed" />, wrapper);
                expect(button.id).toBe('fn-test-1-1-changed');
                expect(otherButton.id).toBe('fn-test-1-2-test');
            });
        });

        describe('not keyed', () => {
            const items = ['Alan', 'Brian', 'Carl'];
            const items2 = ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'];

            it('should reuse elements', () => {
                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option value={item}>{item}</option>
                        ))}
                        <option value="other">Other</option>
                    </select>,
                    wrapper
                );
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(4);

                const first = wrapper.childNodes[0].childNodes[0];
                expect(first).toHaveProperty('tagName', 'OPTION');
                expect(first).toHaveProperty('textContent', 'Alan');

                const second = wrapper.childNodes[0].childNodes[1];
                expect(second).toHaveProperty('tagName', 'OPTION');
                expect(second).toHaveProperty('textContent', 'Brian');

                const third = wrapper.childNodes[0].childNodes[2];
                expect(third).toHaveProperty('tagName', 'OPTION');
                expect(third).toHaveProperty('textContent', 'Carl');

                const otherOption = wrapper.childNodes[0].childNodes[3];
                expect(otherOption).toHaveProperty('tagName', 'OPTION');
                expect(otherOption).toHaveProperty('textContent', 'Other');

                DNA.render(
                    <select>
                        {items2.map((item) => (
                            <option value={item}>{item}</option>
                        ))}
                        <option value="other">Other</option>
                    </select>,
                    wrapper
                );

                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(5);

                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Daniel');
                expect(wrapper.childNodes[0].childNodes[0]).toBe(first);

                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('textContent', 'Eduardo');
                expect(wrapper.childNodes[0].childNodes[1]).toBe(second);

                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Francesca');
                expect(wrapper.childNodes[0].childNodes[2]).toBe(third);

                expect(wrapper.childNodes[0].childNodes[3]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[3]).toHaveProperty('textContent', 'Gabriella');
                expect(wrapper.childNodes[0].childNodes[3]).toBe(otherOption);

                expect(wrapper.childNodes[0].childNodes[4]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[4]).toHaveProperty('textContent', 'Other');
                expect(wrapper.childNodes[0].childNodes[4]).not.toBe(otherOption);
            });

            it('should swap rows', () => {
                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option value={item}>{item}</option>
                        ))}
                    </select>,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                expect(option1).toHaveProperty('textContent', items[0]);
                expect(option2).toHaveProperty('textContent', items[1]);
                expect(option3).toHaveProperty('textContent', items[2]);

                DNA.render(
                    <select>
                        {items
                            .slice(0)
                            .reverse()
                            .map((item) => (
                                <option value={item}>{item}</option>
                            ))}
                    </select>,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];
                const option6 = wrapper.childNodes[0].childNodes[2];

                expect(option4).toHaveProperty('textContent', items[2]);
                expect(option5).toHaveProperty('textContent', items[1]);
                expect(option6).toHaveProperty('textContent', items[0]);

                expect(option1).toBe(option4);
                expect(option2).toBe(option5);
                expect(option3).toBe(option6);
            });

            it('should delete a row', () => {
                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option value={item}>{item}</option>
                        ))}
                    </select>,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                expect(option1).toHaveProperty('textContent', items[0]);
                expect(option2).toHaveProperty('textContent', items[1]);
                expect(option3).toHaveProperty('textContent', items[2]);

                DNA.render(
                    <select>
                        {items.slice(1).map((item) => (
                            <option value={item}>{item}</option>
                        ))}
                    </select>,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];

                expect(option1).toHaveProperty('textContent', items[1]);
                expect(option2).toHaveProperty('textContent', items[2]);
                expect(option4).toHaveProperty('textContent', items[1]);
                expect(option5).toHaveProperty('textContent', items[2]);

                expect(option1).toBe(option4);
                expect(option2).toBe(option5);
            });
        });

        describe('keyed', () => {
            const items = ['Alan', 'Brian', 'Carl'];
            const items2 = ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'];

            it('should reuse non keyed elements', () => {
                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option value={item}>{item}</option>
                        ))}
                        <option
                            key="last"
                            value="other">
                            Other
                        </option>
                    </select>,
                    wrapper
                );

                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(4);

                const first = wrapper.childNodes[0].childNodes[0];
                expect(first).toHaveProperty('tagName', 'OPTION');
                expect(first).toHaveProperty('textContent', 'Alan');

                const second = wrapper.childNodes[0].childNodes[1];
                expect(second).toHaveProperty('tagName', 'OPTION');
                expect(second).toHaveProperty('textContent', 'Brian');

                const third = wrapper.childNodes[0].childNodes[2];
                expect(third).toHaveProperty('tagName', 'OPTION');
                expect(third).toHaveProperty('textContent', 'Carl');

                const otherOption = wrapper.childNodes[0].childNodes[3];
                expect(otherOption).toHaveProperty('tagName', 'OPTION');
                expect(otherOption).toHaveProperty('textContent', 'Other');

                DNA.render(
                    <select>
                        {items2.map((item) => (
                            <option value={item}>{item}</option>
                        ))}
                        <option
                            key="last"
                            value="other">
                            Other
                        </option>
                    </select>,
                    wrapper
                );

                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(5);

                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Daniel');
                expect(wrapper.childNodes[0].childNodes[0]).toBe(first);

                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('textContent', 'Eduardo');
                expect(wrapper.childNodes[0].childNodes[1]).toBe(second);

                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Francesca');
                expect(wrapper.childNodes[0].childNodes[2]).toBe(third);

                expect(wrapper.childNodes[0].childNodes[3]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[3]).toHaveProperty('textContent', 'Gabriella');
                expect(wrapper.childNodes[0].childNodes[3]).not.toBe(otherOption);

                expect(wrapper.childNodes[0].childNodes[4]).toHaveProperty('tagName', 'OPTION');
                expect(wrapper.childNodes[0].childNodes[4]).toHaveProperty('textContent', 'Other');
                expect(wrapper.childNodes[0].childNodes[4]).toBe(otherOption);
            });

            it('should swap rows', () => {
                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option
                                key={item}
                                value={item}>
                                {item}
                            </option>
                        ))}
                    </select>,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                DNA.render(
                    <select>
                        {items
                            .slice(0)
                            .reverse()
                            .map((item) => (
                                <option
                                    key={item}
                                    value={item}>
                                    {item}
                                </option>
                            ))}
                    </select>,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];
                const option6 = wrapper.childNodes[0].childNodes[2];

                expect(option1).toHaveProperty('textContent', items[0]);
                expect(option2).toHaveProperty('textContent', items[1]);
                expect(option3).toHaveProperty('textContent', items[2]);
                expect(option4).toHaveProperty('textContent', items[2]);
                expect(option5).toHaveProperty('textContent', items[1]);
                expect(option6).toHaveProperty('textContent', items[0]);

                expect(option1).not.toBe(option4);
                expect(option1).toBe(option6);
                expect(option2).toBe(option5);
                expect(option3).not.toBe(option6);
                expect(option3).toBe(option4);
            });

            it('should add a row', () => {
                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option
                                key={item}
                                value={item}>
                                {item}
                            </option>
                        ))}
                    </select>,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                items.splice(1, 0, 'Dylan');

                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option
                                key={item}
                                value={item}>
                                {item}
                            </option>
                        ))}
                    </select>,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[2];
                const option6 = wrapper.childNodes[0].childNodes[3];
                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('textContent', 'Dylan');
                expect(option1).toBe(option4);
                expect(option2).toBe(option5);
                expect(option3).toBe(option6);
            });

            it('should delete a row', () => {
                DNA.render(
                    <select>
                        {items.map((item) => (
                            <option
                                key={item}
                                value={item}>
                                {item}
                            </option>
                        ))}
                    </select>,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                DNA.render(
                    <select>
                        {items.slice(1).map((item) => (
                            <option
                                key={item}
                                value={item}>
                                {item}
                            </option>
                        ))}
                    </select>,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];
                expect(option1).toHaveProperty('textContent', items[0]);
                expect(option2).toHaveProperty('textContent', items[1]);
                expect(option3).toHaveProperty('textContent', items[2]);
                expect(option4).toHaveProperty('textContent', items[1]);
                expect(option5).toHaveProperty('textContent', items[2]);
                expect(option1).not.toBe(option4);
                expect(option2).toBe(option4);
                expect(option3).toBe(option5);
            });

            it('should delete nodes until the attached one', () => {
                const connectedCallback = vi.fn();
                const TestElement = DNA.define(
                    'test-render-12',
                    class TestElement extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                    }
                );

                const ref = new TestElement();
                DNA.render(
                    <>
                        <h1>Title</h1>
                        <h2>Subtitle</h2>
                        <div ref={ref} />
                    </>,
                    wrapper
                );
                expect(connectedCallback).toHaveBeenCalled();
                expect(connectedCallback).toHaveBeenCalledOnce();
                DNA.render(
                    <>
                        <h1>Title</h1>
                        <div ref={ref} />
                    </>,
                    wrapper
                );
                expect(connectedCallback).toHaveBeenCalledOnce();
            });

            it('should correctly update nodes after Function render', () => {
                const Fn: DNA.FunctionComponent = () => (
                    <div
                        class="test"
                        data-ref={true}
                    />
                );

                const [, div1, div2] = DNA.render(
                    <>
                        <Fn />
                        <div
                            class="test"
                            // @ts-expect-error We are testing attribute handling
                            attr={true}
                            data-ref={true}
                        />
                    </>,
                    wrapper
                ) as [Comment, HTMLDivElement, HTMLDivElement];

                expect(wrapper.childNodes).toHaveLength(3);
                expect(div1).toHaveProperty('tagName', 'DIV');
                expect(div2).toHaveProperty('tagName', 'DIV');
                expect(div1.dataset.ref).toBe('');
                expect(div2.getAttribute('attr')).toBe('');
                expect(div2.dataset.ref).toBe('');

                const [, div3, div4] = DNA.render(
                    <>
                        <Fn />
                        <div
                            class="test"
                            // @ts-expect-error We are testing attribute handling
                            attr={undefined}
                            data-ref={undefined}
                        />
                    </>,
                    wrapper
                ) as [Comment, HTMLDivElement, HTMLDivElement];

                expect(wrapper.childNodes).toHaveLength(3);
                expect(div1).toHaveProperty('tagName', 'DIV');
                expect(div2).toHaveProperty('tagName', 'DIV');
                expect(div3.dataset.ref).toBe('');
                expect(div4.getAttribute('attr')).toBeNull();
                expect(div4.dataset.ref).toBeUndefined();

                expect(div1).toBe(div3);
                expect(div2).toBe(div4);
            });

            it('should correctly update nodes after nested Function renders', () => {
                const Parent = () => <Child key="2" />;
                const Child = () => (
                    <div
                        class="test"
                        data-ref={true}
                    />
                );

                const [comment1, comment2, div1, div2] = DNA.render(
                    <>
                        <Parent />
                        <div
                            class="test"
                            // @ts-expect-error We are testing attribute handling
                            attr={true}
                            data-ref={true}
                        />
                    </>,
                    wrapper
                ) as [Comment, Comment, HTMLDivElement, HTMLDivElement];

                expect(wrapper.childNodes).toHaveLength(4);
                expect(div1.tagName).toBe('DIV');
                expect(div2.tagName).toBe('DIV');
                expect(div1.dataset.ref).toBe('');
                expect(div2.getAttribute('attr')).toBe('');
                expect(div2.dataset.ref).toBe('');

                const [comment3, comment4, div3, div4] = DNA.render(
                    <>
                        <Parent />
                        <div
                            class="test"
                            // @ts-expect-error We are testing attribute handling
                            attr={undefined}
                            data-ref={undefined}
                        />
                    </>,
                    wrapper
                ) as [Comment, Comment, HTMLDivElement, HTMLDivElement];

                expect(wrapper.childNodes).toHaveLength(4);
                expect(div3.tagName).toBe('DIV');
                expect(div4.tagName).toBe('DIV');
                expect(div3.dataset.ref).toBe('');
                expect(div4.getAttribute('attr')).toBeNull();
                expect(div4.dataset.ref).toBeUndefined();

                expect(comment1).toBe(comment3);
                expect(comment2).toBe(comment4);
                expect(div1).toBe(div3);
                expect(div2).toBe(div4);

                const [comment5, comment6] = DNA.render(
                    <>
                        <Parent />
                        <div
                            class="test"
                            // @ts-expect-error We are testing attribute handling
                            attr={undefined}
                            data-ref={undefined}
                        />
                    </>,
                    wrapper
                ) as [Comment, Comment];

                expect(comment1).toBe(comment5);
                expect(comment2).toBe(comment6);
            });
        });

        /**
         * The render reorders the child list first and moves the nodes once, at the end, so
         * that a reorder costs the minimum number of insertions instead of one per displaced
         * sibling. These tests pin the cost down: they count the operations the document
         * receives, because a regression here keeps producing the right tree, only slower.
         */
        describe('reconcile', () => {
            type Counters = {
                insertBefore: number;
                removeChild: number;
                /** operations addressed to a node that is not in the document any more */
                detached: number;
            };

            /**
             * Count the operations the document receives while running a render.
             * @param run The function to measure.
             * @returns The collected counters.
             */
            const count = (run: () => void): Counters => {
                const counters: Counters = { insertBefore: 0, removeChild: 0, detached: 0 };
                const proto = Node.prototype as unknown as {
                    insertBefore: (node: Node, ref: Node | null) => Node;
                    removeChild: (node: Node) => Node;
                    appendChild: (node: Node) => Node;
                };
                const insertBefore = proto.insertBefore;
                const removeChild = proto.removeChild;
                const appendChild = proto.appendChild;

                proto.insertBefore = function (this: Node, node: Node, ref: Node | null) {
                    counters.insertBefore++;
                    if (!this.isConnected) {
                        counters.detached++;
                    }
                    return insertBefore.call(this, node, ref);
                };
                proto.removeChild = function (this: Node, node: Node) {
                    counters.removeChild++;
                    if (!this.isConnected) {
                        counters.detached++;
                    }
                    return removeChild.call(this, node);
                };
                proto.appendChild = function (this: Node, node: Node) {
                    counters.insertBefore++;
                    if (!this.isConnected) {
                        counters.detached++;
                    }
                    return appendChild.call(this, node);
                };

                try {
                    run();
                } finally {
                    proto.insertBefore = insertBefore;
                    proto.removeChild = removeChild;
                    proto.appendChild = appendChild;
                }

                return counters;
            };

            describe('keyed reorder', () => {
                const SIZE = 100;
                // a row that did not exist before is built out of two nodes, the item and
                // its text, so its own construction is what the counters account for
                const NODES_PER_ROW = 2;

                const list = (ids: number[]) => ids.map((id) => <li key={id}>{id}</li>);

                let ids: number[];

                beforeEach(() => {
                    ids = Array.from({ length: SIZE }, (_, index) => index);
                    DNA.render(list(ids), wrapper);
                });

                /**
                 * Render the given order and return what it cost.
                 * @param next The identifiers to render, in order.
                 * @returns The collected counters.
                 */
                const reorder = (next: number[]) => {
                    const nodes = new Map(
                        Array.from(wrapper.children).map((node, index) => [ids[index], node] as const)
                    );
                    const counters = count(() => DNA.render(list(next), wrapper));

                    expect(Array.from(wrapper.children).map((node) => node.textContent)).toEqual(
                        next.map((id) => `${id}`)
                    );
                    // the nodes of the keys that survived are moved, never rebuilt
                    for (const id of next) {
                        const previous = nodes.get(id);
                        if (previous) {
                            expect(wrapper.children[next.indexOf(id)]).toBe(previous);
                        }
                    }
                    return counters;
                };

                it('should swap two rows with two insertions', () => {
                    const next = [...ids];
                    next[1] = ids[SIZE - 2];
                    next[SIZE - 2] = ids[1];

                    expect(reorder(next)).toEqual({ insertBefore: 2, removeChild: 0, detached: 0 });
                });

                it('should move the last row to the front with a single insertion', () => {
                    const next = [...ids];
                    next.unshift(next.pop() as number);

                    expect(reorder(next)).toEqual({ insertBefore: 1, removeChild: 0, detached: 0 });
                });

                it('should move the first row to the back with a single insertion', () => {
                    const next = [...ids];
                    next.push(next.shift() as number);

                    expect(reorder(next)).toEqual({ insertBefore: 1, removeChild: 0, detached: 0 });
                });

                it('should reverse the list moving every row but one', () => {
                    expect(reorder([...ids].reverse())).toEqual({
                        insertBefore: SIZE - 1,
                        removeChild: 0,
                        detached: 0,
                    });
                });

                it('should rotate the list moving the smaller side only', () => {
                    const next = [...ids.slice(3), ...ids.slice(0, 3)];

                    expect(reorder(next)).toEqual({ insertBefore: 3, removeChild: 0, detached: 0 });
                });

                it('should remove a row in the middle without touching the others', () => {
                    expect(reorder(ids.filter((id) => id !== 50))).toEqual({
                        insertBefore: 0,
                        removeChild: 1,
                        detached: 0,
                    });
                });

                it('should insert a row in the middle without touching the others', () => {
                    const next = [...ids];
                    next.splice(50, 0, 1000);

                    expect(reorder(next)).toEqual({
                        insertBefore: NODES_PER_ROW,
                        removeChild: 0,
                        detached: 0,
                    });
                });

                it('should append rows without touching the others', () => {
                    expect(reorder([...ids, 1000, 1001, 1002])).toEqual({
                        insertBefore: 3 * NODES_PER_ROW,
                        removeChild: 0,
                        detached: 0,
                    });
                });

                it('should leave the document alone when the order does not change', () => {
                    expect(reorder([...ids])).toEqual({ insertBefore: 0, removeChild: 0, detached: 0 });
                });

                it('should move a row and drop another one at the same time', () => {
                    const next = ids.filter((id) => id !== 10);
                    next.unshift(next.pop() as number);

                    expect(reorder(next)).toEqual({ insertBefore: 1, removeChild: 1, detached: 0 });
                });

                it('should move the whole content of a keyed function component', () => {
                    const Item: DNA.FunctionComponent<{ name: string }> = ({ name }) => (
                        <>
                            <span>{name}</span>
                            <i>{name}</i>
                        </>
                    );
                    const template = (names: string[]) =>
                        names.map((name) => (
                            <Item
                                key={name}
                                name={name}
                            />
                        ));

                    DNA.render(template(['a', 'b', 'c']), wrapper);
                    expect(wrapper.textContent).toBe('aabbcc');
                    const [spanA, spanB, spanC] = Array.from(wrapper.querySelectorAll('span'));

                    DNA.render(template(['c', 'a', 'b']), wrapper);
                    expect(wrapper.textContent).toBe('ccaabb');
                    expect(Array.from(wrapper.querySelectorAll('span'))).toEqual([spanC, spanA, spanB]);

                    DNA.render(template(['b', 'c']), wrapper);
                    expect(wrapper.textContent).toBe('bbcc');
                    expect(Array.from(wrapper.querySelectorAll('span'))).toEqual([spanB, spanC]);
                });
            });

            describe('teardown', () => {
                it('should not empty the subtree of a removed node', () => {
                    const rows = Array.from({ length: 20 }, (_, index) => index);
                    const template = (list: number[]) =>
                        list.map((id) => (
                            <p key={id}>
                                <span>
                                    <b>{id}</b>
                                </span>
                            </p>
                        ));

                    DNA.render(template(rows), wrapper);
                    expect(wrapper.querySelectorAll('b')).toHaveLength(20);

                    // the content of a detached row is never seen again, so taking it apart
                    // node by node would have no observable effect; and since the render
                    // dropped every row, the parent is emptied in a single operation instead
                    // of being asked to remove them one at a time
                    const counters = count(() => DNA.render(template([]), wrapper));

                    expect(counters).toEqual({ insertBefore: 0, removeChild: 0, detached: 0 });
                    expect(wrapper.childNodes).toHaveLength(0);
                });

                it('should empty a node the template did not create', () => {
                    // the code that owns the node keeps a reference to it, so it must not be
                    // handed back with the children of a render that no longer exists
                    const list = document.createElement('ul');
                    const template = (show: boolean) =>
                        show ? (
                            <div>
                                <ul ref={list}>
                                    {['a', 'b', 'c'].map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null;

                    DNA.render(template(true), wrapper);
                    expect(list.childNodes).toHaveLength(3);

                    DNA.render(template(false), wrapper);
                    expect(list.childNodes).toHaveLength(0);

                    DNA.render(template(true), wrapper);
                    expect(list.childNodes).toHaveLength(3);
                });

                // the bindings of a removed subtree are covered by `signals.spec.tsx`, which
                // reaches the polyfill this build is configured with
            });
        });
    },
    10 * 1000
);
