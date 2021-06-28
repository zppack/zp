import Toml from '@ltd/j-toml';
import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

// const zpvarsToml = fse.readFileSync(path.resolve(__dirname, '../../.zp-vars.toml'), 'utf8');

// console.log(zpvarsToml);

// const json = Toml.parse(zpvarsToml, 1.0, '\n', false); // don't use bigint type for numbers
// console.log(json);
// const count = json.vars[2].count;
// console.log(count, typeof count, count + 1);

const zprcToml = fse.readFileSync(path.resolve(__dirname, '../../config/.zprc'), 'utf8');
const zprcJson = Toml.parse(zprcToml, 1.0, '\n', false);
console.log(JSON.stringify(zprcJson));

const data = { projectName: 'test-project', 'zp-newline': '\n', 'zp-tab': '\t', 'zp-space': ' ' };
const { list } = zprcJson.init.plugins[0].config;
const templateRegEx = new RegExp('{\\s*(.*?)\\s*}', 'g');
const strs = list.map((item, idx) => {
  const { text, chalk: chalkArr = [], texts } = item;
  let line = '';
  if (text) {
    const chalkFn = chalkArr.reduce((c, r) => c[r], chalk);
    line = chalkFn(text.replace(templateRegEx, (_, $1) => data[$1]));
    console.log(`Line ${idx}: `, line);
    return line;
  }
  if (texts) {
    line = texts.map(({ text: text2 = '', chalk: chalkArr2 = [] }) => {
      const chalkFn = chalkArr2.reduce((c, r) => c[r], chalk);
      return chalkFn(text2.replace(templateRegEx, (_, $1) => data[$1] ?? ''));
    }).join('');
    console.log(`Line ${idx}: `, line);
    return line;
  }
});

strs.forEach(s => console.log(s));
