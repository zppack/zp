# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.2-alpha.8](https://github.com/zppack/zp/compare/v0.1.2-alpha.7...v0.1.2-alpha.8) (2021-08-11)


### Refactors

* read extensions config from main process ([db7d385](https://github.com/zppack/zp/commit/db7d3854a2374782cced03a6b28aa670aef233ea))

### [0.1.2-alpha.7](https://github.com/zppack/zp/compare/v0.1.2-alpha.6...v0.1.2-alpha.7) (2021-08-11)


### Features

* add -f, --force option to zp-init to clean up directory before init when the directory already exists. ([b267527](https://github.com/zppack/zp/commit/b267527d13ffbfd0bc0be649b10f4a89228d4a23))


### Bug Fixes

* add installOpts param for extensions in type `npm` ([6791f0f](https://github.com/zppack/zp/commit/6791f0f5c0609f07c34e36bab0fb7bbdc209921c))
* remove wrong duplicate hooks call ([750c9e9](https://github.com/zppack/zp/commit/750c9e9f764748d18c549278990479c366c57bcb))

### [0.1.2-alpha.6](https://github.com/zppack/zp/compare/v0.1.2-alpha.5...v0.1.2-alpha.6) (2021-08-10)


### Bug Fixes

* fix import errors ([96aee56](https://github.com/zppack/zp/commit/96aee564443b1faaf1d3c71a2bd9d1075692e546))

### [0.1.2-alpha.5](https://github.com/zppack/zp/compare/v0.1.2-alpha.4...v0.1.2-alpha.5) (2021-08-10)


### Features

* add extensions and refactor subcommanders ([41ba3e3](https://github.com/zppack/zp/commit/41ba3e35fcada2ea6784e4d51e7b380a017badfe))


### Bug Fixes

* fix error that ecexShellSync not be imported in init-tapable-hooks.js ([6b80133](https://github.com/zppack/zp/commit/6b8013332f03adad875d6fd1e489791fda5f678f))

### [0.1.2-alpha.4](https://github.com/zppack/zp/compare/v0.1.2-alpha.3...v0.1.2-alpha.4) (2021-08-10)

### [0.1.2-alpha.3](https://github.com/zppack/zp/compare/v0.1.2-alpha.2...v0.1.2-alpha.3) (2021-08-10)

### [0.1.2-alpha.2](https://github.com/zppack/zp/compare/v0.1.2-alpha.1...v0.1.2-alpha.2) (2021-08-10)

### [0.1.2-alpha.1](https://github.com/zppack/zp/compare/v0.1.2-alpha.0...v0.1.2-alpha.1) (2021-08-10)

### [0.1.2-alpha.0](https://github.com/zppack/zp/compare/v0.1.1...v0.1.2-alpha.0) (2021-08-10)


### Build

* upgrade least required node version to v14 to support grammar `?.` ([f88012c](https://github.com/zppack/zp/commit/f88012ced1358ff7c7d1668755ab9dfa33fd4472))

### [0.1.1](https://github.com/zppack/zp/compare/v0.1.0...v0.1.1) (2021-07-22)


### Bug Fixes

* Fix a bug that async plugin did not call the callback function which would break later plugins for the same hook. ([fd09608](https://github.com/zppack/zp/commit/fd096083ce4f22f9d88db2a29291885cce5ab83a))

## [0.1.0](https://github.com/zppack/zp/compare/v0.0.15...v0.1.0) (2021-06-29)


### Features

* add version update tips ([12ab72a](https://github.com/zppack/zp/commit/12ab72a5d82ccc2ca7a6b084e8e039649b0526c8))

### [0.0.15](https://github.com/zppack/zp/compare/v0.0.14...v0.0.15) (2021-06-29)


### Features

* zp init support config preset through options `-p, --preset <preset-name>` ([fb5bf8d](https://github.com/zppack/zp/commit/fb5bf8de735e8e8f5bc57bb187f6a904bac55edc))

### [0.0.14](https://github.com/zppack/zp/compare/v0.0.13...v0.0.14) (2021-06-28)

### [0.0.13](https://github.com/zppack/zp/compare/v0.0.12...v0.0.13) (2021-06-28)

### [0.0.12](https://github.com/zppack/zp/compare/v0.0.11...v0.0.12) (2021-06-28)


### Bug Fixes

* Fix a stupid error that writing JSON to Json ([74a9ef6](https://github.com/zppack/zp/commit/74a9ef619d0ea87ab0f0e6cd888c7b0844440d94))

### [0.0.11](https://github.com/zppack/zp/compare/v0.0.10...v0.0.11) (2021-06-28)


### Bug Fixes

* Fix tapable async hook lack of callback ([818acc5](https://github.com/zppack/zp/commit/818acc520ba15cd9cea91d4177d5c36afd43d0e4))

### [0.0.10](https://github.com/zppack/zp/compare/v0.0.9...v0.0.10) (2021-06-28)


### Bug Fixes

* Fix a bug of null pointer in hooks function ([c521c27](https://github.com/zppack/zp/commit/c521c27e623c5ed4388f1e33dae57f3e0d080667))

### [0.0.9](https://github.com/zppack/zp/compare/v0.0.8...v0.0.9) (2021-06-28)


### Features

* support plugins with tapable hooks. ([c1809d2](https://github.com/zppack/zp/commit/c1809d2c19bd91b90a80dcc8989b387a8653be44))

### [0.0.8](https://github.com/zppack/zp/compare/v0.0.7...v0.0.8) (2021-04-15)


### Bug Fixes

* fix a bug when merging two modules' package.json files but the later module don't have one ([9c15108](https://github.com/zppack/zp/commit/9c1510836630d0880fbf71fcd5ed3272eb03b36f))

### [0.0.7](https://github.com/zppack/zp/compare/v0.0.6...v0.0.7) (2021-04-15)


### Bug Fixes

* fix the problem which happens in the case executing `npm install` when there is a `prepare` npm script config, which runs some commands like `build` or `pack`, but codes for builing or packing are not ready, by adding `--ignore-scripts` argument ([aeb185a](https://github.com/zppack/zp/commit/aeb185affc0a369cecd439dc1a9ab560b08d88e8))

### [0.0.6](https://github.com/zppack/zp/compare/v0.0.5...v0.0.6) (2021-04-14)

### [0.0.5](https://github.com/zppack/zp/compare/v0.0.4...v0.0.5) (2021-04-14)

### [0.0.4](https://github.com/zppack/zp/compare/v0.0.3...v0.0.4) (2021-04-14)


### Bug Fixes

* fix bugs when merging module results ([9a3e067](https://github.com/zppack/zp/commit/9a3e067431f66e0083f12b1a2448a301e8c0049c))

### [0.0.3](https://github.com/zppack/zp/compare/v0.0.2...v0.0.3) (2021-04-12)


### Documentations

* something about config file ([da96957](https://github.com/zppack/zp/commit/da96957554e9b675744f309c500665abdfaa6fff))

### 0.0.2 (2021-04-12)


### Features

* finish initialization feature developments ([aca4c1b](https://github.com/zppack/zp/commit/aca4c1bb55e3997c3bedd0c008af5b658b46c927))
