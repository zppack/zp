#!/usr/bin/env node

import fse from 'fs-extra';
import path from 'path';
import log from '@zppack/log';
import { GLOBAL_CONFIG_HOME, GLOBAL_CONFIG_NAME } from '../lib/constants';

log.i('Post-install: checking global config file...');

log.d('Copy from: ', path.resolve(__dirname, '../../config/', GLOBAL_CONFIG_NAME));
log.d('Copy to: ', path.resolve(GLOBAL_CONFIG_HOME, GLOBAL_CONFIG_NAME));

if (fse.existsSync(path.resolve(GLOBAL_CONFIG_HOME, GLOBAL_CONFIG_NAME))) {
  log.w('Post-install: global config file already exists and will be overwriten by latest one.');
} else {
  log.i('Post-install: creating global config file...');
}

try {
  fse.copySync(path.resolve(__dirname, '../../config/', GLOBAL_CONFIG_NAME), path.resolve(GLOBAL_CONFIG_HOME, GLOBAL_CONFIG_NAME));
} catch (ex) {
  log.e('Post-install: failed to create global config file!');
  throw ex;
}
log.i('Post-install: create global config file successfully');

