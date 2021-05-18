# API Reference

<strong>Classes</strong>

<a href="#customelementregistry">CustomElementRegistry</a>

<strong>Types</strong>

<a href="#asyncevent">AsyncEvent</a>, <a href="#classfieldattributeconverter">ClassFieldAttributeConverter</a>, <a href="#classfielddescriptor">ClassFieldDescriptor</a>, <a href="#classfieldobserver">ClassFieldObserver</a>, <a href="#classfieldpropertyconverter">ClassFieldPropertyConverter</a>, <a href="#classfieldvalidator">ClassFieldValidator</a>, <a href="#componentconstructorinterface">ComponentConstructorInterface</a>, <a href="#componentinterface">ComponentInterface</a>, <a href="#context">Context</a>, <a href="#delegatedeventcallback">DelegatedEventCallback</a>, <a href="#delegatedeventdescriptor">DelegatedEventDescriptor</a>, <a href="#hypernode">HyperNode</a>, <a href="#observable">Observable</a>, <a href="#template">Template</a>, <a href="#templatefilter">TemplateFilter</a>, <a href="#templatefunction">TemplateFunction</a>, <a href="#templateitem">TemplateItem</a>, <a href="#templateitems">TemplateItems</a>

<strong>Variables</strong>

<a href="#component">Component</a>, <a href="#dom">DOM</a>, <a href="#fragment">Fragment</a>, <a href="#customelements">customElements</a>, <a href="#window">window</a>

<strong>Functions</strong>

<a href="#connect">connect</a>, <a href="#css">css</a>, <a href="#customelement">customElement</a>, <a href="#definelisteners">defineListeners</a>, <a href="#defineproperties">defineProperties</a>, <a href="#defineproperty">defineProperty</a>, <a href="#delegateeventlistener">delegateEventListener</a>, <a href="#disconnect">disconnect</a>, <a href="#dispatchasyncevent">dispatchAsyncEvent</a>, <a href="#dispatchevent">dispatchEvent</a>, <a href="#extend">extend</a>, <a href="#getproperties">getProperties</a>, <a href="#getproperty">getProperty</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#iscomponent">isComponent</a>, <a href="#iscomponentconstructor">isComponentConstructor</a>, <a href="#property">property</a>, <a href="#render">render</a>, <a href="#undelegateeventlistener">undelegateEventListener</a>, <a href="#until">until</a>

<hr />

<strong id="customelementregistry"><code>Class</code> CustomElementRegistry</strong>

<p>

The CustomElementRegistry interface provides methods for registering custom elements and querying registered elements.

</p>

<strong>Propertie</strong>

<table>
        <thead>
            <th align="left">Name</th>
            <th align="left">Type</th>
            <th align="left">Readonly</th>
            <th align="left">Description</th>
        </thead>
        <tbody>
            <tr>
                <td>native</td>
                <td><code>Property</code></td>
                <td align="center">✓</td>
                <td>Support native registry.</td></tr>
<tr>
                <td>queue</td>
                <td><code>Property</code></td>
                <td align="center">✓</td>
                <td>Collect "whenDefined" promises.</td></tr>
<tr>
                <td>registry</td>
                <td><code>Property</code></td>
                <td align="center">✓</td>
                <td>A global registry.</td></tr>
<tr>
                <td>tagNames</td>
                <td><code>Property</code></td>
                <td align="center">✓</td>
                <td>A map of tag names.</td>
            </tr>
        </tbody>
    </table>

<strong>Methods</strong>

<strong><code>Function</code> constructor</strong>

<details>
<summary>
    <code>new (): <a href="#customelementregistry">CustomElementRegistry</a></code>
</summary>

<strong>Returns</strong>: <code><a href="#customelementregistry">CustomElementRegistry</a></code> 

</details>

<strong id="define"><code>Function</code> define</strong>

<details>
<summary>
    <code>(name: string, constructor: {
  prototype: <a href="#htmlelement">HTMLElement</a>
} & {
  shim?: boolean
}, options: <a href="#elementdefinitionoptions">ElementDefinitionOptions</a>): void</code>
</summary>

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
            <td></td></tr>
<tr>
            <td>constructor</td>
            <td><code>{
  prototype: <a href="#htmlelement">HTMLElement</a>
} & {
  shim?: boolean
}</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>options</td>
            <td><code><a href="#elementdefinitionoptions">ElementDefinitionOptions</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<strong id="get"><code>Function</code> get</strong>

<details>
<summary>
    <code>(name: string): undefined | {
  prototype: <a href="#htmlelement">HTMLElement</a>
}</code>
</summary>

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
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>undefined | {   prototype: <a href="#htmlelement">HTMLElement</a> }</code> The definition for the given tag.

</details>

<strong id="upgrade"><code>Function</code> upgrade</strong>

<details>
<summary>
    <code>(root: <a href="#htmlelement">HTMLElement</a>): void</code>
</summary>

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
            <td><code><a href="#htmlelement">HTMLElement</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<strong id="whendefined"><code>Function</code> whenDefined</strong>

<details>
<summary>
    <code>(name: string): <a href="#promise">Promise</a></code>
</summary>

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
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#promise">Promise</a></code> A Promise that resolves when the named element is defined.

</details>

<hr />

<strong id="asyncevent"><code>Type</code> AsyncEvent</strong>
    

<pre><a href="#event">Event</a> & {
  respondWith(callback: () => <a href="#promise">Promise</a>): void
}</pre>

<hr />

<strong id="classfieldattributeconverter"><code>Type</code> ClassFieldAttributeConverter</strong>
    
<p>

Convert attribute to property value.

</p>

<pre>(value: string | null) => unknown</pre>

<hr />

<strong id="classfielddescriptor"><code>Type</code> ClassFieldDescriptor</strong>
    
<p>

A list of properties for an class field description.

</p>

<pre><a href="#propertydescriptor">PropertyDescriptor</a> & {
  attribute?: true | string;
  defaultValue?: unknown;
  event?: true | string;
  fromAttribute?: <a href="#classfieldattributeconverter">ClassFieldAttributeConverter</a>;
  getter?: (value?: any) => any;
  initializer?: <a href="#function">Function</a>;
  name?: <a href="#propertykey">PropertyKey</a>;
  observe?: <a href="#classfieldobserver">ClassFieldObserver</a>;
  observers?: <a href="#classfieldobserver">ClassFieldObserver</a>[];
  setter?: (newValue?: any) => any;
  symbol?: symbol;
  toAttribute?: <a href="#classfieldpropertyconverter">ClassFieldPropertyConverter</a>;
  type?: <a href="#function">Function</a> | <a href="#function">Function</a>[];
  validate?: <a href="#classfieldvalidator">ClassFieldValidator</a>
}</pre>

<hr />

<strong id="classfieldobserver"><code>Type</code> ClassFieldObserver</strong>
    
<p>

The observer signature for class fields.

</p>

<pre>(oldValue: unknown, newValue: unknown) => unknown</pre>

<hr />

<strong id="classfieldpropertyconverter"><code>Type</code> ClassFieldPropertyConverter</strong>
    
<p>

Convert property to attribute value.

</p>

<pre>(value: any) => string | null | undefined</pre>

<hr />

<strong id="classfieldvalidator"><code>Type</code> ClassFieldValidator</strong>
    
<p>

A validation function for the class field.

</p>

<pre>(value: unknown) => boolean</pre>

<hr />

<strong id="componentconstructorinterface"><code>Type</code> ComponentConstructorInterface&lt;T extends <a href="#htmlelement">HTMLElement</a>&gt;</strong>
    
<p>

The basic DNA Component interface.
It's a Custom Element, but with some extra useful method.

</p>

<pre>{
  listeners?: <a href="#delegatedeventcallback">DelegatedEventCallback</a> | <a href="#delegatedeventdescriptor">DelegatedEventDescriptor</a>;
  observedAttributes: string[];
  properties?: <a href="#classfielddescriptor">ClassFieldDescriptor</a> | <a href="#function">Function</a> | <a href="#function">Function</a>[];
  prototype: <a href="#componentinterface">ComponentInterface</a>;
  shim?: boolean
}</pre>

<strong>See also</strong>

* [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.

<hr />

<strong id="componentinterface"><code>Type</code> ComponentInterface&lt;T extends <a href="#htmlelement">HTMLElement</a>&gt;</strong>
    

<pre><a href="#t">T</a> & {
  [COMPONENT_SYMBOL]: boolean;
  [CONSTRUCTED_SYMBOL]: boolean;
  adoptedStyleSheets?: <a href="#cssstylesheet">CSSStyleSheet</a>[];
  constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>;
  is: string;
  slotChildNodes: <a href="#iterablenodelist">IterableNodeList</a>;
  attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  delegateEventListener(event: string, selector: null | string, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void;
  disconnectedCallback(): void;
  dispatchAsyncEvent(event: <a href="#event">Event</a>): <a href="#promise">Promise</a>
  dispatchAsyncEvent(event: string, detail?: unknown, bubbles?: boolean, cancelable?: boolean, composed?: boolean): <a href="#promise">Promise</a>;
  dispatchEvent(event: <a href="#event">Event</a>): boolean
  dispatchEvent(event: string, detail?: unknown, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;
  emulateLifeCycle(): void;
  forceUpdate(): void;
  initialize(properties?: unknown): void;
  observe(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void;
  propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
  render(): <a href="#template">Template</a>;
  undelegateEventListener(event?: string, selector?: null | string, callback?: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void;
  unobserve(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void
}</pre>

<hr />

<strong id="context"><code>Type</code> Context</strong>
    
<p>

The node context interface.

</p>

<pre>{
  childNodes?: <a href="#iterablenodelist">IterableNodeList</a>;
  first?: <a href="#node">Node</a>;
  fragments: <a href="#context">Context</a>[];
  function?: <a href="#templatefunction">TemplateFunction</a>;
  is?: string;
  isElement?: boolean;
  isText?: boolean;
  key?: unknown;
  last?: <a href="#node">Node</a>;
  parent?: <a href="#context">Context</a>;
  props: [<a href="#propertiesmap">PropertiesMap</a>, <a href="#propertiesmap">PropertiesMap</a>];
  root?: <a href="#context">Context</a>;
  slotChildNodes?: <a href="#iterablenodelist">IterableNodeList</a>;
  state: <a href="#map">Map</a>;
  tagName?: string
}</pre>

<hr />

<strong id="delegatedeventcallback"><code>Type</code> DelegatedEventCallback</strong>
    
<p>

Describe the signature of a delegated event callback.

</p>

<pre>(event: <a href="#event">Event</a>, target?: <a href="#node">Node</a>) => unknown</pre>

<hr />

<strong id="delegatedeventdescriptor"><code>Type</code> DelegatedEventDescriptor</strong>
    
<p>

A descriptor for an event delegation.

</p>

<pre><a href="#addeventlisteneroptions">AddEventListenerOptions</a> & {
  callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>
}</pre>

<hr />

<strong id="hypernode"><code>Type</code> HyperNode</strong>
    
<p>

A virtual description of a Node, generate by the `h` helper and used in the render function.

</p>

<pre>{
  Component?: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>;
  Function?: <a href="#templatefunction">TemplateFunction</a>;
  children: <a href="#templateitems">TemplateItems</a>;
  is?: string;
  isFragment?: boolean;
  isSlot?: boolean;
  key?: unknown;
  namespaceURI?: <a href="#namespaceuri">NamespaceURI</a>;
  node?: <a href="#node">Node</a>;
  properties: <a href="#hyperproperties">HyperProperties</a>;
  tag?: string
}</pre>

<hr />

<strong id="observable"><code>Type</code> Observable&lt;T&gt;</strong>
    
<p>

Observable-like minimal interface.

</p>

<pre>{
  pipe(operator: (value: <a href="#t">T</a>) => unknown): <a href="#observable">Observable</a>;
  subscribe(nextCallback: (value: <a href="#t">T</a>) => unknown, errorCallback: (error: <a href="#error">Error</a>) => unknown, completeCallback: () => unknown): <a href="#subscription">Subscription</a>
}</pre>

<hr />

<strong id="template"><code>Type</code> Template</strong>
    
<p>

A generic template. Can be a single atomic item or a list of items.

</p>

<pre><a href="#templateitem">TemplateItem</a> | <a href="#templateitems">TemplateItems</a></pre>

<hr />

<strong id="templatefilter"><code>Type</code> TemplateFilter</strong>
    
<p>

A filter function signature for template items.

</p>

<pre>(item: <a href="#node">Node</a>) => boolean</pre>

<hr />

<strong id="templatefunction"><code>Type</code> TemplateFunction</strong>
    
<p>

A function that returns a template.

</p>

<pre>(props: <a href="#hyperproperties">HyperProperties</a>, state: <a href="#map">Map</a>, update: () => boolean, live: () => boolean, context: <a href="#context">Context</a>) => <a href="#template">Template</a></pre>

<hr />

<strong id="templateitem"><code>Type</code> TemplateItem</strong>
    
<p>

The atomic template item.
It can be a node, a Hyper or Interpolate function or a primitive value.

</p>

<pre><a href="#element">Element</a> | <a href="#text">Text</a> | <a href="#node">Node</a> | <a href="#hypernode">HyperNode</a> | <a href="#promise">Promise</a> | <a href="#observable">Observable</a> | string | number | boolean | undefined | null</pre>

<hr />

<strong id="templateitems"><code>Type</code> TemplateItems</strong>
    
<p>

A list of template items.

</p>

<pre><a href="#templateitem">TemplateItem</a>[]</pre>

<hr />

<strong id="component"><code>Variable</code> Component</strong>
    
<p>

The DNA base Component constructor, a Custom Element constructor with
declarative properties and event delegations, custom template and
a complete life cycle implementation.
All DNA components **must** extends this class.

</p>

<pre><a href="#componentconstructorinterface">ComponentConstructorInterface</a></pre>

<hr />

<strong id="dom"><code>Variable</code> DOM</strong>
    
<p>

DOM is a singleton that components uses to access DOM methods.
By default, it uses browsers' DOM implementation, but it can be set to use a different one.
For example, in a Node context it is possibile to use DNA thanks to the `jsdom` dom implementation.
It also handle element life cycle for custom elements unless otherwise specified.

</p>

<pre>{
  createDocumentFragment: () => <a href="#documentfragment">DocumentFragment</a>;
  createTextNode: (data: string) => <a href="#text">Text</a>;
  appendChild&lt;T extends <a href="#node">Node</a>&gt;(parent: <a href="#node">Node</a>, newChild: <a href="#t">T</a>, slot: boolean): <a href="#t">T</a>;
  createComment(data: string): <a href="#comment">Comment</a>;
  createElement&lt;K extends &gt;(tagName: <a href="#k">K</a>, options?: <a href="#elementcreationoptions">ElementCreationOptions</a>): ;
  createElementNS(namespaceURI: string, tagName: string): <a href="#element">Element</a>;
  createEvent(typeArg: string, eventInitDict: <a href="#customeventinit">CustomEventInit</a>): <a href="#customevent">CustomEvent</a>;
  getAttribute(element: <a href="#element">Element</a>, qualifiedName: string): null | string;
  hasAttribute(element: <a href="#element">Element</a>, qualifiedName: string): boolean;
  insertBefore&lt;T extends <a href="#node">Node</a>&gt;(parent: <a href="#node">Node</a>, newChild: <a href="#t">T</a>, refChild: null | <a href="#node">Node</a>, slot: boolean): <a href="#t">T</a>;
  removeAttribute(element: <a href="#element">Element</a>, qualifiedName: string): void;
  removeChild&lt;T extends <a href="#node">Node</a>&gt;(parent: <a href="#node">Node</a>, oldChild: <a href="#t">T</a>, slot: boolean): <a href="#t">T</a>;
  replaceChild&lt;T extends <a href="#node">Node</a>&gt;(parent: <a href="#node">Node</a>, newChild: <a href="#node">Node</a>, oldChild: <a href="#t">T</a>, slot: boolean): <a href="#t">T</a>;
  setAttribute(element: <a href="#element">Element</a>, qualifiedName: string, value: string): void
}</pre>

<hr />

<strong id="fragment"><code>Variable</code> Fragment</strong>
    
<p>

A constructor alias used for JSX fragments </>.

</p>

<pre>symbol</pre>

<hr />

<strong id="customelements"><code>Variable</code> customElements</strong>
    
<p>

The global DNA registry instance.

</p>

<pre><a href="#customelementregistry">CustomElementRegistry</a></pre>

<hr />

<strong id="window"><code>Variable</code> window</strong>
    

<pre><a href="#window">Window</a> & <a href="#globalthis">globalThis</a></pre>

<hr />

<strong id="connect"><code>Function</code> connect</strong>

<details>
<summary>
    <code>(node: <a href="#node">Node</a>, force: boolean): void</code>
</summary>

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
            <td>node</td>
            <td><code><a href="#node">Node</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>force</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<hr />

<strong id="css"><code>Function</code> css</strong>

<details>
<summary>
    <code>(name: string, cssText: string, extend?: string): string</code>
</summary>

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
            <td></td></tr>
<tr>
            <td>cssText</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>extend</td>
            <td><code>string</code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>string</code> A scoped CSS string.

</details>

<hr />

<strong id="customelement"><code>Function</code> customElement</strong>

<details>
<summary>
    <code>(name: string, options?: <a href="#elementdefinitionoptions">ElementDefinitionOptions</a>): (classOrDescriptor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a> | <a href="#classdescriptor">ClassDescriptor</a>) => any</code>
</summary>

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
            <td></td></tr>
<tr>
            <td>options</td>
            <td><code><a href="#elementdefinitionoptions">ElementDefinitionOptions</a></code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>(classOrDescriptor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a> | <a href="#classdescriptor">ClassDescriptor</a>) => any</code> The decorated component class.

</details>

<hr />

<strong id="definelisteners"><code>Function</code> defineListeners</strong>

<details>
<summary>
    <code>(constructor: <a href="#withlisteners">WithListeners</a>): void</code>
</summary>

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
            <td>constructor</td>
            <td><code><a href="#withlisteners">WithListeners</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<hr />

<strong id="defineproperties"><code>Function</code> defineProperties</strong>

<details>
<summary>
    <code>(constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>): void</code>
</summary>

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
            <td>constructor</td>
            <td><code><a href="#componentconstructorinterface">ComponentConstructorInterface</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<hr />

<strong id="defineproperty"><code>Function</code> defineProperty</strong>

<details>
<summary>
    <code>(constructor: <a href="#withproperties">WithProperties</a>, propertyKey: string, descriptor: <a href="#classfielddescriptor">ClassFieldDescriptor</a>, symbolKey?: symbol, initializer?: <a href="#function">Function</a>): <a href="#propertydescriptor">PropertyDescriptor</a></code>
</summary>

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
            <td>constructor</td>
            <td><code><a href="#withproperties">WithProperties</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>propertyKey</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>descriptor</td>
            <td><code><a href="#classfielddescriptor">ClassFieldDescriptor</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>symbolKey</td>
            <td><code>symbol</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>initializer</td>
            <td><code><a href="#function">Function</a></code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#propertydescriptor">PropertyDescriptor</a></code> The final descriptor.

</details>

<hr />

<strong id="delegateeventlistener"><code>Function</code> delegateEventListener</strong>

<details>
<summary>
    <code>(element: <a href="#element">Element</a>, eventName: string, selector: null | string, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>, options?: <a href="#addeventlisteneroptions">AddEventListenerOptions</a>): void</code>
</summary>

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
            <td>element</td>
            <td><code><a href="#element">Element</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>eventName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>selector</td>
            <td><code>null | string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>callback</td>
            <td><code><a href="#delegatedeventcallback">DelegatedEventCallback</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>options</td>
            <td><code><a href="#addeventlisteneroptions">AddEventListenerOptions</a></code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<hr />

<strong id="disconnect"><code>Function</code> disconnect</strong>

<details>
<summary>
    <code>(node: <a href="#node">Node</a>): void</code>
</summary>

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
            <td>node</td>
            <td><code><a href="#node">Node</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<hr />

<strong id="dispatchasyncevent"><code>Function</code> dispatchAsyncEvent</strong>

<details>
<summary>
    <code>(element: <a href="#element">Element</a>, event: string | <a href="#event">Event</a>, detail?: any, bubbles: boolean, cancelable: boolean, composed: boolean): <a href="#promise">Promise</a></code>
</summary>

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
            <td>element</td>
            <td><code><a href="#element">Element</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>event</td>
            <td><code>string | <a href="#event">Event</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>detail</td>
            <td><code>any</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>bubbles</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>cancelable</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>composed</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#promise">Promise</a></code> 

</details>

<hr />

<strong id="dispatchevent"><code>Function</code> dispatchEvent</strong>

<details>
<summary>
    <code>(element: <a href="#element">Element</a>, event: string | <a href="#event">Event</a>, detail?: any, bubbles: boolean, cancelable: boolean, composed: boolean): boolean</code>
</summary>

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
            <td>element</td>
            <td><code><a href="#element">Element</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>event</td>
            <td><code>string | <a href="#event">Event</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>detail</td>
            <td><code>any</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>bubbles</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>cancelable</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>composed</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>boolean</code> 

</details>

<hr />

<strong id="extend"><code>Function</code> extend</strong>

<details>
<summary>
    <code>&lt;T extends {
  prototype: <a href="#htmlelement">HTMLElement</a>
}&gt;(constructor: <a href="#t">T</a>): <a href="#componentconstructorinterface">ComponentConstructorInterface</a></code>
</summary>

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
            <td>constructor</td>
            <td><code><a href="#t">T</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#componentconstructorinterface">ComponentConstructorInterface</a></code> A proxy that extends the native constructor.

</details>

<hr />

<strong id="getproperties"><code>Function</code> getProperties</strong>

<details>
<summary>
    <code>(constructor: <a href="#withproperties">WithProperties</a>): <a href="#classfielddescriptor">ClassFieldDescriptor</a></code>
</summary>

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
            <td>constructor</td>
            <td><code><a href="#withproperties">WithProperties</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#classfielddescriptor">ClassFieldDescriptor</a></code> A list of class field descriptors.

</details>

<hr />

<strong id="getproperty"><code>Function</code> getProperty</strong>

<details>
<summary>
    <code>(constructor: <a href="#componentconstructorinterface">ComponentConstructorInterface</a>, propertyKey: string): <a href="#classfielddescriptor">ClassFieldDescriptor</a></code>
</summary>

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
            <td>constructor</td>
            <td><code><a href="#componentconstructorinterface">ComponentConstructorInterface</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>propertyKey</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#classfielddescriptor">ClassFieldDescriptor</a></code> The class field descriptor.

</details>

<hr />

<strong id="h"><code>Function</code> h</strong>

<details>
<summary>
    <code>(tagOrComponent: string | symbol | <a href="#node">Node</a> | {
  prototype: <a href="#htmlelement">HTMLElement</a>
} | <a href="#templatefunction">TemplateFunction</a>, properties: null | <a href="#hyperproperties">HyperProperties</a>, children: <a href="#templateitems">TemplateItems</a>): <a href="#hypernode">HyperNode</a></code>
</summary>

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
            <td>tagOrComponent</td>
            <td><code>string | symbol | <a href="#node">Node</a> | {
  prototype: <a href="#htmlelement">HTMLElement</a>
} | <a href="#templatefunction">TemplateFunction</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code>null | <a href="#hyperproperties">HyperProperties</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#templateitems">TemplateItems</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#hypernode">HyperNode</a></code> 

</details>

<hr />

<strong id="html"><code>Function</code> html</strong>

<details>
<summary>
    <code>(string: string | <a href="#templatestringsarray">TemplateStringsArray</a>, values: unknown[]): <a href="#template">Template</a></code>
</summary>

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
            <td>string</td>
            <td><code>string | <a href="#templatestringsarray">TemplateStringsArray</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>values</td>
            <td><code>unknown[]</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#template">Template</a></code> The virtual DOM template function.

</details>

<hr />

<strong id="iscomponent"><code>Function</code> isComponent</strong>

<details>
<summary>
    <code>(node: <a href="#withcomponentflag">WithComponentFlag</a>): node is <a href="#componentinterface">ComponentInterface</a></code>
</summary>

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
            <td>node</td>
            <td><code><a href="#withcomponentflag">WithComponentFlag</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>node is <a href="#componentinterface">ComponentInterface</a></code> 

</details>

<hr />

<strong id="iscomponentconstructor"><code>Function</code> isComponentConstructor</strong>

<details>
<summary>
    <code>(constructor: <a href="#function">Function</a>): constructor is <a href="#componentconstructorinterface">ComponentConstructorInterface</a></code>
</summary>

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
            <td>constructor</td>
            <td><code><a href="#function">Function</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>constructor is <a href="#componentconstructorinterface">ComponentConstructorInterface</a></code> 

</details>

<hr />

<strong id="property"><code>Function</code> property</strong>

<details>
<summary>
    <code>(descriptor: <a href="#classfielddescriptor">ClassFieldDescriptor</a>): (targetOrClassElement: <a href="#componentinterface">ComponentInterface</a> | <a href="#classelement">ClassElement</a>, propertyKey: string, originalDescriptor?: <a href="#classfielddescriptor">ClassFieldDescriptor</a>) => any</code>
</summary>

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
            <td>descriptor</td>
            <td><code><a href="#classfielddescriptor">ClassFieldDescriptor</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>(targetOrClassElement: <a href="#componentinterface">ComponentInterface</a> | <a href="#classelement">ClassElement</a>, propertyKey: string, originalDescriptor?: <a href="#classfielddescriptor">ClassFieldDescriptor</a>) => any</code> The decorator initializer.

</details>

<hr />

<strong id="render"><code>Function</code> render</strong>

<details>
<summary>
    <code>(input: <a href="#template">Template</a>, root: <a href="#node">Node</a>, slot: boolean): void | <a href="#node">Node</a> | <a href="#node">Node</a>[]</code>
</summary>

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
            <td>input</td>
            <td><code><a href="#template">Template</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>root</td>
            <td><code><a href="#node">Node</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>slot</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void | <a href="#node">Node</a> | <a href="#node">Node</a>[]</code> The resulting child Nodes.

</details>

<hr />

<strong id="undelegateeventlistener"><code>Function</code> undelegateEventListener</strong>

<details>
<summary>
    <code>(element: <a href="#element">Element</a>, eventName: string, selector: null | string, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void</code>
</summary>

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
            <td>element</td>
            <td><code><a href="#element">Element</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>eventName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>selector</td>
            <td><code>null | string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>callback</td>
            <td><code><a href="#delegatedeventcallback">DelegatedEventCallback</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>

<hr />

<strong id="until"><code>Function</code> until</strong>

<details>
<summary>
    <code>(thenable: <a href="#promise">Promise</a>, template: <a href="#template">Template</a>): <a href="#promise">Promise</a></code>
</summary>

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
            <td>thenable</td>
            <td><code><a href="#promise">Promise</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>template</td>
            <td><code><a href="#template">Template</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#promise">Promise</a></code> A promise which resolves the template while the Thenable is in pending status.

</details>