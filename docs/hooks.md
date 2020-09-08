# Hooks

Hooks API had been introduced in the React library with the aim to replace class-based components with functional components. Since Web Components **must** extends the HTMLElement class, DNA has not a core Hooks API, but it provides an adapter `hooks` which uses the [haunted](https://github.com/matthewp/haunted) library under the hoods.

## Install the library

Haunted is a DNA's optional dependency, so we need to install it along the DNA library:

```sh
$ npm i @chialab/dna haunted
```

## Usage

Now, you can import the `hook` factory to define a Web Component Hook:

```js
import { hook, html, render } from '@chialab/dna/hooks';

const Counter = hook('counter-hook', () => {
    const [count, setCount] = useState(0);
    return <button onclick={() => setCount(count + 1)}>Count: {count}</button>;
});

render(document.body, <Counter />);
```

You can also use the `hook` factory to define plain template components:

```js
import { hook, html, render } from '@chialab/dna/hooks';

const HelloWorld = hook('hello-world', () => <h1>Hello world!</h1>);

render(document.body, <HelloWorld />);
```

Please refer to the haunted documentation for hook methods:

* [useState](https://github.com/matthewp/haunted#usestate)
* [useEffect](https://github.com/matthewp/haunted#useeffect)
* [useLayoutEffect](https://github.com/matthewp/haunted#uselayoutreducer)
* [useReducer](https://github.com/matthewp/haunted#usereducer)
* [useMemo](https://github.com/matthewp/haunted#usememo)
* [useCallback](https://github.com/matthewp/haunted#usecallback)
* [useRef](https://github.com/matthewp/haunted#useref)
* [useContext](https://github.com/matthewp/haunted#usecontext)

## Compatibility

Hook components uses the same shimmed constructor provided by DNA in order to invoke life cycle methods without requiring polyfills. They are also forced to render children to the component root instead of their shadow roots. Since haunted uses Proxy, you need to include a polyfill for non-modern browsers like IE11:

```html
<script src="https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js"></script>
```
