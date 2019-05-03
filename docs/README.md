<p align="center">
    <img alt="DNA" src="https://logos.chialab.io/@chialab/dna.svg" width="100">
</p>

<h1 align="center">
    DNA
</h1>

<h2 align="center">
    Evolution-based components.
</h2>

<p align="center">
    <a href="https://github.com/chialab/dna">
        <img alt="Source link" src="https://img.shields.io/badge/Source-GitHub-lightgrey.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@chialab/dna">
        <img alt="NPM" src="https://img.shields.io/npm/v/@chialab/dna.svg?style=flat-square">
    </a>
    <a href="https://github.com/chialab/dna/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/npm/l/@chialab/dna.svg?style=flat-square">
    </a>
</p>

<section>

### Design Web Components

DNA does not introduce any custom pattern for Component definitions, since it is based on the standard Custom Elements specifications, so the life cycle is almost the same, with some helper methods.

</section>
<section>

### Fast and reliable

In order to be fast, simple and predective, DNA uses a custom template engine. Components automatically re-render when the state change, and only the necessary patches are applied to the DOM tree thanks to an in-place diffing algorithm.

</section>
<section>

### Interpolation and JSX

If you are familiar with JSX, you can write your templates using the React syntax, but if you prefer to use standard JavaScript you can also use [Interpolated Templates]() to avoid the build step in your workflow.

</section>
<section>

### Properties, async render, slots... and more!

DNA comes with a lot of features in a very small (< 5kb gzipped) package. You can use `<slot>` elements like in Shadow DOM contexts, render `Promise`s results, observe properties changes and delegate events.

</section>
