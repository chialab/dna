/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

import type {
    HTMLAnchorAttributes,
    HTMLAreaAttributes,
    HTMLAttributes,
    HTMLAudioAttributes,
    HTMLBaseAttributes,
    HTMLBlockquoteAttributes,
    HTMLButtonAttributes,
    HTMLCanvasAttributes,
    HTMLColAttributes,
    HTMLColgroupAttributes,
    HTMLDataAttributes,
    HTMLDelAttributes,
    HTMLDetailsAttributes,
    HTMLDialogAttributes,
    HTMLEmbedAttributes,
    HTMLFieldsetAttributes,
    HTMLFormAttributes,
    HTMLHtmlAttributes,
    HTMLIframeAttributes,
    HTMLImgAttributes,
    HTMLInputAttributes,
    HTMLInsAttributes,
    HTMLKeygenAttributes,
    HTMLLabelAttributes,
    HTMLLiAttributes,
    HTMLLinkAttributes,
    HTMLMapAttributes,
    HTMLMenuAttributes,
    HTMLMetaAttributes,
    HTMLMeterAttributes,
    HTMLObjectAttributes,
    HTMLOlAttributes,
    HTMLOptgroupAttributes,
    HTMLOptionAttributes,
    HTMLOutputAttributes,
    HTMLParamAttributes,
    HTMLProgressAttributes,
    HTMLQuoteAttributes,
    HTMLScriptAttributes,
    HTMLSelectAttributes,
    HTMLSlotAttributes,
    HTMLSourceAttributes,
    HTMLStyleAttributes,
    HTMLTableAttributes,
    HTMLTdAttributes,
    HTMLTextareaAttributes,
    HTMLThAttributes,
    HTMLTimeAttributes,
    HTMLTrackAttributes,
    HTMLVideoAttributes,
    HTMLWebViewAttributes,
} from 'svelte/elements';
import type { JSXInternal, Props } from '../types/JSX';

type IntrinsicElementAttributes = {
    a: HTMLAnchorAttributes;
    area: HTMLAreaAttributes;
    audio: HTMLAudioAttributes;
    base: HTMLBaseAttributes;
    blockquote: HTMLBlockquoteAttributes;
    button: HTMLButtonAttributes;
    canvas: HTMLCanvasAttributes;
    col: HTMLColAttributes;
    colgroup: HTMLColgroupAttributes;
    data: HTMLDataAttributes;
    del: HTMLDelAttributes;
    details: HTMLDetailsAttributes;
    dialog: HTMLDialogAttributes;
    embed: HTMLEmbedAttributes;
    fieldset: HTMLFieldsetAttributes;
    form: HTMLFormAttributes;
    html: HTMLHtmlAttributes;
    iframe: HTMLIframeAttributes;
    img: HTMLImgAttributes;
    input: HTMLInputAttributes;
    ins: HTMLInsAttributes;
    keygen: HTMLKeygenAttributes;
    label: HTMLLabelAttributes;
    li: HTMLLiAttributes;
    link: HTMLLinkAttributes;
    map: HTMLMapAttributes;
    menu: HTMLMenuAttributes;
    meta: HTMLMetaAttributes;
    meter: HTMLMeterAttributes;
    object: HTMLObjectAttributes;
    ol: HTMLOlAttributes;
    optgroup: HTMLOptgroupAttributes;
    option: HTMLOptionAttributes;
    output: HTMLOutputAttributes;
    param: HTMLParamAttributes;
    progress: HTMLProgressAttributes;
    q: HTMLQuoteAttributes;
    script: HTMLScriptAttributes;
    select: HTMLSelectAttributes;
    slot: HTMLSlotAttributes;
    source: HTMLSourceAttributes;
    style: HTMLStyleAttributes;
    table: HTMLTableAttributes;
    td: HTMLTdAttributes;
    textarea: HTMLTextareaAttributes;
    th: HTMLThAttributes;
    time: HTMLTimeAttributes;
    track: HTMLTrackAttributes;
    video: HTMLVideoAttributes;
    webview: HTMLWebViewAttributes;
};

/**
 * Extend the SvelteHTMLElements interface for svelte support.
 */
declare module 'svelte/elements' {
    type DNASvelteHTMLElements = {
        [K in keyof JSXInternal.CustomElements]: ('extends' extends keyof JSXInternal.CustomElements[K]
            ? JSXInternal.CustomElements[K] extends keyof IntrinsicElementAttributes
                ? IntrinsicElementAttributes[JSXInternal.CustomElements[K]]
                : HTMLAttributes<JSXInternal.CustomElements[K]>
            : HTMLAttributes<JSXInternal.CustomElements[K]>) &
            Props<JSXInternal.CustomElements[K]>;
    };

    export interface SvelteHTMLElements extends DNASvelteHTMLElements {}
}
