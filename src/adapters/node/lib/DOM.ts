import { DOM } from '../../../lib/DOM';

const JSDOM = require('js' + 'dom').JSDOM;
const dom = new JSDOM();

DOM.window = dom.window;
DOM.document = dom.window.document;
DOM.Document = dom.window.Document;
DOM.Node = dom.window.Node;
DOM.Text = dom.window.Text;
DOM.HTMLElement = dom.window.HTMLElement;
DOM.Event = dom.window.Event;
DOM.CustomEvent = dom.window.CustomEvent;
