export const ComponentMixin = (SuperClass) => class extends SuperClass {
    get is() {
        return this.getAttribute('is') || this.localName;
    }
    /**
     * Fires when an instance was inserted into the document.
     */
    connectedCallback() {}
    /**
     * Fires when an instance was detached from the document.
     */
    disconnectedCallback() {}
    /**
     * Fires when an attribute was added, removed, or updated.
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback() {}
};
