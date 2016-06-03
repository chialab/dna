## Constants

<dl>
<dt><a href="#REGISTRY">`REGISTRY`</a> : <code>Object</code></dt>
<dd><p>A list of registered DNA components.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#classToElement">`classToElement(fn)`</a> ⇒ <code>String</code></dt>
<dd><p>Convert a Class name into HTML tag.</p>
</dd>
<dt><a href="#getDescriptor">`getDescriptor(ctr, prop)`</a> ⇒ <code>object</code></dt>
<dd><p>Get an element&#39;s property descriptor.</p>
</dd>
<dt><a href="#wrapDescriptorGet">`wrapDescriptorGet(prop, descriptor, value)`</a> ⇒ <code>function</code></dt>
<dd><p>Wrap a property descriptor get function or create a new one.</p>
</dd>
<dt><a href="#wrapDescriptorSet">`wrapDescriptorSet(prop, descriptor, callback)`</a> ⇒ <code>function</code></dt>
<dd><p>Wrap a property descriptor set function or create a new one.</p>
</dd>
<dt><a href="#camelToDash">`camelToDash(str)`</a> ⇒ <code>string</code></dt>
<dd><p>Convert a string from camelCase to dash-case.</p>
</dd>
<dt><a href="#dashToCamel">`dashToCamel(str)`</a> ⇒ <code>string</code></dt>
<dd><p>Convert a string from dash-case to camelCase.</p>
</dd>
<dt><a href="#digest">`digest(fn, options)`</a> ⇒ <code>Object</code></dt>
<dd><p>Normalize the <code>register</code> method arguments.</p>
</dd>
<dt><a href="#wrapPrototype">`wrapPrototype(main, currentProto, includeFunctions, callback)`</a></dt>
<dd><p>Wrap prototype properties in top-level element.</p>
</dd>
<dt><a href="#registry">`registry(tagName, constructor)`</a></dt>
<dd><p>Add an entry to the DNA registry.</p>
</dd>
<dt><a href="#register">`register(tagName, options)`</a> ⇒ <code>function</code></dt>
<dd><p>Trigger <code>onRegister</code> callbacks.</p>
</dd>
</dl>

<a name="REGISTRY"></a>

## `REGISTRY` : <code>Object</code>
A list of registered DNA components.

**Kind**: global constant  
<a name="classToElement"></a>

## `classToElement(fn)` ⇒ <code>String</code>
Convert a Class name into HTML tag.

**Kind**: global function  
**Returns**: <code>String</code> - The tag name for the Custom Element.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>Class</code> | Grab the tag name from this class. |

<a name="getDescriptor"></a>

## `getDescriptor(ctr, prop)` ⇒ <code>object</code>
Get an element's property descriptor.

**Kind**: global function  
**Returns**: <code>object</code> - The descriptor of the property.  

| Param | Type | Description |
| --- | --- | --- |
| ctr | <code>function</code> | The element constructor. |
| prop | <code>string</code> | The property to analyze. |

<a name="wrapDescriptorGet"></a>

## `wrapDescriptorGet(prop, descriptor, value)` ⇒ <code>function</code>
Wrap a property descriptor get function or create a new one.

**Kind**: global function  
**Returns**: <code>function</code> - The descriptor get function wrapped.  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>string</code> | The property to wrap. |
| descriptor | <code>object</code> | The property descriptor. |
| value | <code>\*</code> | The initial value. |

<a name="wrapDescriptorSet"></a>

## `wrapDescriptorSet(prop, descriptor, callback)` ⇒ <code>function</code>
Wrap a property descriptor set function or create a new one.

**Kind**: global function  
**Returns**: <code>function</code> - The descriptor set function wrapped.  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>string</code> | The property to wrap. |
| descriptor | <code>object</code> | The property descriptor. |
| callback | <code>function</code> | An optional callback to trigger on set. |

<a name="camelToDash"></a>

## `camelToDash(str)` ⇒ <code>string</code>
Convert a string from camelCase to dash-case.

**Kind**: global function  
**Returns**: <code>string</code> - The converted string.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to convert. |

<a name="dashToCamel"></a>

## `dashToCamel(str)` ⇒ <code>string</code>
Convert a string from dash-case to camelCase.

**Kind**: global function  
**Returns**: <code>string</code> - The converted string.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to convert. |

<a name="digest"></a>

## `digest(fn, options)` ⇒ <code>Object</code>
Normalize the `register` method arguments.

**Kind**: global function  
**Returns**: <code>Object</code> - A descriptor of the component with `tagName`, `config` and `scope` keys.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> &#124; <code>String</code> | The definition or the tag name of the Custom Element. |
| options | <code>Object</code> &#124; <code>function</code> | A set of options or the Component class                                     for the registration of the Custom Element. |

<a name="wrapPrototype"></a>

## `wrapPrototype(main, currentProto, includeFunctions, callback)`
Wrap prototype properties in top-level element.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| main | <code>Object</code> | The top-level element which needs the prototype properties. |
| currentProto | <code>Object</code> | The current prototype to analyze. |
| includeFunctions | <code>Boolean</code> | Should deine methods too. |
| callback | <code>function</code> | A setter callback for the property (optional). |

<a name="registry"></a>

## `registry(tagName, constructor)`
Add an entry to the DNA registry.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tagName | <code>String</code> | The tag name of the Component. |
| constructor | <code>function</code> | The Component constructor. |

<a name="register"></a>

## `register(tagName, options)` ⇒ <code>function</code>
Trigger `onRegister` callbacks.

**Kind**: global function  
**Returns**: <code>function</code> - The Component constructor.  

| Param | Type | Description |
| --- | --- | --- |
| tagName | <code>function</code> &#124; <code>String</code> | The definition or the tag name of the Component. |
| options | <code>Object</code> | A set of options for the registration of the Component. |

