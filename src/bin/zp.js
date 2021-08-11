#!/usr/bin/env node

import program from 'commander';
import chalk from 'chalk';
import log from '@zppack/log';
import getZprc from '../lib/zprc';
import assembleExtensions from '../lib/assemble-extensions';
import pkg from '../../package.json';
// import '../lib/update-util';

program.version(pkg.version, '-v, --version');

program.option('-d, --debug', 'debug mode')
  .on('option:debug', () => {
    const debugMode = program.opts().debug;
    if (debugMode) {
      process.env.ZP_DEBUG = true;
      log.d('zp debug mode truned on');
      log.d(chalk.yellowBright('process.env.ZP_DEBUG = ' + process.env.ZP_DEBUG));
    }
  });

getZprc().then((zprc) => {
  const { extensions = [] } = zprc;
  if (!extensions || !extensions.length) {
    log.d('Extensions: no extensions config.');
    return [];
  }
  return assembleExtensions(extensions, program);
}).then(() => {
  program.parse(process.argv);
});

// const opts = program.opts();
