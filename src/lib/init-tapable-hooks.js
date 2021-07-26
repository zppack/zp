import { HookMap, AsyncSeriesHook } from 'tapable';
import log from '@zppack/log';
import chalk from 'chalk';

// tapable hooks
const hooks = {
  // tapable hooks for plugins to tap
  list: [
    'before-create', // before creating project directory
    'before-init', // after creating project directory and setup context, before initialization start
    'before-module-install', // [if there are modules config] before every module initialzation start
    'before-module-middleware', // [if there are modules config] after downloading the module, before middlewares install
    'before-module-merge', // [if there are modules config] after module middlewares processing done, before merge module files to `zpDestPath`
    'after-module', // [if there are modules config] after module files are merged
    'after-module-all', // after all module files merged, or after bypass module initialization with no modules config
    'after-init', // after files moved to appPath and cleaning up done, before git initialization and npm installation
    'after-create', // after git initialization and npm installlation, everything done.
  ],
  map: new HookMap(key => new AsyncSeriesHook(['ctx'])),
  init() {
    this.list.forEach((hookName) => {
      this.map.for(hookName).intercept({
        register: ({ name }) => {
          log.i(`✨ Tapable: [intercept:register] registered a plugin "${chalk.yellow.underline(name)}" triggered by the hook ${chalk.bgBlueBright(` ${hookName} `)}.`);
        },
        call: (ctx) => {
          log.d(`✨ Tapable: [intercept:call] before the hook ${chalk.bgBlueBright(` ${hookName} `)} calls. Current context: \n`, chalk.gray(JSON.stringify(ctx)));
        },
        tap: ({ name }) => {
          log.i(`✨ Tapable: [intercept:tap] before the plugin "${chalk.yellow.underline(name)}" taps into the hook ${chalk.bgBlueBright(` ${hookName} `)}.`);
        },
      });
    });
  },
  tap(plugin) {
    const { name, hook, pkgName, pkgVersion, config } = plugin;
    const pkg = `${pkgName}@${pkgVersion}`;
    log.i(`✨ Tapable: tap hook ${chalk.underline(hook)} with plugin ${chalk.yellow.underline(name, `(${pkg})`)}.`);
    log.d(`✨ Tapable: installing plugin ${chalk.yellow.underline(pkg)}. Plugin configs = \n`, chalk.gray(JSON.stringify(config)));
    const sh = `npm install -g ${pkg}`;
    execShellSync(sh, 3002, `Unknown error of cmd: ${chalk.underline(sh)}. This maybe an error of npm itself.`);
    log.d('✨ Tapable: plugin ' + chalk.yellow.underline(pkg) + ' installed');
    let pluginFn = importGlobal(pkgName);
    pluginFn = pluginFn.default ?? pluginFn;
    const pluginFnTag = pluginFn[Symbol.toStringTag];
    if (pluginFnTag === 'AsyncFunction') {
      this.map.for(hook).tapAsync(name, (ctx, cb) => {
        const pluginCtx = { ...ctx, pluginConfig: config };
        pluginFn(pluginCtx).then(cb);
      });
    } else if (pluginFnTag === 'GeneratorFunction') {
      this.map.for(hook).tapAsync(name, (ctx, cb) => {
        const pluginCtx = { ...ctx, pluginConfig: config };
        const pluginGen = pluginFn(pluginCtx);
        let result = pluginGen.next();
        while (!result.done) {
          result = pluginGen.next();
        }
        cb();
      });
    } else {
      this.map.for(hook).tap(name, (ctx) => {
        const pluginCtx = { ...ctx, pluginConfig: config };
        pluginFn(pluginCtx);
      });
    }
  },
  call(hookName, ctx) {
    const hook = this.map.get(hookName);
    log.d(`✨ Tapable: hook ${chalk.underline(hookName)} called. ${hook.taps.length} plugins tapped will be run.`);
    return new Promise((resolve) => {
      log.d(chalk.gray(JSON.stringify(hook.taps)));
      if (hook !== undefined && hook.taps && hook.taps.length > 0) {
        hook.callAsync(ctx, () => {
          log.i(`✨ Tapable: hook ${chalk.underline(hookName)} done.`);
          resolve();
        });
      } else {
        resolve();
      }
    });
  },
};

export default hooks;
