# DNA





**Classes**

<a href="#component">Component</a>


**Methods**

<a href="#render">render</a>, <a href="#define">define</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#interpolate">interpolate</a>, <a href="#bootstrap">bootstrap</a>, <a href="#property">property</a>, <a href="#delegate">delegate</a>, <a href="#undelegate">undelegate</a>


**Constants**

<a href="#dom">DOM</a>






<hr />

<strong id="component"><code>class</code>  Component</strong>
    


<strong>Extends:</strong> <a href="#baseelement">BaseElement</a>





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
            <td>properties</td>
            <td><code>{
    [key: string]: <a href="#accessordescriptor">AccessorDescriptor</a>;
}</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>events</td>
            <td><code>{
    [key: string]: <a href="#delegatedeventcallback">DelegatedEventCallback</a>;
}</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>is</td>
            <td><code>string|undefined</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>isConnected</td>
            <td><code>boolean</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>template</td>
            <td><code><a href="#template">Template</a>|undefined</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>$scope</td>
            <td><code><a href="#scope">Scope</a>|undefined</code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>


<strong>Methods</strong>

<strong id="connectedcallback"><code>method</code>  connectedCallback</strong>





<details>
<summary>
<code>(): void</code>
</summary><br />



<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="disconnectedcallback"><code>method</code>  disconnectedCallback</strong>





<details>
<summary>
<code>(): void</code>
</summary><br />



<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="attributechangedcallback"><code>method</code>  attributeChangedCallback</strong>





<details>
<summary>
<code>(attributeName: string), oldValue: null|string), newValue: null|string)): void</code>
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
            <td>attributeName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>oldValue</td>
            <td><code>null|string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>newValue</td>
            <td><code>null|string</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="propertychangedcallback"><code>method</code>  propertyChangedCallback</strong>





<details>
<summary>
<code>(propertyName: string), oldValue: any), newValue: any)): void</code>
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
            <td>propertyName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>oldValue</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>newValue</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="observe"><code>method</code>  observe</strong>



<p>

Observe a Component Property.

</p>

<details>
<summary>
<code>(propertyName: string), callback: <a href="#accessorobserver">AccessorObserver</a>)): void</code>
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
            <td>propertyName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The name of the Property to observe</td></tr>
<tr>
            <td>callback</td>
            <td><code><a href="#accessorobserver">AccessorObserver</a></code></td>
            <td align="center"></td>
            <td>The callback function</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="unobserve"><code>method</code>  unobserve</strong>



<p>

Unobserve a Component Property.

</p>

<details>
<summary>
<code>(propertyName: string), callback?: <a href="#accessorobserver">AccessorObserver</a>)): void</code>
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
            <td>propertyName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The name of the Property to unobserve</td></tr>
<tr>
            <td>callback</td>
            <td><code><a href="#accessorobserver">AccessorObserver</a></code></td>
            <td align="center">✓</td>
            <td>The callback function to remove</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="delegate"><code>method</code>  delegate</strong>





<details>
<summary>
<code>(event: string), selector: string), callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>)): void</code>
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
            <td>event</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>selector</td>
            <td><code>string</code></td>
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





<br />

<strong id="undelegate"><code>method</code>  undelegate</strong>





<details>
<summary>
<code>(event?: string), selector?: string), callback?: <a href="#delegatedeventcallback">DelegatedEventCallback</a>)): void</code>
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
            <td>event</td>
            <td><code>string</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>selector</td>
            <td><code>string</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>callback</td>
            <td><code><a href="#delegatedeventcallback">DelegatedEventCallback</a></code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="render"><code>method</code>  render</strong>



<p>

Render method of the Component.

</p>

<details>
<summary>
<code>(children?: <a href="#template">Template</a>)): void</code>
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
            <td>children</td>
            <td><code><a href="#template">Template</a></code></td>
            <td align="center">✓</td>
            <td>The children to render into the Component</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> The instances of the rendered Components and/or Nodes

</details>





<br />

<strong id="appendchild"><code>method</code>  appendChild</strong>



<p>

Append a child to the Component.

</p>

<details>
<summary>
<code>(newChild: T)): T</code>
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
            <td>newChild</td>
            <td><code>T</code></td>
            <td align="center"></td>
            <td>The child to add</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>T</code> 

</details>





<br />

<strong id="removechild"><code>method</code>  removeChild</strong>



<p>

Remove a child from the Component.

</p>

<details>
<summary>
<code>(oldChild: T)): T</code>
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
            <td>oldChild</td>
            <td><code>T</code></td>
            <td align="center"></td>
            <td>The child to remove</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>T</code> 

</details>





<br />

<strong id="insertbefore"><code>method</code>  insertBefore</strong>



<p>

Insert a child before another in the Component.

</p>

<details>
<summary>
<code>(newChild: T), refChild: Node|null)): T</code>
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
            <td>newChild</td>
            <td><code>T</code></td>
            <td align="center"></td>
            <td>The child to insert</td></tr>
<tr>
            <td>refChild</td>
            <td><code>Node|null</code></td>
            <td align="center"></td>
            <td>The referred Node</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>T</code> 

</details>





<br />

<strong id="replacechild"><code>method</code>  replaceChild</strong>



<p>

Replace a child with another in the Component.

</p>

<details>
<summary>
<code>(newChild: Node), oldChild: T)): T</code>
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
            <td>newChild</td>
            <td><code>Node</code></td>
            <td align="center"></td>
            <td>The child to insert</td></tr>
<tr>
            <td>oldChild</td>
            <td><code>T</code></td>
            <td align="center"></td>
            <td>The Node to replace</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>T</code> 

</details>





<br />

<strong id="setattribute"><code>method</code>  setAttribute</strong>



<p>

Set a Component attribute.

</p>

<details>
<summary>
<code>(qualifiedName: string), value: string)): void</code>
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
            <td>qualifiedName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>value</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The value to set</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>





<br />

<strong id="removeattribute"><code>method</code>  removeAttribute</strong>



<p>

Remove a Component attribute.

</p>

<details>
<summary>
<code>(qualifiedName: string)): void</code>
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
            <td>qualifiedName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The attribute name</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>














<hr />

<strong id="baseelement"><code>class</code>  BaseElement</strong>
    


<strong>Extends:</strong> <a href="#element">Element</a>

<p>

The abstact HTMLElement that Component extends.
It proxies the DOM.Element class.

</p>














<hr />

<strong id="render"><code>method</code>  render</strong>



<p>

Render a set of Nodes into another, with some checks for Nodes in order to avoid
useless changes in the tree and to mantain or update the state of compatible Nodes.

</p>

<details>
<summary>
<code>(node: HTMLElement), input: <a href="#template">Template</a>), context?: <a href="#rendercontext">RenderContext</a>), previousResult?: <a href="#template">Template</a>[]), filter?: <a href="#templatefilter">TemplateFilter</a>)): <a href="#template">Template</a>|<a href="#template">Template</a>[]|void</code>
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
            <td>node</td>
            <td><code>HTMLElement</code></td>
            <td align="center"></td>
            <td>The root Node for the render</td></tr>
<tr>
            <td>input</td>
            <td><code><a href="#template">Template</a></code></td>
            <td align="center"></td>
            <td>The child (or the children) to render in Virtual DOM format or already generated</td></tr>
<tr>
            <td>context</td>
            <td><code><a href="#rendercontext">RenderContext</a></code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>previousResult</td>
            <td><code><a href="#template">Template</a>[]</code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>filter</td>
            <td><code><a href="#templatefilter">TemplateFilter</a></code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#template">Template</a>|<a href="#template">Template</a>[]|void</code> The resulting child Nodes

</details>






<hr />

<strong id="define"><code>method</code>  define</strong>





<details>
<summary>
<code>(name: string), constructor: <a href="#definitionconstructor">DefinitionConstructor</a>), options?: <a href="#definitionoptions">DefinitionOptions</a>)): void</code>
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
            <td></td></tr>
<tr>
            <td>constructor</td>
            <td><code><a href="#definitionconstructor">DefinitionConstructor</a></code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>options</td>
            <td><code><a href="#definitionoptions">DefinitionOptions</a></code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>






<hr />

<strong id="h"><code>method</code>  h</strong>



<p>

HyperFunction factory to use as JSX pragma.

</p>

<details>
<summary>
<code>(tag: string|HTMLElement), properties: <a href="#hyperproperties">HyperProperties</a>|null), children: <a href="#templateitems">TemplateItems</a>)): <a href="#hyperfunction">HyperFunction</a></code>
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
            <td>tag</td>
            <td><code>string|HTMLElement</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>properties</td>
            <td><code><a href="#hyperproperties">HyperProperties</a>|null</code></td>
            <td align="center"></td>
            <td>The set of properties of the Node</td></tr>
<tr>
            <td>children</td>
            <td><code><a href="#templateitems">TemplateItems</a></code></td>
            <td align="center"></td>
            <td>The children of the Node</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#hyperfunction">HyperFunction</a></code> 

</details>






<hr />

<strong id="html"><code>method</code>  html</strong>



<p>

Compile a template element or a template string into virtual DOM template.

</p>

<details>
<summary>
<code>(template: string|HTMLTemplateElement)): <a href="#template">Template</a></code>
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
            <td>template</td>
            <td><code>string|HTMLTemplateElement</code></td>
            <td align="center"></td>
            <td>The template to parse.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#template">Template</a></code> The virtual DOM template function.

</details>






<hr />

<strong id="interpolate"><code>method</code>  interpolate</strong>



<p>

Create an interpolated function.

</p>

<details>
<summary>
<code>(expression: string)): <a href="#interpolatefunction">InterpolateFunction</a>|string</code>
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
            <td>expression</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The expression to interpolate.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#interpolatefunction">InterpolateFunction</a>|string</code> A simple string if the expression does not need interpolation, or an InterpolateFunction to generate interpolated content.

</details>






<hr />

<strong id="bootstrap"><code>method</code>  bootstrap</strong>



<p>

Find and instantiate elements in the page.
It is useful to bootstrap or rehydratate components starting from a plain HTML document.

</p>

<details>
<summary>
<code>(root: HTMLElement)): HTMLElement[]</code>
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
            <td>The document root to query.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>HTMLElement[]</code> A list of instantiated elements.

</details>






<hr />

<strong id="property"><code>method</code>  property</strong>





<details>
<summary>
<code>(descriptor?: <a href="#accessordescriptor">AccessorDescriptor</a>)): (target: HTMLElement, propertyKey: string, originalDescriptor: PropertyDescriptor): void</code>
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
            <td>descriptor</td>
            <td><code><a href="#accessordescriptor">AccessorDescriptor</a></code></td>
            <td align="center">✓</td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>(target: HTMLElement, propertyKey: string, originalDescriptor: PropertyDescriptor): void</code> 

</details>






<hr />

<strong id="delegate"><code>method</code>  delegate</strong>



<p>

Delegate an Event listener.

</p>

<details>
<summary>
<code>(element: HTMLElement), eventName: string), selector: string|undefined), callback: <a href="#delegatedeventcallback">DelegatedEventCallback</a>)): void</code>
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
            <td>element</td>
            <td><code>HTMLElement</code></td>
            <td align="center"></td>
            <td>The root element for the delegation</td></tr>
<tr>
            <td>eventName</td>
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The event name to listen</td></tr>
<tr>
            <td>selector</td>
            <td><code>string|undefined</code></td>
            <td align="center"></td>
            <td>The selector to delegate</td></tr>
<tr>
            <td>callback</td>
            <td><code><a href="#delegatedeventcallback">DelegatedEventCallback</a></code></td>
            <td align="center"></td>
            <td>The callback to trigger when an Event matches the delegation</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>






<hr />

<strong id="undelegate"><code>method</code>  undelegate</strong>



<p>

Remove an Event delegation.

</p>

<details>
<summary>
<code>(element: HTMLElement), eventName?: string), selector?: string), callback?: <a href="#delegatedeventcallback">DelegatedEventCallback</a>)): void</code>
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
            <td>element</td>
            <td><code>HTMLElement</code></td>
            <td align="center"></td>
            <td>The root element of the delegation</td></tr>
<tr>
            <td>eventName</td>
            <td><code>string</code></td>
            <td align="center">✓</td>
            <td>The Event name to undelegate</td></tr>
<tr>
            <td>selector</td>
            <td><code>string</code></td>
            <td align="center">✓</td>
            <td>The selector to undelegate</td></tr>
<tr>
            <td>callback</td>
            <td><code><a href="#delegatedeventcallback">DelegatedEventCallback</a></code></td>
            <td align="center">✓</td>
            <td>The callback to remove</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>






<hr />

<strong id="createscope"><code>method</code>  createScope</strong>



<p>

Create a Scope with an initial prototype.

</p>

<details>
<summary>
<code>(prototype: HTMLElement)): <a href="#scope">Scope</a></code>
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
            <td>prototype</td>
            <td><code>HTMLElement</code></td>
            <td align="center"></td>
            <td>The initial prototype object for the Scope.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#scope">Scope</a></code> An object with the Scope interface.

</details>






<hr />

<strong id="getscope"><code>method</code>  getScope</strong>



<p>

Get the Scope attached to an object.

</p>

<details>
<summary>
<code>(target: any)): <a href="#scope">Scope</a>|undefined</code>
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
            <td>target</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The scoped object.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#scope">Scope</a>|undefined</code> The Scope object (if it exists).

</details>






<hr />

<strong id="setscope"><code>method</code>  setScope</strong>



<p>

Attach a Scope to an object.

</p>

<details>
<summary>
<code>(target: any), scope: <a href="#scope">Scope</a>)): void</code>
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
            <td>target</td>
            <td><code>any</code></td>
            <td align="center"></td>
            <td>The object to scope.</td></tr>
<tr>
            <td>scope</td>
            <td><code><a href="#scope">Scope</a></code></td>
            <td align="center"></td>
            <td>The Scope to set.</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>






<hr />

<strong id="dom"><code>constant</code>  DOM</strong>



<p>

DOM is a singleton that components uses to access DOM methods.
By default, it uses browsers' DOM implementation, but it can be set to use a different one.
For example, in a Node context it is possibile to use DNA via the `jsdom` package and updating `DOM.Text` and `DOM.Element` references.
It also handle element life cycle for custom elements unless otherwise specified.

</p>



<strong>Type:</strong>

<pre>{
    Text: {
        constructor(data?: string|undefined): Text;
        prototype: Text;
    };
    Element: {
        constructor(): HTMLElement;
        prototype: HTMLElement;
    };
    useLifeCycle(use?: boolean): void;
    isElement(node: any): node is HTMLElement;
    isText(node: any): node is Text;
    isCustomElement(node: any): node is <a href="#customelement">CustomElement</a>;
    parse(source: string): NodeList;
    createElement(tagName: string): HTMLElement;
    createTextNode(data: string): Text;
    appendChild&lt;T extends Node&gt;(parent: HTMLElement, newChild: T): T;
    removeChild&lt;T extends Node&gt;(parent: HTMLElement, oldChild: T): T;
    insertBefore&lt;T extends Node&gt;(parent: HTMLElement, newChild: T, refChild: Node|null): T;
    replaceChild&lt;T extends Node&gt;(parent: HTMLElement, newChild: Node, oldChild: T): T;
    getAttribute(element: HTMLElement, qualifiedName: string): string|null;
    hasAttribute(element: HTMLElement, qualifiedName: string): boolean;
    setAttribute(element: HTMLElement, qualifiedName: string, value: string): void;
    removeAttribute(element: HTMLElement, qualifiedName: string): void;
    getChildNodes(node: Node): readonly Node[]|undefined;
    connect(node: Node): void;
    disconnect(node: Node): void;
}</pre>




<hr />

<strong id="filter_symbol"><code>constant</code>  FILTER_SYMBOL</strong>







<strong>Type:</strong>

<pre>unique Symbol</pre>




<hr />

<strong id="slotted_symbol"><code>constant</code>  SLOTTED_SYMBOL</strong>



<p>

A Symbol which contains slotted children of a Component.

</p>



<strong>Type:</strong>

<pre>unique Symbol</pre>




<hr />

<strong id="element"><code>constant</code>  Element</strong>



<p>

Create a shimmed HTMLElement.
(in some browsers, HTMLElement construction throw errors when not shimmed).

</p>



<strong>Type:</strong>

<pre>{
    constructor(): HTMLElement;
    prototype: HTMLElement;
}</pre>




<hr />

<strong id="customelement"><code>type</code>  CustomElement</strong>

<p>

The interface of Custom Element, as described by the W3C.

</p>



<pre>HTMLElement & {
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: null|string, newValue: null|string): void;
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
    render(): void;
}</pre>

<strong>See also</strong>

* [https://w3c.github.io/webcomponents/spec/custom/](https://w3c.github.io/webcomponents/spec/custom/) W3C specification.


<hr />

<strong id="template"><code>type</code>  Template</strong>





<pre>(<a href="#templateitem">TemplateItem</a>|<a href="#templateitems">TemplateItems</a>) & <a href="#slotted">Slotted</a></pre>




<hr />

<strong id="templateitem"><code>type</code>  TemplateItem</strong>





<pre>HTMLElement|Text|Function|<a href="#hyperfunction">HyperFunction</a>|<a href="#interpolatefunction">InterpolateFunction</a>|string|boolean</pre>




<hr />

<strong id="hyperfunction"><code>type</code>  HyperFunction</strong>

<p>

A HyperFunction (built by the `h` method with a tag name, a list of properties and children)
returns a Template result for a given previous node at the current position in a render context.

</p>



<pre>(this: <a href="#scope">Scope</a>, previousElement?: HTMLElement): <a href="#template">Template</a>|<a href="#templateitems">TemplateItems</a></pre>




<hr />

<strong id="scope"><code>type</code>  Scope</strong>

<p>

The Scope object set up a chain of scopes for templates in a render context.
It is possibile to assign properties only to a Component's scope,
or create a child scope which inherits properties from the current scope.

</p>



<pre>HTMLElement & {
    [key: string]: any;
    $assign(values: {
        [key: string]: any;
    }): void;
    $child(): <a href="#scope">Scope</a>;
}</pre>




<hr />

<strong id="templateitems"><code>type</code>  TemplateItems</strong>





<pre>(<a href="#templateitem">TemplateItem</a>[] & {
    [FILTER_SYMBOL]?: <a href="#templatefilter">TemplateFilter</a>;
})</pre>




<hr />

<strong id="templatefilter"><code>type</code>  TemplateFilter</strong>





<pre>(item: HTMLElement|Text): boolean</pre>




<hr />

<strong id="interpolatefunction"><code>type</code>  InterpolateFunction</strong>

<p>

A function that interpolate content in a string using a render Scope.

</p>



<pre>(this: <a href="#scope">Scope</a>): string</pre>




<hr />

<strong id="slotted"><code>type</code>  Slotted</strong>





<pre>{
    [SLOTTED_SYMBOL]?: <a href="#templateitems">TemplateItems</a>;
}</pre>




<hr />

<strong id="rendercontext"><code>type</code>  RenderContext</strong>





<pre>{
    scope: <a href="#scope">Scope</a>;
    currentNode: Node;
}</pre>




<hr />

<strong id="definitionconstructor"><code>type</code>  DefinitionConstructor</strong>





<pre>HTMLElement & {
    constructor(nodeOrProperties?: HTMLElement|{
        [key: string]: any;
    }, properties?: {
        [key: string]: any;
    }): <a href="#customelement">CustomElement</a>;
    prototype: <a href="#customelement">CustomElement</a>;
}</pre>




<hr />

<strong id="definitionoptions"><code>type</code>  DefinitionOptions</strong>





<pre>{
    extends?: string;
}</pre>




<hr />

<strong id="hyperproperties"><code>type</code>  HyperProperties</strong>





<pre>{
    is?: string;
    slot?: string;
    [key: string]: any;
}</pre>




<hr />

<strong id="accessordescriptor"><code>type</code>  AccessorDescriptor</strong>





<pre>PropertyDescriptor & {
    name?: string;
    attribute?: string|boolean;
    defaultValue?: any;
    types?: Function|Function[];
    observers?: <a href="#accessorobserver">AccessorObserver</a>[];
    validate?: (value: any): boolean;
    observe?: (callback: <a href="#accessorobserver">AccessorObserver</a>): void;
    getter?: (this: HTMLElement, value?: any): any;
    setter?: (this: HTMLElement, newValue?: any): any;
}</pre>




<hr />

<strong id="accessorobserver"><code>type</code>  AccessorObserver</strong>





<pre>(oldValue: any, newValue: any): any</pre>




<hr />

<strong id="delegatedeventcallback"><code>type</code>  DelegatedEventCallback</strong>

<p>

Describe the signature of a delegated event callback.

</p>



<pre>(event: Event, target?: HTMLElement): any</pre>


