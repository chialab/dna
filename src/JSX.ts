/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

import type { Observable } from './Observable';
import type { CustomElementConstructor } from './CustomElementRegistry';
import type { Props } from './Component';
import type { FunctionComponent } from './FunctionComponent';
import { createSymbol, isElement } from './helpers';
import { customElements, isCustomElementConstructor } from './CustomElementRegistry';

// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
export interface AriaAttributes {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    'aria-activedescendant'?: string | undefined;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    'aria-atomic'?: boolean | 'false' | 'true' | undefined;
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    'aria-busy'?: boolean | 'false' | 'true' | undefined;
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    'aria-colcount'?: number | undefined;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    'aria-colindex'?: number | undefined;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    'aria-colspan'?: number | undefined;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    'aria-controls'?: string | undefined;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    'aria-describedby'?: string | undefined;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    'aria-details'?: string | undefined;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    'aria-disabled'?: boolean | 'false' | 'true' | undefined;
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined;
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    'aria-errormessage'?: string | undefined;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    'aria-expanded'?: boolean | 'false' | 'true' | undefined;
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    'aria-flowto'?: string | undefined;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    'aria-grabbed'?: boolean | 'false' | 'true' | undefined;
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    'aria-hidden'?: boolean | 'false' | 'true' | undefined;
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    'aria-keyshortcuts'?: string | undefined;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    'aria-label'?: string | undefined;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    'aria-labelledby'?: string | undefined;
    /** Defines the hierarchical level of an element within a structure. */
    'aria-level'?: number | undefined;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
    /** Indicates whether an element is modal when displayed. */
    'aria-modal'?: boolean | 'false' | 'true' | undefined;
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    'aria-multiline'?: boolean | 'false' | 'true' | undefined;
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    'aria-multiselectable'?: boolean | 'false' | 'true' | undefined;
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    'aria-owns'?: string | undefined;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    'aria-placeholder'?: string | undefined;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    'aria-posinset'?: number | undefined;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    'aria-readonly'?: boolean | 'false' | 'true' | undefined;
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals' | undefined;
    /** Indicates that user input is required on the element before a form may be submitted. */
    'aria-required'?: boolean | 'false' | 'true' | undefined;
    /** Defines a human-readable, author-localized description for the role of an element. */
    'aria-roledescription'?: string | undefined;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    'aria-rowcount'?: number | undefined;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    'aria-rowindex'?: number | undefined;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    'aria-rowspan'?: number | undefined;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    'aria-selected'?: boolean | 'false' | 'true' | undefined;
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    'aria-setsize'?: number | undefined;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
    /** Defines the maximum allowed value for a range widget. */
    'aria-valuemax'?: number | undefined;
    /** Defines the minimum allowed value for a range widget. */
    'aria-valuemin'?: number | undefined;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    'aria-valuenow'?: number | undefined;
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    'aria-valuetext'?: string | undefined;
}

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
export type AriaRole =
    | 'alert'
    | 'alertdialog'
    | 'application'
    | 'article'
    | 'banner'
    | 'button'
    | 'cell'
    | 'checkbox'
    | 'columnheader'
    | 'combobox'
    | 'complementary'
    | 'contentinfo'
    | 'definition'
    | 'dialog'
    | 'directory'
    | 'document'
    | 'feed'
    | 'figure'
    | 'form'
    | 'grid'
    | 'gridcell'
    | 'group'
    | 'heading'
    | 'img'
    | 'link'
    | 'list'
    | 'listbox'
    | 'listitem'
    | 'log'
    | 'main'
    | 'marquee'
    | 'math'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'navigation'
    | 'none'
    | 'note'
    | 'option'
    | 'presentation'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'region'
    | 'row'
    | 'rowgroup'
    | 'rowheader'
    | 'scrollbar'
    | 'search'
    | 'searchbox'
    | 'separator'
    | 'slider'
    | 'spinbutton'
    | 'status'
    | 'switch'
    | 'tab'
    | 'table'
    | 'tablist'
    | 'tabpanel'
    | 'term'
    | 'textbox'
    | 'timer'
    | 'toolbar'
    | 'tooltip'
    | 'tree'
    | 'treegrid'
    | 'treeitem'
    | (string & {});

export interface HTMLAttributes extends AriaAttributes {
    accessKey?: string | undefined;
    class?: string | undefined;
    contentEditable?: boolean | 'true' | 'false' | 'inherit' | undefined;
    contextMenu?: string | undefined;
    dir?: string | undefined;
    draggable?: boolean | 'true' | 'false' | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    placeholder?: string | undefined;
    slot?: string | undefined;
    spellCheck?: boolean | 'true' | 'false' | undefined;
    style?: string | undefined;
    tabIndex?: number | undefined;
    title?: string | undefined;
    translate?: 'yes' | 'no' | undefined;

    // Unknown
    radioGroup?: string | undefined; // <command>, <menuitem>

    // WAI-ARIA
    role?: AriaRole | undefined;

    // RDFa Attributes
    about?: string | undefined;
    datatype?: string | undefined;
    inlist?: '';
    prefix?: string | undefined;
    property?: string | undefined;
    resource?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;

    // Non-standard Attributes
    autoCapitalize?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: 'on' | 'off' | undefined;

    // Living Standard
    /**
     * Hints at the type of data that might be entered by the user while editing the element or its contents
     * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
     */
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
    /**
     * Specify that a standard HTML element should behave like a defined custom built-in element
     * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
     */
    is?: string | undefined;
}

export type HTMLAttributeReferrerPolicy = ''
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';

export interface AnchorHTMLAttributes extends HTMLAttributes {
    download?: string;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    ping?: string | undefined;
    rel?: string | undefined;
    target?: '_self' | '_blank' | '_parent' | '_top' | string | undefined;
    type?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
}

export interface AreaHTMLAttributes extends HTMLAttributes {
    alt?: string | undefined;
    coords?: string | undefined;
    download?: string | undefined;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    rel?: string | undefined;
    shape?: string | undefined;
    target?: string | undefined;
}

export interface BaseHTMLAttributes extends HTMLAttributes {
    href?: string | undefined;
    target?: string | undefined;
}

export interface BlockquoteHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
}

export interface ButtonHTMLAttributes extends HTMLAttributes {
    autoFocus?: boolean | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    formAction?: string | undefined;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    name?: string | undefined;
    type?: 'submit' | 'reset' | 'button' | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface CanvasHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    width?: number | string | undefined;
}

export interface ColHTMLAttributes extends HTMLAttributes {
    span?: number | undefined;
    width?: number | string | undefined;
}

export interface ColgroupHTMLAttributes extends HTMLAttributes {
    span?: number | undefined;
}

export interface DataHTMLAttributes extends HTMLAttributes {
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface DetailsHTMLAttributes extends HTMLAttributes {
    open?: boolean | undefined;
}

export interface DelHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
    dateTime?: string | undefined;
}

export interface DialogHTMLAttributes extends HTMLAttributes {
    open?: boolean | undefined;
}

export interface EmbedHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    src?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
}

export interface FieldsetHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | undefined;
    form?: string | undefined;
    name?: string | undefined;
}

export interface FormHTMLAttributes extends HTMLAttributes {
    acceptCharset?: string | undefined;
    action?: string | undefined;
    autoComplete?: string | undefined;
    encType?: string | undefined;
    method?: string | undefined;
    name?: string | undefined;
    noValidate?: boolean | undefined;
    target?: string | undefined;
}

export interface HtmlHTMLAttributes extends HTMLAttributes {
    manifest?: string | undefined;
}

export interface IframeHTMLAttributes extends HTMLAttributes {
    allow?: string | undefined;
    allowFullScreen?: boolean | undefined;
    allowTransparency?: boolean | undefined;
    /** @deprecated */
    frameBorder?: number | string | undefined;
    height?: number | string | undefined;
    loading?: 'eager' | 'lazy' | undefined;
    /** @deprecated */
    marginHeight?: number | undefined;
    /** @deprecated */
    marginWidth?: number | undefined;
    name?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sandbox?: string | undefined;
    /** @deprecated */
    scrolling?: string | undefined;
    seamless?: boolean | undefined;
    src?: string | undefined;
    srcDoc?: string | undefined;
    width?: number | string | undefined;
}

export interface ImgHTMLAttributes extends HTMLAttributes {
    alt?: string | undefined;
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
    decoding?: 'async' | 'auto' | 'sync' | undefined;
    height?: number | string | undefined;
    loading?: 'eager' | 'lazy' | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
}

export interface InputHTMLAttributes extends HTMLAttributes {
    accept?: string | undefined;
    alt?: string | undefined;
    autoComplete?: string | undefined;
    autoFocus?: boolean | undefined;
    capture?: boolean | string | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    checked?: boolean | undefined;
    crossOrigin?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    formAction?: string | undefined;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    height?: number | string | undefined;
    list?: string | undefined;
    max?: number | string | undefined;
    maxLength?: number | undefined;
    min?: number | string | undefined;
    minLength?: number | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    pattern?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    src?: string | undefined;
    step?: number | string | undefined;
    type?: string | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
    width?: number | string | undefined;
}

export interface InsHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
    dateTime?: string | undefined;
}

export interface KeygenHTMLAttributes extends HTMLAttributes {
    autoFocus?: boolean | undefined;
    challenge?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    keyType?: string | undefined;
    keyParams?: string | undefined;
    name?: string | undefined;
}

export interface LabelHTMLAttributes extends HTMLAttributes {
    form?: string | undefined;
    for?: string | undefined;
}

export interface LiHTMLAttributes extends HTMLAttributes {
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface LinkHTMLAttributes extends HTMLAttributes {
    as?: string | undefined;
    crossOrigin?: string | undefined;
    href?: string | undefined;
    hrefLang?: string | undefined;
    integrity?: string | undefined;
    media?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    rel?: string | undefined;
    sizes?: string | undefined;
    type?: string | undefined;
    charSet?: string | undefined;
}

export interface MapHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
}

export interface MenuHTMLAttributes extends HTMLAttributes {
    type?: string | undefined;
}

export interface MediaHTMLAttributes extends HTMLAttributes {
    autoPlay?: boolean | undefined;
    controls?: boolean | undefined;
    controlsList?: string | undefined;
    crossOrigin?: string | undefined;
    loop?: boolean | undefined;
    mediaGroup?: string | undefined;
    muted?: boolean | undefined;
    playsInline?: boolean | undefined;
    preload?: string | undefined;
    src?: string | undefined;
}

export interface MetaHTMLAttributes extends HTMLAttributes {
    charSet?: string | undefined;
    content?: string | undefined;
    httpEquiv?: string | undefined;
    name?: string | undefined;
    media?: string | undefined;
}

export interface MeterHTMLAttributes extends HTMLAttributes {
    form?: string | undefined;
    high?: number | undefined;
    low?: number | undefined;
    max?: number | string | undefined;
    min?: number | string | undefined;
    optimum?: number | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface QuoteHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
}

export interface ObjectHTMLAttributes extends HTMLAttributes {
    classID?: string | undefined;
    data?: string | undefined;
    form?: string | undefined;
    height?: number | string | undefined;
    name?: string | undefined;
    type?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
    wmode?: string | undefined;
}

export interface OlHTMLAttributes extends HTMLAttributes {
    reversed?: boolean | undefined;
    start?: number | undefined;
    type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
}

export interface OptgroupHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | undefined;
    label?: string | undefined;
}

export interface OptionHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | undefined;
    label?: string | undefined;
    selected?: boolean | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface OutputHTMLAttributes extends HTMLAttributes {
    form?: string | undefined;
    for?: string | undefined;
    name?: string | undefined;
}

export interface ParamHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface ProgressHTMLAttributes extends HTMLAttributes {
    max?: number | string | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface SlotHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
}

export interface ScriptHTMLAttributes extends HTMLAttributes {
    async?: boolean | undefined;
    /** @deprecated */
    charSet?: string | undefined;
    crossOrigin?: string | undefined;
    defer?: boolean | undefined;
    integrity?: string | undefined;
    noModule?: boolean | undefined;
    nonce?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    src?: string | undefined;
    type?: string | undefined;
}

export interface SelectHTMLAttributes extends HTMLAttributes {
    autoComplete?: string | undefined;
    autoFocus?: boolean | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

export interface SourceHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    media?: string | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
}

export interface StyleHTMLAttributes extends HTMLAttributes {
    media?: string | undefined;
    nonce?: string | undefined;
    scoped?: boolean | undefined;
    type?: string | undefined;
}

export interface TableHTMLAttributes extends HTMLAttributes {
    cellPadding?: number | string | undefined;
    cellSpacing?: number | string | undefined;
    summary?: string | undefined;
    width?: number | string | undefined;
}

export interface TextareaHTMLAttributes extends HTMLAttributes {
    autoComplete?: string | undefined;
    autoFocus?: boolean | undefined;
    cols?: number | undefined;
    dirName?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    name?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    rows?: number | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
    wrap?: string | undefined;
}

export interface TdHTMLAttributes extends HTMLAttributes {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
    height?: number | string | undefined;
    width?: number | string | undefined;
    valign?: 'top' | 'middle' | 'bottom' | 'baseline' | undefined;
}

export interface ThHTMLAttributes extends HTMLAttributes {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
}

export interface TimeHTMLAttributes extends HTMLAttributes {
    dateTime?: string | undefined;
}

export interface TrackHTMLAttributes extends HTMLAttributes {
    default?: boolean | undefined;
    kind?: string | undefined;
    label?: string | undefined;
    src?: string | undefined;
    srcLang?: string | undefined;
}

export interface VideoHTMLAttributes extends MediaHTMLAttributes {
    height?: number | string | undefined;
    playsInline?: boolean | undefined;
    poster?: string | undefined;
    width?: number | string | undefined;
    disablePictureInPicture?: boolean | undefined;
}

export interface SVGAttributes extends AriaAttributes {
    // Attributes which also defined in HTMLAttributes
    // See comment in SVGDOMPropertyConfig.js
    class?: string | undefined;
    color?: string | undefined;
    height?: number | string | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    max?: number | string | undefined;
    media?: string | undefined;
    method?: string | undefined;
    min?: number | string | undefined;
    name?: string | undefined;
    style?: string | undefined;
    target?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;

    // Other HTML properties supported by SVG elements in browsers
    role?: AriaRole | undefined;
    tabIndex?: number | undefined;
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;

    // SVG Specific attributes
    accentHeight?: number | string | undefined;
    accumulate?: 'none' | 'sum' | undefined;
    additive?: 'replace' | 'sum' | undefined;
    alignmentBaseline?: 'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' | 'central' | 'after-edge' |
    'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | 'inherit' | undefined;
    allowReorder?: 'no' | 'yes' | undefined;
    alphabetic?: number | string | undefined;
    amplitude?: number | string | undefined;
    arabicForm?: 'initial' | 'medial' | 'terminal' | 'isolated' | undefined;
    ascent?: number | string | undefined;
    attributeName?: string | undefined;
    attributeType?: string | undefined;
    autoReverse?: 'true' | 'false' | boolean | undefined;
    azimuth?: number | string | undefined;
    baseFrequency?: number | string | undefined;
    baselineShift?: number | string | undefined;
    baseProfile?: number | string | undefined;
    bbox?: number | string | undefined;
    begin?: number | string | undefined;
    bias?: number | string | undefined;
    by?: number | string | undefined;
    calcMode?: number | string | undefined;
    capHeight?: number | string | undefined;
    clip?: number | string | undefined;
    clipPath?: string | undefined;
    clipPathUnits?: number | string | undefined;
    clipRule?: number | string | undefined;
    colorInterpolation?: number | string | undefined;
    colorInterpolationFilters?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined;
    colorProfile?: number | string | undefined;
    colorRendering?: number | string | undefined;
    contentScriptType?: number | string | undefined;
    contentStyleType?: number | string | undefined;
    cursor?: number | string | undefined;
    cx?: number | string | undefined;
    cy?: number | string | undefined;
    d?: string | undefined;
    decelerate?: number | string | undefined;
    descent?: number | string | undefined;
    diffuseConstant?: number | string | undefined;
    direction?: number | string | undefined;
    display?: number | string | undefined;
    divisor?: number | string | undefined;
    dominantBaseline?: number | string | undefined;
    dur?: number | string | undefined;
    dx?: number | string | undefined;
    dy?: number | string | undefined;
    edgeMode?: number | string | undefined;
    elevation?: number | string | undefined;
    enableBackground?: number | string | undefined;
    end?: number | string | undefined;
    exponent?: number | string | undefined;
    externalResourcesRequired?: 'true' | 'false' | boolean | undefined;
    fill?: string | undefined;
    fillOpacity?: number | string | undefined;
    fillRule?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
    filter?: string | undefined;
    filterRes?: number | string | undefined;
    filterUnits?: number | string | undefined;
    floodColor?: number | string | undefined;
    floodOpacity?: number | string | undefined;
    focusable?: 'true' | 'false' | boolean | 'auto' | undefined;
    fontFamily?: string | undefined;
    fontSize?: number | string | undefined;
    fontSizeAdjust?: number | string | undefined;
    fontStretch?: number | string | undefined;
    fontStyle?: number | string | undefined;
    fontVariant?: number | string | undefined;
    fontWeight?: number | string | undefined;
    format?: number | string | undefined;
    from?: number | string | undefined;
    fx?: number | string | undefined;
    fy?: number | string | undefined;
    g1?: number | string | undefined;
    g2?: number | string | undefined;
    glyphName?: number | string | undefined;
    glyphOrientationHorizontal?: number | string | undefined;
    glyphOrientationVertical?: number | string | undefined;
    glyphRef?: number | string | undefined;
    gradientTransform?: string | undefined;
    gradientUnits?: string | undefined;
    hanging?: number | string | undefined;
    horizAdvX?: number | string | undefined;
    horizOriginX?: number | string | undefined;
    href?: string | undefined;
    ideographic?: number | string | undefined;
    imageRendering?: number | string | undefined;
    in2?: number | string | undefined;
    in?: string | undefined;
    intercept?: number | string | undefined;
    k1?: number | string | undefined;
    k2?: number | string | undefined;
    k3?: number | string | undefined;
    k4?: number | string | undefined;
    k?: number | string | undefined;
    kernelMatrix?: number | string | undefined;
    kernelUnitLength?: number | string | undefined;
    kerning?: number | string | undefined;
    keyPoints?: number | string | undefined;
    keySplines?: number | string | undefined;
    keyTimes?: number | string | undefined;
    lengthAdjust?: number | string | undefined;
    letterSpacing?: number | string | undefined;
    lightingColor?: number | string | undefined;
    limitingConeAngle?: number | string | undefined;
    local?: number | string | undefined;
    markerEnd?: string | undefined;
    markerHeight?: number | string | undefined;
    markerMid?: string | undefined;
    markerStart?: string | undefined;
    markerUnits?: number | string | undefined;
    markerWidth?: number | string | undefined;
    mask?: string | undefined;
    maskContentUnits?: number | string | undefined;
    maskUnits?: number | string | undefined;
    mathematical?: number | string | undefined;
    mode?: number | string | undefined;
    numOctaves?: number | string | undefined;
    offset?: number | string | undefined;
    opacity?: number | string | undefined;
    operator?: number | string | undefined;
    order?: number | string | undefined;
    orient?: number | string | undefined;
    orientation?: number | string | undefined;
    origin?: number | string | undefined;
    overflow?: number | string | undefined;
    overlinePosition?: number | string | undefined;
    overlineThickness?: number | string | undefined;
    paintOrder?: number | string | undefined;
    panose1?: number | string | undefined;
    path?: string | undefined;
    pathLength?: number | string | undefined;
    patternContentUnits?: string | undefined;
    patternTransform?: number | string | undefined;
    patternUnits?: string | undefined;
    pointerEvents?: number | string | undefined;
    points?: string | undefined;
    pointsAtX?: number | string | undefined;
    pointsAtY?: number | string | undefined;
    pointsAtZ?: number | string | undefined;
    preserveAlpha?: 'true' | 'false' | boolean | undefined;
    preserveAspectRatio?: string | undefined;
    primitiveUnits?: number | string | undefined;
    r?: number | string | undefined;
    radius?: number | string | undefined;
    refX?: number | string | undefined;
    refY?: number | string | undefined;
    renderingIntent?: number | string | undefined;
    repeatCount?: number | string | undefined;
    repeatDur?: number | string | undefined;
    requiredExtensions?: number | string | undefined;
    requiredFeatures?: number | string | undefined;
    restart?: number | string | undefined;
    result?: string | undefined;
    rotate?: number | string | undefined;
    rx?: number | string | undefined;
    ry?: number | string | undefined;
    scale?: number | string | undefined;
    seed?: number | string | undefined;
    shapeRendering?: number | string | undefined;
    slope?: number | string | undefined;
    spacing?: number | string | undefined;
    specularConstant?: number | string | undefined;
    specularExponent?: number | string | undefined;
    speed?: number | string | undefined;
    spreadMethod?: string | undefined;
    startOffset?: number | string | undefined;
    stdDeviation?: number | string | undefined;
    stemh?: number | string | undefined;
    stemv?: number | string | undefined;
    stitchTiles?: number | string | undefined;
    stopColor?: string | undefined;
    stopOpacity?: number | string | undefined;
    strikethroughPosition?: number | string | undefined;
    strikethroughThickness?: number | string | undefined;
    string?: number | string | undefined;
    stroke?: string | undefined;
    strokeDasharray?: string | number | undefined;
    strokeDashoffset?: string | number | undefined;
    strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
    strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined;
    strokeMiterlimit?: number | string | undefined;
    strokeOpacity?: number | string | undefined;
    strokeWidth?: number | string | undefined;
    surfaceScale?: number | string | undefined;
    systemLanguage?: number | string | undefined;
    tableValues?: number | string | undefined;
    targetX?: number | string | undefined;
    targetY?: number | string | undefined;
    textAnchor?: string | undefined;
    textDecoration?: number | string | undefined;
    textLength?: number | string | undefined;
    textRendering?: number | string | undefined;
    to?: number | string | undefined;
    transform?: string | undefined;
    u1?: number | string | undefined;
    u2?: number | string | undefined;
    underlinePosition?: number | string | undefined;
    underlineThickness?: number | string | undefined;
    unicode?: number | string | undefined;
    unicodeBidi?: number | string | undefined;
    unicodeRange?: number | string | undefined;
    unitsPerEm?: number | string | undefined;
    vAlphabetic?: number | string | undefined;
    values?: string | undefined;
    vectorEffect?: number | string | undefined;
    version?: string | undefined;
    vertAdvY?: number | string | undefined;
    vertOriginX?: number | string | undefined;
    vertOriginY?: number | string | undefined;
    vHanging?: number | string | undefined;
    vIdeographic?: number | string | undefined;
    viewBox?: string | undefined;
    viewTarget?: number | string | undefined;
    visibility?: number | string | undefined;
    vMathematical?: number | string | undefined;
    widths?: number | string | undefined;
    wordSpacing?: number | string | undefined;
    writingMode?: number | string | undefined;
    x1?: number | string | undefined;
    x2?: number | string | undefined;
    x?: number | string | undefined;
    xChannelSelector?: string | undefined;
    xHeight?: number | string | undefined;
    xlinkActuate?: string | undefined;
    xlinkArcrole?: string | undefined;
    xlinkHref?: string | undefined;
    xlinkRole?: string | undefined;
    xlinkShow?: string | undefined;
    xlinkTitle?: string | undefined;
    xlinkType?: string | undefined;
    xmlBase?: string | undefined;
    xmlLang?: string | undefined;
    xmlns?: string | undefined;
    xmlnsXlink?: string | undefined;
    xmlSpace?: string | undefined;
    y1?: number | string | undefined;
    y2?: number | string | undefined;
    y?: number | string | undefined;
    yChannelSelector?: string | undefined;
    z?: number | string | undefined;
    zoomAndPan?: string | undefined;
}

export type AttributesMap = {
    [K in keyof HTMLTagNameMap]:
        K extends 'a' ? AnchorHTMLAttributes :
        K extends 'area' ? AreaHTMLAttributes :
        K extends 'audio' ? MediaHTMLAttributes :
        K extends 'base' ? BaseHTMLAttributes :
        K extends 'blockquote' ? BlockquoteHTMLAttributes :
        K extends 'button' ? ButtonHTMLAttributes :
        K extends 'canvase' ? CanvasHTMLAttributes :
        K extends 'col' ? ColHTMLAttributes :
        K extends 'colgroup' ? ColgroupHTMLAttributes :
        K extends 'data' ? DataHTMLAttributes :
        K extends 'del' ? DelHTMLAttributes :
        K extends 'details' ? DetailsHTMLAttributes :
        K extends 'dialog' ? DialogHTMLAttributes :
        K extends 'embed' ? EmbedHTMLAttributes :
        K extends 'fieldset' ? FieldsetHTMLAttributes :
        K extends 'form' ? FormHTMLAttributes :
        K extends 'html' ? HtmlHTMLAttributes :
        K extends 'iframe' ? IframeHTMLAttributes :
        K extends 'img' ? ImgHTMLAttributes :
        K extends 'input' ? InputHTMLAttributes :
        K extends 'ins' ? InsHTMLAttributes :
        K extends 'keygen' ? KeygenHTMLAttributes :
        K extends 'label' ? LabelHTMLAttributes :
        K extends 'li' ? LiHTMLAttributes :
        K extends 'link' ? LinkHTMLAttributes :
        K extends 'map' ? MapHTMLAttributes :
        K extends 'menu' ? MenuHTMLAttributes :
        K extends 'meta' ? MetaHTMLAttributes :
        K extends 'meter' ? MeterHTMLAttributes :
        K extends 'object' ? ObjectHTMLAttributes :
        K extends 'ol' ? OlHTMLAttributes :
        K extends 'optgroup' ? OptgroupHTMLAttributes :
        K extends 'option' ? OptionHTMLAttributes :
        K extends 'output' ? OutputHTMLAttributes :
        K extends 'param' ? ParamHTMLAttributes :
        K extends 'progress' ? ProgressHTMLAttributes :
        K extends 'quote' ? QuoteHTMLAttributes :
        K extends 'slot' ? SlotHTMLAttributes :
        K extends 'script' ? ScriptHTMLAttributes :
        K extends 'select' ? SelectHTMLAttributes :
        K extends 'source' ? SourceHTMLAttributes :
        K extends 'style' ? StyleHTMLAttributes :
        K extends 'table' ? TableHTMLAttributes :
        K extends 'td' ? TdHTMLAttributes :
        K extends 'textarea' ? TextareaHTMLAttributes :
        K extends 'th' ? ThHTMLAttributes :
        K extends 'time' ? TimeHTMLAttributes :
        K extends 'track' ? TrackHTMLAttributes :
        K extends 'video' ? VideoHTMLAttributes :
        K extends 'svg' ? SVGAttributes :
        HTMLAttributes;
} & {
    'big': HTMLAttributes;
    'keygen': HTMLAttributes;
    'menuitem': HTMLAttributes;
    'noindex': HTMLAttributes;
    'iframe': IframeHTMLAttributes;

    'animate': SVGAttributes;
    'animateMotion': SVGAttributes;
    'animateTransform': SVGAttributes;
    'circle': SVGAttributes;
    'clipPath': SVGAttributes;
    'defs': SVGAttributes;
    'desc': SVGAttributes;
    'ellipse': SVGAttributes;
    'feBlend': SVGAttributes;
    'feColorMatrix': SVGAttributes;
    'feComponentTransfer': SVGAttributes;
    'feComposite': SVGAttributes;
    'feConvolveMatrix': SVGAttributes;
    'feDiffuseLighting': SVGAttributes;
    'feDisplacementMap': SVGAttributes;
    'feDistantLight': SVGAttributes;
    'feDropShadow': SVGAttributes;
    'feFlood': SVGAttributes;
    'feFuncA': SVGAttributes;
    'feFuncB': SVGAttributes;
    'feFuncG': SVGAttributes;
    'feFuncR': SVGAttributes;
    'feGaussianBlur': SVGAttributes;
    'feImage': SVGAttributes;
    'feMerge': SVGAttributes;
    'feMergeNode': SVGAttributes;
    'feMorphology': SVGAttributes;
    'feOffset': SVGAttributes;
    'fePointLight': SVGAttributes;
    'feSpecularLighting': SVGAttributes;
    'feSpotLight': SVGAttributes;
    'feTile': SVGAttributes;
    'feTurbulence': SVGAttributes;
    'filter': SVGAttributes;
    'foreignObject': SVGAttributes;
    'g': SVGAttributes;
    'image': SVGAttributes;
    'line': SVGAttributes;
    'linearGradient': SVGAttributes;
    'marker': SVGAttributes;
    'mask': SVGAttributes;
    'metadata': SVGAttributes;
    'mpath': SVGAttributes;
    'path': SVGAttributes;
    'pattern': SVGAttributes;
    'polygon': SVGAttributes;
    'polyline': SVGAttributes;
    'radialGradient': SVGAttributes;
    'rect': SVGAttributes;
    'stop': SVGAttributes;
    'svg': SVGAttributes;
    'switch': SVGAttributes;
    'symbol': SVGAttributes;
    'text': SVGAttributes;
    'textPath': SVGAttributes;
    'tspan': SVGAttributes;
    'use': SVGAttributes;
    'view': SVGAttributes;

    [k: string]: HTMLAttributes;
}

export interface HTMLTagNameMap {
    'a': HTMLAnchorElement;
    'abbr': HTMLElement;
    'address': HTMLElement;
    'area': HTMLAreaElement;
    'article': HTMLElement;
    'aside': HTMLElement;
    'audio': HTMLAudioElement;
    'b': HTMLElement;
    'base': HTMLBaseElement;
    'bdi': HTMLElement;
    'bdo': HTMLElement;
    'blockquote': HTMLQuoteElement;
    'body': HTMLBodyElement;
    'br': HTMLBRElement;
    'button': HTMLButtonElement;
    'canvas': HTMLCanvasElement;
    'caption': HTMLTableCaptionElement;
    'cite': HTMLElement;
    'code': HTMLElement;
    'col': HTMLTableColElement;
    'colgroup': HTMLTableColElement;
    'data': HTMLDataElement;
    'datalist': HTMLDataListElement;
    'dd': HTMLElement;
    'del': HTMLModElement;
    'details': HTMLDetailsElement;
    'dfn': HTMLElement;
    'dialog': HTMLDialogElement;
    'dir': HTMLDirectoryElement;
    'div': HTMLDivElement;
    'dl': HTMLDListElement;
    'dt': HTMLElement;
    'em': HTMLElement;
    'embed': HTMLEmbedElement;
    'fieldset': HTMLFieldSetElement;
    'figcaption': HTMLElement;
    'figure': HTMLElement;
    'font': HTMLFontElement;
    'footer': HTMLElement;
    'form': HTMLFormElement;
    'frame': HTMLFrameElement;
    'frameset': HTMLFrameSetElement;
    'h1': HTMLHeadingElement;
    'h2': HTMLHeadingElement;
    'h3': HTMLHeadingElement;
    'h4': HTMLHeadingElement;
    'h5': HTMLHeadingElement;
    'h6': HTMLHeadingElement;
    'head': HTMLHeadElement;
    'header': HTMLElement;
    'hgroup': HTMLElement;
    'hr': HTMLHRElement;
    'html': HTMLHtmlElement;
    'i': HTMLElement;
    'iframe': HTMLIFrameElement;
    'img': HTMLImageElement;
    'input': HTMLInputElement;
    'ins': HTMLModElement;
    'kbd': HTMLElement;
    'label': HTMLLabelElement;
    'legend': HTMLLegendElement;
    'li': HTMLLIElement;
    'link': HTMLLinkElement;
    'main': HTMLElement;
    'map': HTMLMapElement;
    'mark': HTMLElement;
    'marquee': HTMLMarqueeElement;
    'menu': HTMLMenuElement;
    'meta': HTMLMetaElement;
    'meter': HTMLMeterElement;
    'nav': HTMLElement;
    'noscript': HTMLElement;
    'object': HTMLObjectElement;
    'ol': HTMLOListElement;
    'optgroup': HTMLOptGroupElement;
    'option': HTMLOptionElement;
    'output': HTMLOutputElement;
    'p': HTMLParagraphElement;
    'param': HTMLParamElement;
    'picture': HTMLPictureElement;
    'pre': HTMLPreElement;
    'progress': HTMLProgressElement;
    'q': HTMLQuoteElement;
    'rp': HTMLElement;
    'rt': HTMLElement;
    'ruby': HTMLElement;
    's': HTMLElement;
    'samp': HTMLElement;
    'script': HTMLScriptElement;
    'section': HTMLElement;
    'select': HTMLSelectElement;
    'slot': HTMLSlotElement;
    'small': HTMLElement;
    'source': HTMLSourceElement;
    'span': HTMLSpanElement;
    'strong': HTMLElement;
    'style': HTMLStyleElement;
    'sub': HTMLElement;
    'summary': HTMLElement;
    'sup': HTMLElement;
    'table': HTMLTableElement;
    'tbody': HTMLTableSectionElement;
    'td': HTMLTableCellElement;
    'template': HTMLTemplateElement;
    'textarea': HTMLTextAreaElement;
    'tfoot': HTMLTableSectionElement;
    'th': HTMLTableCellElement;
    'thead': HTMLTableSectionElement;
    'time': HTMLTimeElement;
    'title': HTMLTitleElement;
    'tr': HTMLTableRowElement;
    'track': HTMLTrackElement;
    'u': HTMLElement;
    'ul': HTMLUListElement;
    'var': HTMLElement;
    'video': HTMLVideoElement;
    'wbr': HTMLElement;
    'big': HTMLElement;
    'keygen': HTMLElement;
    'menuitem': HTMLElement;
    'noindex': HTMLElement;
}

export interface SVGTagNameMap {
    'animate': SVGElement;
    'animateMotion': SVGElement;
    'animateTransform': SVGElement;
    'circle': SVGCircleElement;
    'clipPath': SVGClipPathElement;
    'defs': SVGDefsElement;
    'desc': SVGDescElement;
    'ellipse': SVGEllipseElement;
    'feBlend': SVGFEBlendElement;
    'feColorMatrix': SVGFEColorMatrixElement;
    'feComponentTransfer': SVGFEComponentTransferElement;
    'feComposite': SVGFECompositeElement;
    'feConvolveMatrix': SVGFEConvolveMatrixElement;
    'feDiffuseLighting': SVGFEDiffuseLightingElement;
    'feDisplacementMap': SVGFEDisplacementMapElement;
    'feDistantLight': SVGFEDistantLightElement;
    'feDropShadow': SVGElement;
    'feFlood': SVGFEFloodElement;
    'feFuncA': SVGFEFuncAElement;
    'feFuncB': SVGFEFuncBElement;
    'feFuncG': SVGFEFuncGElement;
    'feFuncR': SVGFEFuncRElement;
    'feGaussianBlur': SVGFEGaussianBlurElement;
    'feImage': SVGFEImageElement;
    'feMerge': SVGFEMergeElement;
    'feMergeNode': SVGFEMergeNodeElement;
    'feMorphology': SVGFEMorphologyElement;
    'feOffset': SVGFEOffsetElement;
    'fePointLight': SVGFEPointLightElement;
    'feSpecularLighting': SVGFESpecularLightingElement;
    'feSpotLight': SVGFESpotLightElement;
    'feTile': SVGFETileElement;
    'feTurbulence': SVGFETurbulenceElement;
    'filter': SVGFilterElement;
    'foreignObject': SVGForeignObjectElement;
    'g': SVGGElement;
    'image': SVGImageElement;
    'line': SVGLineElement;
    'linearGradient': SVGLinearGradientElement;
    'marker': SVGMarkerElement;
    'mask': SVGMaskElement;
    'metadata': SVGMetadataElement;
    'mpath': SVGElement;
    'path': SVGPathElement;
    'pattern': SVGPatternElement;
    'polygon': SVGPolygonElement;
    'polyline': SVGPolylineElement;
    'radialGradient': SVGRadialGradientElement;
    'rect': SVGRectElement;
    'stop': SVGStopElement;
    'svg': SVGElement;
    'switch': SVGSwitchElement;
    'symbol': SVGSymbolElement;
    'text': SVGTextElement;
    'textPath': SVGTextPathElement;
    'tspan': SVGTSpanElement;
    'use': SVGUseElement;
    'view': SVGViewElement;
}

/**
 * Identify virtual dom objects.
 */
export const V_SYM: unique symbol = createSymbol();

/**
 * A constructor alias used for JSX fragments </>.
 */
export const Fragment: unique symbol = createSymbol();

/**
 * Get all the property keys that extends a builtin element.
 */
export type ExtractCustomElementsKeys<T extends keyof HTMLTagNameMap> = Exclude<{
    [K in keyof JSXInternal.CustomElements]:
        'extends' extends keyof JSXInternal.CustomElements[K] ?
            JSXInternal.CustomElements[K]['extends'] extends T ?
                (keyof Props<JSXInternal.CustomElements[K]>) :
                never :
            never;
}[keyof JSXInternal.CustomElements], never | keyof VRenderProperties | 'extends' | keyof Props<HTMLTagNameMap[T]>>;

/**
 * Classes dictionary.
 */
export type VClasses = string
    | { [key: string]: boolean | undefined };

/**
 * Styles dictionary.
 */
export type VStyle = string
    | { [key: string]: string | undefined };

/**
 * Special virtual properties.
 */
export type VRenderProperties = {
    slot?: string;
    key?: unknown;
    xmlns?: string;
    ref?: Element;
    children?: Template | Template[];
    class?: VClasses;
    style?: VStyle;
    [listener: `on${string}`]: EventListener | undefined;
};

/**
 * Get prototype properties that can be assigned to the node.
 */
type VProps<T> = Omit<
    T extends keyof HTMLTagNameMap ? Props<HTMLTagNameMap[T]> :
    T extends keyof SVGTagNameMap ? Props<SVGTagNameMap[T]> :
    T extends Element ? Props<T> :
    T extends FunctionComponent ? Parameters<T>[0] :
    T,
    keyof VRenderProperties
> & (
    T extends keyof HTMLTagNameMap ? { is?: never } & {
        [K in ExtractCustomElementsKeys<T>]?: never;
    } :
    T extends keyof SVGTagNameMap ? { is?: never } :
    T extends Element ? { is?: never } :
    { is?: unknown }
);

/**
 * Get a list of html attributes that can be assigned to the node.
 */
type VAttrs<T, E> = Omit<
    E extends keyof HTMLTagNameMap ? AttributesMap[E] :
    E extends keyof SVGTagNameMap ? AttributesMap[E] :
    T extends keyof HTMLTagNameMap ? AttributesMap[T] :
    T extends keyof SVGTagNameMap ? AttributesMap[T] :
    T extends SVGElement ? SVGAttributes :
    T extends Element ? HTMLAttributes :
    {},
    keyof VRenderProperties
>;

/**
 * Get all valid prototypes properties that extends a builtin element.
 */
export type VExtends<T> =
    Exclude<
        {
            [K in keyof JSXInternal.CustomElements]:
                'extends' extends keyof JSXInternal.CustomElements[K] ?
                    JSXInternal.CustomElements[K]['extends'] extends T ?
                        (
                            { is: K }
                            & Omit<Props<JSXInternal.CustomElements[K]>, keyof VRenderProperties | 'extends'>
                            & VAttrs<JSXInternal.CustomElements[K], JSXInternal.CustomElements[K]['extends']>
                            & VRenderProperties
                        ) :
                        never :
                    never;
        }[keyof JSXInternal.CustomElements],
        never
    >;

/**
 * Properties that can be assigned to a node through the render engine.
 */
export type VProperties<
    TagOrFunctionOrProps = { [key: string]: unknown },
    Extends extends string | null = null
> = TagOrFunctionOrProps extends keyof HTMLTagNameMap ?
        (
            (VProps<TagOrFunctionOrProps>
            & VAttrs<TagOrFunctionOrProps, Extends>
            & VRenderProperties)
            | VExtends<TagOrFunctionOrProps>
        ) : (
            VProps<TagOrFunctionOrProps>
            & VAttrs<TagOrFunctionOrProps, Extends>
            & VRenderProperties
        );

/**
 * The interface of a JSX fragment node.
 */
export type VFragment = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag?: undefined;
    isFragment: true;
    isSlot?: false;
    key?: unknown;
    properties?: {};
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a functional component.
 */
export type VFunction<T extends FunctionComponent> = {
    Function: T;
    Component?: undefined;
    node?: undefined;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of an HTML node used as JSX tag.
 */
export type VElement<T extends Element> = {
    Function?: undefined;
    Component?: undefined;
    node: T;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a Component constructor used as JSX tag.
 */
export type VComponent<T extends CustomElementConstructor> = {
    Function?: undefined;
    Component: T;
    node?: undefined;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<InstanceType<T>>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of slot element.
 */
export type VSlot = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag: 'slot';
    isFragment?: false;
    isSlot: true;
    key?: unknown;
    properties: VProperties<'slot'>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a generic JSX tag.
 */
export type VTag<T extends string> = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag: T;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * Generic virtual dom object.
 */
export type VObject = VFunction<FunctionComponent>
    | VComponent<CustomElementConstructor>
    | VElement<Element>
    | VSlot
    | VTag<string>
    | VFragment;

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
export type Template =
    Element
    | Text
    | Node
    | VFragment
    | VFunction<FunctionComponent>
    | VComponent<CustomElementConstructor>
    | VElement<Element>
    | VSlot
    | VTag<string>
    | Promise<unknown>
    | Observable<unknown>
    | string
    | number
    | boolean
    | undefined
    | null
    | Template[];

/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isVObject = (target: any): target is VObject => typeof target === 'object' && !!target[V_SYM];

/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 */
export const isVFragment = (target: VObject): target is VFragment => !!target.isFragment;

/**
 * Check if the current virtual node is a functional component.
 * @param target The node to check.
 */
export const isVFunction = (target: VObject): target is VFunction<FunctionComponent> => !!target.Function;

/**
 * Check if the current virtual node is a Component.
 * @param target The node to check.
 */
export const isVComponent = (target: VObject): target is VComponent<CustomElementConstructor> => !!target.Component;

/**
 * Check if the current virtual node is an HTML node instance.
 * @param target The node to check.
 */
export const isVNode = (target: VObject): target is VElement<Element> => !!target.node;

/**
 * Check if the current virtual node is a slot element.
 * @param target The node to check.
 */
export const isVSlot = (target: VObject): target is VSlot => !!target.isSlot;

/**
 * Check if the current virtual node is a generic tag to render.
 * @param target The node to check.
 */
export const isVTag = (target: VObject): target is VTag<string> => !!target.tag;

/**
 * Function factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 */
function h(tagOrComponent: typeof Fragment): VFragment;
function h(tagOrComponent: typeof Fragment, properties: null, ...children: Template[]): VFragment;
function h<T extends FunctionComponent>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VFunction<T>;
function h<T extends CustomElementConstructor>(tagOrComponent: T, properties?: VProperties<InstanceType<T>> | null, ...children: Template[]): VComponent<T>;
/**
 * @deprecated Use the `ref` property instead.
 */
function h<T extends Element>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VElement<T>;
function h(tagOrComponent: 'slot', properties?: VProperties<'slot'> | null, ...children: Template[]): VSlot;
function h<T extends string>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VTag<T>;
function h(tagOrComponent: typeof Fragment | FunctionComponent | CustomElementConstructor | Element | string, properties: VProperties | null = null, ...children: Template[]) {
    const { is, key, xmlns, ref } = (properties || {});

    if (tagOrComponent === Fragment) {
        return {
            isFragment: true,
            children,
            [V_SYM]: true,
        } as VFragment;
    }

    if (isElement(tagOrComponent)) {
        return {
            node: tagOrComponent,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VElement<typeof tagOrComponent>;
    }

    if (typeof tagOrComponent === 'function') {
        if (isCustomElementConstructor(tagOrComponent)) {
            return {
                Component: tagOrComponent,
                key,
                namespaceURI: xmlns,
                properties: properties || {},
                children,
                [V_SYM]: true,
            } as VComponent<typeof tagOrComponent>;
        }

        return {
            Function: tagOrComponent,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VFunction<typeof tagOrComponent>;
    }

    if (ref) {
        return {
            node: ref,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VElement<typeof ref>;
    }

    if (tagOrComponent === 'svg') {
        return {
            tag: tagOrComponent,
            key,
            namespaceURI: 'http://www.w3.org/2000/svg',
            properties,
            children,
            [V_SYM]: true,
        } as VTag<'svg'>;
    }

    if (tagOrComponent === 'slot') {
        return {
            tag: tagOrComponent,
            isSlot: true,
            key,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VSlot;
    }

    const Component = customElements.get((is as string) || tagOrComponent);
    if (Component) {
        return {
            Component,
            key,
            namespaceURI: xmlns,
            properties: properties || {},
            children,
            [V_SYM]: true,
        } as VComponent<typeof Component>;
    }

    return {
        tag: tagOrComponent,
        key,
        namespaceURI: xmlns,
        properties: properties || {},
        children,
        [V_SYM]: true,
    } as VTag<typeof tagOrComponent>;
}

export { h };

/**
 * The internal JSX namespace.
 */
export namespace JSXInternal {
    export interface CustomElements { }

    export type Element = Template;

    export type IntrinsicElements = {
        [K in keyof CustomElements]:
            'extends' extends keyof JSXInternal.CustomElements[K] ?
                never :
                VProperties<CustomElements[K]>;
    } & {
        [K in keyof HTMLTagNameMap]: VProperties<K>;
    } & {
        [K in keyof SVGTagNameMap]: VProperties<SVGTagNameMap[K]>
    };
}

/**
 * Configure JSX support.
 */
declare global {
    namespace JSX {
        type Element = JSXInternal.Element;
        type IntrinsicElements = JSXInternal.IntrinsicElements;
    }

    interface HTMLElementTagNameMap extends JSXInternal.CustomElements { }
}