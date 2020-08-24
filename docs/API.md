# API Reference





**Classes**

<a href="#customelementregistry">CustomElementRegistry</a>




**Constants**

<a href="#namespace">namespace</a>, <a href="#customelements">customElements</a>, <a href="#dom">DOM</a>, <a href="#connect">connect</a>, <a href="#disconnect">disconnect</a>, <a href="#render">render</a>, <a href="#fragment">Fragment</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#css">css</a>, <a href="#delegateeventlistener">delegateEventListener</a>, <a href="#undelegateeventlistener">undelegateEventListener</a>, <a href="#dispatchevent">dispatchEvent</a>, <a href="#dispatchasyncevent">dispatchAsyncEvent</a>, <a href="#definelisteners">defineListeners</a>, <a href="#property">property</a>, <a href="#getproperty">getProperty</a>, <a href="#getproperties">getProperties</a>, <a href="#defineproperties">defineProperties</a>, <a href="#defineproperty">defineProperty</a>, <a href="#iscomponent">isComponent</a>, <a href="#iscomponentconstructor">isComponentConstructor</a>, <a href="#extend">extend</a>, <a href="#component">Component</a>, <a href="#until">until</a>


**Enums**

<a href="#namespaceuri">NamespaceURI</a>


**Types**

<a href="#observable">Observable</a>, <a href="#subscription">Subscription</a>, <a href="#templateitem">TemplateItem</a>, <a href="#hypernode">HyperNode</a>, <a href="#templatefunction">TemplateFunction</a>, <a href="#template">Template</a>, <a href="#templateitems">TemplateItems</a>, <a href="#context">Context</a>, <a href="#iterablenodelist">IterableNodeList</a>, <a href="#templatefilter">TemplateFilter</a>, <a href="#hyperproperties">HyperProperties</a>, <a href="#asyncevent">AsyncEvent</a>, <a href="#delegatedeventcallback">DelegatedEventCallback</a>, <a href="#componentconstructorinterface">ComponentConstructorInterface</a>, <a href="#classfielddescriptor">ClassFieldDescriptor</a>, <a href="#classfieldattributeconverter">ClassFieldAttributeConverter</a>, <a href="#classfieldpropertyconverter">ClassFieldPropertyConverter</a>, <a href="#classfieldobserver">ClassFieldObserver</a>, <a href="#classfieldvalidator">ClassFieldValidator</a>, <a href="#delegatedeventdescriptor">DelegatedEventDescriptor</a>, <a href="#componentinterface">ComponentInterface</a>


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
    [key: string]: HTMLElement;
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
<code>(name: string): HTMLElement|undefined</code>
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

<strong>Returns</strong>: <code>HTMLElement|undefined</code> The definition for the given tag.

<br />
</details>





<br />

<strong id="define"><code>method</code>  define</strong>



<p>

Define a new Custom Element.

</p>

<details>
<summary>
<code>(name: string, constructor: HTMLElement, options?: ElementDefinitionOptions): void</code>
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
            <td><code>HTMLElement</code></td>
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

<strong id="namespace"><code>constant</code>  namespace</strong>







<strong>Type:</strong>

<pre>Window & globalThis</pre>




<hr />

<strong id="customelements"><code>constant</code>  customElements</strong>



<p>

The global DNA registry instance.

</p>



<strong>Type:</strong>

<pre><a href="#customelementregistry">CustomElementRegistry</a></pre>




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
    createElement(tagName: string, options?: ElementCreationOptions|undefined): Element;
    createElementNS(namespaceURI: string, tagName: string): Element;
    createTextNode(data: string): Text;
    createComment(data: string): Comment;
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

<pre>(node: Node, force?: boolean): void</pre>




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

<pre>(root: HTMLElement, input: <a href="#template">Template</a>): Node|Node[]|void</pre>




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

<pre>(tagOrComponent: string|HTMLElement|<a href="#fragment">Fragment</a>|<a href="#templatefunction">TemplateFunction</a>|Node, properties?: <a href="#hyperproperties">HyperProperties</a>|null, children: <a href="#templateitems">TemplateItems</a>): <a href="#hypernode">HyperNode</a></pre>




<hr />

<strong id="html"><code>constant</code>  html</strong>



<p>

Compile a template string into virtual DOM template.

</p>



<strong>Type:</strong>

<pre>(string: string|TemplateStringsArray, values: any[]): <a href="#template">Template</a></pre>




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

<pre>(element: Element, event: Event|string, detail?: CustomEventInit&lt;any&gt;|undefined, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean</pre>




<hr />

<strong id="dispatchasyncevent"><code>constant</code>  dispatchAsyncEvent</strong>



<p>

Dispatch an async custom Event.

</p>



<strong>Type:</strong>

<pre>(element: Element, event: Event|string, detail?: CustomEventInit&lt;any&gt;|undefined, bubbles?: boolean, cancelable?: boolean, composed?: boolean): Promise&lt;any[]&gt;</pre>




<hr />

<strong id="definelisteners"><code>constant</code>  defineListeners</strong>



<p>

Define component constructor listeners.

</p>



<strong>Type:</strong>

<pre>(constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>&lt;HTMLElement&gt;): void</pre>




<hr />

<strong id="property"><code>constant</code>  property</strong>



<p>

A decorator for class fields definition.

</p>



<strong>Type:</strong>

<pre>(descriptor?: <a href="#classfielddescriptor">ClassFieldDescriptor</a>): any</pre>




<hr />

<strong id="getproperty"><code>constant</code>  getProperty</strong>



<p>

Retrieve property descriptor.

</p>



<strong>Type:</strong>

<pre>(constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>&lt;HTMLElement&gt;, propertyKey: string): <a href="#classfielddescriptor">ClassFieldDescriptor</a>|null</pre>




<hr />

<strong id="getproperties"><code>constant</code>  getProperties</strong>



<p>

Retrieve all properties descriptors.

</p>



<strong>Type:</strong>

<pre>(constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>&lt;HTMLElement&gt;): {
    [propertyKey: string]: <a href="#classfielddescriptor">ClassFieldDescriptor</a>;
}</pre>




<hr />

<strong id="defineproperties"><code>constant</code>  defineProperties</strong>



<p>

Define component constructor properties.

</p>



<strong>Type:</strong>

<pre>(constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>&lt;HTMLElement&gt;): void</pre>




<hr />

<strong id="defineproperty"><code>constant</code>  defineProperty</strong>



<p>

Define an observed property.

</p>



<strong>Type:</strong>

<pre>(constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>&lt;HTMLElement&gt;, propertyKey: string, descriptor: <a href="#classfielddescriptor">ClassFieldDescriptor</a>, symbolKey?: Symbol|undefined): Symbol</pre>




<hr />

<strong id="iscomponent"><code>constant</code>  isComponent</strong>



<p>

Check if a node is a component.

</p>



<strong>Type:</strong>

<pre>(node: any): node is <a href="#componentinterface">ComponentInterface</a></pre>




<hr />

<strong id="iscomponentconstructor"><code>constant</code>  isComponentConstructor</strong>



<p>

Check if a constructor is a component constructor.

</p>



<strong>Type:</strong>

<pre>(constructor: Function): constructor is <a href="#componentconstructorinterface">ComponentConstructorInterface</a></pre>




<hr />

<strong id="extend"><code>constant</code>  extend</strong>



<p>

Get a native HTMLElement constructor to extend by its name.

</p>



<strong>Type:</strong>

<pre>&lt;T extends {
    constructor(): HTMLElement;
    prototype: HTMLElement;
}&gt;(constructor: T): <a href="#componentconstructorinterface">ComponentConstructorInterface</a>&lt;InstanceType&lt;T&gt;&gt;</pre>




<hr />

<strong id="component"><code>constant</code>  Component</strong>



<p>

The DNA base Component constructor, a Custom Element constructor with
declarative properties and event delegations, custom template and
a complete life cycle implementation.
All DNA components **must** extends this class.

</p>



<strong>Type:</strong>

<pre><a href="#componentconstructorinterface">ComponentConstructorInterface</a>&lt;HTMLElement&gt;</pre>




<hr />

<strong id="until"><code>constant</code>  until</strong>



<p>

It renders the template when then provided Thenable is in pending status.

</p>



<strong>Type:</strong>

<pre>(thenable: any, template: <a href="#template">Template</a>): any</pre>




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

<strong id="observable"><code>type</code>  Observable</strong>

<p>

Observable-like minimal interface.

</p>



<pre>{
    pipe(operator: (value: T): any): <a href="#observable">Observable</a>&lt;T&gt;;
    subscribe(nextCallback: (value: T): any, errorCallback: (error: Error): any, completeCallback: (): any): <a href="#subscription">Subscription</a>;
}</pre>




<hr />

<strong id="subscription"><code>type</code>  Subscription</strong>

<p>

Subscription-like minimal interface.

</p>



<pre>{
    unsubscribe(): void;
}</pre>




<hr />

<strong id="templateitem"><code>type</code>  TemplateItem</strong>

<p>

The atomic template item.
It can be a node, a Hyper or Interpolate function or a primitive value.

</p>



<pre>Element|Text|Node|<a href="#hypernode">HyperNode</a>|Promise&lt;any&gt;|<a href="#observable">Observable</a>&lt;any&gt;|string|number|boolean|undefined|null</pre>




<hr />

<strong id="hypernode"><code>type</code>  HyperNode</strong>

<p>

A virtual description of a Node, generate by the `h` helper and used in the render function.

</p>



<pre>{
    node?: Node;
    Component?: HTMLElement;
    Function?: <a href="#templatefunction">TemplateFunction</a>;
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

<strong id="templatefunction"><code>type</code>  TemplateFunction</strong>

<p>

A function that returns a template.

</p>



<pre>(props: {
    children: <a href="#template">Template</a>;
    [key: string]: any;
}, state: any, update: (): boolean, live: (): boolean, context: <a href="#context">Context</a>): <a href="#template">Template</a></pre>




<hr />

<strong id="template"><code>type</code>  Template</strong>

<p>

A generic template. Can be a single atomic item or a list of items.

</p>



<pre><a href="#templateitem">TemplateItem</a>|<a href="#templateitems">TemplateItems</a></pre>




<hr />

<strong id="templateitems"><code>type</code>  TemplateItems</strong>

<p>

A list of template items.

</p>



<pre><a href="#templateitem">TemplateItem</a>[]</pre>




<hr />

<strong id="context"><code>type</code>  Context</strong>

<p>

The node context interface.

</p>



<pre>{
    isElement?: boolean;
    isText?: boolean;
    tagName?: string;
    is?: string;
    key?: any;
    props: {
        [key: string]: any;
    };
    state: Map&lt;string, any&gt;;
    childNodes?: <a href="#iterablenodelist">IterableNodeList</a>;
    slotChildNodes?: <a href="#iterablenodelist">IterableNodeList</a>;
    first?: Node;
    last?: Node;
    function?: <a href="#templatefunction">TemplateFunction</a>;
    fragments: <a href="#context">Context</a>[];
}</pre>




<hr />

<strong id="iterablenodelist"><code>type</code>  IterableNodeList</strong>





<pre>Node[] & {
    item(index: number): Node|null;
}</pre>




<hr />

<strong id="templatefilter"><code>type</code>  TemplateFilter</strong>

<p>

A filter function signature for template items.

</p>



<pre>(item: <a href="#templateitem">TemplateItem</a>): boolean</pre>




<hr />

<strong id="hyperproperties"><code>type</code>  HyperProperties</strong>

<p>

The properties of a HyperNode.

</p>



<pre>{
    is?: string;
    slot?: string;
    key?: any;
    xlmns?: <a href="#namespaceuri">NamespaceURI</a>;
    children?: <a href="#templateitems">TemplateItems</a>;
    [key: string]: any;
}</pre>




<hr />

<strong id="asyncevent"><code>type</code>  AsyncEvent</strong>





<pre>Event & {
    respondWith(callback: (): Promise&lt;any&gt;): void;
}</pre>




<hr />

<strong id="delegatedeventcallback"><code>type</code>  DelegatedEventCallback</strong>

<p>

Describe the signature of a delegated event callback.

</p>



<pre>(event: Event, target?: Node): any</pre>




<hr />

<strong id="componentconstructorinterface"><code>type</code>  ComponentConstructorInterface</strong>

<p>

The basic DNA Component interface.
It's a Custom Element, but with some extra useful method.

</p>



<pre>{
    observedAttributes: string[];
    properties?: {
        [key: string]: <a href="#classfielddescriptor">ClassFieldDescriptor</a>|Function|Function[];
    };
    listeners?: {
        [key: string]: <a href="#delegatedeventcallback">DelegatedEventCallback</a>|<a href="#delegatedeventdescriptor">DelegatedEventDescriptor</a>;
    };
    constructor(node?: HTMLElement, properties?: {
        [key: string]: any;
    }): <a href="#componentinterface">ComponentInterface</a>&lt;T&gt;;
    constructor(properties?: {
        [key: string]: any;
    }): <a href="#componentinterface">ComponentInterface</a>&lt;T&gt;;
    constructor(): <a href="#componentinterface">ComponentInterface</a>&lt;T&gt;;
    prototype: <a href="#componentinterface">ComponentInterface</a>&lt;T&gt;;
}</pre>

<strong>See also</strong>

* [W3C specification][https://w3c.github.io/webcomponents/spec/custom/](https://w3c.github.io/webcomponents/spec/custom/).


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
    getter?: (value?: any): any;
    setter?: (newValue?: any): any;
    event?: true|string;
    symbol?: Symbol;
}</pre>




<hr />

<strong id="classfieldattributeconverter"><code>type</code>  ClassFieldAttributeConverter</strong>

<p>

Convert attribute to property value.

</p>



<pre>(value: string|null): any</pre>




<hr />

<strong id="classfieldpropertyconverter"><code>type</code>  ClassFieldPropertyConverter</strong>

<p>

Convert property to attribute value.

</p>



<pre>(value: any): string|null|undefined</pre>




<hr />

<strong id="classfieldobserver"><code>type</code>  ClassFieldObserver</strong>

<p>

The observer signature for class fields.

</p>



<pre>(oldValue: any, newValue: any): any</pre>




<hr />

<strong id="classfieldvalidator"><code>type</code>  ClassFieldValidator</strong>

<p>

A validation function for the class field.

</p>



<pre>(value: any): boolean</pre>




<hr />

<strong id="delegatedeventdescriptor"><code>type</code>  DelegatedEventDescriptor</strong>

<p>

A descriptor for an event delegation.

</p>



<pre>AddEventListenerOptions & {
    callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>;
}</pre>




<hr />

<strong id="componentinterface"><code>type</code>  ComponentInterface</strong>





<pre>T & {
    is: string;
    slotChildNodes: <a href="#templateitems">TemplateItems</a>;
    adoptedStyleSheets?: CSSStyleSheet[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: null|string, newValue: null|string): void;
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
    render(): <a href="#template">Template</a>;
    forceUpdate(): void;
    initialize(context: <a href="#context">Context</a>, props: {
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
    emulateLifeCycle(): void;
}</pre>


