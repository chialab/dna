# Life cycle

DNA components follow the Custom Element life cycle specification, with the addition of the `propertyChangedCallback` and `render` methods. The complete list of methods is:
* [connectedCallback](#connectedcallback)
* [disconnectedCallback](#disconnectedcallback)
* [attributeChangedCallback](#attributechangedcallback)
* [propertyChangedCallback](#propertychangedcallback)
* [stateChangedCallback](#statechangedcallback)

Life cycle methods are dispatched by the DNA Virtual DOM implementation by default. When you are not using templates to update the tree, always use the [`DOM`](./render-a-component#manipulating-the-dom) helper.

## connectedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):
> Invoked each time the custom element is appended into a document-connected element. This will happen each time the node is moved, and may happen before the element's contents have been fully parsed. `connectedCallback` may be called once your element is no longer connected, use `Node.isConnected` to make sure.

## disconnectedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):
> Invoked each time the custom element is disconnected from the document's DOM.

## attributeChangedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):
> Invoked each time one of the custom element's attributes is added, removed, or changed.

The method receives the attribute name as first argument, as well as the new value and the previous value (default `null`).

## propertyChangedCallback

This method is very similar to `attributeChangedCallback` and it is invoked each time one of the element's property is changed.

The signature is equivalent too: it receives the property name as first argument, as well as the new value and the previous value (default `undefined`).

## stateChangedCallback

The same of `propertyChangedCallback`, but for stateful properties.
