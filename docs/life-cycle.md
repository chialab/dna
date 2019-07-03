# Life cycle

DNA Components follow the Custom Element life cycle specification, with the addition of the `propertyChangedCallback`. The complete list of methods is:
* [connectedCallback](#connectedcallback)
* [disconnectedCallback](#disconnectedcallback)
* [attributeChangedCallback](#attributechangedcallback)
* [propertyChangedCallback](#propertychangedcallback)

Life cycle methods are dispatched by the DNA Virtual DOM implementation by default. When you are not using templates to update the tree, always use the [`DOM`](#manipulating-the-dom) helper. You can disable this behavior and use native Custom Elements life cycle with the instruction `DOM.useLifeCycle(false)`.


### connectedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):
> Invoked each time the custom element is appended into a document-connected element. This will happen each time the node is moved, and may happen before the element's contents have been fully parsed. `connectedCallback` may be called once your element is no longer connected, use `Node.isConnected` to make sure.

### disconnectedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):
> Invoked each time the custom element is disconnected from the document's DOM.

### attributeChangedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):
> Invoked each time one of the custom element's attributes is added, removed, or changed.

The method receives the attribute name as first argument, as well as the new value and the previous value (default `null`).

### propertyChangedCallback

This method is very similar to `attributeChangedCallback` and it is invoked each time one of the element's property is changed.

The signature is equivalent too: it receives the property name as first argument, as well as the new value and the previous value (default `undefined`).

## Manipulating the DOM

Since DNA does not require any Custom Elements polyfill, the life cycle is delegated to the Virtual DOM which uses the `DOM` helper under the hood. This helper invokes the life cycle methods for each DOM operation like `appendChild`, `removeChild` etc.
If you want to manipulate the DOM tree outside of a render cycle, always use `DOM` methods instead of the Element prototype:

```ts
// don't
parentElement.appendChild(childElement);
// DO!
DOM.appendChild(parentElement, childElement);
```

All methods inherit the prototype signature with the context node as first argument:

| `Element.prototype` | `DOM` helper |
| :------------------- | :------------ |
| `appendChild(newChild)` | `appendChild(parent, newChild)` |
| `removeChild(newChild)` | `removeChild(parent, newChild)` |
| `insertBefore(newChild, refChild)` | `removeChild(parent, newChild, refChild)` |
| `replaceChild(newChild, oldChild)` | `removeChild(parent, newChild, oldChild)` |
| `getAttribute(qualifiedName)` | `getAttribute(element, qualifiedName)` |
| `hasAttribute(qualifiedName)` | `hasAttribute(element, qualifiedName)` |
| `setAttribute(qualifiedName, value)` | `setAttribute(element, qualifiedName, value)` |
| `removeAttribute(qualifiedName)` | `removeAttribute(element, qualifiedName)` |

<aside class="note">

Please note that all DNA Components already wrap those methods with the `DOM` helper.

</aside>
