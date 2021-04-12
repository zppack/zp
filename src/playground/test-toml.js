import Toml from '@ltd/j-toml';
import fse from 'fs-extra';
import path from 'path';

// const zpvarsToml = fse.readFileSync(path.resolve(__dirname, '../../.zp-vars.toml'), 'utf8');

// console.log(zpvarsToml);

// const json = Toml.parse(zpvarsToml, 1.0, '\n', false); // don't use bigint type for numbers
// console.log(json);
// const count = json.vars[2].count;
// console.log(count, typeof count, count + 1);

const zprcToml = fse.readFileSync(path.resolve(__dirname, '../../config/.zprc'), 'utf8');
const zprcJson = Toml.parse(zprcToml, 1.0, '\n', false);
console.log(zprcJson);
