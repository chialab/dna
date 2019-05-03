# DNA





**Classes**

<a href="#component">Component</a>


**Methods**

<a href="#render">render</a>, <a href="#define">define</a>, <a href="#h">h</a>, <a href="#html">html</a>, <a href="#interpolate">interpolate</a>, <a href="#bootstrap">bootstrap</a>, <a href="#property">property</a>, <a href="#delegate">delegate</a>, <a href="#undelegate">undelegate</a>


**Constants**

<a href="#dom">DOM</a>






<hr />

<details>
<summary><strong id="component"><code>class</code>  Component</strong></summary><br />
    


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













</details>

<hr />

<details>
<summary><strong id="baseelement"><code>class</code>  BaseElement</strong></summary><br />
    


<strong>Extends:</strong> <a href="#element">Element</a>

<p>

The abstact HTMLElement that Component extends.
It proxies the DOM.Element class.

</p>













</details>

<hr />

<details>
<summary><strong id="render"><code>method</code>  render</strong></summary><br />



<p>

Render a set of Nodes into another, with some checks for Nodes in order to avoid
useless changes in the tree and to mantain or update the state of compatible Nodes.

</p>

<details>
<summary>
<code>(node: HTMLElement), input: <a href="#template">Template</a>), scope?: <a href="#scope">Scope</a>), previousResult?: <a href="#template">Template</a>[]), filter?: <a href="#templatefilter">TemplateFilter</a>)): <a href="#template">Template</a>|<a href="#template">Template</a>[]|void</code>
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
            <td>scope</td>
            <td><code><a href="#scope">Scope</a></code></td>
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





</details>

<hr />

<details>
<summary><strong id="define"><code>method</code>  define</strong></summary><br />





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





</details>

<hr />

<details>
<summary><strong id="h"><code>method</code>  h</strong></summary><br />



<p>

HyperFunction factory to use as JSX pragma.

</p>

<details>
<summary>
<code>(tag: string|HTMLElement), properties: <a href="#hyperproperties">HyperProperties</a>|null), children: (<a href="#templateitem">TemplateItem</a>[]|<a href="#templateitem">TemplateItem</a>)[])): <a href="#hyperfunction">HyperFunction</a></code>
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
            <td><code>(<a href="#templateitem">TemplateItem</a>[]|<a href="#templateitem">TemplateItem</a>)[]</code></td>
            <td align="center"></td>
            <td>The children of the Node</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#hyperfunction">HyperFunction</a></code> 

</details>





</details>

<hr />

<details>
<summary><strong id="html"><code>method</code>  html</strong></summary><br />



<p>

Compile a template string into virtual DOM template.

</p>

<details>
<summary>
<code>(template: string)): <a href="#interpolatefunction">InterpolateFunction</a></code>
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
            <td><code>string</code></td>
            <td align="center"></td>
            <td>The template to parse</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#interpolatefunction">InterpolateFunction</a></code> The virtual DOM template function

</details>
<details>
<summary>
<code>(template: HTMLTemplateElement)): <a href="#template">Template</a></code>
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
            <td><code>HTMLTemplateElement</code></td>
            <td align="center"></td>
            <td>The template to parse</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#template">Template</a></code> The virtual DOM template function

</details>
<details>
<summary>
<code>(template: HTMLElement)): <a href="#hyperfunction">HyperFunction</a></code>
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
            <td><code>HTMLElement</code></td>
            <td align="center"></td>
            <td>The template to parse</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#hyperfunction">HyperFunction</a></code> The virtual DOM template function

</details>
<details>
<summary>
<code>(template: Text)): <a href="#interpolatefunction">InterpolateFunction</a></code>
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
            <td><code>Text</code></td>
            <td align="center"></td>
            <td>The template to parse</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#interpolatefunction">InterpolateFunction</a></code> The virtual DOM template function

</details>
<details>
<summary>
<code>(template: NodeList)): Array&lt;<a href="#hyperfunction">HyperFunction</a>|<a href="#interpolatefunction">InterpolateFunction</a>&gt;</code>
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
            <td><code>NodeList</code></td>
            <td align="center"></td>
            <td>The template to parse</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>Array&lt;<a href="#hyperfunction">HyperFunction</a>|<a href="#interpolatefunction">InterpolateFunction</a>&gt;</code> The virtual DOM template function

</details>





</details>

<hr />

<details>
<summary><strong id="interpolate"><code>method</code>  interpolate</strong></summary><br />



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
            <td>The expression to interpolate</td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#interpolatefunction">InterpolateFunction</a>|string</code> 

</details>





</details>

<hr />

<details>
<summary><strong id="bootstrap"><code>method</code>  bootstrap</strong></summary><br />



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





</details>

<hr />

<details>
<summary><strong id="property"><code>method</code>  property</strong></summary><br />





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





</details>

<hr />

<details>
<summary><strong id="delegate"><code>method</code>  delegate</strong></summary><br />



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





</details>

<hr />

<details>
<summary><strong id="undelegate"><code>method</code>  undelegate</strong></summary><br />



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





</details>

<hr />

<details>
<summary><strong id="createscope"><code>method</code>  createScope</strong></summary><br />



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





</details>

<hr />

<details>
<summary><strong id="getscope"><code>method</code>  getScope</strong></summary><br />



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





</details>

<hr />

<details>
<summary><strong id="setscope"><code>method</code>  setScope</strong></summary><br />



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





</details>

<hr />

<details>
<summary><strong id="dom"><code>constant</code>  DOM</strong></summary><br />



<p>

DOM is a singleton that components uses to access DOM methods.
By default, it uses browsers' DOM implementation, but it can be set to use a different one.
For example, in a Node context it is possibile to use DNA via the `jsdom` package and updating `DOM.Text` and `DOM.Element` references.
It also handle element life cycle for custom elements unless otherwise specified.

</p>



<strong>Type:</strong>

<pre class="typescript">{
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
    appendChild(parent: HTMLElement, newChild: T): T;
    removeChild(parent: HTMLElement, oldChild: T): T;
    insertBefore(parent: HTMLElement, newChild: T, refChild: Node|null): T;
    replaceChild(parent: HTMLElement, newChild: Node, oldChild: T): T;
    getAttribute(element: HTMLElement, qualifiedName: string): string|null;
    hasAttribute(element: HTMLElement, qualifiedName: string): boolean;
    setAttribute(element: HTMLElement, qualifiedName: string, value: string): void;
    removeAttribute(element: HTMLElement, qualifiedName: string): void;
    getChildNodes(node: Node): readonly Node[]|undefined;
    connect(node: Node): void;
    disconnect(node: Node): void;
}</pre>



</details>

<hr />

<details>
<summary><strong id="hyper_symbol"><code>constant</code>  HYPER_SYMBOL</strong></summary><br />



<p>

Symbol for interpolated functions.

</p>



<strong>Type:</strong>

<pre class="typescript">unique Symbol</pre>



</details>

<hr />

<details>
<summary><strong id="interpolated_symbol"><code>constant</code>  INTERPOLATED_SYMBOL</strong></summary><br />



<p>

Symbol for interpolated functions.

</p>



<strong>Type:</strong>

<pre class="typescript">unique Symbol</pre>



</details>

<hr />

<details>
<summary><strong id="element"><code>constant</code>  Element</strong></summary><br />



<p>

Create a shimmed HTMLElement.
(in some browsers, HTMLElement construction throw errors when not shimmed).

</p>



<strong>Type:</strong>

<pre class="typescript">{
    constructor(): HTMLElement;
    prototype: HTMLElement;
}</pre>



</details>

<hr />

<details>
<summary><strong id="scope_symbol"><code>constant</code>  SCOPE_SYMBOL</strong></summary><br />



<p>

The scope symbol.

</p>



<strong>Type:</strong>

<pre class="typescript">unique Symbol</pre>



</details>

<hr />

<details>
<summary><strong id="customelement"><code>type</code>  CustomElement</strong></summary><br />

<p>

The interface of Custom Element, as described by the W3C.

</p>



<pre class="typescript">HTMLElement & {
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: null|string, newValue: null|string): void;
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
    render(): void;
}</pre>

<strong>See also</strong>

* [https://w3c.github.io/webcomponents/spec/custom/](https://w3c.github.io/webcomponents/spec/custom/) W3C specification.

</details>

<hr />

<details>
<summary><strong id="template"><code>type</code>  Template</strong></summary><br />





<pre class="typescript"><a href="#templateitem">TemplateItem</a>|<a href="#templateitem">TemplateItem</a>[]</pre>



</details>

<hr />

<details>
<summary><strong id="templateitem"><code>type</code>  TemplateItem</strong></summary><br />





<pre class="typescript">HTMLElement|Text|Function|<a href="#hyperfunction">HyperFunction</a>|<a href="#interpolatefunction">InterpolateFunction</a>|Promise&lt;any&gt;|string|boolean</pre>



</details>

<hr />

<details>
<summary><strong id="hyperfunction"><code>type</code>  HyperFunction</strong></summary><br />

<p>

A HyperFunction (built by the `h` method with a tag name, a list of properties and children)
returns a Template result for a given previous node at the current position in a render context.

</p>



<pre class="typescript">((this: <a href="#scope">Scope</a>, previousElement?: HTMLElement): <a href="#template">Template</a>|<a href="#template">Template</a>[]) & {
    [HYPER_SYMBOL]?: true;
}</pre>



</details>

<hr />

<details>
<summary><strong id="scope"><code>type</code>  Scope</strong></summary><br />

<p>

The Scope object set up a chain of scopes for templates in a render context.
It is possibile to assign properties only to a Component's scope,
or create a child scope which inherits properties from the current scope.

</p>



<pre class="typescript">HTMLElement & {
    [key: string]: any;
    $assign(values: {
        [key: string]: any;
    }): void;
    $child(): <a href="#scope">Scope</a>;
}</pre>



</details>

<hr />

<details>
<summary><strong id="interpolatefunction"><code>type</code>  InterpolateFunction</strong></summary><br />





<pre class="typescript">((this: <a href="#scope">Scope</a>): string) & {
    [INTERPOLATED_SYMBOL]?: true;
}</pre>



</details>

<hr />

<details>
<summary><strong id="templatefilter"><code>type</code>  TemplateFilter</strong></summary><br />





<pre class="typescript">(item: HTMLElement|Text): boolean</pre>



</details>

<hr />

<details>
<summary><strong id="definitionconstructor"><code>type</code>  DefinitionConstructor</strong></summary><br />





<pre class="typescript">HTMLElement & {
    constructor(nodeOrProperties?: HTMLElement|{
        [key: string]: any;
    }, properties?: {
        [key: string]: any;
    }): <a href="#customelement">CustomElement</a>;
    prototype: <a href="#customelement">CustomElement</a>;
}</pre>



</details>

<hr />

<details>
<summary><strong id="definitionoptions"><code>type</code>  DefinitionOptions</strong></summary><br />





<pre class="typescript">{
    extends?: string;
}</pre>



</details>

<hr />

<details>
<summary><strong id="hyperproperties"><code>type</code>  HyperProperties</strong></summary><br />





<pre class="typescript">{
    is?: string;
    slot?: string;
    [key: string]: any;
}</pre>



</details>

<hr />

<details>
<summary><strong id="accessordescriptor"><code>type</code>  AccessorDescriptor</strong></summary><br />





<pre class="typescript">PropertyDescriptor & {
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



</details>

<hr />

<details>
<summary><strong id="accessorobserver"><code>type</code>  AccessorObserver</strong></summary><br />





<pre class="typescript">(oldValue: any, newValue: any): any</pre>



</details>

<hr />

<details>
<summary><strong id="delegatedeventcallback"><code>type</code>  DelegatedEventCallback</strong></summary><br />

<p>

Describe the signature of a delegated event callback.

</p>



<pre class="typescript">(event: Event, target?: HTMLElement): any</pre>



</details>

<hr />

<details>
<summary><strong id="scoped"><code>type</code>  Scoped</strong></summary><br />

<p>

A Scoped object has a Scope instance attached, in order to use it in a render context.

</p>



<pre class="typescript">{
    [SCOPE_SYMBOL]?: <a href="#scope">Scope</a>;
}</pre>



</details>