# API Reference

<strong>Namespaces</strong>

<a href="#jsx">JSX</a>

<strong>Classes</strong>

<a href="#customelementregistry">CustomElementRegistry</a>

<strong>Interfaces</strong>

<a href="#anchorhtmlattributes">AnchorHTMLAttributes</a>, <a href="#areahtmlattributes">AreaHTMLAttributes</a>, <a href="#ariaattributes">AriaAttributes</a>, <a href="#basehtmlattributes">BaseHTMLAttributes</a>, <a href="#blockquotehtmlattributes">BlockquoteHTMLAttributes</a>, <a href="#buttonhtmlattributes">ButtonHTMLAttributes</a>, <a href="#canvashtmlattributes">CanvasHTMLAttributes</a>, <a href="#colhtmlattributes">ColHTMLAttributes</a>, <a href="#colgrouphtmlattributes">ColgroupHTMLAttributes</a>, <a href="#componentconstructor">ComponentConstructor</a>, <a href="#datahtmlattributes">DataHTMLAttributes</a>, <a href="#delhtmlattributes">DelHTMLAttributes</a>, <a href="#detailshtmlattributes">DetailsHTMLAttributes</a>, <a href="#dialoghtmlattributes">DialogHTMLAttributes</a>, <a href="#embedhtmlattributes">EmbedHTMLAttributes</a>, <a href="#fieldsethtmlattributes">FieldsetHTMLAttributes</a>, <a href="#formhtmlattributes">FormHTMLAttributes</a>, <a href="#htmlattributes">HTMLAttributes</a>, <a href="#htmltagnamemap">HTMLTagNameMap</a>, <a href="#htmlhtmlattributes">HtmlHTMLAttributes</a>, <a href="#iframehtmlattributes">IframeHTMLAttributes</a>, <a href="#imghtmlattributes">ImgHTMLAttributes</a>, <a href="#inputhtmlattributes">InputHTMLAttributes</a>, <a href="#inshtmlattributes">InsHTMLAttributes</a>, <a href="#keygenhtmlattributes">KeygenHTMLAttributes</a>, <a href="#labelhtmlattributes">LabelHTMLAttributes</a>, <a href="#lihtmlattributes">LiHTMLAttributes</a>, <a href="#linkhtmlattributes">LinkHTMLAttributes</a>, <a href="#maphtmlattributes">MapHTMLAttributes</a>, <a href="#mediahtmlattributes">MediaHTMLAttributes</a>, <a href="#menuhtmlattributes">MenuHTMLAttributes</a>, <a href="#metahtmlattributes">MetaHTMLAttributes</a>, <a href="#meterhtmlattributes">MeterHTMLAttributes</a>, <a href="#objecthtmlattributes">ObjectHTMLAttributes</a>, <a href="#olhtmlattributes">OlHTMLAttributes</a>, <a href="#optgrouphtmlattributes">OptgroupHTMLAttributes</a>, <a href="#optionhtmlattributes">OptionHTMLAttributes</a>, <a href="#outputhtmlattributes">OutputHTMLAttributes</a>, <a href="#paramhtmlattributes">ParamHTMLAttributes</a>, <a href="#progresshtmlattributes">ProgressHTMLAttributes</a>, <a href="#quotehtmlattributes">QuoteHTMLAttributes</a>, <a href="#svgattributes">SVGAttributes</a>, <a href="#svgtagnamemap">SVGTagNameMap</a>, <a href="#scripthtmlattributes">ScriptHTMLAttributes</a>, <a href="#selecthtmlattributes">SelectHTMLAttributes</a>, <a href="#slothtmlattributes">SlotHTMLAttributes</a>, <a href="#sourcehtmlattributes">SourceHTMLAttributes</a>, <a href="#stylehtmlattributes">StyleHTMLAttributes</a>, <a href="#tablehtmlattributes">TableHTMLAttributes</a>, <a href="#tdhtmlattributes">TdHTMLAttributes</a>, <a href="#textareahtmlattributes">TextareaHTMLAttributes</a>, <a href="#thhtmlattributes">ThHTMLAttributes</a>, <a href="#timehtmlattributes">TimeHTMLAttributes</a>, <a href="#trackhtmlattributes">TrackHTMLAttributes</a>, <a href="#videohtmlattributes">VideoHTMLAttributes</a>

<strong>Types</strong>

<a href="#ariarole">AriaRole</a>, <a href="#asyncevent">AsyncEvent</a>, <a href="#attributesmap">AttributesMap</a>, <a href="#componentinstance">ComponentInstance</a>, <a href="#context">Context</a>, <a href="#delegatedeventcallback">DelegatedEventCallback</a>, <a href="#delegatedeventdescriptor">DelegatedEventDescriptor</a>, <a href="#functioncomponent">FunctionComponent</a>, <a href="#globalnamespace">GlobalNamespace</a>, <a href="#htmlattributereferrerpolicy">HTMLAttributeReferrerPolicy</a>, <a href="#observable">Observable</a>, <a href="#propertydeclaration">PropertyDeclaration</a>, <a href="#propertyobserver">PropertyObserver</a>, <a href="#template">Template</a>, <a href="#vattrs">VAttrs</a>, <a href="#vcomponent">VComponent</a>, <a href="#velement">VElement</a>, <a href="#vfragment">VFragment</a>, <a href="#vfunction">VFunction</a>, <a href="#vobject">VObject</a>, <a href="#vproperties">VProperties</a>, <a href="#vprops">VProps</a>, <a href="#vslot">VSlot</a>, <a href="#vtag">VTag</a>

<strong>Variables</strong>

<a href="#component">Component</a>, <a href="#customevent">CustomEvent</a>, <a href="#dom">DOM</a>, <a href="#event">Event</a>, <a href="#fragment">Fragment</a>, <a href="#htmlelement">HTMLElement</a>, <a href="#node">Node</a>, <a href="#customelements">customElements</a>, <a href="#document">document</a>, <a href="#window">window</a>

<strong>Functions</strong>

<a href="#compile">compile</a>, <a href="#connect">connect</a>, <a href="#css">css</a>, <a href="#customelement">customElement</a>, <a href="#definelisteners">defineListeners</a>, <a href="#defineproperties">defineProperties</a>, <a href="#defineproperty">defineProperty</a>, <a href="#delegateeventlistener">delegateEventListener</a>, <a href="#disconnect">disconnect</a>, <a href="#dispatchasyncevent">dispatchAsyncEvent</a>, <a href="#dispatchevent">dispatchEvent</a>, <a href="#extend">extend</a>, <a href="#getproperties">getProperties</a>, <a href="#getproperty">getProperty</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#iscomponent">isComponent</a>, <a href="#iscomponentconstructor">isComponentConstructor</a>, <a href="#listen">listen</a>, <a href="#observe">observe</a>, <a href="#parsedom">parseDOM</a>, <a href="#property">property</a>, <a href="#render">render</a>, <a href="#state">state</a>, <a href="#undelegateeventlistener">undelegateEventListener</a>, <a href="#until">until</a>

<hr />

<span id="jsx"><code>Namespace</code> JSX</span>

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

<p>

Create registry instance.

</p>

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

<span id="anchorhtmlattributes"><code>Interface</code> AnchorHTMLAttributes</span>

<hr />

<span id="areahtmlattributes"><code>Interface</code> AreaHTMLAttributes</span>

<hr />

<span id="ariaattributes"><code>Interface</code> AriaAttributes</span>

<hr />

<span id="basehtmlattributes"><code>Interface</code> BaseHTMLAttributes</span>

<hr />

<span id="blockquotehtmlattributes"><code>Interface</code> BlockquoteHTMLAttributes</span>

<hr />

<span id="buttonhtmlattributes"><code>Interface</code> ButtonHTMLAttributes</span>

<hr />

<span id="canvashtmlattributes"><code>Interface</code> CanvasHTMLAttributes</span>

<hr />

<span id="colhtmlattributes"><code>Interface</code> ColHTMLAttributes</span>

<hr />

<span id="colgrouphtmlattributes"><code>Interface</code> ColgroupHTMLAttributes</span>

<hr />

<span id="componentconstructor"><code>Interface</code> ComponentConstructor</span>

<hr />

<span id="datahtmlattributes"><code>Interface</code> DataHTMLAttributes</span>

<hr />

<span id="delhtmlattributes"><code>Interface</code> DelHTMLAttributes</span>

<hr />

<span id="detailshtmlattributes"><code>Interface</code> DetailsHTMLAttributes</span>

<hr />

<span id="dialoghtmlattributes"><code>Interface</code> DialogHTMLAttributes</span>

<hr />

<span id="embedhtmlattributes"><code>Interface</code> EmbedHTMLAttributes</span>

<hr />

<span id="fieldsethtmlattributes"><code>Interface</code> FieldsetHTMLAttributes</span>

<hr />

<span id="formhtmlattributes"><code>Interface</code> FormHTMLAttributes</span>

<hr />

<span id="htmlattributes"><code>Interface</code> HTMLAttributes</span>

<hr />

<span id="htmltagnamemap"><code>Interface</code> HTMLTagNameMap</span>

<hr />

<span id="htmlhtmlattributes"><code>Interface</code> HtmlHTMLAttributes</span>

<hr />

<span id="iframehtmlattributes"><code>Interface</code> IframeHTMLAttributes</span>

<hr />

<span id="imghtmlattributes"><code>Interface</code> ImgHTMLAttributes</span>

<hr />

<span id="inputhtmlattributes"><code>Interface</code> InputHTMLAttributes</span>

<hr />

<span id="inshtmlattributes"><code>Interface</code> InsHTMLAttributes</span>

<hr />

<span id="keygenhtmlattributes"><code>Interface</code> KeygenHTMLAttributes</span>

<hr />

<span id="labelhtmlattributes"><code>Interface</code> LabelHTMLAttributes</span>

<hr />

<span id="lihtmlattributes"><code>Interface</code> LiHTMLAttributes</span>

<hr />

<span id="linkhtmlattributes"><code>Interface</code> LinkHTMLAttributes</span>

<hr />

<span id="maphtmlattributes"><code>Interface</code> MapHTMLAttributes</span>

<hr />

<span id="mediahtmlattributes"><code>Interface</code> MediaHTMLAttributes</span>

<hr />

<span id="menuhtmlattributes"><code>Interface</code> MenuHTMLAttributes</span>

<hr />

<span id="metahtmlattributes"><code>Interface</code> MetaHTMLAttributes</span>

<hr />

<span id="meterhtmlattributes"><code>Interface</code> MeterHTMLAttributes</span>

<hr />

<span id="objecthtmlattributes"><code>Interface</code> ObjectHTMLAttributes</span>

<hr />

<span id="olhtmlattributes"><code>Interface</code> OlHTMLAttributes</span>

<hr />

<span id="optgrouphtmlattributes"><code>Interface</code> OptgroupHTMLAttributes</span>

<hr />

<span id="optionhtmlattributes"><code>Interface</code> OptionHTMLAttributes</span>

<hr />

<span id="outputhtmlattributes"><code>Interface</code> OutputHTMLAttributes</span>

<hr />

<span id="paramhtmlattributes"><code>Interface</code> ParamHTMLAttributes</span>

<hr />

<span id="progresshtmlattributes"><code>Interface</code> ProgressHTMLAttributes</span>

<hr />

<span id="quotehtmlattributes"><code>Interface</code> QuoteHTMLAttributes</span>

<hr />

<span id="svgattributes"><code>Interface</code> SVGAttributes</span>

<hr />

<span id="svgtagnamemap"><code>Interface</code> SVGTagNameMap</span>

<hr />

<span id="scripthtmlattributes"><code>Interface</code> ScriptHTMLAttributes</span>

<hr />

<span id="selecthtmlattributes"><code>Interface</code> SelectHTMLAttributes</span>

<hr />

<span id="slothtmlattributes"><code>Interface</code> SlotHTMLAttributes</span>

<hr />

<span id="sourcehtmlattributes"><code>Interface</code> SourceHTMLAttributes</span>

<hr />

<span id="stylehtmlattributes"><code>Interface</code> StyleHTMLAttributes</span>

<hr />

<span id="tablehtmlattributes"><code>Interface</code> TableHTMLAttributes</span>

<hr />

<span id="tdhtmlattributes"><code>Interface</code> TdHTMLAttributes</span>

<hr />

<span id="textareahtmlattributes"><code>Interface</code> TextareaHTMLAttributes</span>

<hr />

<span id="thhtmlattributes"><code>Interface</code> ThHTMLAttributes</span>

<hr />

<span id="timehtmlattributes"><code>Interface</code> TimeHTMLAttributes</span>

<hr />

<span id="trackhtmlattributes"><code>Interface</code> TrackHTMLAttributes</span>

<hr />

<span id="videohtmlattributes"><code>Interface</code> VideoHTMLAttributes</span>

<hr />

<strong id="ariarole"><code>Type</code> AriaRole</strong>
    

<pre>alert | alertdialog | application | article | banner | button | cell | checkbox | columnheader | combobox | complementary | contentinfo | definition | dialog | directory | document | feed | figure | form | grid | gridcell | group | heading | img | link | list | listbox | listitem | log | main | marquee | math | menu | menubar | menuitem | menuitemcheckbox | menuitemradio | navigation | none | note | option | presentation | progressbar | radio | radiogroup | region | row | rowgroup | rowheader | scrollbar | search | searchbox | separator | slider | spinbutton | status | switch | tab | table | tablist | tabpanel | term | textbox | timer | toolbar | tooltip | tree | treegrid | treeitem | string & {

}</pre>

<hr />

<strong id="asyncevent"><code>Type</code> AsyncEvent</strong>
    
<p>

Async event interface.

</p>

<pre><a href="#event">Event</a> & {
  respondWith(callback: () => <a href="#promise">Promise</a>): void
}</pre>

<hr />

<strong id="attributesmap"><code>Type</code> AttributesMap</strong>
    

<pre> & <a href="#htmlattributes">HTMLAttributes</a></pre>

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
  keyed?: <a href="#keyed">Keyed</a>;
  node: <a href="#t">T</a>;
  properties: <a href="#weakmap">WeakMap</a>;
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

<strong id="functioncomponent"><code>Type</code> FunctionComponent&lt;P, N extends <a href="#node">Node</a>&gt;</strong>
    

<pre>(props: <a href="#p">P</a> & {
  children?: <a href="#template">Template</a>[];
  key?: unknown
}, context: <a href="#context">Context</a>, requestUpdate: <a href="#updaterequest">UpdateRequest</a>, isAttached: () => boolean, sameContext: <a href="#context">Context</a>) => <a href="#template">Template</a></pre>

<hr />

<strong id="globalnamespace"><code>Type</code> GlobalNamespace</strong>
    

<pre><a href="#window">Window</a> & <a href="#globalthis">globalThis</a> & {
  _jsdom?: <a href="#jsdomjsdom">jsdom.JSDOM</a>
}</pre>

<hr />

<strong id="htmlattributereferrerpolicy"><code>Type</code> HTMLAttributeReferrerPolicy</strong>
    

<pre> | no-referrer | no-referrer-when-downgrade | origin | origin-when-cross-origin | same-origin | strict-origin | strict-origin-when-cross-origin | unsafe-url</pre>

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
  update?: boolean;
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

<strong id="vattrs"><code>Type</code> VAttrs&lt;T, E&gt;</strong>
    
<p>

Get a list of html attributes that can be assigned to the node.

</p>

<pre><a href="#omit">Omit</a></pre>

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

<strong id="vproperties"><code>Type</code> VProperties&lt;TagOrFunctionOrProps, Extends extends string | null&gt;</strong>
    
<p>

Properties that can be assigned to a node through the render engine.

</p>

<pre></pre>

<hr />

<strong id="vprops"><code>Type</code> VProps&lt;T&gt;</strong>
    
<p>

Get prototype properties that can be assigned to the node.

</p>

<pre><a href="#omit">Omit</a> & </pre>

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

<strong id="vtag"><code>Type</code> VTag&lt;T extends string&gt;</strong>
    
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

<strong id="customevent"><code>Variable</code> CustomEvent</strong>
    

<pre>{
  prototype: <a href="#customevent">CustomEvent</a>
}</pre>

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

<strong id="event"><code>Variable</code> Event</strong>
    

<pre>{
  AT_TARGET: number;
  BUBBLING_PHASE: number;
  CAPTURING_PHASE: number;
  NONE: number;
  prototype: <a href="#event">Event</a>
}</pre>

<hr />

<strong id="fragment"><code>Variable</code> Fragment</strong>
    
<p>

A constructor alias used for JSX fragments </>.

</p>

<pre></pre>

<hr />

<strong id="htmlelement"><code>Variable</code> HTMLElement</strong>
    

<pre>{
  prototype: <a href="#htmlelement">HTMLElement</a>
}</pre>

<hr />

<strong id="node"><code>Variable</code> Node</strong>
    

<pre>{
  ATTRIBUTE_NODE: number;
  CDATA_SECTION_NODE: number;
  COMMENT_NODE: number;
  DOCUMENT_FRAGMENT_NODE: number;
  DOCUMENT_NODE: number;
  DOCUMENT_POSITION_CONTAINED_BY: number;
  DOCUMENT_POSITION_CONTAINS: number;
  DOCUMENT_POSITION_DISCONNECTED: number;
  DOCUMENT_POSITION_FOLLOWING: number;
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
  DOCUMENT_POSITION_PRECEDING: number;
  DOCUMENT_TYPE_NODE: number;
  ELEMENT_NODE: number;
  ENTITY_NODE: number;
  ENTITY_REFERENCE_NODE: number;
  NOTATION_NODE: number;
  PROCESSING_INSTRUCTION_NODE: number;
  TEXT_NODE: number;
  prototype: <a href="#node">Node</a>
}</pre>

<hr />

<strong id="customelements"><code>Variable</code> customElements</strong>
    
<p>

The global DNA registry instance.

</p>

<pre><a href="#customelementregistry">CustomElementRegistry</a></pre>

<hr />

<strong id="document"><code>Variable</code> document</strong>
    

<pre><a href="#document">Document</a></pre>

<hr />

<strong id="window"><code>Variable</code> window</strong>
    

<pre><a href="#globalnamespace">GlobalNamespace</a></pre>

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
    <code>(name: string, options?: <a href="#elementdefinitionoptions">ElementDefinitionOptions</a>): &lt;T extends <a href="#componentconstructor">ComponentConstructor</a>&gt;(classOrDescriptor: <a href="#classdescriptor">ClassDescriptor</a> | <a href="#t">T</a>) => any</code>
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

<strong>Returns</strong>: <code>&lt;T extends <a href="#componentconstructor">ComponentConstructor</a>&gt;(classOrDescriptor: <a href="#classdescriptor">ClassDescriptor</a> | <a href="#t">T</a>) => any</code> The decorated component class.

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
} & <a href="#componentmixin">ComponentMixin</a>, P extends string | number | symbol&gt;(prototype: <a href="#withproperties">WithProperties</a>, propertyKey: <a href="#p">P</a>, declaration: <a href="#propertydeclaration">PropertyDeclaration</a>, symbolKey: symbol, isStatic: boolean): <a href="#propertydescriptor">PropertyDescriptor</a></code>
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
            <td></td></tr>
<tr>
            <td>isStatic</td>
            <td><code>boolean</code></td>
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

<strong>Returns</strong>: <code>boolean</code> True if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

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
    <code>&lt;T extends string&gt;(tagOrComponent: <a href="#t">T</a>, properties?: <a href="#vproperties">VProperties</a> | null, children: <a href="#template">Template</a>[]): <a href="#vtag">VTag</a></code>
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

<strong>Returns</strong>: <code><a href="#template">Template</a></code> 

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

<strong>Returns</strong>: <code><a href="#template">Template</a></code> 

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

<strong>Returns</strong>: <code>node is <a href="#t">T</a></code> True if element is a custom element.

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

<strong>Returns</strong>: <code>constructor is <a href="#c">C</a></code> True if the constructor is a component class.

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

<strong>Returns</strong>: <code><a href="#function">Function</a></code> 

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

<strong>Returns</strong>: <code><a href="#function">Function</a></code> 

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

<strong>Returns</strong>: <code><a href="#function">Function</a></code> 

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
