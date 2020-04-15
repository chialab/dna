# API Reference





**Classes**

<a href="#customelementregistry">CustomElementRegistry</a>




**Constants**

<a href="#icomponent">IComponent</a>, <a href="#namespace">namespace</a>, <a href="#registry">registry</a>, <a href="#get">get</a>, <a href="#define">define</a>, <a href="#upgrade">upgrade</a>, <a href="#whendefined">whenDefined</a>, <a href="#dom">DOM</a>, <a href="#connect">connect</a>, <a href="#disconnect">disconnect</a>, <a href="#render">render</a>, <a href="#fragment">Fragment</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#template">template</a>, <a href="#interpolate">interpolate</a>, <a href="#css">css</a>, <a href="#delegateeventlistener">delegateEventListener</a>, <a href="#undelegateeventlistener">undelegateEventListener</a>, <a href="#dispatchevent">dispatchEvent</a>, <a href="#dispatchasyncevent">dispatchAsyncEvent</a>, <a href="#property">property</a>, <a href="#extend">extend</a>, <a href="#component">Component</a>


**Enums**

<a href="#namespaceuri">NamespaceURI</a>


**Types**

<a href="#icomponent">IComponent</a>, <a href="#classfielddescriptor">ClassFieldDescriptor</a>, <a href="#classfieldattributeconverter">ClassFieldAttributeConverter</a>, <a href="#classfieldpropertyconverter">ClassFieldPropertyConverter</a>, <a href="#classfieldobserver">ClassFieldObserver</a>, <a href="#classfieldvalidator">ClassFieldValidator</a>, <a href="#delegatedeventcallback">DelegatedEventCallback</a>, <a href="#scope">Scope</a>, <a href="#scopevalues">ScopeValues</a>, <a href="#templateitems">TemplateItems</a>, <a href="#templateitem">TemplateItem</a>, <a href="#hypernode">HyperNode</a>, <a href="#template">Template</a>, <a href="#templatefilter">TemplateFilter</a>, <a href="#templatefunction">TemplateFunction</a>, <a href="#hyperproperties">HyperProperties</a>, <a href="#asyncevent">AsyncEvent</a>, <a href="#component">Component</a>


<hr />

<strong id="customelementregistry"><code>class</code>  CustomElementRegistry</strong>
    




<p>

The CustomElementRegistry interface provides methods for registering custom elements and querying registered elements.

</p>



<strong>Properties</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Readonly</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>registry</td>
            <td><code>{
    [key: string]: <a href="#icomponent">IComponent</a>;
}</code></td>
            <td align="center">✓</td>
            <td>A global registry.</td></tr>
<tr>
            <td>tagNames</td>
            <td><code>{
    [key: string]: string;
}</code></td>
            <td align="center">✓</td>
            <td>A map of tag names.</td></tr>
<tr>
            <td>queue</td>
            <td><code>{
    [key: string]: Array&lt;(value?: any): void&gt;;
}</code></td>
            <td align="center">✓</td>
            <td>Collect "whenDefined" promises.</td>
        </tr>
    </tbody>
</table>


<strong>Methods</strong>

<strong id="get"><code>method</code>  get</strong>



<p>

Get the Custom Element definition for a tag.

</p>

<details>
<summary>
<code>(name: string): <a href="#icomponent">IComponent</a></code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The name of the tag.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#icomponent">IComponent</a></code> The definition for the given tag.

<br />
</details>





<br />

<strong id="define"><code>method</code>  define</strong>



<p>

Define a new Custom Element.

</p>

<details>
<summary>
<code>(name: string, constructor: <a href="#icomponent">IComponent</a>, options?: ElementDefinitionOptions): void</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The tag name for the element.</td></tr>
<tr>
            <td>constructor</td>
            <td><code><a href="#icomponent">IComponent</a></code></td>
            <td align="center"></td>
            <td>The Custom Element constructor.</td></tr>
<tr>
            <td>options</td>
            <td><code>ElementDefinitionOptions</code></td>
            <td align="center">✓</td>
            <td>A set of definition options, like `extends` for native tag extension.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

<br />
</details>





<br />

<strong id="whendefined"><code>method</code>  whenDefined</strong>



<p>

It returns a Promise that resolves when the named element is defined.

</p>

<details>
<summary>
<code>(name: string): Promise&lt;void&gt;</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The Custom Element name.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>Promise&lt;void&gt;</code> A Promise that resolves when the named element is defined.

<br />
</details>





<br />

<strong id="upgrade"><code>method</code>  upgrade</strong>



<p>

It upgrades all custom elements in a subtree even before they are connected to the main document.

</p>

<details>
<summary>
<code>(root: HTMLElement): void</code>
</summary><br />



<strong>Params</strong>

<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>
            <td>root</td>
            <td><code>HTMLElement</code></td>
            <td align="center"></td>
            <td>A Node instance with descendant elements that are to be upgraded.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

<br />
</details>














<hr />

<strong id="icomponent"><code>constant</code>  IComponent</strong>



<p>

The basic DNA Component interface.
It's a Custom Element, but with some extra useful method.

</p>



<strong>Type:</strong>

<pre>{
    observedAttributes: string[];
    constructor(node?: HTMLElement, properties?: {
        [key: string]: any;
    }): <a href="#icomponent">IComponent</a>;
    constructor(properties?: {
        [key: string]: any;
    }): <a href="#icomponent">IComponent</a>;
    constructor(): <a href="#icomponent">IComponent</a>;
    prototype: <a href="#icomponent">IComponent</a>;
}</pre>

<strong>See also</strong>

* [W3C specification][https://w3c.github.io/webcomponents/spec/custom/](https://w3c.github.io/webcomponents/spec/custom/).


<hr />

<strong id="namespace"><code>constant</code>  namespace</strong>







<strong>Type:</strong>

<pre>Window & globalThis</pre>




<hr />

<strong id="registry"><code>constant</code>  registry</strong>



<p>

The global DNA registry instance.

</p>



<strong>Type:</strong>

<pre><a href="#customelementregistry">CustomElementRegistry</a></pre>




<hr />

<strong id="get"><code>constant</code>  get</strong>







<strong>Type:</strong>

<pre>(name: string): {
    constructor(node?: HTMLElement|undefined, properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    observedAttributes: string[];
    prototype: <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
}</pre>




<hr />

<strong id="define"><code>constant</code>  define</strong>







<strong>Type:</strong>

<pre>(name: string, constructor: {
    constructor(node?: HTMLElement|undefined, properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    observedAttributes: string[];
    prototype: <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
}, options?: ElementDefinitionOptions): void</pre>




<hr />

<strong id="upgrade"><code>constant</code>  upgrade</strong>







<strong>Type:</strong>

<pre>(root: HTMLElement): void</pre>




<hr />

<strong id="whendefined"><code>constant</code>  whenDefined</strong>







<strong>Type:</strong>

<pre>(name: string): Promise&lt;void&gt;</pre>




<hr />

<strong id="dom"><code>constant</code>  DOM</strong>



<p>

DOM is a singleton that components uses to access DOM methods.
By default, it uses browsers' DOM implementation, but it can be set to use a different one.
For example, in a Node context it is possibile to use DNA via the `jsdom` package and updating `this.Text` and `this.Element` references.
It also handle element life cycle for custom elements unless otherwise specified.

</p>



<strong>Type:</strong>

<pre>{
    emulateLifeCycle(node: HTMLElement): void;
    createElement(tagName: string, options?: ElementCreationOptions|undefined): Element;
    createElementNS(namespaceURI: string, tagName: string): Element;
    createTextNode(data: string): Text;
    createEvent(typeArg: string, eventInitDict?: CustomEventInit&lt;any&gt;): CustomEvent&lt;any&gt;;
    appendChild&lt;T extends Node&gt;(parent: Element, newChild: T, slot?: boolean): T;
    removeChild&lt;T_1 extends Node&gt;(parent: Element, oldChild: T_1, slot?: boolean): T_1;
    insertBefore&lt;T_2 extends Node&gt;(parent: Element, newChild: T_2, refChild: Node|null, slot?: boolean): T_2;
    replaceChild&lt;T_3 extends Node&gt;(parent: Element, newChild: Node, oldChild: T_3, slot?: boolean): T_3;
    getAttribute(element: Element, qualifiedName: string): string|null;
    hasAttribute(element: Element, qualifiedName: string): boolean;
    setAttribute(element: Element, qualifiedName: string, value: string): void;
    removeAttribute(element: Element, qualifiedName: string): void;
    matches(element: Element, selectorString: string): boolean;
}</pre>




<hr />

<strong id="connect"><code>constant</code>  connect</strong>



<p>

Invoke `connectedCallback` method of a Node (and its descendents).
It does nothing if life cycle is disabled.

</p>



<strong>Type:</strong>

<pre>(node: Node): void</pre>




<hr />

<strong id="disconnect"><code>constant</code>  disconnect</strong>



<p>

Invoke `disconnectedCallback` method of a Node (and its descendents).
It does nothing if life cycle is disabled.

</p>



<strong>Type:</strong>

<pre>(node: Node): void</pre>




<hr />

<strong id="render"><code>constant</code>  render</strong>



<p>

Render a set of Nodes into another, with some checks for Nodes in order to avoid
useless changes in the tree and to mantain or update the state of compatible Nodes.

</p>



<strong>Type:</strong>

<pre>(root: HTMLElement, input: <a href="#template">Template</a>, scope?: <a href="#scope">Scope</a>|undefined, filter?: <a href="#templatefilter">TemplateFilter</a>|undefined): void|Node|Node[]</pre>




<hr />

<strong id="fragment"><code>constant</code>  Fragment</strong>



<p>

A constructor alias used for JSX fragments </>.

</p>



<strong>Type:</strong>

<pre>Symbol</pre>




<hr />

<strong id="h"><code>constant</code>  h</strong>



<p>

HyperFunction factory to use as JSX pragma.

</p>



<strong>Type:</strong>

<pre>(tagOrComponent: string|Symbol|{
    constructor(node?: HTMLElement|undefined, properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    observedAttributes: string[];
    prototype: <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
}|<a href="#templatefunction">TemplateFunction</a>, properties?: <a href="#hyperproperties">HyperProperties</a>|null, children: <a href="#templateitems">TemplateItems</a>): <a href="#hypernode">HyperNode</a></pre>




<hr />

<strong id="html"><code>constant</code>  html</strong>



<p>

Compile a template string into virtual DOM template.

</p>



<strong>Type:</strong>

<pre>(string: string|TemplateStringsArray, values: any[]): <a href="#template">Template</a></pre>




<hr />

<strong id="template"><code>constant</code>  template</strong>



<p>

Compile a template element into virtual DOM template.

</p>



<strong>Type:</strong>

<pre>(template: HTMLTemplateElement, scope: <a href="#scope">Scope</a>): <a href="#template">Template</a></pre>




<hr />

<strong id="interpolate"><code>constant</code>  interpolate</strong>



<p>

Create an InterpolationFunction.

</p>



<strong>Type:</strong>

<pre>(expression: string, scope: <a href="#scope">Scope</a>): any</pre>




<hr />

<strong id="css"><code>constant</code>  css</strong>



<p>

Scope a CSS string, adding a compnent-specific trailing selector to all rules.
It also converts `:host` selectors for cross browser compatibility.

</p>



<strong>Type:</strong>

<pre>(name: string, cssText: string): string</pre>




<hr />

<strong id="delegateeventlistener"><code>constant</code>  delegateEventListener</strong>



<p>

Delegate an Event listener.

</p>



<strong>Type:</strong>

<pre>(element: Element, eventName: string, selector: string|null, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>, options?: AddEventListenerOptions|undefined): void</pre>

<strong>See also</strong>

* [MDN][https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)


<hr />

<strong id="undelegateeventlistener"><code>constant</code>  undelegateEventListener</strong>



<p>

Remove an Event delegation.

</p>



<strong>Type:</strong>

<pre>(element: Element, eventName: string, selector: string|null, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void</pre>




<hr />

<strong id="dispatchevent"><code>constant</code>  dispatchEvent</strong>



<p>

Dispatch a custom Event.

</p>



<strong>Type:</strong>

<pre>(element: Element, event: string|Event, detail?: CustomEventInit&lt;any&gt;|undefined, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean</pre>




<hr />

<strong id="dispatchasyncevent"><code>constant</code>  dispatchAsyncEvent</strong>



<p>

Dispatch an async custom Event.

</p>



<strong>Type:</strong>

<pre>(element: Element, event: string|Event, detail?: CustomEventInit&lt;any&gt;|undefined, bubbles?: boolean, cancelable?: boolean, composed?: boolean): Promise&lt;any[]&gt;</pre>




<hr />

<strong id="property"><code>constant</code>  property</strong>



<p>

A decorator for class fields definition.

</p>



<strong>Type:</strong>

<pre>(descriptor?: <a href="#classfielddescriptor">ClassFieldDescriptor</a>): any</pre>




<hr />

<strong id="extend"><code>constant</code>  extend</strong>



<p>

Get a native HTMLElement constructor to extend by its name.

</p>



<strong>Type:</strong>

<pre>&lt;T extends {
    constructor(): HTMLElement;
    prototype: HTMLElement;
}&gt;(constructor: T): {
    constructor(node?: HTMLElement|undefined, properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;InstanceType&lt;T&gt;&gt;;
    constructor(properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;InstanceType&lt;T&gt;&gt;;
    constructor(): <a href="#icomponent">IComponent</a>&lt;InstanceType&lt;T&gt;&gt;;
    observedAttributes: string[];
    prototype: <a href="#icomponent">IComponent</a>&lt;InstanceType&lt;T&gt;&gt;;
}</pre>




<hr />

<strong id="component"><code>constant</code>  Component</strong>



<p>

The DNA base Component constructor, a Custom Element constructor with
declarative properties and event delegations, custom template and
a complete life cycle implementation.
All DNA components **must** extends this class.

</p>



<strong>Type:</strong>

<pre>{
    constructor(node?: HTMLElement|undefined, properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(properties?: {
        [key: string]: any;
    }|undefined): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    constructor(): <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
    observedAttributes: string[];
    prototype: <a href="#icomponent">IComponent</a>&lt;HTMLElement&gt;;
}</pre>




<hr />

<strong id="namespaceuri"><code>enum</code>  NamespaceURI</strong>



<p>

A list of namespaceURI bound with their tagName.

</p>


<table>
    <thead>
        <th align="left">Member</th>
        <th align="left">Description</th>
        <th align="left">Value</th>
    </thead>
    <tbody>
        <tr>
            <td>svg</td>
            <td></td>
            <td><code>"http://www.w3.org/2000/svg"</code></td>
        </tr>
    </tbody>
</table>







<hr />

<strong id="icomponent"><code>type</code>  IComponent</strong>





<pre>T & {
    is: string;
    properties?: {
        [key: string]: <a href="#classfielddescriptor">ClassFieldDescriptor</a>|Function|Function[];
    };
    listeners?: {
        [key: string]: <a href="#delegatedeventcallback">DelegatedEventCallback</a>;
    };
    template: HTMLTemplateElement|undefined;
    $: <a href="#scope">Scope</a>|undefined;
    slotChildNodes: <a href="#templateitems">TemplateItems</a>;
    adoptedStyleSheets?: CSSStyleSheet[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: null|string, newValue: null|string): void;
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
    render(): <a href="#template">Template</a>;
    forceUpdate(): void;
    getProperties(): {
        [propertyKey: string]: <a href="#classfielddescriptor">ClassFieldDescriptor</a>;
    };
    getProperty(propertyKey: string): <a href="#classfielddescriptor">ClassFieldDescriptor</a>|null;
    defineProperty(propertyKey: string, descriptor: <a href="#classfielddescriptor">ClassFieldDescriptor</a>, symbol?: Symbol): Symbol;
    initProperties(props: {
        [key: string]: any;
    }): void;
    initProperty(propertyKey: string, descriptor: <a href="#classfielddescriptor">ClassFieldDescriptor</a>, symbol: Symbol, initializer?: Function): any;
    observe(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void;
    unobserve(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void;
    dispatchEvent(event: Event): boolean;
    dispatchEvent(event: string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;
    dispatchAsyncEvent(event: Event): Promise&lt;any[]&gt;;
    dispatchAsyncEvent(event: string, detail?: any, bubbles?: boolean, cancelable?: boolean, composed?: boolean): Promise&lt;any[]&gt;;
    delegateEventListener(event: string, selector: string|null, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void;
    undelegateEventListener(event?: string, selector?: string|null, callback?: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void;
}</pre>




<hr />

<strong id="classfielddescriptor"><code>type</code>  ClassFieldDescriptor</strong>

<p>

A list of properties for an class field description.

</p>



<pre>PropertyDescriptor & {
    name?: PropertyKey;
    attribute?: true|string;
    defaultValue?: any;
    type?: Function|Function[];
    fromAttribute?: <a href="#classfieldattributeconverter">ClassFieldAttributeConverter</a>;
    toAttribute?: <a href="#classfieldpropertyconverter">ClassFieldPropertyConverter</a>;
    observe?: <a href="#classfieldobserver">ClassFieldObserver</a>;
    observers?: <a href="#classfieldobserver">ClassFieldObserver</a>[];
    validate?: <a href="#classfieldvalidator">ClassFieldValidator</a>;
    getter?: (this: Element, value?: any): any;
    setter?: (this: Element, newValue?: any): any;
    event?: true|string;
    symbol?: Symbol;
}</pre>




<hr />

<strong id="classfieldattributeconverter"><code>type</code>  ClassFieldAttributeConverter</strong>

<p>

Convert attribute to property value.

</p>



<pre>&lt;T extends HTMLElement&gt;(this: T, value: string|null): any</pre>




<hr />

<strong id="classfieldpropertyconverter"><code>type</code>  ClassFieldPropertyConverter</strong>

<p>

Convert property to attribute value.

</p>



<pre>&lt;T extends HTMLElement&gt;(this: T, value: any): string|null|undefined</pre>




<hr />

<strong id="classfieldobserver"><code>type</code>  ClassFieldObserver</strong>

<p>

The observer signature for class fields.

</p>



<pre>&lt;T extends HTMLElement&gt;(this: T, oldValue: any, newValue: any): any</pre>




<hr />

<strong id="classfieldvalidator"><code>type</code>  ClassFieldValidator</strong>

<p>

A validation function for the class field.

</p>



<pre>&lt;T extends HTMLElement&gt;(this: T, value: any): boolean</pre>




<hr />

<strong id="delegatedeventcallback"><code>type</code>  DelegatedEventCallback</strong>

<p>

Describe the signature of a delegated event callback.

</p>



<pre>(event: Event, target?: Node): any</pre>




<hr />

<strong id="scope"><code>type</code>  Scope</strong>

<p>

A scope interface.

</p>



<pre>HTMLElement & <a href="#scopevalues">ScopeValues</a></pre>




<hr />

<strong id="scopevalues"><code>type</code>  ScopeValues</strong>





<pre>{
    [key: string]: any;
}</pre>




<hr />

<strong id="templateitems"><code>type</code>  TemplateItems</strong>

<p>

A list of template items.

</p>



<pre><a href="#templateitem">TemplateItem</a>[]</pre>




<hr />

<strong id="templateitem"><code>type</code>  TemplateItem</strong>

<p>

The atomic template item.
It can be a node, a Hyper or Interpolate function or a primitive value.

</p>



<pre>Element|Text|Node|<a href="#hypernode">HyperNode</a>|string|number|boolean|undefined|null</pre>




<hr />

<strong id="hypernode"><code>type</code>  HyperNode</strong>

<p>

A virtual description of a Node, generate by the `h` helper and used in the render function.

</p>



<pre>{
    Component?: <a href="#icomponent">IComponent</a>;
    tag?: string;
    is?: string;
    key?: any;
    isFragment?: boolean;
    isSlot?: boolean;
    namespaceURI?: <a href="#namespaceuri">NamespaceURI</a>;
    properties?: any;
    children: <a href="#templateitems">TemplateItems</a>;
}</pre>




<hr />

<strong id="template"><code>type</code>  Template</strong>

<p>

A generic template. Can be a single atomic item or a list of items.

</p>



<pre><a href="#templateitem">TemplateItem</a>|<a href="#templateitems">TemplateItems</a></pre>




<hr />

<strong id="templatefilter"><code>type</code>  TemplateFilter</strong>

<p>

A filter function signature for template items.

</p>



<pre>(item: <a href="#templateitem">TemplateItem</a>): boolean</pre>




<hr />

<strong id="templatefunction"><code>type</code>  TemplateFunction</strong>

<p>

A function that returns a template.

</p>



<pre>(props: {
    children: <a href="#template">Template</a>;
    [key: string]: any;
}): <a href="#template">Template</a></pre>




<hr />

<strong id="hyperproperties"><code>type</code>  HyperProperties</strong>

<p>

The properties of a HyperNode.

</p>



<pre>{
    is?: string;
    slot?: string;
    key?: any;
    namespaceURI?: string;
    [key: string]: any;
}</pre>




<hr />

<strong id="asyncevent"><code>type</code>  AsyncEvent</strong>





<pre>Event & {
    respondWith(callback: (): Promise&lt;any&gt;): void;
}</pre>




<hr />

<strong id="component"><code>type</code>  Component</strong>





<pre><a href="#icomponent">IComponent</a>&lt;T&gt;</pre>


