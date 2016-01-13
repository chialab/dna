<a name="DNAComponents"></a>
## DNAComponents
**Kind**: global class  

* [DNAComponents](#DNAComponents)
    * [`new DNAComponents()`](#new_DNAComponents_new)
    * [`.register(fn, options)`](#DNAComponents.register) ⇒ <code>function</code>
    * [`.classToElement(fn)`](#DNAComponents.classToElement) ⇒ <code>String</code>
    * [`.elementToClass(fn)`](#DNAComponents.elementToClass) ⇒ <code>String</code>

<a name="new_DNAComponents_new"></a>
### `new DNAComponents()`
Helper class

<a name="DNAComponents.register"></a>
### `DNAComponents.register(fn, options)` ⇒ <code>function</code>
Trigger `onRegister` callbacks and register the Custom Element (if the `skipWebComponent` option !== true).

**Kind**: static method of <code>[DNAComponents](#DNAComponents)</code>  
**Returns**: <code>function</code> - The Custom Element constructor.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> &#124; <code>String</code> | The definition or the tag name of the Custom Element. |
| options | <code>Object</code> | A set of options for the registration of the Custom Element. |

<a name="DNAComponents.classToElement"></a>
### `DNAComponents.classToElement(fn)` ⇒ <code>String</code>
Convert a Class name into HTML tag.

**Kind**: static method of <code>[DNAComponents](#DNAComponents)</code>  
**Returns**: <code>String</code> - The tag name for the Custom Element.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>Class</code> | Grab the tag name from this class. |

<a name="DNAComponents.elementToClass"></a>
### `DNAComponents.elementToClass(fn)` ⇒ <code>String</code>
Convert a HTML tag into a Class name.

**Kind**: static method of <code>[DNAComponents](#DNAComponents)</code>  
**Returns**: <code>String</code> - The class name for the Custom Element.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>Class</code> | Grab the class name from this tag. |

