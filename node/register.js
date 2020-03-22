const jsdom = require('jsdom');
const dom = new jsdom.JSDOM();
global.__DNA_NS__ = dom.window;
