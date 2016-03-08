<a name="DNAHelper"></a>
## DNAHelper
**Kind**: global class  

* [DNAHelper](#DNAHelper)
    * [`new DNAHelper()`](#new_DNAHelper_new)
    * [`.register(fn, options)`](#DNAHelper.register) ⇒ <code>function</code>
    * [`.classToElement(fn)`](#DNAHelper.classToElement) ⇒ <code>String</code>
    * [`.elementToClass(fn)`](#DNAHelper.elementToClass) ⇒ <code>String</code>
    * [`.getDescriptor(ctr, prop)`](#DNAHelper.getDescriptor) ⇒ <code>object</code>
    * [`.wrapDescriptorGet(prop, descriptor)`](#DNAHelper.wrapDescriptorGet) ⇒ <code>function</code>
    * [`.wrapDescriptorSet(prop, descriptor)`](#DNAHelper.wrapDescriptorSet) ⇒ <code>function</code>

<a name="new_DNAHelper_new"></a>
### `new DNAHelper()`
Helper class

<a name="DNAHelper.register"></a>
### `DNAHelper.register(fn, options)` ⇒ <code>function</code>
Trigger `onRegister` callbacks and register the Custom Element (if the `skipWebComponent` option !== true).

**Kind**: static method of <code>[DNAHelper](#DNAHelper)</code>  
**Returns**: <code>function</code> - The Custom Element constructor.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> &#124; <code>String</code> | The definition or the tag name of the Custom Element. |
| options | <code>Object</code> | A set of options for the registration of the Custom Element. |

<a name="DNAHelper.classToElement"></a>
### `DNAHelper.classToElement(fn)` ⇒ <code>String</code>
Convert a Class name into HTML tag.

**Kind**: static method of <code>[DNAHelper](#DNAHelper)</code>  
**Returns**: <code>String</code> - The tag name for the Custom Element.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>Class</code> | Grab the tag name from this class. |

<a name="DNAHelper.elementToClass"></a>
### `DNAHelper.elementToClass(fn)` ⇒ <code>String</code>
Convert a HTML tag into a Class name.

**Kind**: static method of <code>[DNAHelper](#DNAHelper)</code>  
**Returns**: <code>String</code> - The class name for the Custom Element.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>Class</code> | Grab the class name from this tag. |

<a name="DNAHelper.getDescriptor"></a>
### `DNAHelper.getDescriptor(ctr, prop)` ⇒ <code>object</code>
Get an element's property descriptor.

**Kind**: static method of <code>[DNAHelper](#DNAHelper)</code>  
**Returns**: <code>object</code> - The descriptor of the property.  

| Param | Type | Description |
| --- | --- | --- |
| ctr | <code>function</code> | The element constructor. |
| prop | <code>string</code> | The property to analyze. |

<a name="DNAHelper.wrapDescriptorGet"></a>
### `DNAHelper.wrapDescriptorGet(prop, descriptor)` ⇒ <code>function</code>
Wrap a property descriptor get function.

**Kind**: static method of <code>[DNAHelper](#DNAHelper)</code>  
**Returns**: <code>function</code> - The descriptor get function wrapped.  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>string</code> | The property to wrap. |
| descriptor | <code>object</code> | The property descriptor. |

<a name="DNAHelper.wrapDescriptorSet"></a>
### `DNAHelper.wrapDescriptorSet(prop, descriptor)` ⇒ <code>function</code>
Wrap a property descriptor set function.

**Kind**: static method of <code>[DNAHelper](#DNAHelper)</code>  
**Returns**: <code>function</code> - The descriptor set function wrapped.  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>string</code> | The property to wrap. |
| descriptor | <code>object</code> | The property descriptor. |

