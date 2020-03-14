# API Reference





**Classes**

<a href="#customelementregistry">CustomElementRegistry</a>




**Constants**

<a href="#get">get</a>, <a href="#define">define</a>, <a href="#upgrade">upgrade</a>, <a href="#whendefined">whenDefined</a>, <a href="#dom">DOM</a>, <a href="#render">render</a>, <a href="#fragment">Fragment</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#template">template</a>, <a href="#interpolate">interpolate</a>, <a href="#css">css</a>, <a href="#listener">listener</a>, <a href="#delegateeventlistener">delegateEventListener</a>, <a href="#undelegateeventlistener">undelegateEventListener</a>, <a href="#dispatchevent">dispatchEvent</a>, <a href="#dispatchasyncevent">dispatchAsyncEvent</a>, <a href="#property">property</a>, <a href="#extend">extend</a>, <a href="#component">Component</a>




**Types**

<a href="#asyncevent">AsyncEvent</a>


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
    [key: string]: <a href="#customelement">CustomElement</a>;
}</code></td>
            <td align="center">✓</td>
            <td>A global registry.</td>
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
<code>(name: string): <a href="#customelement">CustomElement</a></code>
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

<strong>Returns</strong>: <code><a href="#customelement">CustomElement</a></code> The definition for the given tag.

<br />
</details>





<br />

<strong id="define"><code>method</code>  define</strong>



<p>

Define a new Custom Element.

</p>

<details>
<summary>
<code>(name: string, constructor: <a href="#customelement">CustomElement</a>, options?: {
    extends?: string;
}): void</code>
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
            <td><code><a href="#customelement">CustomElement</a></code></td>
            <td align="center"></td>
            <td>The Custom Element constructor.</td></tr>
<tr>
            <td>options</td>
            <td><code>{
    extends?: string;
}</code></td>
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

<strong id="get"><code>constant</code>  get</strong>







<strong>Type:</strong>

<pre>(name: string): <a href="#customelement">CustomElement</a></pre>




<hr />

<strong id="ce_symbol"><code>constant</code>  CE_SYMBOL</strong>



<p>

A symbol which identify custom elements.

</p>



<strong>Type:</strong>

<pre>unique Symbol</pre>




<hr />

<strong id="ce_emulate_lifecycle"><code>constant</code>  CE_EMULATE_LIFECYCLE</strong>



<p>

A symbol which identify emulated custom elements.

</p>



<strong>Type:</strong>

<pre>Symbol</pre>




<hr />

<strong id="iscustomelement"><code>constant</code>  isCustomElement</strong>



<p>

Check if a node is a custom element.

</p>



<strong>Type:</strong>

<pre>(node: Element): node is <a href="#customelement">CustomElement</a></pre>




<hr />

<strong id="shouldemulatelifecycle"><code>constant</code>  shouldEmulateLifeCycle</strong>



<p>

Check if a node require emulated life cycle.

</p>



<strong>Type:</strong>

<pre>(node: Element): node is <a href="#customelement">CustomElement</a></pre>




<hr />

<strong id="define"><code>constant</code>  define</strong>







<strong>Type:</strong>

<pre>(name: string, constructor: <a href="#customelement">CustomElement</a>, options?: {
    extends?: string|undefined;
}): void</pre>




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
    emulateLifeCycle: boolean;
    window: Window & globalThis;
    document: Document;
    Document: {
        constructor(): Document;
        prototype: Document;
    };
    Node: {
        constructor(): Node;
        prototype: Node;
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
    };
    Text: {
        constructor(data?: string|undefined): Text;
        prototype: Text;
    };
    HTMLElement: {
        constructor(): HTMLElement;
        prototype: HTMLElement;
    };
    Event: {
        constructor(type: string, eventInitDict?: EventInit|undefined): Event;
        prototype: Event;
        AT_TARGET: number;
        BUBBLING_PHASE: number;
        CAPTURING_PHASE: number;
        NONE: number;
    };
    CustomEvent: {
        constructor(typeArg: string, eventInitDict?: CustomEventInit&lt;T&gt;|undefined): CustomEvent&lt;T&gt;;
        prototype: CustomEvent&lt;any&gt;;
    };
    createElement(tagName: string, options?: ElementCreationOptions|undefined): Element;
    createElementNS(namespaceURI: string, tagName: string): Element;
    createTextNode(data: string): Text;
    createEvent(typeArg: string, eventInitDict?: CustomEventInit&lt;any&gt;): CustomEvent&lt;any&gt;;
    appendChild&lt;T_1 extends Node&gt;(parent: Element, newChild: T_1, slot?: boolean): T_1;
    removeChild&lt;T_2 extends Node&gt;(parent: Element, oldChild: T_2, slot?: boolean): T_2;
    insertBefore&lt;T_3 extends Node&gt;(parent: Element, newChild: T_3, refChild: Node|null, slot?: boolean): T_3;
    replaceChild&lt;T_4 extends Node&gt;(parent: Element, newChild: Node, oldChild: T_4, slot?: boolean): T_4;
    getAttribute(element: Element, qualifiedName: string): string|null;
    hasAttribute(element: Element, qualifiedName: string): boolean;
    setAttribute(element: Element, qualifiedName: string, value: string): void;
    removeAttribute(element: Element, qualifiedName: string): void;
    matches(element: Element, selectorString: string): boolean;
}</pre>




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

<pre>{
    constructor(): Element;
    prototype: Element;
}</pre>




<hr />

<strong id="h"><code>constant</code>  h</strong>



<p>

HyperFunction factory to use as JSX pragma.

</p>



<strong>Type:</strong>

<pre>(tagOrComponent: string|{
    constructor(): Element;
    prototype: Element;
}, properties: <a href="#hyperproperties">HyperProperties</a>|null, children: <a href="#templateitems">TemplateItems</a>): <a href="#hypernode">HyperNode</a></pre>




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

<strong id="listener"><code>constant</code>  listener</strong>



<p>

Bind a method to an event listener.

</p>



<strong>Type:</strong>

<pre>(descriptor: <a href="#delegatedeventdescriptor">DelegatedEventDescriptor</a>): any</pre>




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

<pre>(constructor: {
    constructor(): HTMLElement;
    prototype: HTMLElement;
}): {
    constructor(): {
        constructor(node?: HTMLElement|undefined, properties?: {
            [key: string]: any;
        }|undefined): <a href="#customelement">CustomElement</a>&lt;HTMLElement&gt;;
        constructor(properties?: {
            [key: string]: any;
        }|undefined): <a href="#customelement">CustomElement</a>&lt;HTMLElement&gt;;
        accessKey: string;
        accessKeyLabel: string;
        autocapitalize: string;
        dir: string;
        draggable: boolean;
        hidden: boolean;
        innerText: string;
        lang: string;
        offsetHeight: number;
        offsetLeft: number;
        offsetParent: Element|null;
        offsetTop: number;
        offsetWidth: number;
        spellcheck: boolean;
        title: string;
        translate: boolean;
        click(): void;
        addEventListener&lt;K extends "waiting"|"error"|"abort"|"cancel"|"progress"|"ended"|"change"|"input"|"select"|"fullscreenchange"|"fullscreenerror"|"animationcancel"|"animationend"|"animationiteration"|"animationstart"|"auxclick"|"blur"|"canplay"|"canplaythrough"|"click"|"close"|"contextmenu"|"cuechange"|"dblclick"|"drag"|"dragend"|"dragenter"|"dragexit"|"dragleave"|"dragover"|"dragstart"|"drop"|"durationchange"|"emptied"|"focus"|"focusin"|"focusout"|"gotpointercapture"|"invalid"|"keydown"|"keypress"|"keyup"|"load"|"loadeddata"|"loadedmetadata"|"loadstart"|"lostpointercapture"|"mousedown"|"mouseenter"|"mouseleave"|"mousemove"|"mouseout"|"mouseover"|"mouseup"|"pause"|"play"|"playing"|"pointercancel"|"pointerdown"|"pointerenter"|"pointerleave"|"pointermove"|"pointerout"|"pointerover"|"pointerup"|"ratechange"|"reset"|"resize"|"scroll"|"securitypolicyviolation"|"seeked"|"seeking"|"selectionchange"|"selectstart"|"stalled"|"submit"|"suspend"|"timeupdate"|"toggle"|"touchcancel"|"touchend"|"touchmove"|"touchstart"|"transitioncancel"|"transitionend"|"transitionrun"|"transitionstart"|"volumechange"|"wheel"|"copy"|"cut"|"paste"&gt;(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]): any, options?: boolean|AddEventListenerOptions|undefined): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions|undefined): void;
        removeEventListener&lt;K_1 extends "waiting"|"error"|"abort"|"cancel"|"progress"|"ended"|"change"|"input"|"select"|"fullscreenchange"|"fullscreenerror"|"animationcancel"|"animationend"|"animationiteration"|"animationstart"|"auxclick"|"blur"|"canplay"|"canplaythrough"|"click"|"close"|"contextmenu"|"cuechange"|"dblclick"|"drag"|"dragend"|"dragenter"|"dragexit"|"dragleave"|"dragover"|"dragstart"|"drop"|"durationchange"|"emptied"|"focus"|"focusin"|"focusout"|"gotpointercapture"|"invalid"|"keydown"|"keypress"|"keyup"|"load"|"loadeddata"|"loadedmetadata"|"loadstart"|"lostpointercapture"|"mousedown"|"mouseenter"|"mouseleave"|"mousemove"|"mouseout"|"mouseover"|"mouseup"|"pause"|"play"|"playing"|"pointercancel"|"pointerdown"|"pointerenter"|"pointerleave"|"pointermove"|"pointerout"|"pointerover"|"pointerup"|"ratechange"|"reset"|"resize"|"scroll"|"securitypolicyviolation"|"seeked"|"seeking"|"selectionchange"|"selectstart"|"stalled"|"submit"|"suspend"|"timeupdate"|"toggle"|"touchcancel"|"touchend"|"touchmove"|"touchstart"|"transitioncancel"|"transitionend"|"transitionrun"|"transitionstart"|"volumechange"|"wheel"|"copy"|"cut"|"paste"&gt;(type: K_1, listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]): any, options?: boolean|EventListenerOptions|undefined): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean|EventListenerOptions|undefined): void;
        assignedSlot: HTMLSlotElement|null;
        attributes: NamedNodeMap;
        classList: DOMTokenList;
        className: string;
        clientHeight: number;
        clientLeft: number;
        clientTop: number;
        clientWidth: number;
        id: string;
        localName: string;
        namespaceURI: string|null;
        onfullscreenchange: ((this: Element, ev: Event): any)|null;
        onfullscreenerror: ((this: Element, ev: Event): any)|null;
        outerHTML: string;
        prefix: string|null;
        scrollHeight: number;
        scrollLeft: number;
        scrollTop: number;
        scrollWidth: number;
        shadowRoot: ShadowRoot|null;
        slot: string;
        tagName: string;
        attachShadow(init: ShadowRootInit): ShadowRoot;
        closest&lt;K_2 extends "object"|"link"|"small"|"sub"|"sup"|"track"|"progress"|"a"|"abbr"|"address"|"applet"|"area"|"article"|"aside"|"audio"|"b"|"base"|"basefont"|"bdi"|"bdo"|"blockquote"|"body"|"br"|"button"|"canvas"|"caption"|"cite"|"code"|"col"|"colgroup"|"data"|"datalist"|"dd"|"del"|"details"|"dfn"|"dialog"|"dir"|"div"|"dl"|"dt"|"em"|"embed"|"fieldset"|"figcaption"|"figure"|"font"|"footer"|"form"|"frame"|"frameset"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"head"|"header"|"hgroup"|"hr"|"html"|"i"|"iframe"|"img"|"input"|"ins"|"kbd"|"label"|"legend"|"li"|"main"|"map"|"mark"|"marquee"|"menu"|"meta"|"meter"|"nav"|"noscript"|"ol"|"optgroup"|"option"|"output"|"p"|"param"|"picture"|"pre"|"q"|"rp"|"rt"|"ruby"|"s"|"samp"|"script"|"section"|"select"|"slot"|"source"|"span"|"strong"|"style"|"summary"|"table"|"tbody"|"td"|"template"|"textarea"|"tfoot"|"th"|"thead"|"time"|"title"|"tr"|"u"|"ul"|"var"|"video"|"wbr"&gt;(selector: K_2): HTMLElementTagNameMap[K_2]|null;
        closest&lt;K_3 extends "symbol"|"a"|"script"|"style"|"title"|"circle"|"clipPath"|"defs"|"desc"|"ellipse"|"feBlend"|"feColorMatrix"|"feComponentTransfer"|"feComposite"|"feConvolveMatrix"|"feDiffuseLighting"|"feDisplacementMap"|"feDistantLight"|"feFlood"|"feFuncA"|"feFuncB"|"feFuncG"|"feFuncR"|"feGaussianBlur"|"feImage"|"feMerge"|"feMergeNode"|"feMorphology"|"feOffset"|"fePointLight"|"feSpecularLighting"|"feSpotLight"|"feTile"|"feTurbulence"|"filter"|"foreignObject"|"g"|"image"|"line"|"linearGradient"|"marker"|"mask"|"metadata"|"path"|"pattern"|"polygon"|"polyline"|"radialGradient"|"rect"|"stop"|"svg"|"switch"|"text"|"textPath"|"tspan"|"use"|"view"&gt;(selector: K_3): SVGElementTagNameMap[K_3]|null;
        closest&lt;E extends Element&gt;(selector: string): E|null;
        getAttribute(qualifiedName: string): string|null;
        getAttributeNS(namespace: string|null, localName: string): string|null;
        getAttributeNames(): string[];
        getAttributeNode(name: string): Attr|null;
        getAttributeNodeNS(namespaceURI: string, localName: string): Attr|null;
        getBoundingClientRect(): DOMRect;
        getClientRects(): DOMRectList;
        getElementsByClassName(classNames: string): HTMLCollectionOf&lt;Element&gt;;
        getElementsByTagName&lt;K_4 extends "object"|"link"|"small"|"sub"|"sup"|"track"|"progress"|"a"|"abbr"|"address"|"applet"|"area"|"article"|"aside"|"audio"|"b"|"base"|"basefont"|"bdi"|"bdo"|"blockquote"|"body"|"br"|"button"|"canvas"|"caption"|"cite"|"code"|"col"|"colgroup"|"data"|"datalist"|"dd"|"del"|"details"|"dfn"|"dialog"|"dir"|"div"|"dl"|"dt"|"em"|"embed"|"fieldset"|"figcaption"|"figure"|"font"|"footer"|"form"|"frame"|"frameset"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"head"|"header"|"hgroup"|"hr"|"html"|"i"|"iframe"|"img"|"input"|"ins"|"kbd"|"label"|"legend"|"li"|"main"|"map"|"mark"|"marquee"|"menu"|"meta"|"meter"|"nav"|"noscript"|"ol"|"optgroup"|"option"|"output"|"p"|"param"|"picture"|"pre"|"q"|"rp"|"rt"|"ruby"|"s"|"samp"|"script"|"section"|"select"|"slot"|"source"|"span"|"strong"|"style"|"summary"|"table"|"tbody"|"td"|"template"|"textarea"|"tfoot"|"th"|"thead"|"time"|"title"|"tr"|"u"|"ul"|"var"|"video"|"wbr"&gt;(qualifiedName: K_4): HTMLCollectionOf&lt;HTMLElementTagNameMap[K_4]&gt;;
        getElementsByTagName&lt;K_5 extends "symbol"|"a"|"script"|"style"|"title"|"circle"|"clipPath"|"defs"|"desc"|"ellipse"|"feBlend"|"feColorMatrix"|"feComponentTransfer"|"feComposite"|"feConvolveMatrix"|"feDiffuseLighting"|"feDisplacementMap"|"feDistantLight"|"feFlood"|"feFuncA"|"feFuncB"|"feFuncG"|"feFuncR"|"feGaussianBlur"|"feImage"|"feMerge"|"feMergeNode"|"feMorphology"|"feOffset"|"fePointLight"|"feSpecularLighting"|"feSpotLight"|"feTile"|"feTurbulence"|"filter"|"foreignObject"|"g"|"image"|"line"|"linearGradient"|"marker"|"mask"|"metadata"|"path"|"pattern"|"polygon"|"polyline"|"radialGradient"|"rect"|"stop"|"svg"|"switch"|"text"|"textPath"|"tspan"|"use"|"view"&gt;(qualifiedName: K_5): HTMLCollectionOf&lt;SVGElementTagNameMap[K_5]&gt;;
        getElementsByTagName(qualifiedName: string): HTMLCollectionOf&lt;Element&gt;;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf&lt;HTMLElement&gt;;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf&lt;SVGElement&gt;;
        getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf&lt;Element&gt;;
        hasAttribute(qualifiedName: string): boolean;
        hasAttributeNS(namespace: string|null, localName: string): boolean;
        hasAttributes(): boolean;
        hasPointerCapture(pointerId: number): boolean;
        insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element|null;
        insertAdjacentHTML(where: InsertPosition, html: string): void;
        insertAdjacentText(where: InsertPosition, text: string): void;
        matches(selectors: string): boolean;
        msGetRegionContent(): any;
        releasePointerCapture(pointerId: number): void;
        removeAttribute(qualifiedName: string): void;
        removeAttributeNS(namespace: string|null, localName: string): void;
        removeAttributeNode(attr: Attr): Attr;
        requestFullscreen(options?: FullscreenOptions|undefined): Promise&lt;void&gt;;
        requestPointerLock(): void;
        scroll(options?: ScrollToOptions|undefined): void;
        scroll(x: number, y: number): void;
        scrollBy(options?: ScrollToOptions|undefined): void;
        scrollBy(x: number, y: number): void;
        scrollIntoView(arg?: boolean|ScrollIntoViewOptions|undefined): void;
        scrollTo(options?: ScrollToOptions|undefined): void;
        scrollTo(x: number, y: number): void;
        setAttribute(qualifiedName: string, value: string): void;
        setAttributeNS(namespace: string|null, qualifiedName: string, value: string): void;
        setAttributeNode(attr: Attr): Attr|null;
        setAttributeNodeNS(attr: Attr): Attr|null;
        setPointerCapture(pointerId: number): void;
        toggleAttribute(qualifiedName: string, force?: boolean|undefined): boolean;
        webkitMatchesSelector(selectors: string): boolean;
        baseURI: string;
        childNodes: NodeListOf&lt;ChildNode&gt;;
        firstChild: ChildNode|null;
        isConnected: boolean;
        lastChild: ChildNode|null;
        nextSibling: ChildNode|null;
        nodeName: string;
        nodeType: number;
        nodeValue: string|null;
        ownerDocument: Document|null;
        parentElement: HTMLElement|null;
        parentNode: (Node & ParentNode)|null;
        previousSibling: ChildNode|null;
        textContent: string|null;
        appendChild&lt;T extends Node&gt;(newChild: T): T;
        cloneNode(deep?: boolean|undefined): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node|null): boolean;
        getRootNode(options?: GetRootNodeOptions|undefined): Node;
        hasChildNodes(): boolean;
        insertBefore&lt;T_1 extends Node&gt;(newChild: T_1, refChild: Node|null): T_1;
        isDefaultNamespace(namespace: string|null): boolean;
        isEqualNode(otherNode: Node|null): boolean;
        isSameNode(otherNode: Node|null): boolean;
        lookupNamespaceURI(prefix: string|null): string|null;
        lookupPrefix(namespace: string|null): string|null;
        normalize(): void;
        removeChild&lt;T_2 extends Node&gt;(oldChild: T_2): T_2;
        replaceChild&lt;T_3 extends Node&gt;(newChild: Node, oldChild: T_3): T_3;
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
        dispatchEvent: ((event: Event): boolean) & {
            (event: Event): boolean;
            (event: string, detail?: CustomEventInit&lt;any&gt;|undefined, bubbles?: boolean|undefined, cancelable?: boolean|undefined, composed?: boolean|undefined): boolean;
        };
        animate(keyframes: PropertyIndexedKeyframes|Keyframe[]|null, options?: number|KeyframeAnimationOptions|undefined): Animation;
        getAnimations(): Animation[];
        after(nodes: (string|Node)[]): void;
        before(nodes: (string|Node)[]): void;
        remove(): void;
        replaceWith(nodes: (string|Node)[]): void;
        innerHTML: string;
        nextElementSibling: Element|null;
        previousElementSibling: Element|null;
        childElementCount: number;
        children: HTMLCollection;
        firstElementChild: Element|null;
        lastElementChild: Element|null;
        append(nodes: (string|Node)[]): void;
        prepend(nodes: (string|Node)[]): void;
        querySelector&lt;K_6 extends "object"|"link"|"small"|"sub"|"sup"|"track"|"progress"|"a"|"abbr"|"address"|"applet"|"area"|"article"|"aside"|"audio"|"b"|"base"|"basefont"|"bdi"|"bdo"|"blockquote"|"body"|"br"|"button"|"canvas"|"caption"|"cite"|"code"|"col"|"colgroup"|"data"|"datalist"|"dd"|"del"|"details"|"dfn"|"dialog"|"dir"|"div"|"dl"|"dt"|"em"|"embed"|"fieldset"|"figcaption"|"figure"|"font"|"footer"|"form"|"frame"|"frameset"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"head"|"header"|"hgroup"|"hr"|"html"|"i"|"iframe"|"img"|"input"|"ins"|"kbd"|"label"|"legend"|"li"|"main"|"map"|"mark"|"marquee"|"menu"|"meta"|"meter"|"nav"|"noscript"|"ol"|"optgroup"|"option"|"output"|"p"|"param"|"picture"|"pre"|"q"|"rp"|"rt"|"ruby"|"s"|"samp"|"script"|"section"|"select"|"slot"|"source"|"span"|"strong"|"style"|"summary"|"table"|"tbody"|"td"|"template"|"textarea"|"tfoot"|"th"|"thead"|"time"|"title"|"tr"|"u"|"ul"|"var"|"video"|"wbr"&gt;(selectors: K_6): HTMLElementTagNameMap[K_6]|null;
        querySelector&lt;K_7 extends "symbol"|"a"|"script"|"style"|"title"|"circle"|"clipPath"|"defs"|"desc"|"ellipse"|"feBlend"|"feColorMatrix"|"feComponentTransfer"|"feComposite"|"feConvolveMatrix"|"feDiffuseLighting"|"feDisplacementMap"|"feDistantLight"|"feFlood"|"feFuncA"|"feFuncB"|"feFuncG"|"feFuncR"|"feGaussianBlur"|"feImage"|"feMerge"|"feMergeNode"|"feMorphology"|"feOffset"|"fePointLight"|"feSpecularLighting"|"feSpotLight"|"feTile"|"feTurbulence"|"filter"|"foreignObject"|"g"|"image"|"line"|"linearGradient"|"marker"|"mask"|"metadata"|"path"|"pattern"|"polygon"|"polyline"|"radialGradient"|"rect"|"stop"|"svg"|"switch"|"text"|"textPath"|"tspan"|"use"|"view"&gt;(selectors: K_7): SVGElementTagNameMap[K_7]|null;
        querySelector&lt;E_1 extends Element&gt;(selectors: string): E_1|null;
        querySelectorAll&lt;K_8 extends "object"|"link"|"small"|"sub"|"sup"|"track"|"progress"|"a"|"abbr"|"address"|"applet"|"area"|"article"|"aside"|"audio"|"b"|"base"|"basefont"|"bdi"|"bdo"|"blockquote"|"body"|"br"|"button"|"canvas"|"caption"|"cite"|"code"|"col"|"colgroup"|"data"|"datalist"|"dd"|"del"|"details"|"dfn"|"dialog"|"dir"|"div"|"dl"|"dt"|"em"|"embed"|"fieldset"|"figcaption"|"figure"|"font"|"footer"|"form"|"frame"|"frameset"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"head"|"header"|"hgroup"|"hr"|"html"|"i"|"iframe"|"img"|"input"|"ins"|"kbd"|"label"|"legend"|"li"|"main"|"map"|"mark"|"marquee"|"menu"|"meta"|"meter"|"nav"|"noscript"|"ol"|"optgroup"|"option"|"output"|"p"|"param"|"picture"|"pre"|"q"|"rp"|"rt"|"ruby"|"s"|"samp"|"script"|"section"|"select"|"slot"|"source"|"span"|"strong"|"style"|"summary"|"table"|"tbody"|"td"|"template"|"textarea"|"tfoot"|"th"|"thead"|"time"|"title"|"tr"|"u"|"ul"|"var"|"video"|"wbr"&gt;(selectors: K_8): NodeListOf&lt;HTMLElementTagNameMap[K_8]&gt;;
        querySelectorAll&lt;K_9 extends "symbol"|"a"|"script"|"style"|"title"|"circle"|"clipPath"|"defs"|"desc"|"ellipse"|"feBlend"|"feColorMatrix"|"feComponentTransfer"|"feComposite"|"feConvolveMatrix"|"feDiffuseLighting"|"feDisplacementMap"|"feDistantLight"|"feFlood"|"feFuncA"|"feFuncB"|"feFuncG"|"feFuncR"|"feGaussianBlur"|"feImage"|"feMerge"|"feMergeNode"|"feMorphology"|"feOffset"|"fePointLight"|"feSpecularLighting"|"feSpotLight"|"feTile"|"feTurbulence"|"filter"|"foreignObject"|"g"|"image"|"line"|"linearGradient"|"marker"|"mask"|"metadata"|"path"|"pattern"|"polygon"|"polyline"|"radialGradient"|"rect"|"stop"|"svg"|"switch"|"text"|"textPath"|"tspan"|"use"|"view"&gt;(selectors: K_9): NodeListOf&lt;SVGElementTagNameMap[K_9]&gt;;
        querySelectorAll&lt;E_2 extends Element&gt;(selectors: string): NodeListOf&lt;E_2&gt;;
        oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent): any)|null;
        oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent): any)|null;
        onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent): any)|null;
        style: CSSStyleDeclaration;
        contentEditable: string;
        inputMode: string;
        isContentEditable: boolean;
        onabort: ((this: GlobalEventHandlers, ev: UIEvent): any)|null;
        onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onblur: ((this: GlobalEventHandlers, ev: FocusEvent): any)|null;
        oncancel: ((this: GlobalEventHandlers, ev: Event): any)|null;
        oncanplay: ((this: GlobalEventHandlers, ev: Event): any)|null;
        oncanplaythrough: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onchange: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onclick: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onclose: ((this: GlobalEventHandlers, ev: Event): any)|null;
        oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        oncuechange: ((this: GlobalEventHandlers, ev: Event): any)|null;
        ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        ondrag: ((this: GlobalEventHandlers, ev: DragEvent): any)|null;
        ondragend: ((this: GlobalEventHandlers, ev: DragEvent): any)|null;
        ondragenter: ((this: GlobalEventHandlers, ev: DragEvent): any)|null;
        ondragexit: ((this: GlobalEventHandlers, ev: Event): any)|null;
        ondragleave: ((this: GlobalEventHandlers, ev: DragEvent): any)|null;
        ondragover: ((this: GlobalEventHandlers, ev: DragEvent): any)|null;
        ondragstart: ((this: GlobalEventHandlers, ev: DragEvent): any)|null;
        ondrop: ((this: GlobalEventHandlers, ev: DragEvent): any)|null;
        ondurationchange: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onemptied: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onended: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onerror: OnErrorEventHandler;
        onfocus: ((this: GlobalEventHandlers, ev: FocusEvent): any)|null;
        ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        oninput: ((this: GlobalEventHandlers, ev: Event): any)|null;
        oninvalid: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent): any)|null;
        onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent): any)|null;
        onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent): any)|null;
        onload: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onloadeddata: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onloadedmetadata: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onloadstart: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent): any)|null;
        onpause: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onplay: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onplaying: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent): any)|null;
        onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent&lt;EventTarget&gt;): any)|null;
        onratechange: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onreset: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onresize: ((this: GlobalEventHandlers, ev: UIEvent): any)|null;
        onscroll: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent): any)|null;
        onseeked: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onseeking: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onselect: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onselectionchange: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onselectstart: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onstalled: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onsubmit: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onsuspend: ((this: GlobalEventHandlers, ev: Event): any)|null;
        ontimeupdate: ((this: GlobalEventHandlers, ev: Event): any)|null;
        ontoggle: ((this: GlobalEventHandlers, ev: Event): any)|null;
        ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null|undefined;
        ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null|undefined;
        ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null|undefined;
        ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null|undefined;
        ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        onvolumechange: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onwaiting: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onwheel: ((this: GlobalEventHandlers, ev: WheelEvent): any)|null;
        autofocus: boolean;
        dataset: DOMStringMap;
        nonce?: string|undefined;
        tabIndex: number;
        blur(): void;
        focus(options?: FocusOptions|undefined): void;
        is: string|undefined;
        properties?: {
            [key: string]: <a href="#classfielddescriptor">ClassFieldDescriptor</a>;
        }|undefined;
        listeners?: {
            [key: string]: <a href="#delegatedeventcallback">DelegatedEventCallback</a>;
        }|undefined;
        template?: HTMLTemplateElement|undefined;
        adoptedStyleSheets?: CSSStyleSheet[]|undefined;
        connectedCallback(): void;
        disconnectedCallback(): void;
        attributeChangedCallback(attributeName: string, oldValue: string|null, newValue: string|null): void;
        propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
        render(): <a href="#template">Template</a>;
        forceUpdate(): void;
        observe(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void;
        unobserve(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void;
        delegateEventListener(event: string, selector: string|null, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void;
        undelegateEventListener(event?: string|undefined, selector?: string|null|undefined, callback?: <a href="#delegatedeventcallback">DelegatedEventCallback</a>|undefined): void;
    };
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

<pre><a href="#customelement">CustomElement</a>&lt;HTMLElement&gt;</pre>




<hr />

<strong id="customelement"><code>type</code>  CustomElement</strong>

<p>

The basic Custom Element interface.
It's a Custom Element, but with some extra useful method.

</p>



<pre>T & {
    is: string|undefined;
    properties?: {
        [key: string]: <a href="#classfielddescriptor">ClassFieldDescriptor</a>;
    };
    listeners?: {
        [key: string]: <a href="#delegatedeventcallback">DelegatedEventCallback</a>;
    };
    template?: HTMLTemplateElement;
    adoptedStyleSheets?: CSSStyleSheet[];
    constructor(node?: T, properties?: {
        [key: string]: any;
    }): <a href="#customelement">CustomElement</a>&lt;T&gt;;
    constructor(properties?: {
        [key: string]: any;
    }): <a href="#customelement">CustomElement</a>&lt;T&gt;;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: null|string, newValue: null|string): void;
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
    render(): <a href="#template">Template</a>;
    forceUpdate(): void;
    observe(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void;
    unobserve(propertyName: string, callback: <a href="#classfieldobserver">ClassFieldObserver</a>): void;
    dispatchEvent(event: Event): boolean;
    dispatchEvent(event: string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;
    delegateEventListener(event: string, selector: string|null, callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void;
    undelegateEventListener(event?: string, selector?: string|null, callback?: <a href="#delegatedeventcallback">DelegatedEventCallback</a>): void;
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
    attribute?: string;
    defaultValue?: any;
    types?: Function|Function[];
    observe?: <a href="#classfieldobserver">ClassFieldObserver</a>;
    observers?: <a href="#classfieldobserver">ClassFieldObserver</a>[];
    validate?: <a href="#classfieldvalidator">ClassFieldValidator</a>;
    getter?: (this: Element, value?: any): any;
    setter?: (this: Element, newValue?: any): any;
    symbol?: Symbol;
}</pre>




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

<strong id="delegatedeventcallback"><code>type</code>  DelegatedEventCallback</strong>

<p>

Describe the signature of a delegated event callback.

</p>



<pre>(event: Event, target?: Node): any</pre>




<hr />

<strong id="template"><code>type</code>  Template</strong>

<p>

A generic template. Can be a single atomic item or a list of items.

</p>



<pre><a href="#templateitem">TemplateItem</a>|<a href="#templateitems">TemplateItems</a></pre>




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
    Component?: Element;
    tag?: string;
    is?: string;
    key?: any;
    isFragment?: boolean;
    isSlot?: boolean;
    namespaceURI?: string;
    properties?: any;
    children: <a href="#templateitems">TemplateItems</a>;
}</pre>




<hr />

<strong id="templateitems"><code>type</code>  TemplateItems</strong>

<p>

A list of template items.

</p>



<pre><a href="#templateitem">TemplateItem</a>[]</pre>




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
    namespaceURI?: string;
    [key: string]: any;
}</pre>




<hr />

<strong id="asyncevent"><code>type</code>  AsyncEvent</strong>





<pre>Event & {
    respondWith(callback: (): Promise&lt;any&gt;): void;
}</pre>




<hr />

<strong id="delegatedeventdescriptor"><code>type</code>  DelegatedEventDescriptor</strong>

<p>

A descriptor for an event delegation.

</p>



<pre>{
    event: string;
    selector: string|null;
    callback?: <a href="#delegatedeventcallback">DelegatedEventCallback</a>;
}</pre>


