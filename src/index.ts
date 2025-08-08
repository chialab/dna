import './polyfill';

export type {
    AnchorHTMLAttributes,
    AreaHTMLAttributes,
    AriaAttributes,
    AriaRole,
    BaseHTMLAttributes,
    BlockquoteHTMLAttributes,
    ButtonHTMLAttributes,
    CanvasHTMLAttributes,
    ColgroupHTMLAttributes,
    ColHTMLAttributes,
    DataHTMLAttributes,
    DelHTMLAttributes,
    DetailsHTMLAttributes,
    DialogHTMLAttributes,
    EmbedHTMLAttributes,
    FieldsetHTMLAttributes,
    FormHTMLAttributes,
    HTMLAttributeReferrerPolicy,
    HTMLAttributes,
    HtmlHTMLAttributes,
    IframeHTMLAttributes,
    ImgHTMLAttributes,
    InputHTMLAttributes,
    InsHTMLAttributes,
    IntrinsicElementAttributes,
    KeygenHTMLAttributes,
    LabelHTMLAttributes,
    LiHTMLAttributes,
    LinkHTMLAttributes,
    MapHTMLAttributes,
    MediaHTMLAttributes,
    MenuHTMLAttributes,
    MetaHTMLAttributes,
    MeterHTMLAttributes,
    ObjectHTMLAttributes,
    OlHTMLAttributes,
    OptgroupHTMLAttributes,
    OptionHTMLAttributes,
    OutputHTMLAttributes,
    ParamHTMLAttributes,
    ProgressHTMLAttributes,
    QuoteHTMLAttributes,
    ScriptHTMLAttributes,
    SelectHTMLAttributes,
    SlotHTMLAttributes,
    SourceHTMLAttributes,
    StyleHTMLAttributes,
    SVGAttributes,
    TableHTMLAttributes,
    TdHTMLAttributes,
    TextareaHTMLAttributes,
    ThHTMLAttributes,
    TimeHTMLAttributes,
    TrackHTMLAttributes,
    VideoHTMLAttributes,
} from './Attributes';
export type { ComponentConstructor, ComponentInstance } from './Component';
export {
    Component,
    customElement,
    define,
    extend,
    HTML,
    isComponent,
    isComponentConstructor,
} from './Component';
export { css } from './css';
export { $await, $parse, $until } from './directives';
export type { HTMLTagNameMap, SVGTagNameMap } from './Elements';
export type {
    AsyncEvent,
    DelegatedEventCallback,
    DelegatedEventDescriptor,
    EventHandler,
    EventType,
    ListenerConfig,
} from './events';
export {
    defineListeners,
    delegateEventListener,
    dispatchAsyncEvent,
    dispatchEvent,
    fires,
    listen,
    undelegateEventListener,
} from './events';
export type {
    FunctionComponent,
    JSXInternal as JSX,
    Props,
    Template,
    VElement,
    VFunction,
    VObject,
    VSlot,
    VTag,
} from './JSX';
export { compile, Fragment, h, html, jsx, jsxDEV, jsxs } from './JSX';
export type { PropertyConfig, PropertyDeclaration, PropertyObserver } from './property';
export {
    defineProperties,
    defineProperty,
    getProperties,
    getProperty,
    observe,
    property,
    state,
} from './property';
export type { Context } from './render';
export { render } from './render';
