import type { JSXInternal } from '../JSX';

export type AutonomousElements = {
    [K in keyof JSXInternal.AutonomousElements]: import('preact').JSX.HTMLAttributes<HTMLElement> &
        JSXInternal.AutonomousElements[K];
};

export type CustomizedElements = {
    [K in keyof JSXInternal.CustomizedElements]: import('preact').JSX.IntrinsicElements[K] &
        (JSXInternal.BuiltinElements[K] | JSXInternal.CustomizedElements[K]);
};

declare global {
    namespace preact.JSX {
        interface IntrinsicElements extends AutonomousElements {
            a: CustomizedElements['a'];
            abbr: CustomizedElements['abbr'];
            address: CustomizedElements['address'];
            area: CustomizedElements['area'];
            article: CustomizedElements['article'];
            aside: CustomizedElements['aside'];
            audio: CustomizedElements['audio'];
            b: CustomizedElements['b'];
            base: CustomizedElements['base'];
            bdi: CustomizedElements['bdi'];
            bdo: CustomizedElements['bdo'];
            big: CustomizedElements['big'];
            blockquote: CustomizedElements['blockquote'];
            body: CustomizedElements['body'];
            br: CustomizedElements['br'];
            button: CustomizedElements['button'];
            canvas: CustomizedElements['canvas'];
            caption: CustomizedElements['caption'];
            cite: CustomizedElements['cite'];
            code: CustomizedElements['code'];
            col: CustomizedElements['col'];
            colgroup: CustomizedElements['colgroup'];
            data: CustomizedElements['data'];
            datalist: CustomizedElements['datalist'];
            dd: CustomizedElements['dd'];
            del: CustomizedElements['del'];
            details: CustomizedElements['details'];
            dfn: CustomizedElements['dfn'];
            dialog: CustomizedElements['dialog'];
            div: CustomizedElements['div'];
            dl: CustomizedElements['dl'];
            dt: CustomizedElements['dt'];
            em: CustomizedElements['em'];
            embed: CustomizedElements['embed'];
            fieldset: CustomizedElements['fieldset'];
            figcaption: CustomizedElements['figcaption'];
            figure: CustomizedElements['figure'];
            footer: CustomizedElements['footer'];
            form: CustomizedElements['form'];
            h1: CustomizedElements['h1'];
            h2: CustomizedElements['h2'];
            h3: CustomizedElements['h3'];
            h4: CustomizedElements['h4'];
            h5: CustomizedElements['h5'];
            h6: CustomizedElements['h6'];
            head: CustomizedElements['head'];
            header: CustomizedElements['header'];
            hgroup: CustomizedElements['hgroup'];
            hr: CustomizedElements['hr'];
            html: CustomizedElements['html'];
            i: CustomizedElements['i'];
            iframe: CustomizedElements['iframe'];
            img: CustomizedElements['img'];
            input: CustomizedElements['input'];
            ins: CustomizedElements['ins'];
            kbd: CustomizedElements['kbd'];
            keygen: CustomizedElements['keygen'];
            label: CustomizedElements['label'];
            legend: CustomizedElements['legend'];
            li: CustomizedElements['li'];
            link: CustomizedElements['link'];
            main: CustomizedElements['main'];
            map: CustomizedElements['map'];
            mark: CustomizedElements['mark'];
            menu: CustomizedElements['menu'];
            menuitem: CustomizedElements['menuitem'];
            meta: CustomizedElements['meta'];
            meter: CustomizedElements['meter'];
            nav: CustomizedElements['nav'];
            noscript: CustomizedElements['noscript'];
            object: CustomizedElements['object'];
            ol: CustomizedElements['ol'];
            optgroup: CustomizedElements['optgroup'];
            option: CustomizedElements['option'];
            output: CustomizedElements['output'];
            p: CustomizedElements['p'];
            param: CustomizedElements['param'];
            picture: CustomizedElements['picture'];
            pre: CustomizedElements['pre'];
            progress: CustomizedElements['progress'];
            q: CustomizedElements['q'];
            rp: CustomizedElements['rp'];
            rt: CustomizedElements['rt'];
            ruby: CustomizedElements['ruby'];
            s: CustomizedElements['s'];
            samp: CustomizedElements['samp'];
            slot: CustomizedElements['slot'];
            script: CustomizedElements['script'];
            search: CustomizedElements['search'];
            section: CustomizedElements['section'];
            select: CustomizedElements['select'];
            small: CustomizedElements['small'];
            source: CustomizedElements['source'];
            span: CustomizedElements['span'];
            strong: CustomizedElements['strong'];
            style: CustomizedElements['style'];
            sub: CustomizedElements['sub'];
            summary: CustomizedElements['summary'];
            sup: CustomizedElements['sup'];
            table: CustomizedElements['table'];
            template: CustomizedElements['template'];
            tbody: CustomizedElements['tbody'];
            td: CustomizedElements['td'];
            textarea: CustomizedElements['textarea'];
            tfoot: CustomizedElements['tfoot'];
            th: CustomizedElements['th'];
            thead: CustomizedElements['thead'];
            time: CustomizedElements['time'];
            title: CustomizedElements['title'];
            tr: CustomizedElements['tr'];
            track: CustomizedElements['track'];
            u: CustomizedElements['u'];
            ul: CustomizedElements['ul'];
            var: CustomizedElements['var'];
            video: CustomizedElements['video'];
            wbr: CustomizedElements['wbr'];
            webview: CustomizedElements['webview'];
        }
    }
}
