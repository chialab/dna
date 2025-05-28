import './polyfill';

export { h, compile, html, Fragment, jsx, jsxs, jsxDEV } from './JSX';
export { render } from './render';
export { css } from './css';
export {
    listen,
    delegateEventListener,
    undelegateEventListener,
    dispatchEvent,
    dispatchAsyncEvent,
    defineListeners,
} from './events';
export {
    property,
    state,
    observe,
    getProperty,
    getProperties,
    defineProperties,
    defineProperty,
} from './property';
export {
    define,
    extend,
    HTML,
    Component,
    isComponent,
    isComponentConstructor,
    customElement,
} from './Component';
export { $parse, $await, $until } from './directives';

export type { HTMLTagNameMap, SVGTagNameMap } from './Elements';
export type {
    AriaAttributes,
    AriaRole,
    HTMLAttributes,
    HTMLAttributeReferrerPolicy,
    AnchorHTMLAttributes,
    AreaHTMLAttributes,
    BaseHTMLAttributes,
    BlockquoteHTMLAttributes,
    ButtonHTMLAttributes,
    CanvasHTMLAttributes,
    ColHTMLAttributes,
    ColgroupHTMLAttributes,
    DataHTMLAttributes,
    DetailsHTMLAttributes,
    DelHTMLAttributes,
    DialogHTMLAttributes,
    EmbedHTMLAttributes,
    FieldsetHTMLAttributes,
    FormHTMLAttributes,
    HtmlHTMLAttributes,
    IframeHTMLAttributes,
    ImgHTMLAttributes,
    InputHTMLAttributes,
    InsHTMLAttributes,
    KeygenHTMLAttributes,
    LabelHTMLAttributes,
    LiHTMLAttributes,
    LinkHTMLAttributes,
    MapHTMLAttributes,
    MenuHTMLAttributes,
    MediaHTMLAttributes,
    MetaHTMLAttributes,
    MeterHTMLAttributes,
    QuoteHTMLAttributes,
    ObjectHTMLAttributes,
    OlHTMLAttributes,
    OptgroupHTMLAttributes,
    OptionHTMLAttributes,
    OutputHTMLAttributes,
    ParamHTMLAttributes,
    ProgressHTMLAttributes,
    SlotHTMLAttributes,
    ScriptHTMLAttributes,
    SelectHTMLAttributes,
    SourceHTMLAttributes,
    StyleHTMLAttributes,
    TableHTMLAttributes,
    TextareaHTMLAttributes,
    TdHTMLAttributes,
    ThHTMLAttributes,
    TimeHTMLAttributes,
    TrackHTMLAttributes,
    VideoHTMLAttributes,
    SVGAttributes,
    IntrinsicElementAttributes,
} from './Attributes';
export type {
    Props,
    JSXInternal as JSX,
    FunctionComponent,
    Template,
    VObject,
    VFunction,
    VElement,
    VSlot,
    VTag,
} from './JSX';
export type { Context } from './render';
export type {
    AsyncEvent,
    DelegatedEventCallback,
    DelegatedEventDescriptor,
} from './events';
export type { PropertyDeclaration, PropertyObserver } from './property';
export type { ComponentInstance, ComponentConstructor } from './Component';
