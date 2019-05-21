import * as DNA_NS from '../dna';

export function adapter(DNA: typeof DNA_NS) {
    const JSDOM = require('js' + 'dom').JSDOM;
    const { document, Node, Text, HTMLElement, CustomEvent } = new JSDOM().window;

    DNA.DOM.Node = Node;
    DNA.DOM.document = document;
    DNA.DOM.Text = Text;
    DNA.DOM.HTMLElement = DNA.shim(HTMLElement);
    DNA.DOM.CustomEvent = CustomEvent;
}
