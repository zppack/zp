#!/usr/bin/env node

import path from 'path';
import fse from 'fs-extra';
import program from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Toml from '@ltd/j-toml';
import importGlobal from 'import-global';
import log from '@zppack/log';
import zpGlob from '@zppack/glob';
import mergePackage from 'merge-packages';
import hooks from '../lib/init-tapable-hooks';
import getZprc from '../lib/zprc';
import { filterTrim, validateRequired } from '../lib/inquirer-util';
import execShellSync from '../lib/shell-util';
import {
  GLOBAL_CONFIG_HOME,
  APP_ZP_HOME,
  APP_ZP_TEMP,
  ZP_MODULE_CONFIG_HOME,
  ZP_MODULE_CONFIG_NAME,
  INQUIRER_PREFIX,
} from '../lib/constants';
import pkg from '../../package.json';

const isDebugMode = process.env.ZP_DEBUG || process.env.DEBUG;

program.version(pkg.version, '-v, --version');

program
  .option('-p, --preset <preset-name>', 'Using specific config presets')
  .arguments('[name]')
  .action((name, options, command) => {
    // log.d('options: ', options, command.opts());
    start({ name, ...options }).then(() => {
      log.i('Init Completed.');
    }).catch((err) => {
      log.e(chalk.redBright(`${err} (Error Code: ${process.exitCode})`));
    });
  });

program.parse(process.argv);

// const opts = program.opts();
// console.log(program.args, opts);

async function start({ name, preset, ...rest }) {
  log.i('Init start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  log.d(name, preset, rest);

  const date = new Date();
  const dateStr = `${date.getFullYear()}.${date.getMonth() + 1}`;

  const zprc = await getZprc(preset);
  log.d('Init zprc: \n', JSON.stringify(zprc));

  // init hooks
  log.i('Initializing tapable hooks...');
  hooks.init();
  // register plugins that tap into hooks
  log.i('Registering plugins...');
  const { plugins } = zprc.init || {};
  log.d('Registering plugins: ', chalk.gray(JSON.stringify(plugins)));
  if (plugins && plugins.length > 0) {
    plugins.forEach((plugin) => {
      hooks.tap(plugin);
    });
  } else {
    log.i('Bypass plugins registering for no configurations.')
  }

  const options = { name, projectName: name, date: dateStr, ...rest };
  const ctx = { options, zprc };

  // call hook "before-create"
  await hooks.call('before-create', ctx);

  // create project directory
  await createProject(ctx);

  // create context
  if (ctx.appPath) {
    ctx.zpPath = path.join(ctx.appPath, APP_ZP_HOME);
    ctx.zpDestPath = path.join(ctx.zpPath, APP_ZP_TEMP);
    fse.mkdirSync(ctx.zpPath);
    fse.mkdirSync(ctx.zpDestPath);
  }

  await initProject(ctx);
}

async function createProject(ctx) {
  const { options } = ctx;
  const questions = [
    {
      type: 'input',
      name: 'projectName',
      prefix: INQUIRER_PREFIX,
      message: chalk.yellow('Input the project name: '),
      default: () => options.projectName || '',
      filter: filterTrim,
      validate: validateRequired(chalk.red('Project name is required.')),
    }
  ];

  const { projectName } = await inquirer.prompt(questions);
  log.d('Create project: projectName = ' + chalk.underline(projectName));
  options.projectName = projectName;

  if (!options.name) {
    options.name = projectName;
  }

  if (fse.existsSync(options.name)) {
    log.d('Create project: already exist project directory ' + chalk.underline(options.name));
    process.exitCode = 1000;
    throw Error(`Directory ${options.name} already exist. Try another name or remove the existing directory.`);
  } else {
    fse.mkdirSync(options.name);
    ctx.appPath = path.resolve(options.name);
    log.i('Create project: project directory ' + chalk.underline(options.name) + ' created.');
  }
}

async function initProject(ctx) {
  log.i('Init project: begin to init project.');

  // call hook "before-init"
  await hooks.call('before-init', ctx);

  const { zprc } = ctx;
  const { modules } = zprc.init || {};
  if (!modules) {
    process.exitCode = 2000;
    throw Error(`Global config not found. Please check your global config at ${chalk.underline(GLOBAL_CONFIG_HOME)}, or 're-install' zp.`);
  }

  log.i('Init project: initializing project modules...');

  if (modules.length > 0) {
    const len = modules.length;
    let moduleIndex = 0;
    while (moduleIndex < len) {
      // ask whether to continue or skip to next module, or break all.
      // if continue
      const module = modules[moduleIndex];
      await initProjectModule(module, ctx);
      moduleIndex += 1;
      // else if skip to next
      // moduleIndex += 1;
      // else if break all
      // break; // or moduleIndex = len;
    }
    log.i(`Init project: ${len} project modules initialization completed.`);
  } else {
    log.w('Init project: no modules in config file.');
  }

  // call hook "after-module-all"
  await hooks.call('after-module-all', ctx);

  log.i('Init project: moving project files...');
  log.d('Init project: moving project files from ' + chalk.underline(ctx.zpDestPath) + ' to ' + chalk.underline(ctx.appPath));
  fse.copySync(ctx.zpDestPath, ctx.appPath);

  if (!isDebugMode) {
    log.i('Init project: removing temperary files...');
    fse.removeSync(ctx.zpPath);
  } else {
    log.d('Init project: retain temperary files during project initialization in ' + chalk.underline(ctx.zpPath));
  }

  // call hook "after-init"
  await hooks.call('after-init', ctx);

  const shellCwd = ctx.appPath;
  log.d('Init project: shell cwd = ' + chalk.underline(shellCwd));

  log.i('Iint project: initializing git environments...');
  log.d('Init project: executing shell ' + chalk.blue('git init'));
  execShellSync('git init', { cwd: shellCwd }, 3001, 'This maybe an error of git itself when executing shell `git init`');

  log.i('Init project: installing npm dependencies...');
  log.d('Init project: executing shell ' + chalk.blue('npm install'));
  try {
    execShellSync('npm install --ignore-scripts', { cwd: shellCwd }, 3002, 'This maybe an error of npm itself when executing shell `npm install`');
  } catch (err) {
    log.e(chalk.redBright(`${err} (Error Code: ${process.exitCode})`));
    // process.exitCode = 1;
  }

  log.i('Init project: project initialization done.');

  // call hook "after-create"
  await hooks.call('after-create', ctx);
}

async function initProjectModule(module, ctx) {
  const { options, zpPath, zpDestPath } = ctx;
  const { type, defaultRepo, repos } = module;

  // call hook "before-module-install"
  await hooks.call('before-module-install', { ...ctx, module });

  log.i('Init project module: start project module, type = ', chalk.underline(type));

  if (!repos || !repos.length) {
    process.exitCode = 2001;
    throw Error(`No "repos" config when init project module type: ${chalk.underline(type)}.`);
  }

  let repoObj;
  if (repos.length === 1) {
    repoObj = repos[0];
  }
  if (repos.length > 1) {
    const { repoName } = await inquirer.prompt({
      type: 'list',
      name: 'repoName',
      prefix: INQUIRER_PREFIX,
      message: `Select a repo for module ${chalk.underline(type)}: `,
      choices: repos.map((item) => item.name),
      default: defaultRepo || ''
    });
    repoObj = repos.find(item => item.name === repoName);
  }
  log.d('Init project module: repo name = ' + chalk.underline(repoObj.name) + ', repo url = ' + chalk.underline(repoObj.repo) + ', repo path = ' + chalk.underline(repoObj.path));

  if (!repoObj.path || !repoObj.repo) {
    log.w(`Init project module: lack of "path" or "repo" config of module repo "${repoObj.name}", module "${type}" skipped.`);
    return;
  }

  log.i('Init project module: cloning module template from ' + chalk.underline(repoObj.repo));
  const sh = `git clone ${repoObj.repo} ${zpPath}/${repoObj.path}`;
  log.d('Init project module: executing command: ' + chalk.blue(sh));
  execShellSync(sh, 3001, `Unknown error of cmd: ${chalk.underline(sh)}. Check your git client and this maybe an error of that.`);

  if (isDebugMode) {
    log.d('Init project module: back-up template to ' + chalk.underline(`.${repoObj.path}`));
    fse.copySync(path.join(zpPath, repoObj.path), path.join(zpPath, `.${repoObj.path}`));
  }

  const moduleCtx = {
    ...repoObj,
    type,
    tplBasePath: path.join(zpPath, repoObj.path),
    tplPath: path.join(zpPath, repoObj.path, type),
    configDir: ZP_MODULE_CONFIG_HOME,
    options,
  };

  const configTomlPath = path.join(moduleCtx.tplPath, moduleCtx.configDir, ZP_MODULE_CONFIG_NAME);
  log.i('Init project module: reading module config...');
  log.d('Init project module: reading module config from ' + chalk.underline(configTomlPath));
  const configToml = fse.readFileSync(configTomlPath, 'utf8');
  const moduleConfig = Toml.parse(configToml, 1.0, '\n', false);
  moduleCtx.moduleConfig = moduleConfig;

  // call hook "before-module-middleware"
  await hooks.call('before-module-middleware', { ...ctx, moduleCtx });

  // first version: only support object of middleware package name and version, such as `{ '@zppack/zp-vars': '0.1.0' }`.
  const middlewares = Object.entries(moduleConfig.middlewares || {});
  if (middlewares.length > 0) {
    log.i('Init project module: installing module middlewares...');
    const usedMiddlewares = await Promise.all(middlewares.map(([pkgName, pkgVersion]) => {
      return new Promise((resolve) => {
        const pkg = `${pkgName}@${pkgVersion}`;
        log.d('Init project module: installing middleware ' + chalk.underline(pkg));
        const sh = `npm install -g ${pkg}`;
        execShellSync(sh, 3002, `Unknown error of cmd: ${chalk.underline(sh)}. This maybe an error of npm itself.`);
        log.d('Init project module: middleware ' + chalk.underline(pkg) + ' installed');
        const middleware = importGlobal(pkgName);
        resolve(middleware.default ?? middlewares);
      });
    }));
    log.d('Init project module: installing module middlewares done.');

    const composeMiddlewares = (middlewares) => {
      return (ctx, next) => {
        const dispatch = (i) => {
          let fn = middlewares[i];
          if (i === middlewares.length) {
            fn = next;
          }
          if (!fn) {
            return Promise.resolve();
          }
          const rNext = () => {
            return dispatch(i + 1);
          }

          const r = fn(ctx, rNext);
          return Promise.resolve(r);
        };
        return dispatch(0);
      };
    };

    const composedMiddlewaresFn = composeMiddlewares(usedMiddlewares);
    await composedMiddlewaresFn(moduleCtx);
  } else {
    log.i('Init project module: no middlewares.');
  }
  ctx.options = moduleCtx.options;

  // call hook "before-module-merge"
 await hooks.call('before-module-merge', { ...ctx, moduleCtx });

  // merge module results
  log.i('Init project module: moving module files...');
  const cwd = path.resolve(moduleCtx.tplPath);
  log.d('Init project module: moving module files cwd = ', chalk.underline(cwd));
  const moduleFiles = zpGlob.union(['**', `!${ZP_MODULE_CONFIG_HOME}/**`, '!.git/**', '!package.json'], { dot: true, cwd, nodir: true });
  moduleFiles.forEach((file) => {
    const sourceFilePath = path.join(cwd, file);
    const destFilePath = path.join(zpDestPath, file);
    log.d('Init project module: moving file ' + chalk.underline(sourceFilePath) + ' to ' + chalk.underline(destFilePath));
    fse.copySync(sourceFilePath, destFilePath);
  });
  log.i(`Init project module: ${moduleFiles.length} files moved.`);

  const pkgFilePath = path.join(moduleCtx.tplPath, 'package.json');
  if (fse.pathExistsSync(pkgFilePath)) {
    log.d('Init project module: a package.json file found, path = ', chalk.underline(pkgFilePath));
    const destPkgFilePath = path.join(zpDestPath, 'package.json');
    if (fse.pathExistsSync(destPkgFilePath)) {
      log.i('Init project module: merging package.json file...');
      log.d('Init project module: already exists a package.json and will merge them. path = ', chalk.underline(destPkgFilePath));
      const pkgContent = fse.readFileSync(pkgFilePath, 'utf8');
      const destPkgContent = fse.readFileSync(destPkgFilePath, 'utf8');
      const nextPkgContent = mergePackage(destPkgContent, pkgContent);
      fse.writeFileSync(destPkgFilePath, nextPkgContent);
      log.i('Init project module: package.json file merged.');
    } else {
      fse.copySync(pkgFilePath, destPkgFilePath);
      log.i('Init project module: package.json file moved.');
    }
  }

  fse.removeSync(moduleCtx.tplBasePath);
  log.i('Init project module: cleaning up done.');

  // call hook "after-module"
  await hooks.call('after-module', { ...ctx, moduleCtx });

  log.i('Init project module: complete a project module.');
}


