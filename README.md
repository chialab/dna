![Logo](https://gitlab.com/dna-components/dna-design/raw/master/logos/logo-raster-128.png)

# DNA Components
Write your set of (Web) Components using [ES2015](https://github.com/lukehoban/es6features), [templates](http://www.2ality.com/2015/01/template-strings-html.html) and (optionally) [Sass](http://sass-lang.com/).

## Features

* Declarative [CustomElements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements)-like interface.
* ES2015 using [Babel](https://babeljs.io) transpiler.
* HTML templates using ES2015 [templates string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings) without any library.
* Optional [virtual-dom](https://github.com/Matt-Esch/virtual-dom) support.
* [Polymer](polymer-project.org)-like behaviors for prototype mixins.
* [WebComponents](http://webcomponents.org/) support.
* Browsers support (IE9+, Chrome, Firefox, Opera, Safari, Android 4.1+)

## TODO

* Quickstart guide
* Tests

## Built-in

[ES5 Library](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-library.md)

Prototypes:
* [DNAComponent](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-component.md)
* [DNAEventsComponent](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-events-component.md)
* [DNAAttributesComponent](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-attributes-component.md)
* [DNATemplateComponent](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-template-component.md)
* [DNAStyleComponent](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-style-component.md)
* [DNAMixedComponent](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-mixed-component.md)
* [DNABaseComponent](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-base-component.md)

Helpers:
* [DNAConfig](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-config.md)
* [DNAHelper](https://gitlab.com/dna-components/dna-components/blob/master/docs/dna-helper.md)

## Examples

* [Example 1](https://gitlab.com/dna-components/dna-components/blob/master/samples/es6/components/seed/seed-component.next.js): using ES2015 + Babel + external template and css
* [Example 2](https://gitlab.com/dna-components/dna-components/blob/master/samples/es5/components/seed/seed-component.js): using DNAComponents Library (ES5 compatibile)

## Build

* Install [NodeJS](https://nodejs.org)
* Navigate to the project path and run: `npm install && npm run build`
