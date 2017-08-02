[![Logo](https://cdn.rawgit.com/Chialab/dna/master/logo.svg)](http://dna.chialab.io)

Just another components pattern.

[Documentation](http://dna.chialab.io/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://dna.chialab.io) | [Author home page](http://www.chialab.it)

[![Travis](https://img.shields.io/travis/Chialab/dna.svg?maxAge=2592000)](https://travis-ci.org/Chialab/dna)
[![Code coverage](https://codecov.io/gh/Chialab/dna/graph/badge.svg)](https://codecov.io/gh/Chialab/dna)
[![NPM](https://img.shields.io/npm/v/@dnajs/core.svg)](https://www.npmjs.com/package/@dnajs/core)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-012.svg)](https://saucelabs.com/u/chialab-sl-012)

## Principles

### 🚀 Standards first
Components are built using the same syntax of W3C Custom Elements specifications.

### 🍔 Modular system
Thanks to ES2015 classes and a [smart mixins implementation](https://github.com/justinfagnani/mixwith.js), it is easy to combine features and reuse code.

### 🍻 Interoperability
Moving away DOM strategies and focusing on the pattern, components can work with different implementations like Custom Elements, React, Incremental DOM and, ideally, any other javascript library.

## Usage

### Use with [Custom Elements v1](./packages/custom-elements-v1/)

DNA is built on the top of [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs, so it is 100% compatible with the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) interface. Simply define the component and register it using `customElements.define`.

### Use with [Incremental DOM](./packages/idom/)

Using [Google IncrementalDOM](https://github.com/google/incremental-dom) notifications, DNA can replicate [Custom Elements v1](https://www.w3.org/TR/custom-elements/) callbacks without any polyfill.

**Use with [Custom Elements v0 spec](./packages/custom-elements-v0/).**

**Use with [React](./packages/react/).**
