# zp

A front-end project engineering system which highly supports customization through modularization, middlewares and plugins.

## Features

- [x] Project initialization modularize
- [x] Initialization modules support processing middlewares
- [ ] Support plugins after modules initialization
- [ ] Project management tool
- [ ] Support customize cli command
- [ ] Support events plugins through something like `tapable`
- [ ] Update and upgrade mechanism and tools
- [ ] Developing server improvement
- [ ] Building tool improvement

## Start

```sh
npm install @zppack/zp --global

zp -h

zp init my-project
```

### Commands

#### init

```sh
zp init {project-name}
```

Execute the command above and then follow the interactive prompts.

### Config modules

Global config file locates at `%USERHOME%/.zp/.zprc`.
You can create a `.user.zprc` file at the same directory to customize your zp.

#### How to write a `.user.zprc` config file?

> To be completed...

## Contributing

[How to contribute to this?](CONTRIBUTING.md)

## Recently changes

See the [change log](CHANGELOG.md).

## License

[MIT](LICENSE)
