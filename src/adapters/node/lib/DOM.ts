import { DOM } from '../../../lib/DOM';

const JSDOM = require('js' + 'dom').JSDOM;
const dom = new JSDOM();

DOM.window = dom.window;
DOM.document = dom.window.document;
