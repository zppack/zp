# Brief

## global config cache

- mac:
  - `~/.zprc`: global common config
  - `~/.user.zprc`: global custom config

## process exit code

- `1000`: project name exists
- `2000`: lack of configs
  - `2001`: lack of module config
- `3000`: i/o error
  - `3001`: cmd git error
  - `3002`: cmd npm error

## words

### 模板模块（zp-module）

又叫模块模板，是一种包含某些模板文件和处理配置文件的模块。

当一个 zp-module 被使用时，将先读取模块中的处理配置文件 .zp-module.toml ，在该配置文件中可以配置处理模板文件的中间件；

读取完所有中间件配置后，首先安装这些中间件，然后以 洋葱模型 的方式调用这些中间件对 模板文件 进行处理；

处理完毕后，被处理过的模板文件将会被合并到目标目录，如果模板文件和目标目录中都含有 “package.json“ 文件，将以以下规则进行合并：

对两个文件中的都存在的依赖包进行版本取交集，不同时存在的直接合并

- 对 bin 字段进行智能化合并，包括 object 形式和 string 形式，string 形式将取 package.name 作为执行命令合并到 object 形式中

- 两个文件的  description 都会保留，用空格连接起来

- 一些基础信息，比如 name version homepage author 等，将会保留目标目录的 package.json 中的值，而忽略后续模板中的值，除非之前不存在

- 其他字段进行覆盖式合并，最后会按字母顺序对 package.json 中的字段排序

- 另外，在非 debug 模式下，模板文件合并完后会被清理掉，而 debug 模式下，将会保留最初未处理的模板文件和配置文件，以供调试用。

### 事件系统与插件 （plugins）

采用 `tapable` 的 SyncSeriesHook 类作为本工具的事件钩子，目前仅在 zp-init 工具中使用，支持的事件有：

- before-create：工程目录创建之前
- before-init：创建目录并设置 context 值之后，开始执行初始化操作之前
- before-module-install：在每个模板模块被下载之前，有多个模板模块将会多次触发 （有模板模块配置时才会触发）
- before-module-middleware：在模板模块下载完毕后，开始安装中间件之前 （有模板模块配置时才会触发）
- before-module-merge：在模板模块的模板文件被处理完毕后，准备合并到目标目录之前 （有模板模块配置时才会触发）
- after-module：在模板模块的模板文件被合并到目标目录之后，标识这个模板模块处理完成 （有模板模块配置时才会触发）
- after-module-all：在所有模板模块的模板文件都被合并到目标目录之后，标识模板模块阶段处理全部完成；或者在没有模板模块配置，被跳过模板模块阶段之后
- after-init：在所有的目标目录文件被移动到工程目录文件下，并清理掉临时文件之后，开始初始化 git 环境之前
- after-create：初始完 git 环境 ，并完成 npm dependencies 安装之后，标识 init 最终完成

插件 （plugins） 可以配置一个对应的 hook，一个 hook 可以配置多个 plugin，将按配置顺序执行。

一个插件 plugin 是一个 js 函数，可以是同步的，也可以是异步的，使用普通函数或 `async` 函数进行区分；

当普通函数和异步函数插件同时 tap into 一个 hook 时，依然会按配置顺序执行，后面的插件将等待的异步插件执行完毕才开始执行。
