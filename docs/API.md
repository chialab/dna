# API Reference

<strong>Classes</strong>

<a href="#customelementregistry">CustomElementRegistry</a>

<strong>Interfaces</strong>

<a href="#componentconstructor">ComponentConstructor</a>

<strong>Types</strong>

<a href="#asyncevent">AsyncEvent</a>, <a href="#componentinstance">ComponentInstance</a>, <a href="#context">Context</a>, <a href="#delegatedeventcallback">DelegatedEventCallback</a>, <a href="#delegatedeventdescriptor">DelegatedEventDescriptor</a>, <a href="#functioncomponent">FunctionComponent</a>, <a href="#observable">Observable</a>, <a href="#propertydeclaration">PropertyDeclaration</a>, <a href="#propertyobserver">PropertyObserver</a>, <a href="#template">Template</a>, <a href="#vclasses">VClasses</a>, <a href="#vcomponent">VComponent</a>, <a href="#velement">VElement</a>, <a href="#vfragment">VFragment</a>, <a href="#vfunction">VFunction</a>, <a href="#vobject">VObject</a>, <a href="#vproperties">VProperties</a>, <a href="#vslot">VSlot</a>, <a href="#vstyle">VStyle</a>, <a href="#vtag">VTag</a>

<strong>Variables</strong>

<a href="#component">Component</a>, <a href="#dom">DOM</a>, <a href="#fragment">Fragment</a>, <a href="#customelements">customElements</a>, <a href="#window">window</a>

<strong>Functions</strong>

<a href="#compile">compile</a>, <a href="#connect">connect</a>, <a href="#css">css</a>, <a href="#customelement">customElement</a>, <a href="#definelisteners">defineListeners</a>, <a href="#defineproperties">defineProperties</a>, <a href="#defineproperty">defineProperty</a>, <a href="#delegateeventlistener">delegateEventListener</a>, <a href="#disconnect">disconnect</a>, <a href="#dispatchasyncevent">dispatchAsyncEvent</a>, <a href="#dispatchevent">dispatchEvent</a>, <a href="#extend">extend</a>, <a href="#getproperties">getProperties</a>, <a href="#getproperty">getProperty</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#iscomponent">isComponent</a>, <a href="#iscomponentconstructor">isComponentConstructor</a>, <a href="#listen">listen</a>, <a href="#observe">observe</a>, <a href="#parsedom">parseDOM</a>, <a href="#property">property</a>, <a href="#render">render</a>, <a href="#state">state</a>, <a href="#undelegateeventlistener">undelegateEventListener</a>, <a href="#until">until</a>

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
    <code>&lt;T extends <a href="#customelementconstructor">CustomElementConstructor</a>&gt;(name: string, constructor: <a href="#t">T</a>, options: <a href="#elementdefinitionoptions">ElementDefinitionOptions</a>): void</code>
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
            <td><code><a href="#t">T</a></code></td>
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
    <code>&lt;K extends string&gt;(name: <a href="#k">K</a>): <a href="#customelementconstructor">CustomElementConstructor</a></code>
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
            <td><code><a href="#k">K</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#customelementconstructor">CustomElementConstructor</a></code> The definition for the given tag.

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
    <code>&lt;K extends string&gt;(name: <a href="#k">K</a>): <a href="#promise">Promise</a></code>
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
            <td><code><a href="#k">K</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#promise">Promise</a></code> A Promise that resolves when the named element is defined.

</details>

<hr />

<span id="componentconstructor"><code>Interface</code> ComponentConstructor</span>

<hr />

<strong id="asyncevent"><code>Type</code> AsyncEvent</strong>
    
<p>

Async event interface.

</p>

<pre><a href="#event">Event</a> & {
  respondWith(callback: () => <a href="#promise">Promise</a>): void
}</pre>

<hr />

<strong id="componentinstance"><code>Type</code> ComponentInstance&lt;T extends <a href="#htmlelement">HTMLElement</a>&gt;</strong>
    
<p>

The basic DNA Component interface.
It's a Custom Element, but with some extra useful method.

</p>

<pre><a href="#customelement">CustomElement</a> & <a href="#componentmixin">ComponentMixin</a></pre>

<strong>See also</strong>

* [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.

<hr />

<strong id="context"><code>Type</code> Context&lt;T extends <a href="#node">Node</a>, P, S&gt;</strong>
    
<p>

The node context interface.

</p>

<pre>{
  Function?: <a href="#functioncomponent">FunctionComponent</a>;
  __proto__: {
    clear: ;
    delete: ;
    forEach: ;
    get: ;
    has: ;
    set: ;
    size: number
  };
  childNodes?: <a href="#iterablenodelist">IterableNodeList</a>;
  end?: <a href="#node">Node</a>;
  fragments: <a href="#context">Context</a>[];
  is?: string;
  isElement?: boolean;
  isText?: boolean;
  key?: unknown;
  node: <a href="#t">T</a>;
  parent?: <a href="#context">Context</a>;
  properties: [<a href="#weakmap">WeakMap</a>, <a href="#weakmap">WeakMap</a>];
  requestUpdate?: <a href="#updaterequest">UpdateRequest</a>;
  root?: <a href="#context">Context</a>;
  slotChildNodes?: <a href="#iterablenodelist">IterableNodeList</a>;
  start?: <a href="#node">Node</a>;
  store: <a href="#s">S</a>;
  tagName?: string
}</pre>

<hr />

<strong id="delegatedeventcallback"><code>Type</code> DelegatedEventCallback</strong>
    

<pre>(event: <a href="#event">Event</a>, target?: <a href="#node">Node</a>) => unknown</pre>

<hr />

<strong id="delegatedeventdescriptor"><code>Type</code> DelegatedEventDescriptor</strong>
    
<p>

A descriptor for an event delegation.

</p>

<pre><a href="#addeventlisteneroptions">AddEventListenerOptions</a> & {
  callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>;
  target?: <a href="#eventtarget">EventTarget</a>
}</pre>

<hr />

<strong id="functioncomponent"><code>Type</code> FunctionComponent&lt;P&gt;</strong>
    

<pre>(props: <a href="#p">P</a>, context: <a href="#context">Context</a>, requestUpdate: <a href="#updaterequest">UpdateRequest</a>, isAttached: () => boolean, sameContext: <a href="#context">Context</a>) => <a href="#template">Template</a></pre>

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

<strong id="propertydeclaration"><code>Type</code> PropertyDeclaration&lt;TypeConstructorHint extends <a href="#constructor">Constructor</a>&gt;</strong>
    
<p>

A state property declaration.

</p>

<pre><a href="#propertydescriptor">PropertyDescriptor</a> & {
  attribute?: boolean | string;
  defaultValue?: <a href="#convertconstructortypes">ConvertConstructorTypes</a>;
  event?: true | string;
  get?: ;
  initializer?: <a href="#function">Function</a>;
  observe?: <a href="#propertyobserver">PropertyObserver</a>;
  observers?: <a href="#propertyobserver">PropertyObserver</a>[];
  set?: ;
  state?: boolean;
  symbol?: symbol;
  type?: <a href="#typeconstructorhint">TypeConstructorHint</a> | <a href="#typeconstructorhint">TypeConstructorHint</a>[];
  fromAttribute(value: null | string): undefined | <a href="#convertconstructortypes">ConvertConstructorTypes</a>;
  getter(value?: <a href="#convertconstructortypes">ConvertConstructorTypes</a>): any;
  setter(newValue?: any): <a href="#convertconstructortypes">ConvertConstructorTypes</a>;
  toAttribute(value: <a href="#convertconstructortypes">ConvertConstructorTypes</a>): undefined | null | string;
  validate(value: unknown): boolean
}</pre>

<hr />

<strong id="propertyobserver"><code>Type</code> PropertyObserver&lt;TypeHint&gt;</strong>
    

<pre>(oldValue: <a href="#typehint">TypeHint</a> | undefined, newValue: <a href="#typehint">TypeHint</a>, propertyKey: string) => void</pre>

<hr />

<strong id="template"><code>Type</code> Template</strong>
    
<p>

A generic template. Can be a single atomic item or a list of items.

</p>

<pre><a href="#element">Element</a> | <a href="#text">Text</a> | <a href="#node">Node</a> | <a href="#vfragment">VFragment</a> | <a href="#vfunction">VFunction</a> | <a href="#vcomponent">VComponent</a> | <a href="#velement">VElement</a> | <a href="#vslot">VSlot</a> | <a href="#vtag">VTag</a> | <a href="#promise">Promise</a> | <a href="#observable">Observable</a> | string | number | boolean | undefined | null | <a href="#template">Template</a>[]</pre>

<hr />

<strong id="vclasses"><code>Type</code> VClasses</strong>
    
<p>

Classes dictionary.

</p>

<pre>string | boolean | undefined</pre>

<hr />

<strong id="vcomponent"><code>Type</code> VComponent&lt;T extends <a href="#customelementconstructor">CustomElementConstructor</a>&gt;</strong>
    
<p>

The interface of a Component constructor used as JSX tag.

</p>

<pre>{
  Component: <a href="#t">T</a>;
  Function?: undefined;
  [V_SYM]: true;
  children: <a href="#template">Template</a>[];
  isFragment?: false;
  isSlot?: false;
  key?: unknown;
  namespaceURI?: string;
  node?: undefined;
  properties: <a href="#vproperties">VProperties</a>;
  tag?: undefined
}</pre>

<hr />

<strong id="velement"><code>Type</code> VElement&lt;T extends <a href="#element">Element</a>&gt;</strong>
    
<p>

The interface of an HTML node used as JSX tag.

</p>

<pre>{
  Component?: undefined;
  Function?: undefined;
  [V_SYM]: true;
  children: <a href="#template">Template</a>[];
  isFragment?: false;
  isSlot?: false;
  key?: unknown;
  namespaceURI?: string;
  node: <a href="#t">T</a>;
  properties: <a href="#vproperties">VProperties</a>;
  tag?: undefined
}</pre>

<hr />

<strong id="vfragment"><code>Type</code> VFragment</strong>
    
<p>

The interface of a JSX fragment node.

</p>

<pre>{
  Component?: undefined;
  Function?: undefined;
  [V_SYM]: true;
  children: <a href="#template">Template</a>[];
  isFragment: true;
  isSlot?: false;
  key?: unknown;
  node?: undefined;
  properties?: {
  
  };
  tag?: undefined
}</pre>

<hr />

<strong id="vfunction"><code>Type</code> VFunction&lt;T extends <a href="#functioncomponent">FunctionComponent</a>&gt;</strong>
    
<p>

The interface of a functional component.

</p>

<pre>{
  Component?: undefined;
  Function: <a href="#t">T</a>;
  [V_SYM]: true;
  children: <a href="#template">Template</a>[];
  isFragment?: false;
  isSlot?: false;
  key?: unknown;
  namespaceURI?: string;
  node?: undefined;
  properties: <a href="#vproperties">VProperties</a>;
  tag?: undefined
}</pre>

<hr />

<strong id="vobject"><code>Type</code> VObject</strong>
    
<p>

Generic virtual dom object.

</p>

<pre><a href="#vfunction">VFunction</a> | <a href="#vcomponent">VComponent</a> | <a href="#velement">VElement</a> | <a href="#vslot">VSlot</a> | <a href="#vtag">VTag</a> | <a href="#vfragment">VFragment</a></pre>

<hr />

<strong id="vproperties"><code>Type</code> VProperties&lt;T&gt;</strong>
    
<p>

Properties that can be assigned to a node through the render engine.

</p>

<pre><a href="#omit">Omit</a> & {
  children?: <a href="#template">Template</a> | <a href="#template">Template</a>[];
  class?: <a href="#vclasses">VClasses</a>;
  is?: string;
  key?: unknown;
  ref?: <a href="#element">Element</a>;
  slot?: string;
  style?: <a href="#vstyle">VStyle</a>;
  xmlns?: string
}</pre>

<hr />

<strong id="vslot"><code>Type</code> VSlot</strong>
    
<p>

The interface of slot element.

</p>

<pre>{
  Component?: undefined;
  Function?: undefined;
  [V_SYM]: true;
  children: <a href="#template">Template</a>[];
  isFragment?: false;
  isSlot: true;
  key?: unknown;
  node?: undefined;
  properties: <a href="#vproperties">VProperties</a>;
  tag: slot
}</pre>

<hr />

<strong id="vstyle"><code>Type</code> VStyle</strong>
    
<p>

Styles dictionary.

</p>

<pre>string | string | undefined</pre>

<hr />

<strong id="vtag"><code>Type</code> VTag&lt;T extends &gt;</strong>
    
<p>

The interface of a generic JSX tag.

</p>

<pre>{
  Component?: undefined;
  Function?: undefined;
  [V_SYM]: true;
  children: <a href="#template">Template</a>[];
  isFragment?: false;
  isSlot?: false;
  key?: unknown;
  namespaceURI?: string;
  node?: undefined;
  properties: <a href="#vproperties">VProperties</a>;
  tag: <a href="#t">T</a>
}</pre>

<hr />

<strong id="component"><code>Variable</code> Component</strong>
    
<p>

The DNA base Component constructor, a Custom Element constructor with
declarative properties and event delegations, custom template and
a complete life cycle implementation.
All DNA components **must** extends this class.

</p>

<pre><a href="#componentconstructor">ComponentConstructor</a></pre>

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
  createElement&lt;K extends &gt;(qualifiedName: <a href="#k">K</a>, options?: <a href="#elementcreationoptions">ElementCreationOptions</a>): ;
  createElementNS(namespaceURI: null | string, qualifiedName: string): <a href="#element">Element</a>;
  createEvent(typeArg: string, eventInitDict: <a href="#customeventinit">CustomEventInit</a>): <a href="#customevent">CustomEvent</a>;
  getAttribute(element: <a href="#element">Element</a>, qualifiedName: string): null | string;
  hasAttribute(element: <a href="#element">Element</a>, qualifiedName: string): boolean;
  insertAdjacentElement(parent: <a href="#element">Element</a>, position: <a href="#insertposition">InsertPosition</a>, insertedElement: <a href="#element">Element</a>, slot: boolean): null | <a href="#element">Element</a>;
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

<pre></pre>

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

<strong id="compile"><code>Function</code> compile</strong>

<details>
<summary>
    <code>(string: string): <a href="#template">Template</a></code>
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
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#template">Template</a></code> The virtual DOM template.

</details>

<hr />

<strong id="connect"><code>Function</code> connect</strong>

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
    <code>(name: string, options?: <a href="#elementdefinitionoptions">ElementDefinitionOptions</a>): &lt;T extends <a href="#componentconstructor">ComponentConstructor</a>&gt;(classOrDescriptor: <a href="#t">T</a> | <a href="#classdescriptor">ClassDescriptor</a>) => any</code>
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

<strong>Returns</strong>: <code>&lt;T extends <a href="#componentconstructor">ComponentConstructor</a>&gt;(classOrDescriptor: <a href="#t">T</a> | <a href="#classdescriptor">ClassDescriptor</a>) => any</code> The decorated component class.

</details>

<hr />

<strong id="definelisteners"><code>Function</code> defineListeners</strong>

<details>
<summary>
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>&gt;(prototype: <a href="#t">T</a>): void</code>
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
            <td>prototype</td>
            <td><code><a href="#t">T</a></code></td>
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
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>&gt;(prototype: <a href="#t">T</a>): void</code>
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
            <td>prototype</td>
            <td><code><a href="#t">T</a></code></td>
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
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>, P extends string | number | symbol&gt;(prototype: <a href="#withproperties">WithProperties</a>, propertyKey: <a href="#p">P</a>, declaration: <a href="#propertydeclaration">PropertyDeclaration</a>, symbolKey: symbol): <a href="#propertydescriptor">PropertyDescriptor</a></code>
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
            <td>prototype</td>
            <td><code><a href="#withproperties">WithProperties</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>propertyKey</td>
            <td><code><a href="#p">P</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>declaration</td>
            <td><code><a href="#propertydeclaration">PropertyDeclaration</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>symbolKey</td>
            <td><code>symbol</code></td>
            <td align="center"></td>
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
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a>&gt;(constructor: <a href="#constructor">Constructor</a>): <a href="#componentconstructor">ComponentConstructor</a></code>
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
            <td><code><a href="#constructor">Constructor</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#componentconstructor">ComponentConstructor</a></code> A proxy that extends the native constructor.

</details>

<hr />

<strong id="getproperties"><code>Function</code> getProperties</strong>

<details>
<summary>
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>&gt;(prototype: <a href="#withproperties">WithProperties</a>): <a href="#propertiesof">PropertiesOf</a></code>
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
            <td>prototype</td>
            <td><code><a href="#withproperties">WithProperties</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#propertiesof">PropertiesOf</a></code> A list of property descriptors.

</details>

<hr />

<strong id="getproperty"><code>Function</code> getProperty</strong>

<details>
<summary>
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>, P extends string | number | symbol&gt;(prototype: <a href="#t">T</a>, propertyKey: <a href="#p">P</a>, failIfMissing: boolean): </code>
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
            <td>prototype</td>
            <td><code><a href="#t">T</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>propertyKey</td>
            <td><code><a href="#p">P</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>failIfMissing</td>
            <td><code>boolean</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code></code> The property declaration.

</details>

<hr />

<strong id="h"><code>Function</code> h</strong>

<details>
<summary>
    <code>(tagOrComponent: <a href="#fragment">Fragment</a>): <a href="#vfragment">VFragment</a></code>
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
            <td><code><a href="#fragment">Fragment</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#vfragment">VFragment</a></code> 

</details>
<details>
<summary>
    <code>(tagOrComponent: <a href="#fragment">Fragment</a>, properties: null, children: <a href="#template">Template</a>[]): <a href="#vfragment">VFragment</a></code>
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
            <td><code><a href="#fragment">Fragment</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code>null</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#template">Template</a>[]</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#vfragment">VFragment</a></code> 

</details>
<details>
<summary>
    <code>&lt;T extends <a href="#functioncomponent">FunctionComponent</a>&gt;(tagOrComponent: <a href="#t">T</a>, properties?: <a href="#vproperties">VProperties</a> | null, children: <a href="#template">Template</a>[]): <a href="#vfunction">VFunction</a></code>
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
            <td><code><a href="#t">T</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code><a href="#vproperties">VProperties</a> | null</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#template">Template</a>[]</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#vfunction">VFunction</a></code> 

</details>
<details>
<summary>
    <code>&lt;T extends <a href="#customelementconstructor">CustomElementConstructor</a>&gt;(tagOrComponent: <a href="#t">T</a>, properties?: <a href="#vproperties">VProperties</a> | null, children: <a href="#template">Template</a>[]): <a href="#vcomponent">VComponent</a></code>
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
            <td><code><a href="#t">T</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code><a href="#vproperties">VProperties</a> | null</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#template">Template</a>[]</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#vcomponent">VComponent</a></code> 

</details>
<details>
<summary>
    <code>&lt;T extends <a href="#element">Element</a>&gt;(tagOrComponent: <a href="#t">T</a>, properties?: <a href="#vproperties">VProperties</a> | null, children: <a href="#template">Template</a>[]): <a href="#velement">VElement</a></code>
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
            <td><code><a href="#t">T</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code><a href="#vproperties">VProperties</a> | null</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#template">Template</a>[]</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#velement">VElement</a></code> 

</details>
<details>
<summary>
    <code>(tagOrComponent: slot, properties?: <a href="#vproperties">VProperties</a> | null, children: <a href="#template">Template</a>[]): <a href="#vslot">VSlot</a></code>
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
            <td><code>slot</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code><a href="#vproperties">VProperties</a> | null</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#template">Template</a>[]</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#vslot">VSlot</a></code> 

</details>
<details>
<summary>
    <code>&lt;T extends symbol |  | circle | clipPath | defs | desc | ellipse | feBlend | feColorMatrix | feComponentTransfer | feComposite | feConvolveMatrix | feDiffuseLighting | feDisplacementMap | feDistantLight | feFlood | feFuncA | feFuncB | feFuncG | feFuncR | feGaussianBlur | feImage | feMerge | feMergeNode | feMorphology | feOffset | fePointLight | feSpecularLighting | feSpotLight | feTile | feTurbulence | filter | foreignObject | g | image | line | linearGradient | marker | mask | metadata | path | pattern | polygon | polyline | radialGradient | rect | stop | svg | switch | text | textPath | tspan | use | view | big | keygen | menuitem | noindex | animate | animateMotion | animateTransform | feDropShadow | mpath&gt;(tagOrComponent: <a href="#t">T</a>, properties?: <a href="#vproperties">VProperties</a> | null, children: <a href="#template">Template</a>[]): <a href="#vtag">VTag</a></code>
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
            <td><code><a href="#t">T</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code><a href="#vproperties">VProperties</a> | null</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#template">Template</a>[]</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#vtag">VTag</a></code> 

</details>

<hr />

<strong id="html"><code>Function</code> html</strong>

<details>
<summary>
    <code>(string: <a href="#templatestringsarray">TemplateStringsArray</a>, values: unknown[]): <a href="#template">Template</a></code>
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
            <td><code><a href="#templatestringsarray">TemplateStringsArray</a></code></td>
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

<strong>Returns</strong>: <code><a href="#template">Template</a></code> The virtual DOM template.

</details>
<details>
<summary>
    <code>(string: string): <a href="#template">Template</a></code>
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
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#template">Template</a></code> The virtual DOM template.

</details>

<hr />

<strong id="iscomponent"><code>Function</code> isComponent</strong>

<details>
<summary>
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>&gt;(node: <a href="#node">Node</a> | <a href="#t">T</a>): node is <a href="#t">T</a></code>
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
            <td><code><a href="#node">Node</a> | <a href="#t">T</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>node is <a href="#t">T</a></code> 

</details>

<hr />

<strong id="iscomponentconstructor"><code>Function</code> isComponentConstructor</strong>

<details>
<summary>
    <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>, C extends <a href="#componentconstructor">ComponentConstructor</a>&gt;(constructor: <a href="#function">Function</a> | <a href="#c">C</a>): constructor is <a href="#c">C</a></code>
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
            <td><code><a href="#function">Function</a> | <a href="#c">C</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>constructor is <a href="#c">C</a></code> 

</details>

<hr />

<strong id="listen"><code>Function</code> listen</strong>

<details>
<summary>
    <code>(eventName: string, options?: <a href="#addeventlisteneroptions">AddEventListenerOptions</a>): <a href="#function">Function</a></code>
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
            <td>eventName</td>
            <td><code>string</code></td>
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

<strong>Returns</strong>: <code><a href="#function">Function</a></code> The decorator initializer.

</details>
<details>
<summary>
    <code>(eventName: string, selector: string, options?: <a href="#addeventlisteneroptions">AddEventListenerOptions</a>): <a href="#function">Function</a></code>
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
            <td>eventName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>selector</td>
            <td><code>string</code></td>
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

<strong>Returns</strong>: <code><a href="#function">Function</a></code> The decorator initializer.

</details>
<details>
<summary>
    <code>(eventName: string, target: <a href="#eventtarget">EventTarget</a>, options?: <a href="#addeventlisteneroptions">AddEventListenerOptions</a>): <a href="#function">Function</a></code>
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
            <td>eventName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>target</td>
            <td><code><a href="#eventtarget">EventTarget</a></code></td>
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

<strong>Returns</strong>: <code><a href="#function">Function</a></code> The decorator initializer.

</details>

<hr />

<strong id="observe"><code>Function</code> observe</strong>

<details>
<summary>
    <code>(propertyKey: string): <a href="#function">Function</a></code>
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
            <td>propertyKey</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#function">Function</a></code> The decorator initializer.

</details>

<hr />

<strong id="parsedom"><code>Function</code> parseDOM</strong>

<details>
<summary>
    <code>(string: string): <a href="#template">Template</a></code>
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
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#template">Template</a></code> The virtual DOM template function.

</details>

<hr />

<strong id="property"><code>Function</code> property</strong>

<details>
<summary>
    <code>&lt;TypeConstructorHint extends <a href="#constructor">Constructor</a>&gt;(declaration: <a href="#propertydeclaration">PropertyDeclaration</a>): &lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>, P extends string | number | symbol&gt;(targetOrClassElement: <a href="#t">T</a>, propertyKey?: <a href="#p">P</a>, descriptor?: <a href="#propertydeclaration">PropertyDeclaration</a>) => any</code>
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
            <td>declaration</td>
            <td><code><a href="#propertydeclaration">PropertyDeclaration</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {   is: string;   attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;   connectedCallback(): void;   disconnectedCallback(): void } & <a href="#componentmixin">ComponentMixin</a>, P extends string | number | symbol&gt;(targetOrClassElement: <a href="#t">T</a>, propertyKey?: <a href="#p">P</a>, descriptor?: <a href="#propertydeclaration">PropertyDeclaration</a>) => any</code> The decorator initializer.

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

<strong id="state"><code>Function</code> state</strong>

<details>
<summary>
    <code>&lt;TypeConstructorHint extends <a href="#constructor">Constructor</a>&gt;(declaration: <a href="#propertydeclaration">PropertyDeclaration</a>): &lt;T extends <a href="#htmlelement">HTMLElement</a> & {
  is: string;
  attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
  connectedCallback(): void;
  disconnectedCallback(): void
} & <a href="#componentmixin">ComponentMixin</a>, P extends string | number | symbol&gt;(targetOrClassElement: <a href="#t">T</a>, propertyKey?: <a href="#p">P</a>, descriptor?: <a href="#propertydeclaration">PropertyDeclaration</a>) => any</code>
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
            <td>declaration</td>
            <td><code><a href="#propertydeclaration">PropertyDeclaration</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>&lt;T extends <a href="#htmlelement">HTMLElement</a> & {   is: string;   attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;   connectedCallback(): void;   disconnectedCallback(): void } & <a href="#componentmixin">ComponentMixin</a>, P extends string | number | symbol&gt;(targetOrClassElement: <a href="#t">T</a>, propertyKey?: <a href="#p">P</a>, descriptor?: <a href="#propertydeclaration">PropertyDeclaration</a>) => any</code> The decorator initializer.

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
