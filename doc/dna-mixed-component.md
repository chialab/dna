<a name="DNAMixedComponent"></a>
## DNAMixedComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAMixedComponent](#DNAMixedComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAMixedComponent()`](#new_DNAMixedComponent_new)
    * _instance_
        * [`.detachedCallback()`](#DNAMixedComponent+detachedCallback)
    * _static_
        * [`.onRegister()`](#DNAMixedComponent.onRegister)

<a name="new_DNAMixedComponent_new"></a>
### `new DNAMixedComponent()`
This is another model to use to create DNA Custom Components mixing a list of prototypes.
Implement a get method for the `behaviors` property which returns a list of Prototypes.

<a name="DNAMixedComponent+detachedCallback"></a>
### `dnaMixedComponent.detachedCallback()`
Fires when an instance was detached from the document.

**Kind**: instance method of <code>[DNAMixedComponent](#DNAMixedComponent)</code>  
<a name="DNAMixedComponent.onRegister"></a>
### `DNAMixedComponent.onRegister()`
Attach behaviors' static and class methods and properties to the current class.
Trigger all `init` static methods of the implemented behaviors.

**Kind**: static method of <code>[DNAMixedComponent](#DNAMixedComponent)</code>  
