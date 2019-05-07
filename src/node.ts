import { DOM, shim, render, define, Fragment, h, html, css, interpolate, bootstrap, property, delegate, undelegate, Component } from './dna';

const { JSDOM } = require('jsdom');

const { document, Text, HTMLElement } = new JSDOM().window;

DOM.document = document;
DOM.Text = Text;
DOM.HTMLElement = shim(HTMLElement);

export { DOM, shim, render, define, Fragment, h, html, css, interpolate, bootstrap, property, delegate, undelegate, Component };
