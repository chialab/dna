<p align="center">
    <img alt="synapse" src="https://logos.chialab.io/@dnajs/dna.svg" width="100">
</p>

<p align="center">
    Evolution-based components.
</p>

<p align="center">
    <a href="https://travis-ci.org/Chialab/dna">
        <img alt="Travis status" src="https://img.shields.io/travis/Chialab/dna.svg?style=flat-square">
    </a>
    <a href="https://codecov.io/gh/Chialab/dna">
        <img alt="Code coverage" src="https://img.shields.io/codecov/c/github/chialab/dna.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@dnajs/core">
        <img alt="NPM" src="https://img.shields.io/npm/v/@dnajs/core.svg?style=flat-square">
    </a>
    <a href="https://github.com/Chialab/synapse/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/npm/l/@dnajs/core.svg?style=flat-square">
    </a>
    <a href="https://dna.chialab.io">
        <img alt="Documentation" src="https://img.shields.io/badge/documentation-wiki-ff69b4.svg?style=flat-square">
    </a>
    <a href="https://saucelabs.com/u/chialab-sl-012">
        <img alt="Saucelabs" src="https://badges.herokuapp.com/sauce/chialab-sl-012?labels=none&style=flat-square">
    </a>
</p>

---

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
