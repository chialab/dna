const jsdom = require('jsdom');
const dom = new jsdom.JSDOM();

// Register a JSDOM window instance as global DNA namespace
global.__DNA_NS__ = dom.window;
