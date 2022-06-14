## [3.17.1](https://github.com/chialab/dna/compare/v3.17.0...v3.17.1) (2022-05-24)

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
