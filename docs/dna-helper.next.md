<a name="DNAHelper"></a>
## DNAHelper
**Kind**: global class  

* [DNAHelper](#DNAHelper)
    * [`new DNAHelper()`](#new_DNAHelper_new)
    * [`.register(fn, options)`](#DNAHelper.register) ⇒ <code>function</code>
    * [`.classToElement(fn)`](#DNAHelper.classToElement) ⇒ <code>String</code>
    * [`.elementToClass(fn)`](#DNAHelper.elementToClass) ⇒ <code>String</code>

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

