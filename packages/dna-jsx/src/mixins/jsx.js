export const JSXTemplateMixin = (superClass) => class extends superClass {
    render() {
        return this.template;
    }
};
