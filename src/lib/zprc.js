import path from 'path';
import fse from 'fs-extra';
import Toml from '@ltd/j-toml';
import { GLOBAL_CONFIG_HOME, GLOBAL_CUSTOM_CONFIG_NAME, GLOBAL_CONFIG_NAME } from './constants';
import { ACTION } from './assemble-extensions';

function parse(content) {
  // return content.trim().split('\n').reduce((acc, line) => {
  //   const [k, v] = line.split('=').map(item => item.trim());
  //   acc[k] = v;
  //   return acc;
  // }, {});
  return Toml.parse(content, 1.0, '\n', false);
}

export default (preset) => {
  return new Promise((resolve, reject) => {
    try {
      const presetConfigName = `.${preset}.zprc`;
      const customConfigFilePath = path.join(GLOBAL_CONFIG_HOME, preset ? presetConfigName : GLOBAL_CUSTOM_CONFIG_NAME);
      const globalConfigFilePath = path.join(GLOBAL_CONFIG_HOME, GLOBAL_CONFIG_NAME);

      let customConfig = {};
      let globalConfig = {};

      if (fse.existsSync(customConfigFilePath)) {
        const customConfigContent = fse.readFileSync(customConfigFilePath, 'utf8');
        customConfig = parse(customConfigContent);
      }

      if (fse.existsSync(globalConfigFilePath)) {
        const globalConfigContent = fse.readFileSync(globalConfigFilePath, 'utf8');
        globalConfig = parse(globalConfigContent);
      }

      const extensionsMap = [...globalConfig.extensions, ...customConfig.extensions].reduce((acc, next) => {
        if (next.action === ACTION.script && next.name) {
          acc[next.name] = next;
        }
        if (next.action === ACTION.command && next.config?.command) {
          acc[next.config.command.split(' ')[0]] = next;
        }
        return acc;
      }, {});
      const extensions = Object.values(extensionsMap);

      resolve({ ...globalConfig, ...customConfig, extensions });
    } catch (ex) {
      process.exitCode = 3000;
      reject(ex);
    }
  });
}

