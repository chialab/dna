## [3.17.1](https://github.com/chialab/dna/compare/v3.17.0...v3.17.1) (2022-05-24)

## 4.0.2

### Patch Changes

- e202353: Correctly queue multiple assign during rendering cycle.

## 4.0.1

### Patch Changes

- 9ec10fe: Fix root node type in `customElements.upgrade` polyfill.
- 197d483: Fix setting value to textarea via render.

## 4.0.0

### Major Changes

- e77bbc9: Remove Observable builtin support.
- 9bac484: Remove support for node environment.
- ad55600: Refactored function components hooks.
- c8dafc0: Add `shouldUpdate` and `requestUpdate` component methods.
- 02d314e: Use quantum to handle component slotted children in light DOM.
- 02d314e: Expose `$await` and `$pipe` directives to treat promises and observables.
- 41ded18: Rename `builtins` to `HTML` namespace.
- 8e63e39: Add `updatedCallback` component method.
- b24f0e6: Remove target handling from `@listen` decorator.
- 5f108c0: Remove support for HTML constructors in rendering.

### Minor Changes

- 0bb72a6: The `define` method now returns the decorated constructor.
- 93a980a: Externalize htm and quantum packages.
- 0bb72a6: Remove `customElementPrototype` decorator.
- 7ed3a2e: Define `tagName` property to component constructors.

### Patch Changes

- ec8bf4a: Better typings for `define` and `extend` methods.
- be5a445: Update Quantum
- 33b0a0d: Fix recursive `connectedCallback` for polyfilled elements.
- eec481f: Pass context to function component.
- cfb6f5f: Improve and fixing typings.
- 04f9e02: Handle component properties in rendering.
- 7d3ab21: Fix setting property on native elements during render.
- 1224baf: Move element initialization to `inizitialize` method.
- a163273: Remove internal `VComponent` type.
- c9d3e40: Fix components render cycle.
- 0b4a9c2: Globally check polyfilled custom elements.
- 94e919c: Improve builtin classes typings.
- d218fe1: Use `event.composedPath()` for event delegation.
- 8c0b0a3: Treat Quantum as dependency.

## 4.0.0-alpha.16

### Patch Changes

- eec481f: Pass context to function component.

## 4.0.0-alpha.15

### Patch Changes

- 33b0a0d: Fix recursive `connectedCallback` for polyfilled elements.

## 4.0.0-alpha.14

### Patch Changes

- 04f9e02: Handle component properties in rendering.

## 4.0.0-alpha.13

### Major Changes

- ad55600: Refactored function components hooks.

### Patch Changes

- 7d3ab21: Fix setting property on native elements during render.

## 4.0.0-alpha.12

### Patch Changes

- a163273: Remove internal `VComponent` type.

## 4.0.0-alpha.11

### Major Changes

- 5f108c0: Remove support for HTML constructors in rendering.

## 4.0.0-alpha.10

### Major Changes

- b24f0e6: Remove target handling from `@listen` decorator.

## 4.0.0-alpha.9

### Major Changes

- e77bbc9: Remove Observable builtin support.

### Patch Changes

- ec8bf4a: Better typings for `define` and `extend` methods.

## 4.0.0-alpha.8

### Major Changes

- 41ded18: Rename `builtins` to `HTML` namespace.

### Minor Changes

- 7ed3a2e: Define `tagName` property to component constructors.

## 4.0.0-alpha.7

### Patch Changes

- d218fe1: Use `event.composedPath()` for event delegation.

## 4.0.0-alpha.6

### Major Changes

- c8dafc0: Add `shouldUpdate` and `requestUpdate` component methods.
- 8e63e39: Add `updatedCallback` component method.

### Patch Changes

- 0b4a9c2: Globally check polyfilled custom elements.

## 4.0.0-alpha.5

### Minor Changes

- 93a980a: Externalize htm and quantum packages.

### Patch Changes

- c9d3e40: Fix components render cycle.
- 8c0b0a3: Treat Quantum as dependency.

## 4.0.0-alpha.4

### Patch Changes

- be5a445: Update Quantum
- 1224baf: Move element initialization to `inizitialize` method.

## 4.0.0-alpha.3

### Patch Changes

- 94e919c: Improve builtin classes typings.

## 4.0.0-alpha.2

### Patch Changes

- cfb6f5f: Improve and fixing typings.

## 4.0.0-alpha.1

### Minor Changes

- 0bb72a6: The `define` method now returns the decorated constructor.
- 0bb72a6: Remove `customElementPrototype` decorator.

## 4.0.0-alpha.0

### Major Changes

- 9bac484: Remove support for node environment.
- 02d314e: Use quantum to handle component slotted children in light DOM.
- 02d314e: Expose `$await` and `$pipe` directives to treat promises and observables.

## 3.22.0

### Minor Changes

- 98dc11d: Refactored component properties typings for better typecheck perfomances and JSX support.

### Patch Changes

- c5c7e44: Cleanup component class typings
- 98dc11d: Do not expose internal `watchedProperties` field for components.
- 764669e: Fix parent children renderers

## 3.22.0-beta.0

### Minor Changes

- 98dc11d: Refactored component properties typings for better typecheck perfomances and JSX support.

### Patch Changes

- 98dc11d: Do not expose internal `watchedProperties` field for components.
- 764669e: Fix parent children renderers

## 3.21.8

### Patch Changes

- f3e5cc4: Correctly upgrade builtin elements in safari on document interactive.

## 3.21.7

### Patch Changes

- f5e062a: Export `jsxDEV` symbol.

## 3.21.6

### Patch Changes

- eaf752e: Fixed JSX properties typings.

## 3.21.5

### Patch Changes

- 389291d: Fix previous build.

## 3.21.4

### Patch Changes

- 422ea43: Fix jsx-runtime main module import.

## 3.21.3

### Patch Changes

- 496b35a: Preserve fragment keys after multiple renders

## 3.21.2

### Patch Changes

- cf416fb: Correctly move slotted nodes

## 3.21.1

### Patch Changes

- 883de6c: Fix context owner for temporary elements

## 3.21.0

### Minor Changes

- a8e3caf: Collect slot children updates

### Patch Changes

- 0624242: Fix detection for custom element initialized by the parser

## 3.20.9

### Patch Changes

- f9620f9: Fix SSR-ed components owner

## 3.20.8

### Patch Changes

- 93bb3c2: Fix children rendering with context ownership
- 098d8a4: Handle ts `getDecorators` in analyzer

## 3.20.7

### Patch Changes

- Fixed render root for SSR-ed components.

## 3.20.6

### Patch Changes

- Create properties prototype chain only during property definition.

## 3.20.5

### Patch Changes

- Fix re-render emptied virtual nodes (again)

## 3.20.4

### Patch Changes

- Fix re-rendering of emptied nodes

## 3.20.3

### Patch Changes

- Fixed render of slotted text with sibling text template

## 3.20.2

### Patch Changes

- Fix JSX runtime with keyed nodes

## 3.20.1

### Patch Changes

- Ensure the JSX runtime transformation uses array

## 3.20.0

### Minor Changes

- 1b128ec: Render nodes against internal render state instead of actual childNodes

### Patch Changes

- e5adda7: Refactored root context handling
- 4165871: Introduce the `customElementPrototype` decorator for base Component classes.
- 98c3381: Preserve root render context for properties
- c7f0337: Fix context for slotted items.
- 785d6f0: Render should return a shallow clone of the child list

## 3.20.0-beta.5

### Patch Changes

- Introduce the `customElementPrototype` decorator for base Component classes.

## 3.20.0-beta.4

### Patch Changes

- Fix context for slotted items.

## 3.20.0-beta.3

### Patch Changes

- Preserve root render context for properties

## 3.20.0-beta.2

### Patch Changes

- Render should return a shallow clone of the child list

## 3.20.0-beta.1

### Patch Changes

- Refactored root context handling

## 3.20.0-beta.0

### Minor Changes

- 1b128ec: Render nodes against internal render state instead of actual childNodes

## 3.19.1

### Patch Changes

- 18f4463: Fix render component instance check

## 3.19.0

### Minor Changes

- fce7ac5: Integration fixes, tests and docs

## 3.18.2

### Patch Changes

- Correctly read properties from slotted contexts.

## 3.18.1

### Patch Changes

- 36c2f17: Revert sideEffects flag

## 3.18.0

### Minor Changes

- bcee8c3: Make it fully tree shakable

### Bug Fixes

- keyed function components re-render ([d436f6b](https://github.com/chialab/dna/commit/d436f6bcdf9a65e52eabd1261dac0061a5f66199))
- slot default in older browsers ([9104e3a](https://github.com/chialab/dna/commit/9104e3ae2067314c448fd43b9010ae5c6e0899af))

# [3.17.0](https://github.com/chialab/dna/compare/v3.16.1...v3.17.0) (2022-04-26)

### Features

- add update config to properties ([ec0e4fc](https://github.com/chialab/dna/commit/ec0e4fc86544308bb73b223f2a68ca83f4c84c51))

## [3.16.1](https://github.com/chialab/dna/compare/v3.16.0...v3.16.1) (2022-03-29)

### Bug Fixes

- analyzer attribute name ([58eb34f](https://github.com/chialab/dna/commit/58eb34f4b047f13b4e08a6ac25054a60db39cbfd))

# [3.16.0](https://github.com/chialab/dna/compare/v3.15.0...v3.16.0) (2022-03-28)

### Features

- expose VAttrs and VProps ([6ac393f](https://github.com/chialab/dna/commit/6ac393f5151fdc2382d62fd7ccd29d5365c4f40b))

# [3.15.0](https://github.com/chialab/dna/compare/v3.14.6...v3.15.0) (2022-03-28)

## [3.14.6](https://github.com/chialab/dna/compare/v3.14.5...v3.14.6) (2022-03-18)

### Bug Fixes

- do not merge property observers across inheritance ([8a6df78](https://github.com/chialab/dna/commit/8a6df78bc8281377b1785d4b174732306b8c8093))

## [3.14.5](https://github.com/chialab/dna/compare/v3.14.4...v3.14.5) (2022-01-13)

### Bug Fixes

- render components document load ([19b57fb](https://github.com/chialab/dna/commit/19b57fb5f3de6f44c6347d87918f169da48d3783))

## [3.14.4](https://github.com/chialab/dna/compare/v3.14.3...v3.14.4) (2022-01-12)

### Bug Fixes

- prevent unnecessary update ([9537fa2](https://github.com/chialab/dna/commit/9537fa21c749505e773c5ac61ce2abf6d06b1c83))

## [3.14.3](https://github.com/chialab/dna/compare/v3.14.2...v3.14.3) (2022-01-03)

### Bug Fixes

- virtual dom for slotted children ([d592401](https://github.com/chialab/dna/commit/d5924011f4181080dfca0cef59415b83fd466639))

## [3.14.2](https://github.com/chialab/dna/compare/v3.14.1...v3.14.2) (2022-01-03)

### Bug Fixes

- do not reuse slotted children in vdom ([b4a4fe5](https://github.com/chialab/dna/commit/b4a4fe569036e9c774e464245f00ec6b122ac026))

## [3.14.1](https://github.com/chialab/dna/compare/v3.14.0...v3.14.1) (2021-12-22)

### Bug Fixes

- key function components ([d8f7878](https://github.com/chialab/dna/commit/d8f78783cdb708f2240c8cdd6d92656186019b83))

# [3.14.0](https://github.com/chialab/dna/compare/v3.13.6...v3.14.0) (2021-12-17)

## [3.13.6](https://github.com/chialab/dna/compare/v3.13.5...v3.13.6) (2021-12-15)

### Bug Fixes

- ts inference for listener ([b5329c9](https://github.com/chialab/dna/commit/b5329c9294e3bab897fbd9b15afc8ce6182571f4))

## [3.13.4](https://github.com/chialab/dna/compare/v3.13.3...v3.13.4) (2021-12-14)

### Bug Fixes

- store properties using rootContext ([5c306ad](https://github.com/chialab/dna/commit/5c306adb1572c8f09617128b15cd76c8b8ec38a5))
- use isCOnnected helper ([b727ec6](https://github.com/chialab/dna/commit/b727ec6a01137db151196b5699ba0afdc0e12445))

## [3.13.3](https://github.com/chialab/dna/compare/v3.13.2...v3.13.3) (2021-10-26)

### Bug Fixes

- do not store global context key ([7a6866e](https://github.com/chialab/dna/commit/7a6866e553761d461e9ef96bd3db8244083b36b8))

## [3.13.2](https://github.com/chialab/dna/compare/v3.13.1...v3.13.2) (2021-10-22)

### Bug Fixes

- contains checks ([4fa1d15](https://github.com/chialab/dna/commit/4fa1d1525dcb397d26a3228ff5a6642ad5284803))

## [3.13.1](https://github.com/chialab/dna/compare/v3.13.0...v3.13.1) (2021-10-22)

### Bug Fixes

- render root check ([46bbe49](https://github.com/chialab/dna/commit/46bbe493dc138f0c0ad8929cdde5e94621069316))
- revert render with default context ([4a7436e](https://github.com/chialab/dna/commit/4a7436e9ac5f471e6c16a2405397ecab50837e78))

# [3.13.0](https://github.com/chialab/dna/compare/v3.12.1...v3.13.0) (2021-10-21)

### Bug Fixes

- ie11 tests ([c3f436d](https://github.com/chialab/dna/commit/c3f436d211c51f4e59c4af27efcad124bbbf40c9))
- pass root context to default render fn ([b237b85](https://github.com/chialab/dna/commit/b237b8557be317b59a2e86b5e0d77959f0839f04))
- root context and multi slots ([14761d0](https://github.com/chialab/dna/commit/14761d0f809f5e53e0e825648ea8489f4c799fb0))

## [3.12.1](https://github.com/chialab/dna/compare/v3.12.0...v3.12.1) (2021-10-05)

### Bug Fixes

- move slot across roots ([41f33c5](https://github.com/chialab/dna/commit/41f33c5bc4fc42e9a8075257d7ba9628d0858a10))

# [3.12.0](https://github.com/chialab/dna/compare/v3.11.1...v3.12.0) (2021-10-04)

## [3.11.1](https://github.com/chialab/dna/compare/v3.11.0...v3.11.1) (2021-10-04)

### Bug Fixes

- diff for referenced nodes ([1ee38f0](https://github.com/chialab/dna/commit/1ee38f0aba934b1aa72cac4d11c11d2d48a217c4))
- use global namespace alias ([702eaba](https://github.com/chialab/dna/commit/702eaba0e2406674a5726a85f38b7ff0186d6a11))

# [3.11.0](https://github.com/chialab/dna/compare/v3.10.1...v3.11.0) (2021-09-30)

### Features

- export common global constructors ([9a89461](https://github.com/chialab/dna/commit/9a894617100b76bbc1726c8f751e1168b83bee52))

## [3.10.1](https://github.com/chialab/dna/compare/v3.10.0...v3.10.1) (2021-09-29)

### Bug Fixes

- add jsdom typings dependency ([f848bc8](https://github.com/chialab/dna/commit/f848bc8544b09767d73cc3333a571530f970f427))

# [3.10.0](https://github.com/chialab/dna/compare/v3.9.0...v3.10.0) (2021-09-28)

# [3.9.0](https://github.com/chialab/dna/compare/v3.8.1...v3.9.0) (2021-09-23)

## [3.8.1](https://github.com/chialab/dna/compare/v3.8.0...v3.8.1) (2021-09-21)

### Bug Fixes

- improve parseDOM performance by defining a DOMParse component function ([8896ad2](https://github.com/chialab/dna/commit/8896ad201b49f7062bc2ec34611520624df5acaa))

# [3.8.0](https://github.com/chialab/dna/compare/v3.7.0...v3.8.0) (2021-09-01)

### Bug Fixes

- jsx builtin extension ([90821ba](https://github.com/chialab/dna/commit/90821ba80125e914875d6d218b066cea84ab7539))
- jsx typings for custom elements attributes ([4db9842](https://github.com/chialab/dna/commit/4db98428e52f828113b8a326c5de0a34316d03a3))

# [3.7.0](https://github.com/chialab/dna/compare/v3.6.1...v3.7.0) (2021-08-30)

### Bug Fixes

- correctly merge vproperties ([e8034f7](https://github.com/chialab/dna/commit/e8034f70716a21a25a2ce079169d90cd8d0eb6bf))
- do not use deprecated html dialog element ([0cc6737](https://github.com/chialab/dna/commit/0cc673791ff64e7b10d2d2616a8458216d21d9bd))

### Features

- add event listeners to vproperties ([d36364a](https://github.com/chialab/dna/commit/d36364aa6abfd90cc31c8a268b2032d62a1adb0b))

## [3.6.1](https://github.com/chialab/dna/compare/v3.6.0...v3.6.1) (2021-08-24)

### Bug Fixes

- vstyle and vclasses should accept undefined values ([377279e](https://github.com/chialab/dna/commit/377279ee51a2098320e813be125e3f1caceacb27))

# [3.6.0](https://github.com/chialab/dna/compare/v3.5.0...v3.6.0) (2021-08-24)

### Bug Fixes

- support single child in jsx templates ([2b63d38](https://github.com/chialab/dna/commit/2b63d38bdf88cb05930c016267684b56a98da123))

### Features

- jsx runtime typings ([41e1abe](https://github.com/chialab/dna/commit/41e1abee06bb06242982a2ad869c37dd27989a65))

# [3.5.0](https://github.com/chialab/dna/compare/v3.4.8...v3.5.0) (2021-08-23)

### Bug Fixes

- event typings ([3fc4610](https://github.com/chialab/dna/commit/3fc4610ef3875ab7e09f34ea579f9de13cd3c8d8))
- partial writable ([7e0a6ad](https://github.com/chialab/dna/commit/7e0a6ade79fb4d8c0c56ae63b1a5d4dadfaa9e51))

### Features

- full jsx typescript support ([eb4b6ef](https://github.com/chialab/dna/commit/eb4b6efa0c47a8dd9afe72a0dec86b2b277aaaa3))
- reference nodes in jsx using the ref property ([36a3000](https://github.com/chialab/dna/commit/36a3000a543cda34e1e809bb609572dbb4fef27c))

## [3.4.8](https://github.com/chialab/dna/compare/v3.4.7...v3.4.8) (2021-08-10)

### Bug Fixes

- avoid functions and symbols serialization ([27ed396](https://github.com/chialab/dna/commit/27ed396d0f267b0eff41d57b448bd00140992984))

## [3.4.7](https://github.com/chialab/dna/compare/v3.4.6...v3.4.7) (2021-08-09)

### Bug Fixes

- context of listeners with target ([7c6c5a2](https://github.com/chialab/dna/commit/7c6c5a267da662116cae0a6993d755d4bb6c9f99))
- typyings ([7842ddb](https://github.com/chialab/dna/commit/7842ddba9e18663de94943254d0db028ff2003b9))

## [3.4.6](https://github.com/chialab/dna/compare/v3.4.5...v3.4.6) (2021-07-16)

### Bug Fixes

- from attribute context in render ([080da1f](https://github.com/chialab/dna/commit/080da1f7385060b9e9016bb1972259899087a81b))

## [3.4.5](https://github.com/chialab/dna/compare/v3.4.4...v3.4.5) (2021-07-08)

### Bug Fixes

- check property descriptor before set ([d3ff1d4](https://github.com/chialab/dna/commit/d3ff1d44fd2e6dc34840c2750cfd7dda6a3aca5c))

## [3.4.4](https://github.com/chialab/dna/compare/v3.4.3...v3.4.4) (2021-07-07)

### Bug Fixes

- babel legacy decorator ([daa7d35](https://github.com/chialab/dna/commit/daa7d35881fb944cb8503526c5a55f2dccdccb44))
