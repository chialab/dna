---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: DNA
titleTemplate: Progressive Web Components

hero:
    name: 'DNA'
    text: 'Progressive Web Components'
    image:
        src: /logo.svg
        alt: DNA logo
    tagline: 'Unleash the power of Custom Elements through declarative API, customized built-in elements and shadow-free composition.'
    actions:
        - theme: brand
          text: Get started with DNA
          link: /guide/
        - theme: alt
          text: ...but why?
          link: /guide/why-dna

features:
    - title: Customized built-in elements
      details: DNA makes it easy to create customized built-in elements that inherit HTML behavior, preserving usability and accessibility.
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="m31 16l-7 7l-1.41-1.41L28.17 16l-5.58-5.59L24 9l7 7zM1 16l7-7l1.41 1.41L3.83 16l5.58 5.59L8 23l-7-7zm11.42 9.484L17.64 6l1.932.517L14.352 26z"/></svg>
    - title: Properties, states and attributes
      details: With `@property` and `@state` decorators, DNA adds reactivity to class fields, syncing with attributes and triggering updates on change.
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22h14v2H16z"/><rect width="6" height="6" x="4" y="20" fill="currentColor" rx="1"/><path fill="currentColor" d="M16 8h14v2H16zm-6.5 4h-5a.5.5 0 0 1-.447-.724l2.5-5.022a.52.52 0 0 1 .894 0l2.5 5.023A.5.5 0 0 1 9.5 12z"/></svg>
    - title: Slots
      details: DNA renders slotted content via a custom light DOM engine —no Shadow DOM— ensuring form compatibility and allowing &lt;slot&gt; inside built-in elements like &lt;button&gt;.
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M28 3a2.991 2.991 0 0 0-2.816 2h-3.326a3.98 3.98 0 0 0-7.716 0H9.858A3.992 3.992 0 1 0 5 9.858v4.284a3.98 3.98 0 0 0 0 7.716v3.326a3 3 0 1 0 2 0v-3.326a3.978 3.978 0 0 0 1.673-.903l3.364 1.682A2.963 2.963 0 0 0 12 23a3.012 3.012 0 1 0 .922-2.157l-3.148-1.574A3.95 3.95 0 0 0 10 18a3.996 3.996 0 0 0-3-3.858V9.858A3.995 3.995 0 0 0 9.858 7h4.284a3.937 3.937 0 0 0 4.782 2.882l1.811 3.17a3.045 3.045 0 1 0 1.733-.998L20.689 8.94A3.984 3.984 0 0 0 21.858 7h3.326A2.995 2.995 0 1 0 28 3ZM8 18a2 2 0 1 1-2-2a2.002 2.002 0 0 1 2 2ZM6 8a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2Zm10-2a2 2 0 1 1 2 2a2.002 2.002 0 0 1-2-2Z"/></svg>
    - title: Listeners and async events
      details: Use the `@listen` decorator for delegated event handling, even for slotted content. Events can be async and dispatched from within the class.
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M13 2a6.007 6.007 0 0 0-6 6h2a4 4 0 0 1 8 0h2a6.007 6.007 0 0 0-6-6Z"/><path fill="currentColor" d="M21 30h-4.44a4 4 0 0 1-2.708-1.057l-9.2-8.466a2.002 2.002 0 0 1 .118-3.055a2.074 2.074 0 0 1 2.658.173L11 20.857V8a2 2 0 0 1 4 0v7a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v7a6 6 0 0 1-6 6Z"/></svg>
    - title: Cross-framework compatibility
      details: Built with standard Web Components APIs, DNA works with any framework. Plasma can generate wrappers for React, Vue, Svelte, and Angular.
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="m19 20.4l1.4-1.4l7.6 7.6V20h2v10H20v-2h6.6zm-6 0L11.6 19L4 26.6V20H2v10h10v-2H5.4zm4-4.4h-2V5.8l-4.6 4.6L9 9l7-7l7 7l-1.4 1.4L17 5.8z"/></svg>
    - title: Storybook and documentation
      details: The DNA tools ecosystem includes a Storybook preset for Web Components, which automatically
          generates documentation and controls for your components.
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M19 10h7v2h-7zm0 5h7v2h-7zm0 5h7v2h-7z"/><path fill="currentColor" d="M28 5H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.003 2.003 0 0 0 2-2V7a2.002 2.002 0 0 0-2-2ZM4 7h11v18H4Zm13 18V7h11l.002 18Z"/></svg>
---
