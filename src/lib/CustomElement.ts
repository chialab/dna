export type CustomElement = HTMLElement & {
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
    attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: null | string): void;
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;
};
