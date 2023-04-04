/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
export interface AriaAttributes {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    'aria-activedescendant'?: string | undefined;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    'aria-atomic'?: boolean | 'true' | 'false' | undefined;
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    'aria-busy'?: boolean | 'true' | 'false' | undefined;
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    'aria-checked'?: boolean | 'true' | 'false' | 'mixed' | undefined;
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    'aria-colcount'?: number | string | undefined;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    'aria-colindex'?: number | string | undefined;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    'aria-colspan'?: number | string | undefined;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    'aria-controls'?: string | undefined;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    'aria-current'?: boolean | 'true' | 'false' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
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
    'aria-disabled'?: boolean | 'true' | 'false' | undefined;
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
    'aria-expanded'?: boolean | 'true' | 'false' | undefined;
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    'aria-flowto'?: string | undefined;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    'aria-grabbed'?: boolean | 'true' | 'false' | undefined;
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    'aria-haspopup'?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    'aria-hidden'?: boolean | 'true' | 'false' | undefined;
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;
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
    'aria-level'?: number | string | undefined;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
    /** Indicates whether an element is modal when displayed. */
    'aria-modal'?: boolean | 'true' | 'false' | undefined;
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    'aria-multiline'?: boolean | 'true' | 'false' | undefined;
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    'aria-multiselectable'?: boolean | 'true' | 'false' | undefined;
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
    'aria-posinset'?: number | string | undefined;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    'aria-pressed'?: boolean | 'true' | 'false' | 'mixed' | undefined;
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    'aria-readonly'?: boolean | 'true' | 'false' | undefined;
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text' | undefined;
    /** Indicates that user input is required on the element before a form may be submitted. */
    'aria-required'?: boolean | 'true' | 'false' | undefined;
    /** Defines a human-readable, author-localized description for the role of an element. */
    'aria-roledescription'?: string | undefined;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    'aria-rowcount'?: number | string | undefined;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    'aria-rowindex'?: number | string | undefined;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    'aria-rowspan'?: number | string | undefined;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    'aria-selected'?: boolean | 'true' | 'false' | undefined;
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    'aria-setsize'?: number | string | undefined;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
    /** Defines the maximum allowed value for a range widget. */
    'aria-valuemax'?: number | string | undefined;
    /** Defines the minimum allowed value for a range widget. */
    'aria-valuemin'?: number | string | undefined;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    'aria-valuenow'?: number | string | undefined;
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
    innerHTML?: string;

    class?: string | undefined;
    style?: string | undefined;

    // Standard HTML Attributes
    accesskey?: string | undefined;
    /** @deprecated Use `contenteditable` instead */
    contentEditable?: boolean | undefined;
    contenteditable?: boolean | 'true' | 'false' | 'inherit' | undefined;
    /** @deprecated Use `contextmenu` instead */
    contextMenu?: string | undefined;
    contextmenu?: string | undefined;
    dir?: string | undefined;
    draggable?: boolean | 'true' | 'false' | undefined;
    hidden?: boolean | 'true' | 'false' | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    placeholder?: string | undefined;
    slot?: string | undefined;
    /** @deprecated Use `spellcheck` instead */
    spellCheck?: boolean | undefined;
    spellcheck?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `tabindex` instead */
    tabIndex?: number | undefined;
    tabindex?: number | string | undefined;
    title?: string | undefined;
    translate?: 'yes' | 'no' | undefined;

    // Unknown
    /** @deprecated Use `radiogroup` instead */
    radioGroup?: string | undefined; // <command>, <menuitem>
    radiogroup?: string | undefined; // <command>, <menuitem>

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
    /** @deprecated Use `autocapitalize` instead */
    autoCapitalize?: string | undefined;
    autocapitalize?: string | undefined;
    /** @deprecated Use `autocorrect` instead */
    autoCorrect?: string | undefined;
    autocorrect?: string | undefined;
    /** @deprecated Use `autosave` instead */
    autoSave?: string | undefined;
    autosave?: string | undefined;
    color?: string | undefined;
    /** @deprecated Use `itemprop` instead */
    itemProp?: string | undefined;
    itemprop?: string | undefined;
    /** @deprecated Use `itemscope` instead */
    itemScope?: boolean | undefined;
    itemscope?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `itemtype` instead */
    itemType?: string | undefined;
    itemtype?: string | undefined;
    /** @deprecated Use `itemid` instead */
    itemID?: string | undefined;
    itemid?: string | undefined;
    /** @deprecated Use `itemref` instead */
    itemRef?: string | undefined;
    itemref?: string | undefined;
    results?: number | string | undefined;
    security?: string | undefined;
    unselectable?: 'on' | 'off' | undefined;

    // Living Standard
    /**
     * Hints at the type of data that might be entered by the user while editing the element or its contents
     * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
     * @deprecated Use `inputmode` instead
     */
    inputMode?:
        | 'none'
        | 'text'
        | 'tel'
        | 'url'
        | 'email'
        | 'numeric'
        | 'decimal'
        | 'search'
        | undefined;
    /**
     * Hints at the type of data that might be entered by the user while editing the element or its contents
     * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
     */
    inputmode?:
        | 'none'
        | 'text'
        | 'tel'
        | 'url'
        | 'email'
        | 'numeric'
        | 'decimal'
        | 'search'
        | undefined;
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
    | 'unsafe-url'

export interface AnchorHTMLAttributes extends HTMLAttributes {
    download?: string | undefined;
    href?: string | undefined;
    /** @deprecated Use `hreflang` instead */
    hrefLang?: string | undefined;
    hreflang?: string | undefined;
    media?: string | undefined;
    ping?: string | undefined;
    rel?: string | undefined;
    target?: '_self' | '_blank' | '_parent' | '_top' | string | undefined;
    type?: string | undefined;
    /** @deprecated Use `referrerpolicy` instead */
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
}

export interface AreaHTMLAttributes extends HTMLAttributes {
    alt?: string | undefined;
    coords?: string | undefined;
    download?: string | undefined;
    href?: string | undefined;
    /** @deprecated Use `hreflang` instead */
    hrefLang?: string | undefined;
    hreflang?: string | undefined;
    media?: string | undefined;
    /** @deprecated Use `referrerpolicy` instead */
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
    rel?: string | undefined;
    shape?: string | undefined;
    target?: string | undefined;
}

export interface AudioHTMLAttributes extends MediaHTMLAttributes { }

export interface BaseHTMLAttributes extends HTMLAttributes {
    href?: string | undefined;
    target?: string | undefined;
}

export interface BlockquoteHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
}

export interface ButtonHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `autofocus` instead */
    autoFocus?: boolean | undefined;
    autofocus?: boolean | 'true' | 'false' | undefined;
    disabled?: boolean | 'true' | 'false' | undefined;
    form?: string | undefined;
    /** @deprecated Use `formaction` instead */
    formAction?: string | undefined;
    formaction?: string | undefined;
    /** @deprecated Use `formenctype` instead */
    formEncType?: string | undefined;
    formenctype?: string | undefined;
    /** @deprecated Use `formmethod` instead */
    formMethod?: string | undefined;
    formmethod?: string | undefined;
    /** @deprecated Use `formnovalidate` instead */
    formNoValidate?: boolean | undefined;
    formnovalidate?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `formtarget` instead */
    formTarget?: string | undefined;
    formtarget?: string | undefined;
    name?: string | undefined;
    type?: 'submit' | 'reset' | 'button' | undefined;
    value?: string | string[] | number | undefined;
}

export interface CanvasHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    width?: number | string | undefined;
}

export interface ColHTMLAttributes extends HTMLAttributes {
    span?: number | string | undefined;
    width?: number | string | undefined;
}

export interface ColgroupHTMLAttributes extends HTMLAttributes {
    span?: number | string | undefined;
}

export interface DataHTMLAttributes extends HTMLAttributes {
    value?: string | string[] | number | undefined;
}

export interface DetailsHTMLAttributes extends HTMLAttributes {
    open?: boolean | 'true' | 'false' | undefined;
}

export interface DelHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
    /** @deprecated Use `datetime` instead */
    dateTime?: string | undefined;
    datetime?: string | undefined;
}

export interface DialogHTMLAttributes extends HTMLAttributes {
    open?: boolean | 'true' | 'false' | undefined;
}

export interface EmbedHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    src?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
}

export interface FieldsetHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | 'true' | 'false' | undefined;
    form?: string | undefined;
    name?: string | undefined;
}

export interface FormHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `acceptcharset` instead */
    acceptCharset?: string | undefined;
    acceptcharset?: string | undefined;
    action?: string | undefined;
    /** @deprecated Use `autocomplete` instead */
    autoComplete?: string | undefined;
    autocomplete?: string | undefined;
    /** @deprecated Use `enctype` instead */
    encType?: string | undefined;
    enctype?: string | undefined;
    method?: string | undefined;
    name?: string | undefined;
    /** @deprecated Use `novalidate` instead */
    noValidate?: boolean | undefined;
    novalidate?: boolean | 'true' | 'false' | undefined;
    target?: string | undefined;
}

export interface HtmlHTMLAttributes extends HTMLAttributes {
    manifest?: string | undefined;
}

export interface IframeHTMLAttributes extends HTMLAttributes {
    allow?: string | undefined;
    /** @deprecated Use `allowfullscreen` instead */
    allowFullscreen?: boolean | undefined;
    allowfullscreen?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `allowtransparency` instead */
    allowTransparency?: boolean | undefined;
    allowtransparency?: boolean | 'true' | 'false' | undefined;
    /** @deprecated */
    frameBorder?: number | string | undefined;
    /** @deprecated */
    frameborder?: number | string | undefined;
    height?: number | string | undefined;
    /** @deprecated */
    marginHeight?: number | string | undefined;
    /** @deprecated */
    marginheight?: number | string | undefined;
    /** @deprecated */
    marginWidth?: number | string | undefined;
    /** @deprecated */
    marginwidth?: number | string | undefined;
    name?: string | undefined;
    /** @deprecated Use `referrerpolicy` instead */
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
    sandbox?: string | undefined;
    /** @deprecated */
    scrolling?: string | undefined;
    seamless?: boolean | 'true' | 'false' | undefined;
    src?: string | undefined;
    /** @deprecated Use `srcdoc` instead */
    srcDoc?: string | undefined;
    srcdoc?: string | undefined;
    width?: number | string | undefined;
}

export interface ImgHTMLAttributes extends HTMLAttributes {
    alt?: string | undefined;
    /** @deprecated Use `crossorigin` instead */
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
    crossorigin?: 'anonymous' | 'use-credentials' | '' | undefined;
    decoding?: 'async' | 'auto' | 'sync' | undefined;
    height?: number | string | undefined;
    /** @deprecated Use `referrerpolicy` instead */
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    /** @deprecated Use `srcset` instead */
    srcSet?: string | undefined;
    srcset?: string | undefined;
    /** @deprecated Use `usemap` instead */
    useMap?: string | undefined;
    usemap?: string | undefined;
    width?: number | string | undefined;
}

export interface InputHTMLAttributes extends HTMLAttributes {
    accept?: string | undefined;
    alt?: string | undefined;
    /** @deprecated Use `autocomplete` instead */
    autoComplete?: string | undefined;
    autocomplete?: string | undefined;
    /** @deprecated Use `autofocus` instead */
    autoFocus?: boolean | undefined;
    autofocus?: boolean | 'true' | 'false' | undefined;
    capture?: boolean | 'user' | 'environment' | undefined; // https://www.w3.org/tr/html-media-capture/#the-capture-attribute
    checked?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `crossorigin` instead */
    crossOrigin?: string | undefined;
    crossorigin?: string | undefined;
    disabled?: boolean | 'true' | 'false' | undefined;
    form?: string | undefined;
    /** @deprecated Use `formaction` instead */
    formAction?: string | undefined;
    formaction?: string | undefined;
    /** @deprecated Use `formenctype` instead */
    formEncType?: string | undefined;
    formenctype?: string | undefined;
    /** @deprecated Use `formmethod` instead */
    formMethod?: string | undefined;
    formmethod?: string | undefined;
    /** @deprecated Use `formnovalidate` instead */
    formNoValidate?: boolean | undefined;
    formnovalidate?: boolean | 'true' | 'false' | undefined;
    formTarget?: string | undefined;
    formtarget?: string | undefined;
    height?: number | string | undefined;
    indeterminate?: boolean | undefined;
    list?: string | undefined;
    max?: number | string | undefined;
    /** @deprecated Use `maxlength` instead */
    maxLength?: number | undefined;
    maxlength?: number | string | undefined;
    min?: number | string | undefined;
    /** @deprecated Use `minlength` instead */
    minLength?: number | undefined;
    minlength?: number | string | undefined;
    multiple?: boolean | 'true' | 'false' | undefined;
    name?: string | undefined;
    pattern?: string | undefined;
    placeholder?: string | undefined;
    /** @deprecated Use `readonly` instead */
    readOnly?: boolean | undefined;
    readonly?: boolean | 'true' | 'false' | undefined;
    required?: boolean | 'true' | 'false' | undefined;
    size?: number | string | undefined;
    src?: string | undefined;
    step?: number | string | undefined;
    type?: string | undefined;
    value?: string | string[] | number | undefined | undefined;
    width?: number | string | undefined;
}

export interface InsHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
    /** @deprecated Use `datetime` instead */
    dateTime?: string | undefined;
    datetime?: string | undefined;
}

export interface KeygenHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `autofocus` instead */
    autoFocus?: boolean | undefined;
    autofocus?: boolean | 'true' | 'false' | undefined;
    challenge?: string | undefined;
    disabled?: boolean | 'true' | 'false' | undefined;
    form?: string | undefined;
    /** @deprecated Use `keytype` instead */
    keyType?: string | undefined;
    keytype?: string | undefined;
    /** @deprecated Use `keyparams` instead */
    keyParams?: string | undefined;
    keyparams?: string | undefined;
    name?: string | undefined;
}

export interface LabelHTMLAttributes extends HTMLAttributes {
    for?: string | undefined;
    form?: string | undefined;
}

export interface LiHTMLAttributes extends HTMLAttributes {
    value?: string | string[] | number | undefined;
}

export interface LinkHTMLAttributes extends HTMLAttributes {
    as?: string | undefined;
    /** @deprecated Use `crossorigin` instead */
    crossOrigin?: string | undefined;
    crossorigin?: string | undefined;
    href?: string | undefined;
    /** @deprecated Use `hreflang` instead */
    hrefLang?: string | undefined;
    hreflang?: string | undefined;
    integrity?: string | undefined;
    media?: string | undefined;
    /** @deprecated Use `referrerpolicy` instead */
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
    rel?: string | undefined;
    sizes?: string | undefined;
    type?: string | undefined;
}

export interface MapHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
}

export interface MenuHTMLAttributes extends HTMLAttributes {
    type?: string | undefined;
}

export interface MediaHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `autoplay` instead */
    autoPlay?: boolean | undefined;
    autoplay?: boolean | 'true' | 'false' | undefined;
    controls?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `controlslist` instead */
    controlsList?: string | undefined;
    controlslist?: string | undefined;
    /** @deprecated Use `crossorigin` instead */
    crossOrigin?: string | undefined;
    crossorigin?: string | undefined;
    loop?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `mediagroup` instead */
    mediaGroup?: string | undefined;
    mediagroup?: string | undefined;
    muted?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `playsinline` instead */
    playsInline?: boolean | undefined;
    playsinline?: boolean | 'true' | 'false' | undefined;
    preload?: string | undefined;
    src?: string | undefined;
}

export interface MetaHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `charset` instead */
    charSet?: string | undefined;
    charset?: string | undefined;
    content?: string | undefined;
    /** @deprecated Use `httpequiv` instead */
    httpEquiv?: string | undefined;
    httpequiv?: string | undefined;
    name?: string | undefined;
    media?: string | undefined;
}

export interface MeterHTMLAttributes extends HTMLAttributes {
    form?: string | undefined;
    high?: number | string | undefined;
    low?: number | string | undefined;
    max?: number | string | undefined;
    min?: number | string | undefined;
    optimum?: number | string | undefined;
    value?: string | string[] | number | undefined;
}

export interface QuoteHTMLAttributes extends HTMLAttributes {
    cite?: string | undefined;
}

export interface ObjectHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `classid` instead */
    classID?: string | undefined;
    classid?: string | undefined;
    data?: string | undefined;
    form?: string | undefined;
    height?: number | string | undefined;
    name?: string | undefined;
    type?: string | undefined;
    /** @deprecated Use `usemap` instead */
    useMap?: string | undefined;
    usemap?: string | undefined;
    width?: number | string | undefined;
    wmode?: string | undefined;
}

export interface OlHTMLAttributes extends HTMLAttributes {
    reversed?: boolean | 'true' | 'false' | undefined;
    start?: number | string | undefined;
    type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
}

export interface OptgroupHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | 'true' | 'false' | undefined;
    label?: string | undefined;
}

export interface OptionHTMLAttributes extends HTMLAttributes {
    disabled?: boolean | 'true' | 'false' | undefined;
    label?: string | undefined;
    selected?: boolean | 'true' | 'false' | undefined;
    value?: string | string[] | number | undefined | undefined;
}

export interface OutputHTMLAttributes extends HTMLAttributes {
    for?: string | undefined;
    form?: string | undefined;
    name?: string | undefined;
}

export interface ParamHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
    value?: string | string[] | number | undefined;
}

export interface ProgressHTMLAttributes extends HTMLAttributes {
    max?: number | string | undefined;
    value?: string | string[] | number | undefined;
}

export interface SlotHTMLAttributes extends HTMLAttributes {
    name?: string | undefined;
}

export interface ScriptHTMLAttributes extends HTMLAttributes {
    async?: boolean | 'true' | 'false' | undefined;
    /** @deprecated */
    charSet?: string | undefined;
    /** @deprecated */
    charset?: string | undefined;
    /** @deprecated Use `crossorigin` instead */
    crossOrigin?: string | undefined;
    crossorigin?: string | undefined;
    defer?: boolean | 'true' | 'false' | undefined;
    integrity?: string | undefined;
    /** @deprecated Use `nomodule` instead */
    noModule?: boolean | undefined;
    nomodule?: boolean | 'true' | 'false' | undefined;
    /** @deprecated Use `referrerpolicy` instead */
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
    nonce?: string | undefined;
    src?: string | undefined;
    type?: string | undefined;
}

export interface SelectHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `autocomplete` instead */
    autoComplete?: string | undefined;
    autocomplete?: string | undefined;
    /** @deprecated Use `autofocus` instead */
    autoFocus?: boolean | undefined;
    autofocus?: boolean | 'true' | 'false' | undefined;
    disabled?: boolean | 'true' | 'false' | undefined;
    form?: string | undefined;
    multiple?: boolean | 'true' | 'false' | undefined;
    name?: string | undefined;
    required?: boolean | 'true' | 'false' | undefined;
    size?: number | string | undefined;
    value?: string | string[] | number | undefined;
}

export interface SourceHTMLAttributes extends HTMLAttributes {
    height?: number | string | undefined;
    media?: string | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    /** @deprecated Use `srcset` instead */
    srcSet?: string | undefined;
    srcset?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
}

export interface StyleHTMLAttributes extends HTMLAttributes {
    media?: string | undefined;
    nonce?: string | undefined;
    scoped?: boolean | 'true' | 'false' | undefined;
    type?: string | undefined;
}

export interface TableHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `cellpadding` instead */
    cellPadding?: number | string | undefined;
    cellpadding?: number | string | undefined;
    /** @deprecated Use `cellspacing` instead */
    cellSpacing?: number | string | undefined;
    cellspacing?: number | string | undefined;
    summary?: string | undefined;
    width?: number | string | undefined;
}

export interface TextareaHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `autocomplete` instead */
    autoComplete?: string | undefined;
    autocomplete?: string | undefined;
    /** @deprecated Use `autofocus` instead */
    autoFocus?: boolean | undefined;
    autofocus?: boolean | 'true' | 'false' | undefined;
    cols?: number | string | undefined;
    /** @deprecated Use `dirname` instead */
    dirName?: string | undefined;
    dirname?: string | undefined;
    disabled?: boolean | 'true' | 'false' | undefined;
    form?: string | undefined;
    /** @deprecated Use `maxlength` instead */
    maxLength?: number | undefined;
    maxlength?: number | string | undefined;
    /** @deprecated Use `minlength` instead */
    minLength?: number | undefined;
    minlength?: number | string | undefined;
    name?: string | undefined;
    placeholder?: string | undefined;
    /** @deprecated Use `readonly` instead */
    readOnly?: boolean | undefined;
    readonly?: boolean | undefined;
    required?: boolean | 'true' | 'false' | undefined;
    rows?: number | string | undefined;
    value?: string | string[] | number | undefined;
    wrap?: string | undefined;
}

export interface TdHTMLAttributes extends HTMLAttributes {
    abbr?: string | undefined;
    align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
    /** @deprecated Use `colspan` instead */
    colSpan?: number | undefined;
    colspan?: number | string | undefined;
    headers?: string | undefined;
    /** @deprecated Use `rowspan` instead */
    rowSpan?: number | undefined;
    rowspan?: number | string | undefined;
    scope?: string | undefined;
    height?: number | string | undefined;
    width?: number | string | undefined;
    valign?: 'top' | 'middle' | 'bottom' | 'baseline' | undefined;
}

export interface ThHTMLAttributes extends HTMLAttributes {
    abbr?: string | undefined;
    align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
    /** @deprecated Use `colspan` instead */
    colSpan?: number | undefined;
    colspan?: number | string | undefined;
    headers?: string | undefined;
    /** @deprecated Use `rowspan` instead */
    rowSpan?: number | undefined;
    rowspan?: number | string | undefined;
    scope?: string | undefined;
}

export interface TimeHTMLAttributes extends HTMLAttributes {
    /** @deprecated Use `datetime` instead */
    dateTime?: string | undefined;
    datetime?: string | undefined;
}

export interface TrackHTMLAttributes extends HTMLAttributes {
    default?: boolean | 'true' | 'false' | undefined;
    kind?: string | undefined;
    label?: string | undefined;
    src?: string | undefined;
    /** @deprecated Use `srclang` instead */
    srcLang?: string | undefined;
    srclang?: string | undefined;
}

export interface VideoHTMLAttributes extends MediaHTMLAttributes {
    height?: number | string | undefined;
    /** @deprecated Use `playsinline` instead */
    playsInline?: boolean | undefined;
    playsinline?: boolean | 'true' | 'false' | undefined;
    poster?: string | undefined;
    width?: number | string | undefined;
    disablePictureInPicture?: boolean | 'true' | 'false' | undefined;
}

export interface WebViewHTMLAttributes extends HTMLAttributes {
    allowfullscreen?: boolean | 'true' | 'false' | undefined;
    allowpopups?: boolean | 'true' | 'false' | undefined;
    autoFocus?: boolean | 'true' | 'false' | undefined;
    autosize?: boolean | 'true' | 'false' | undefined;
    blinkfeatures?: string | undefined;
    disableblinkfeatures?: string | undefined;
    disableguestresize?: boolean | 'true' | 'false' | undefined;
    disablewebsecurity?: boolean | 'true' | 'false' | undefined;
    guestinstance?: string | undefined;
    httpreferrer?: string | undefined;
    nodeintegration?: boolean | 'true' | 'false' | undefined;
    partition?: string | undefined;
    plugins?: boolean | 'true' | 'false' | undefined;
    preload?: string | undefined;
    src?: string | undefined;
    useragent?: string | undefined;
    webpreferences?: string | undefined;
}

export interface SVGAttributes extends AriaAttributes {
    innerHTML?: string | undefined;

    /**
     * SVG Styling Attributes
     * @see https://www.w3.org/TR/SVG/styling.html#ElementSpecificStyling
     */
    class?: string | undefined;
    style?: string | undefined;

    color?: string | undefined;
    height?: number | string | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    max?: number | string | undefined;
    media?: string | undefined;
    method?: string | undefined;
    min?: number | string | undefined;
    name?: string | undefined;
    target?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;

    // Other HTML properties supported by SVG elements in browsers
    role?: AriaRole | undefined;
    /** @deprecated Use `tabindex` instead */
    tabIndex?: number | undefined;
    tabindex?: number | string | undefined;
    /** @deprecated Use `crossorigin` instead */
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
    crossorigin?: 'anonymous' | 'use-credentials' | '' | undefined;

    // SVG Specific attributes
    /** @deprecated Use `accentHeight` instead */
    accentHeight?: number | string | undefined;
    'accent-height'?: number | string | undefined;
    accumulate?: 'none' | 'sum' | undefined;
    additive?: 'replace' | 'sum' | undefined;
    /** @deprecated Use `alignment-baseline` instead */
    alignmentBaseline?: 'auto'
        | 'baseline'
        | 'before-edge'
        | 'text-before-edge'
        | 'middle'
        | 'central'
        | 'after-edge'
        | 'text-after-edge'
        | 'ideographic'
        | 'alphabetic'
        | 'hanging'
        | 'mathematical'
        | 'inherit'
        | undefined;
    'alignment-baseline'?: 'auto'
        | 'baseline'
        | 'before-edge'
        | 'text-before-edge'
        | 'middle'
        | 'central'
        | 'after-edge'
        | 'text-after-edge'
        | 'ideographic'
        | 'alphabetic'
        | 'hanging'
        | 'mathematical'
        | 'inherit'
        | undefined;
    allowReorder?: 'no' | 'yes' | undefined;
    alphabetic?: number | string | undefined;
    amplitude?: number | string | undefined;
    /** @deprecated Use `arabic-form` instead */
    arabicForm?: 'initial' | 'medial' | 'terminal' | 'isolated' | undefined;
    'arabic-form'?: 'initial' | 'medial' | 'terminal' | 'isolated' | undefined;
    ascent?: number | string | undefined;
    attributeName?: string | undefined;
    attributeType?: string | undefined;
    autoReverse?: number | string | undefined;
    azimuth?: number | string | undefined;
    baseFrequency?: number | string | undefined;
    /** @deprecated Use `baseline-shift` instead */
    baselineShift?: number | string | undefined;
    'baseline-shift'?: number | string | undefined;
    baseProfile?: number | string | undefined;
    bbox?: number | string | undefined;
    begin?: number | string | undefined;
    bias?: number | string | undefined;
    by?: number | string | undefined;
    calcMode?: number | string | undefined;
    /** @deprecated Use `cap-height` instead */
    capHeight?: number | string | undefined;
    'cap-height'?: number | string | undefined;
    clip?: number | string | undefined;
    /** @deprecated Use `clip-path` instead */
    clipPath?: string | undefined;
    'clip-path'?: string | undefined;
    clipPathUnits?: number | string | undefined;
    /** @deprecated Use `clip-rule` instead */
    clipRule: number | string | undefined;
    'clip-rule'?: number | string | undefined;
    /** @deprecated Use `color-interpolation` instead */
    colorInterpolation?: number | string | undefined;
    'color-interpolation'?: number | string | undefined;
    /** @deprecated Use `color-interpolation-filters` instead */
    colorInterpolationFilters?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined;
    'color-interpolation-filters'?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined;
    /** @deprecated Use `color-profile` instead */
    colorProfile?: number | string | undefined;
    'color-profile'?: number | string | undefined;
    /** @deprecated Use `color-rendering` instead */
    colorRendering?: number | string | undefined;
    'color-rendering'?: number | string | undefined;
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
    /** @deprecated Use `dominant-baseline` instead */
    dominantBaseline?: number | string | undefined;
    'dominant-baseline'?: number | string | undefined;
    dur?: number | string | undefined;
    dx?: number | string | undefined;
    dy?: number | string | undefined;
    edgeMode?: number | string | undefined;
    elevation?: number | string | undefined;
    /** @deprecated Use `enable-background` instead */
    enableBackground?: number | string | undefined;
    'enable-background'?: number | string | undefined;
    end?: number | string | undefined;
    exponent?: number | string | undefined;
    externalResourcesRequired?: number | string | undefined;
    fill?: string | undefined;
    /** @deprecated Use `fill-opacity` instead */
    fillOpacity?: number | string | undefined;
    'fill-opacity'?: number | string | undefined;
    /** @deprecated Use `fill-rule` instead */
    fillRule?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
    'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
    filter?: string | undefined;
    filterRes?: number | string | undefined;
    filterUnits?: number | string | undefined;
    /** @deprecated Use `flood-color` instead */
    floodColor?: number | string | undefined;
    'flood-color'?: number | string | undefined;
    /** @deprecated Use `flood-opacity` instead */
    floodOpacity?: number | string | undefined;
    'flood-opacity'?: number | string | undefined;
    focusable?: number | string | undefined;
    /** @deprecated Use `font-family` instead */
    fontFamily?: string | undefined;
    'font-family'?: string | undefined;
    /** @deprecated Use `font-size` instead */
    fontSize?: number | string | undefined;
    'font-size'?: number | string | undefined;
    /** @deprecated Use `font-size-adjust` instead */
    fontSizeAdjust?: number | string | undefined;
    'font-size-adjust'?: number | string | undefined;
    /** @deprecated Use `font-stretch` instead */
    fontStretch?: number | string | undefined;
    'font-stretch'?: number | string | undefined;
    /** @deprecated Use `font-style` instead */
    fontStyle?: number | string | undefined;
    'font-style'?: number | string | undefined;
    /** @deprecated Use `font-variant` instead */
    fontVariant?: number | string | undefined;
    'font-variant'?: number | string | undefined;
    /** @deprecated Use `font-weight` instead */
    fontWeight?: number | string | undefined;
    'font-weight'?: number | string | undefined;
    format?: number | string | undefined;
    from?: number | string | undefined;
    fx?: number | string | undefined;
    fy?: number | string | undefined;
    g1?: number | string | undefined;
    g2?: number | string | undefined;
    /** @deprecated Use `glyph-name` instead */
    glyphName?: number | string | undefined;
    'glyph-name'?: number | string | undefined;
    /** @deprecated Use `glyph-orientation-horizontal` instead */
    glyphOrientationHorizontal?: number | string | undefined;
    'glyph-orientation-horizontal'?: number | string | undefined;
    /** @deprecated Use `glyph-orientation-vertical` instead */
    glyphOrientationVertical?: number | string | undefined;
    'glyph-orientation-vertical'?: number | string | undefined;
    glyphRef?: number | string | undefined;
    gradientTransform?: string | undefined;
    gradientUnits?: string | undefined;
    hanging?: number | string | undefined;
    /** @deprecated Use `horiz-adv-x` instead */
    horizAdvX?: number | string | undefined;
    'horiz-adv-x'?: number | string | undefined;
    /** @deprecated Use `horiz-origin-x` instead */
    horizOriginX?: number | string | undefined;
    'horiz-origin-x'?: number | string | undefined;
    href?: string | undefined;
    ideographic?: number | string | undefined;
    /** @deprecated Use `image-rendering` instead */
    imageRendering?: number | string | undefined;
    'image-rendering'?: number | string | undefined;
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
    /** @deprecated Use `letter-spacing` instead */
    letterSpacing?: number | string | undefined;
    'letter-spacing'?: number | string | undefined;
    /** @deprecated Use `lighting-color` instead */
    lightingColor?: number | string | undefined;
    'lighting-color'?: number | string | undefined;
    limitingConeAngle?: number | string | undefined;
    local?: number | string | undefined;
    /** @deprecated Use `marker-end` instead */
    markerEnd?: string | undefined;
    'marker-end'?: string | undefined;
    markerHeight?: number | string | undefined;
    /** @deprecated Use `marker-mid` instead */
    markerMid?: string | undefined;
    'marker-mid'?: string | undefined;
    /** @deprecated Use `marker-start` instead */
    markerStart?: string | undefined;
    'marker-start'?: string | undefined;
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
    /** @deprecated Use `overline-position` instead */
    overlinePosition?: number | string | undefined;
    'overline-position'?: number | string | undefined;
    /** @deprecated Use `overline-thickness` instead */
    overlineThickness?: number | string | undefined;
    'overline-thickness'?: number | string | undefined;
    /** @deprecated Use `paint-order` instead */
    paintOrder?: number | string | undefined;
    'paint-order'?: number | string | undefined;
    /** @deprecated Use `panose-1` instead */
    panose1?: number | string | undefined;
    'panose-1'?: number | string | undefined;
    path?: string | undefined;
    pathLength?: number | string | undefined;
    patternContentUnits?: string | undefined;
    patternTransform?: number | string | undefined;
    patternUnits?: string | undefined;
    /** @deprecated Use `pointer-events` instead */
    pointerEvents?: number | string | undefined;
    'pointer-events'?: number | string | undefined;
    points?: string | undefined;
    pointsAtX?: number | string | undefined;
    pointsAtY?: number | string | undefined;
    pointsAtZ?: number | string | undefined;
    preserveAlpha?: number | string | undefined;
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
    /** @deprecated Use `shape-rendering` instead */
    shapeRendering?: number | string | undefined;
    'shape-rendering'?: number | string | undefined;
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
    /** @deprecated Use `stop-color` instead */
    stopColor?: string | undefined;
    'stop-color'?: string | undefined;
    /** @deprecated Use `stop-opacity` instead */
    stopOpacity?: number | string | undefined;
    'stop-opacity'?: number | string | undefined;
    /** @deprecated Use `strikethrough-position` instead */
    strikethroughPosition?: number | string | undefined;
    'strikethrough-position'?: number | string | undefined;
    /** @deprecated Use `strikethrough-thickness` instead */
    strikethroughThickness?: number | string | undefined;
    'strikethrough-thickness'?: number | string | undefined;
    string?: number | string | undefined;
    stroke?: string | undefined;
    /** @deprecated Use `stroke-dasharray` instead */
    strokeDasharray?: string | number | undefined;
    'stroke-dasharray'?: number | string | undefined;
    /** @deprecated Use `stroke-dashoffset` instead */
    strokeDashoffset?: string | number | undefined;
    'stroke-dashoffset'?: number | string | undefined;
    /** @deprecated Use `stroke-linecap` instead */
    strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
    'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
    /** @deprecated Use `stroke-linejoin` instead */
    strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined;
    'stroke-linejoin'?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined;
    /** @deprecated Use `stroke-miterlimit` instead */
    strokeMiterlimit?: number | string | undefined;
    'stroke-miterlimit'?: number | string | undefined;
    /** @deprecated Use `stroke-opacity` instead */
    strokeOpacity?: number | string | undefined;
    'stroke-opacity'?: number | string | undefined;
    /** @deprecated Use `stroke-width` instead */
    strokeWidth?: number | string | undefined;
    'stroke-width'?: number | string | undefined;
    surfaceScale?: number | string | undefined;
    systemLanguage?: number | string | undefined;
    tableValues?: number | string | undefined;
    targetX?: number | string | undefined;
    targetY?: number | string | undefined;
    /** @deprecated Use `text-anchor` instead */
    textAnchor?: string | undefined;
    'text-anchor'?: string | undefined;
    /** @deprecated Use `text-decoration` instead */
    textDecoration?: number | string | undefined;
    'text-decoration'?: number | string | undefined;
    textLength?: number | string | undefined;
    /** @deprecated Use `text-rendering` instead */
    textRendering?: number | string | undefined;
    'text-rendering'?: number | string | undefined;
    to?: number | string | undefined;
    transform?: string | undefined;
    u1?: number | string | undefined;
    u2?: number | string | undefined;
    /** @deprecated Use `underline-position` instead */
    underlinePosition?: number | string | undefined;
    'underline-position'?: number | string | undefined;
    /** @deprecated Use `underline-thickness` instead */
    underlineThickness?: number | string | undefined;
    'underline-thickness'?: number | string | undefined;
    unicode?: number | string | undefined;
    /** @deprecated Use `unicode-bidi` instead */
    unicodeBidi?: number | string | undefined;
    'unicode-bidi'?: number | string | undefined;
    /** @deprecated Use `unicode-range` instead */
    unicodeRange?: number | string | undefined;
    'unicode-range'?: number | string | undefined;
    /** @deprecated Use `unitsPer-em` instead */
    unitsPerEm?: number | string | undefined;
    'unitsPer-em'?: number | string | undefined;
    /** @deprecated Use `v-alphabetic` instead */
    vAlphabetic?: number | string | undefined;
    'v-alphabetic'?: number | string | undefined;
    values?: string | undefined;
    /** @deprecated Use `vector-effect` instead */
    vectorEffect?: number | string | undefined;
    'vector-effect'?: number | string | undefined;
    version?: string | undefined;
    /** @deprecated Use `vert-adv-y` instead */
    vertAdvY?: number | string | undefined;
    'vert-adv-y'?: number | string | undefined;
    /** @deprecated Use `vert-origin-x` instead */
    vertOriginX?: number | string | undefined;
    'vert-origin-x'?: number | string | undefined;
    /** @deprecated Use `vert-origin-y` instead */
    vertOriginY?: number | string | undefined;
    'vert-origin-y'?: number | string | undefined;
    /** @deprecated Use `v-hanging` instead */
    vHanging?: number | string | undefined;
    'v-hanging'?: number | string | undefined;
    /** @deprecated Use `v-ideographic` instead */
    vIdeographic?: number | string | undefined;
    'v-ideographic'?: number | string | undefined;
    viewBox?: string | undefined;
    viewTarget?: number | string | undefined;
    visibility?: number | string | undefined;
    /** @deprecated Use `v-mathematical` instead */
    vMathematical?: number | string | undefined;
    'v-mathematical'?: number | string | undefined;
    widths?: number | string | undefined;
    /** @deprecated Use `word-spacing` instead */
    wordSpacing?: number | string | undefined;
    'word-spacing'?: number | string | undefined;
    /** @deprecated Use `writing-mode` instead */
    writingMode?: number | string | undefined;
    'writing-mode'?: number | string | undefined;
    x1?: number | string | undefined;
    x2?: number | string | undefined;
    x?: number | string | undefined;
    xChannelSelector?: string | undefined;
    /** @deprecated Use `x-height` instead */
    xHeight?: number | string | undefined;
    'x-height'?: number | string | undefined;
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

export type IntrinsicElementAttributes = {
    a: AnchorHTMLAttributes;
    abbr: HTMLAttributes;
    address: HTMLAttributes;
    area: AreaHTMLAttributes;
    article: HTMLAttributes;
    aside: HTMLAttributes;
    audio: AudioHTMLAttributes;
    b: HTMLAttributes;
    base: BaseHTMLAttributes;
    bdi: HTMLAttributes;
    bdo: HTMLAttributes;
    blockquote: BlockquoteHTMLAttributes;
    body: HTMLAttributes;
    br: HTMLAttributes;
    button: ButtonHTMLAttributes;
    canvas: CanvasHTMLAttributes;
    caption: HTMLAttributes;
    cite: HTMLAttributes;
    code: HTMLAttributes;
    col: ColHTMLAttributes;
    colgroup: ColgroupHTMLAttributes;
    data: DataHTMLAttributes;
    datalist: HTMLAttributes;
    dd: HTMLAttributes;
    del: DelHTMLAttributes;
    details: DetailsHTMLAttributes;
    dfn: HTMLAttributes;
    dialog: DialogHTMLAttributes;
    div: HTMLAttributes;
    dl: HTMLAttributes;
    dt: HTMLAttributes;
    em: HTMLAttributes;
    embed: EmbedHTMLAttributes;
    fieldset: FieldsetHTMLAttributes;
    figcaption: HTMLAttributes;
    figure: HTMLAttributes;
    footer: HTMLAttributes;
    form: FormHTMLAttributes;
    h1: HTMLAttributes;
    h2: HTMLAttributes;
    h3: HTMLAttributes;
    h4: HTMLAttributes;
    h5: HTMLAttributes;
    h6: HTMLAttributes;
    head: HTMLAttributes;
    header: HTMLAttributes;
    hgroup: HTMLAttributes;
    hr: HTMLAttributes;
    html: HtmlHTMLAttributes;
    i: HTMLAttributes;
    iframe: IframeHTMLAttributes;
    img: ImgHTMLAttributes;
    input: InputHTMLAttributes;
    ins: InsHTMLAttributes;
    kbd: HTMLAttributes;
    keygen: KeygenHTMLAttributes;
    label: LabelHTMLAttributes;
    legend: HTMLAttributes;
    li: LiHTMLAttributes;
    link: LinkHTMLAttributes;
    main: HTMLAttributes;
    map: MapHTMLAttributes;
    mark: HTMLAttributes;
    menu: MenuHTMLAttributes;
    meta: MetaHTMLAttributes;
    meter: MeterHTMLAttributes;
    nav: HTMLAttributes;
    noindex: HTMLAttributes;
    noscript: HTMLAttributes;
    object: ObjectHTMLAttributes;
    ol: OlHTMLAttributes;
    optgroup: OptgroupHTMLAttributes;
    option: OptionHTMLAttributes;
    output: OutputHTMLAttributes;
    p: HTMLAttributes;
    param: ParamHTMLAttributes;
    picture: HTMLAttributes;
    pre: HTMLAttributes;
    progress: ProgressHTMLAttributes;
    q: QuoteHTMLAttributes;
    rp: HTMLAttributes;
    rt: HTMLAttributes;
    ruby: HTMLAttributes;
    s: HTMLAttributes;
    samp: HTMLAttributes;
    script: ScriptHTMLAttributes;
    section: HTMLAttributes;
    select: SelectHTMLAttributes;
    slot: SlotHTMLAttributes;
    small: HTMLAttributes;
    source: SourceHTMLAttributes;
    span: HTMLAttributes;
    strong: HTMLAttributes;
    style: StyleHTMLAttributes;
    sub: HTMLAttributes;
    summary: HTMLAttributes;
    sup: HTMLAttributes;
    table: TableHTMLAttributes;
    template: HTMLAttributes;
    tbody: HTMLAttributes;
    td: TdHTMLAttributes;
    textarea: TextareaHTMLAttributes;
    tfoot: HTMLAttributes;
    th: ThHTMLAttributes;
    thead: HTMLAttributes;
    time: TimeHTMLAttributes;
    title: HTMLAttributes;
    tr: HTMLAttributes;
    track: TrackHTMLAttributes;
    u: HTMLAttributes;
    ul: HTMLAttributes;
    var: HTMLAttributes;
    video: VideoHTMLAttributes;
    wbr: HTMLAttributes;
    webview: WebViewHTMLAttributes;

    // SVG
    svg: SVGAttributes;
    animate: SVGAttributes;
    animateMotion: SVGAttributes;
    animateTransform: SVGAttributes;
    circle: SVGAttributes;
    clipPath: SVGAttributes;
    defs: SVGAttributes;
    desc: SVGAttributes;
    ellipse: SVGAttributes;
    feBlend: SVGAttributes;
    feColorMatrix: SVGAttributes;
    feComponentTransfer: SVGAttributes;
    feComposite: SVGAttributes;
    feConvolveMatrix: SVGAttributes;
    feDiffuseLighting: SVGAttributes;
    feDisplacementMap: SVGAttributes;
    feDistantLight: SVGAttributes;
    feDropShadow: SVGAttributes;
    feFlood: SVGAttributes;
    feFuncA: SVGAttributes;
    feFuncB: SVGAttributes;
    feFuncG: SVGAttributes;
    feFuncR: SVGAttributes;
    feGaussianBlur: SVGAttributes;
    feImage: SVGAttributes;
    feMerge: SVGAttributes;
    feMergeNode: SVGAttributes;
    feMorphology: SVGAttributes;
    feOffset: SVGAttributes;
    fePointLight: SVGAttributes;
    feSpecularLighting: SVGAttributes;
    feSpotLight: SVGAttributes;
    feTile: SVGAttributes;
    feTurbulence: SVGAttributes;
    filter: SVGAttributes;
    foreignObject: SVGAttributes;
    g: SVGAttributes;
    image: SVGAttributes;
    line: SVGAttributes;
    linearGradient: SVGAttributes;
    marker: SVGAttributes;
    mask: SVGAttributes;
    metadata: SVGAttributes;
    mpath: SVGAttributes;
    path: SVGAttributes;
    pattern: SVGAttributes;
    polygon: SVGAttributes;
    polyline: SVGAttributes;
    radialGradient: SVGAttributes;
    rect: SVGAttributes;
    stop: SVGAttributes;
    switch: SVGAttributes;
    symbol: SVGAttributes;
    text: SVGAttributes;
    textPath: SVGAttributes;
    tspan: SVGAttributes;
    use: SVGAttributes;
    view: SVGAttributes;

    [k: string]: HTMLAttributes;
}
