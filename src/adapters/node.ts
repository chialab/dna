import { DOM, shim } from '../dna';

const JSDOM = require('js' + 'dom').JSDOM;
const { document, Node, Text, HTMLElement, Event, CustomEvent } = new JSDOM().window;

DOM.Node = Node;
DOM.document = document;
DOM.Text = Text;
DOM.HTMLElement = shim(HTMLElement);
DOM.Event = Event;
DOM.CustomEvent = CustomEvent;

export * from '../dna';
