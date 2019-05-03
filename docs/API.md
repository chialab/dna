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
    


<strong>Extends:</strong> <a href="#abstractelement">AbstractElement</a>





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
            <td><code><a href="#accessordescriptors">AccessorDescriptors</a></code></td>
            <td align="center">✓</td>
            <td></td></tr>
<tr>
            <td>events</td>
            <td><code><a href="#eventdescriptors">EventDescriptors</a></code></td>
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
<code>(event: string), selector: string), callback: <a href="#eventcallback">EventCallback</a>)): void</code>
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
            <td><code><a href="#eventcallback">EventCallback</a></code></td>
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
<code>(event?: string), selector?: string), callback?: <a href="#eventcallback">EventCallback</a>)): void</code>
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
            <td><code><a href="#eventcallback">EventCallback</a></code></td>
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

Create a new Patch instance.

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
<code>(element: HTMLElement), eventName: string), selector: string|undefined), callback: <a href="#eventcallback">EventCallback</a>)): void</code>
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
            <td><code><a href="#eventcallback">EventCallback</a></code></td>
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
<code>(element: HTMLElement), eventName?: string), selector?: string), callback?: <a href="#eventcallback">EventCallback</a>)): void</code>
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
            <td><code><a href="#eventcallback">EventCallback</a></code></td>
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





<details>
<summary>
<code>(prototype: any)): <a href="#scope">Scope</a></code>
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
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#scope">Scope</a></code> 

</details>





</details>

<hr />

<details>
<summary><strong id="createfilterabletemplateitems"><code>method</code>  createFilterableTemplateItems</strong></summary><br />





<details>
<summary>
<code>(items: <a href="#templateitem">TemplateItem</a>[]), filter: <a href="#templatefilter">TemplateFilter</a>)): <a href="#templateitem">TemplateItem</a>[] & <a href="#filterable">Filterable</a></code>
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
            <td>items</td>
            <td><code><a href="#templateitem">TemplateItem</a>[]</code></td>
            <td align="center"></td>
            <td></td></tr>
<tr>
            <td>filter</td>
            <td><code><a href="#templatefilter">TemplateFilter</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#templateitem">TemplateItem</a>[] & <a href="#filterable">Filterable</a></code> 

</details>





</details>

<hr />

<details>
<summary><strong id="getscope"><code>method</code>  getScope</strong></summary><br />





<details>
<summary>
<code>(prototype: any)): <a href="#scope">Scope</a>|undefined</code>
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
            <td><code>any</code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#scope">Scope</a>|undefined</code> 

</details>





</details>

<hr />

<details>
<summary><strong id="setscope"><code>method</code>  setScope</strong></summary><br />





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
            <td></td></tr>
<tr>
            <td>scope</td>
            <td><code><a href="#scope">Scope</a></code></td>
            <td align="center"></td>
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code>void</code> 

</details>





</details>

<hr />

<details>
<summary><strong id="getslotted"><code>method</code>  getSlotted</strong></summary><br />





<details>
<summary>
<code>(target: any)): <a href="#templateitem">TemplateItem</a>[]</code>
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
            <td></td>
        </tr>
    </tbody>
</table>

<strong>Returns</strong>: <code><a href="#templateitem">TemplateItem</a>[]</code> 

</details>





</details>

<hr />

<details>
<summary><strong id="setslotted"><code>method</code>  setSlotted</strong></summary><br />





<details>
<summary>
<code>(target: any), slotted: <a href="#templateitem">TemplateItem</a>[])): void</code>
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
            <td></td></tr>
<tr>
            <td>slotted</td>
            <td><code><a href="#templateitem">TemplateItem</a>[]</code></td>
            <td align="center"></td>
            <td></td>
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
    appendChild(parent: HTMLElement, newChild: T): T;
    removeChild(parent: HTMLElement, oldChild: T): T;
    insertBefore(parent: HTMLElement, newChild: T, refChild: Node|null): T;
    replaceChild(parent: HTMLElement, newChild: Node, oldChild: T): T;
    getAttribute(element: HTMLElement, qualifiedName: string): string|null;
    hasAttribute(element: HTMLElement, qualifiedName: string): boolean;
    setAttribute(element: HTMLElement, qualifiedName: string, value: string): void;
    removeAttribute(element: HTMLElement, qualifiedName: string): void;
    getChildNodes(node: Node): Node[]|undefined;
    connect(node: Node): void;
    disconnect(node: Node): void;
}</pre>



</details>

<hr />

<details>
<summary><strong id="abstractelement"><code>constant</code>  AbstractElement</strong></summary><br />



<p>

The abstact HTMLElement that Component extends.
It proxies the DOM.Element class.

</p>



<strong>Type:</strong>

<pre>{
    constructor(): {
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
        addEventListener(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]): any, options?: boolean|AddEventListenerOptions|undefined): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions|undefined): void;
        removeEventListener(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]): any, options?: boolean|EventListenerOptions|undefined): void;
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
        innerHTML: string;
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
        closest(selector: K): HTMLElementTagNameMap[K]|null;
        closest(selector: K): SVGElementTagNameMap[K]|null;
        closest(selector: string): Element|null;
        getAttribute(qualifiedName: string): string|null;
        getAttributeNS(namespace: string|null, localName: string): string|null;
        getAttributeNames(): string[];
        getAttributeNode(name: string): Attr|null;
        getAttributeNodeNS(namespaceURI: string, localName: string): Attr|null;
        getBoundingClientRect(): DOMRect|ClientRect;
        getClientRects(): ClientRectList|DOMRectList;
        getElementsByClassName(classNames: string): HTMLCollectionOf&lt;Element&gt;;
        getElementsByTagName(qualifiedName: K): HTMLCollectionOf&lt;HTMLElementTagNameMap[K]&gt;;
        getElementsByTagName(qualifiedName: K): HTMLCollectionOf&lt;SVGElementTagNameMap[K]&gt;;
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
        previousSibling: Node|null;
        textContent: string|null;
        appendChild(newChild: T): T;
        cloneNode(deep?: boolean|undefined): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node|null): boolean;
        getRootNode(options?: GetRootNodeOptions|undefined): Node;
        hasChildNodes(): boolean;
        insertBefore(newChild: T, refChild: Node|null): T;
        isDefaultNamespace(namespace: string|null): boolean;
        isEqualNode(otherNode: Node|null): boolean;
        isSameNode(otherNode: Node|null): boolean;
        lookupNamespaceURI(prefix: string|null): string|null;
        lookupPrefix(namespace: string|null): string|null;
        normalize(): void;
        removeChild(oldChild: T): T;
        replaceChild(newChild: Node, oldChild: T): T;
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
        dispatchEvent(event: Event): boolean;
        childElementCount: number;
        children: HTMLCollection;
        firstElementChild: Element|null;
        lastElementChild: Element|null;
        append(nodes: (string|Node)[]): void;
        prepend(nodes: (string|Node)[]): void;
        querySelector(selectors: K): HTMLElementTagNameMap[K]|null;
        querySelector(selectors: K): SVGElementTagNameMap[K]|null;
        querySelector(selectors: string): E|null;
        querySelectorAll(selectors: K): NodeListOf&lt;HTMLElementTagNameMap[K]&gt;;
        querySelectorAll(selectors: K): NodeListOf&lt;SVGElementTagNameMap[K]&gt;;
        querySelectorAll(selectors: string): NodeListOf&lt;E&gt;;
        nextElementSibling: Element|null;
        previousElementSibling: Element|null;
        after(nodes: (string|Node)[]): void;
        before(nodes: (string|Node)[]): void;
        remove(): void;
        replaceWith(nodes: (string|Node)[]): void;
        animate(keyframes: PropertyIndexedKeyframes|Keyframe[]|null, options?: number|KeyframeAnimationOptions|undefined): Animation;
        getAnimations(): Animation[];
        onabort: ((this: GlobalEventHandlers, ev: UIEvent): any)|null;
        onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent): any)|null;
        onauxclick: ((this: GlobalEventHandlers, ev: Event): any)|null;
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
        onloadend: ((this: GlobalEventHandlers, ev: ProgressEvent): any)|null;
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
        onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent): any)|null;
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
        ontouchcancel: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null;
        ontouchend: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null;
        ontouchmove: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null;
        ontouchstart: ((this: GlobalEventHandlers, ev: TouchEvent): any)|null;
        ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent): any)|null;
        onvolumechange: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onwaiting: ((this: GlobalEventHandlers, ev: Event): any)|null;
        onwheel: ((this: GlobalEventHandlers, ev: WheelEvent): any)|null;
        oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent): any)|null;
        oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent): any)|null;
        onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent): any)|null;
        contentEditable: string;
        inputMode: string;
        isContentEditable: boolean;
        dataset: DOMStringMap;
        nonce?: string|undefined;
        tabIndex: number;
        blur(): void;
        focus(options?: FocusOptions|undefined): void;
        style: CSSStyleDeclaration;
    };
}</pre>



</details>

<hr />

<details>
<summary><strong id="filter_symbol"><code>constant</code>  FILTER_SYMBOL</strong></summary><br />







<strong>Type:</strong>

<pre>unique Symbol</pre>



</details>

<hr />

<details>
<summary><strong id="customelement"><code>type</code>  CustomElement</strong></summary><br />





<pre>HTMLElement & {
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
    attributeChangedCallback(attributeName: string, oldValue: null|string, newValue: null|string): void;
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
}</pre>



</details>

<hr />

<details>
<summary><strong id="template"><code>type</code>  Template</strong></summary><br />





<pre><a href="#templateitem">TemplateItem</a>|<a href="#templateitem">TemplateItem</a>[]</pre>



</details>

<hr />

<details>
<summary><strong id="templateitem"><code>type</code>  TemplateItem</strong></summary><br />





<pre>HTMLElement|Text|Function|<a href="#hyperfunction">HyperFunction</a>|<a href="#interpolatefunction">InterpolateFunction</a>|Promise&lt;any&gt;|string|boolean</pre>



</details>

<hr />

<details>
<summary><strong id="hyperfunction"><code>type</code>  HyperFunction</strong></summary><br />





<pre>(this: <a href="#scope">Scope</a>, previousElement?: HTMLElement): <a href="#template">Template</a>|<a href="#template">Template</a>[]</pre>



</details>

<hr />

<details>
<summary><strong id="scope"><code>type</code>  Scope</strong></summary><br />





<pre>{
    [key: string]: any;
    $assign(values: {
        [key: string]: any;
    }): void;
    $child(): <a href="#scope">Scope</a>;
} & HTMLElement</pre>



</details>

<hr />

<details>
<summary><strong id="interpolatefunction"><code>type</code>  InterpolateFunction</strong></summary><br />





<pre>(this: <a href="#scope">Scope</a>): string</pre>



</details>

<hr />

<details>
<summary><strong id="templatefilter"><code>type</code>  TemplateFilter</strong></summary><br />





<pre>(item: HTMLElement|Text): boolean</pre>



</details>

<hr />

<details>
<summary><strong id="definitionconstructor"><code>type</code>  DefinitionConstructor</strong></summary><br />





<pre>HTMLElement & {
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





<pre>{
    extends?: string;
}</pre>



</details>

<hr />

<details>
<summary><strong id="hyperproperties"><code>type</code>  HyperProperties</strong></summary><br />





<pre>{
    is?: string;
    slot?: string;
    [key: string]: any;
}</pre>



</details>

<hr />

<details>
<summary><strong id="accessordescriptor"><code>type</code>  AccessorDescriptor</strong></summary><br />





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



</details>

<hr />

<details>
<summary><strong id="accessorobserver"><code>type</code>  AccessorObserver</strong></summary><br />





<pre>(oldValue: any, newValue: any): any</pre>



</details>

<hr />

<details>
<summary><strong id="eventcallback"><code>type</code>  EventCallback</strong></summary><br />





<pre>(event: Event, target?: HTMLElement): any</pre>



</details>

<hr />

<details>
<summary><strong id="accessordescriptors"><code>type</code>  AccessorDescriptors</strong></summary><br />





<pre>{
    [key: string]: <a href="#accessordescriptor">AccessorDescriptor</a>;
}</pre>



</details>

<hr />

<details>
<summary><strong id="eventdescriptors"><code>type</code>  EventDescriptors</strong></summary><br />





<pre>{
    [key: string]: <a href="#eventcallback">EventCallback</a>;
}</pre>



</details>

<hr />

<details>
<summary><strong id="filterable"><code>type</code>  Filterable</strong></summary><br />





<pre>{
    [FILTER_SYMBOL]?: <a href="#templatefilter">TemplateFilter</a>;
}</pre>



</details>