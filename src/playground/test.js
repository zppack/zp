// import glob from 'glob';
// import path from 'path';
// import log from '../lib/log';
// import zpGlob from '../lib/zp-glob';
// import { intersect } from '@voxpelli/semver-set';
// import semver from 'semver';

// glob('**/*', { dot: true, debug: process.env.ZP_DEBUG }, (err, matches) => {
//   log(matches);
// });

// const files = glob.sync('**/*', { dot: true });


// const gitFiles = glob.sync('.git/**', { dot: true });
// const nodeModuleFiles = glob.sync('node_modules/**', { dot: true });
// const tempFiles = glob.sync('.tmp/**', { dot: true });
// const tempFiles = glob.sync('dist/**', { dot: true });
// log('glob sync gitFiles: ', gitFiles.length, '\n', gitFiles);
// log('glob sync nodeModuleFiles: ', nodeModuleFiles.length, '\n', nodeModuleFiles);
// log('glob sync tempFiles: ', tempFiles.length, '\n', tempFiles);

// const finalFiles = files.filter((file) => {
//   return !(gitFiles.includes(file) || nodeModuleFiles.includes(file) || tempFiles.includes(file));
// });

// log.i('final files: ', finalFiles.length, '\n', finalFiles);

// const zpGlobFiles = zpGlob.difference(['**/*', '.git/**', 'node_modules/**', 'dist/**'], { dot: true });
// log.i('zpGlob: ', zpGlobFiles.length, '\n', zpGlobFiles);

// const zpGlobFiles2 = zpGlob.union(['**/*', '!.git/**', '!node_modules/**', '!dist/**'], { dot: true })
// log.i('zpGlob2: ', zpGlobFiles2.length, '\n', zpGlobFiles2);

// const zpGlobFiles3 = zpGlob.intersection(['**/*', '!.git/**', '!node_modules/**', '!dist/**'], { dot: true })
// log.i('zpGlob3: ', zpGlobFiles3.length, '\n', zpGlobFiles3);

// const zpGlobFiles4 = zpGlob.union(['src/**/*-*.js', 'src/lib/**', '!**/*-util.js']);
// log.i('zpGlob4: ', zpGlobFiles4.length, '\n', zpGlobFiles4);

// const zpGlobFiles5 = zpGlob.intersection(['src/**/*-*.js', 'src/lib/**', '!**/*-util.js']);
// log.i('zpGlob5: ', zpGlobFiles5.length, '\n', zpGlobFiles5);

// const testappfiles = zpGlob.union(['**/*', '!.git/**', '!.zp-vars', '!package.json'], { dot: true, cwd: '/Users/johnchan/Documents/github/zp-test/test-app', nodir: true, realpath: true });
// log.i(testappfiles);

// intersect('^1.1 || ^2.2 || >=5', '^2.2.0-alpha1')
// log.i(intersect('^1.1 || ^2.2 || >=5', '^2.2.0-alpha1'));
// const r = new semver.Range('>=8');
// log.i(r, r.set, r.set[0], r.set[0][0].semver);
// log.i(intersect('>=12', '>=12.1'));
