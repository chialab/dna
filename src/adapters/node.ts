import { DOM } from '../dna';

const JSDOM = require('js' + 'dom').JSDOM;
const { document, Node, Text, Event, CustomEvent, HTMLElement } = new JSDOM().window;

DOM.document = document;
DOM.Node = Node;
DOM.Text = Text;
DOM.Event = Event;
DOM.CustomEvent = CustomEvent;
Object.setPrototypeOf(DOM.HTMLElement.prototype, HTMLElement.prototype);

export * from '../dna';
