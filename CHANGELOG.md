# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
