import path from 'path';
import log from '@zppack/log';
import fse from 'fs-extra';
import { ensureVersionImport, ensureImport, INSTALL_OPTS } from 'npm-package-check';
import getZprc from './zprc';
import execShellSync from './shell-util';

export const ACTION = {
  script: 'script',
  command: 'command',
};

const TYPE = {
  inner: 'inner',
  local: 'local',
  cmd: 'cmd',
  npm: 'npm',
};

const validActioin = action => Reflect.has(ACTION, action);
const validType = type => Reflect.has(TYPE, type);

const execFn = async (script, sync, params) => {
  const fn = script.default ?? script;
  if (typeof fn === 'function') {
    if (sync && fn[Symbol.toStringTag] === 'AsyncFunction') {
      await fn(...params);
    } else {
      fn(...params);
    }
  }
}

const execByPath = async (execPath, sync, params) => {
  if (fse.pathExistsSync(execPath)) {
    const innerScript = require(execPath);
    if (innerScript) {
      await execFn(innerScript, sync, params);
    }
  }
}

const addAttrs = (p, attrName, arrs) => {
  let np = p;
  if (arrs && arrs.length) {
    arrs.forEach((arr) => {
      np = np[attrName](...arr);
    });
  }
  return np;
};

const useExtension = async (extension, program) => {
  const { name, action, type, sync = true, config = {} } = extension;

  // 直接执行类扩展
  if (action === ACTION.script) {
    switch (type) {
      case 'inner':
        {
          if (config.path) {
            const execPath = path.resolve(__dirname, '../bin/', config?.path);
            await execByPath(execPath, sync, [program]);
          }
        }
        break;
      case 'local':
        {
          if (config.path) {
            const execPath = path.resolve(process.cwd(), config?.path);
            await execByPath(execPath, sync, [program]);
          }
        }
        break;
      case 'cmd':
        {
          if (config.cmd) {
            const result = execShellSync(config.cmd, 4001, 'This is an error caused by extension command "' + config.cmd + '".');
            log.i(result);
          }
        }
        break;
      case 'npm':
        {
          const { pkgName, pkgVersion } = config;
          if (pkgName) {
            const script = pkgVersion
              ? ensureVersionImport(pkgName, pkgVersion, { installOpts: INSTALL_OPTS.global })
              : ensureImport(pkgName, { installOpts: INSTALL_OPTS.global });
            await execFn(script, sync, [program]);
          }
        }
        break;
      default:
        throw Error('Extension type "' + type + '" is not supported now.');
    }
    return;
  }

  // 注入命令类扩展
  if (action === ACTION.command) {
    const { command, desc, alias, aliases = [], args = [], opts = [] } = config;
    const finalAliases = [].concat(aliases, alias ?? []);
    let p = type === 'inner'
      ? program.command(command, desc ?? name).aliases(finalAliases)
      : program.command(command).aliases(finalAliases).description(desc ?? name);
    p = addAttrs(p, 'argument', args);
    p = addAttrs(p, 'option', opts);

    switch (type) {
      case 'inner':
        break;
      case 'local':
        {
          p.action(async (...rest) => {
            if (config.path) {
              const execPath = path.resolve(process.cwd(), config?.path);
              await execByPath(execPath, sync, rest);
            }
          });
        }
        break;
      case 'cmd':
        {
          p.action(() => {
            const args = process.argv?.slice(3) || [];
            if (config.cmd) {
              const sh = `${config.cmd} ${args.join(' ')}`;
              const result = execShellSync(sh, 4002, 'This is an error caused by extension command "' + sh + '".');
              log.i(result);
            }
          });
        }
        break;
      case 'npm':
        {
          p.action(async (...rest) => {
            const { pkgName, pkgVersion } = config;
            if (pkgName) {
              const script = pkgVersion
                ? await ensureVersionImport(pkgName, pkgVersion, { installOpts: INSTALL_OPTS.global })
                : await ensureImport(pkgName, { installOpts: INSTALL_OPTS.global });
              await execFn(script, sync, rest);
            }
          });
        }
        break;
      default:
        throw Error('Extension type "' + type + '" is not supported now.');
    }
    return;
  }

  throw Error('Extension action "' + action + '" is not supported now.');
};

const assembleExtensions = async (program) => {
  const zprc = await getZprc();
  const { extensions = [] } = zprc;
  if (!extensions || !extensions.length) {
    log.d('Extensions: no extensions config.');
    return [];
  }

  const exList = [];
  const len = extensions.length;
  let exIndex = 0;
  while (exIndex < len) {
    const ex = extensions[exIndex];
    if (ex && ex?.action && ex?.type && validActioin(ex.action) && validType(ex.type)) {
      try {
        log.d('Extensions: using extension ' + ex.name);
        await useExtension(extensions[exIndex], program);
        exList.push(ex.name || 'Unknown Extension');
      } catch (e) {
        log.e('Extensions: assembling extension at index ' + exIndex + ' throws an exception.' + e);
      }
    } else {
      log.w('Extensions: wrong extension config at index ' + exIndex + ', skipped.');
    }
    exIndex += 1;
  }
  log.d('Extensions: ' + exList.length + ' extensions are assembled.', exList);
  return exList;
};

export default assembleExtensions;
