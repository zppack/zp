# zp

A front-end project engineering system which highly supports customization through modularization, middlewares and plugins.

## Features

- [x] Project initialization modularize
- [x] Initialization modules support processing middlewares
- [x] Support plugins with tapable hooks
- [x] Support init config preset
- [ ] Project management tool
- [ ] Support customize cli command
- [ ] Update and upgrade mechanism and tools
- [ ] Developing server improvement
- [ ] Building tool improvement

## Start

```sh
npm install @zppack/zp --global

zp -h

zp init -h

# Debug mode
zp init -d my-project
```

### Commands

#### init

```sh
zp init [project-name] [--preset <preset-name>]
```

Execute the command above and then follow the interactive prompts.

##### options

- `preset`: "--preset" or "-p" options with a required parameter "preset-name" will use `.${preset-name}.zprc` config file instead of `.user.zprc`.

- `debug`: "--debug" or "-d" options will switch on debug mode under which you can get some extra logs that helps debug.

### Config modules

Global config file locates at `%USERHOME%/.zp/.zprc`.
You can create a `.user.zprc` file at the same directory to customize your zp.

#### How to write a `.user.zprc` config file?

> To be completed...

#### Config Presets

Write a config file named as `.{preset-name}.zprc`. Then run `zp init --preset {preset-name}`
## Contributing

[How to contribute to this?](CONTRIBUTING.md)

## Recently changes

See the [change log](CHANGELOG.md).

## License

[MIT](LICENSE)
