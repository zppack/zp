// test pick

const PICK_PREFIX = 'pick';
const PICK_SEPERATOR = '_';
const pickPrefixStr = `${PICK_PREFIX}${PICK_SEPERATOR}`;

const files = [
  'license.pick_license_mit',
  'license.pick_license_!mit',
  'style.pick_cssType_css.pick_stylesheet_css.css',
  'style.pick_stylesheet_less.less',
  'style.pick_stylesheet_<dot>+ss.scss',
  'style.pick_cssType_!css.pick_stylesheet_postcss.pcss',
];

const fileSources = files.map((file) => {
  const arr = file.split('.');
  const fileNameArr = [];
  const pickRuleArr = [];
  arr.forEach((part) => {
    if (part.startsWith(pickPrefixStr) && part.split(PICK_SEPERATOR).length > 2) {
      pickRuleArr.push(part.replace(pickPrefixStr, ''));
    } else {
      fileNameArr.push(part);
    }
  });
  const pickRules = pickRuleArr.map((ruleStr) => {
    const [pickKey, ...pickValArr] = ruleStr.split(PICK_SEPERATOR);
    return {
      pickKey,
      pickValue: pickValArr.join(PICK_SEPERATOR)
    };
  });
  return {
    origin: file,
    filename: fileNameArr.join('.'),
    pickRules,
  }
});

const options = {
  license: 'MIT',
  stylesheet: 'postcss',
  cssType: 'css'
};

// 设置每条pick规则支持的匹配模式，一个字符代表一个模式，可以叠加
// i ! ^ $ * u
// i: ignore case；在正则模式下将自动添加 i 修饰符
// !: 结果取反，对应识别值也必须以 ! 开头；若未以 ! 开头，则忽略取反规则；在正则模式下将忽略此规则
// ^: 匹配开头；在正则模式下将自动在正则表达式开头添加 ^
// $: 匹配结尾；在正则模式下将自动在正则表达式末尾添加 $
// *: 模糊匹配，将 "<dot>" 替换为 "."， 开启正则表达式模式，出现一次即可
// u: unicode 模式，必须开启正则模式后使用（*u），否则将忽略此规则
// 不支持 y s
const pickOpts = {
  license: 'i!', // i ignore case; ! 取反，对应识别值也必须以 ! 开头
  stylesheet: '*', // 模糊匹配，将识别为正则表达式
  cssType: '^$!', // 完全匹配；
};

const fileResults = fileSources.filter((fileObj) => {
  return fileObj.pickRules.every(({ pickKey, pickValue }) => {
    if (options[pickKey]) {
      const targetVal = options[pickKey];
      const dec = pickOpts[pickKey] ?? '=';
      if (dec === '=') {
        // 没有配置匹配修饰规则的，进行完全匹配
        return targetVal === pickValue;
      }
      const notTag = dec.includes('!');
      const regTag = dec.includes('*');
      const iTag = dec.includes('i');
      const startTag = dec.includes('^');
      const endTag = dec.includes('$');
      const uTag = dec.includes('u');
      if (!regTag) {
        // 非正则模式
        let leftTargetVal = targetVal;
        let leftPickVal = pickValue;
        if (iTag) {
          leftTargetVal = leftTargetVal.toLowerCase();
          leftPickVal = leftPickVal.toLowerCase();
        }
        let tempResult = false;
        let resultInvert = false;
        if (notTag && leftPickVal.startsWith('!')) {
          leftPickVal = pickValue.replace('!', '');
          resultInvert = true;
        }
        if (startTag && !endTag) {
          tempResult = leftTargetVal.startsWith(leftPickVal);
        } else if (!startTag && endTag) {
          tempResult = leftTargetVal.endsWith(leftPickVal);
        } else {
          tempResult = leftTargetVal === leftPickVal;
        }

        return resultInvert ? !tempResult : tempResult;
      } else {
        // 正则模式
        let ex = pickValue.replace(/<dot>/g, '.');
        if (startTag && !ex.startsWith('^')) {
          ex = '^' + ex;
        }
        if (endTag && !ex.endsWith('$')) {
          ex = ex + '$';
        }
        const regEx = new RegExp(ex, `${iTag ? 'i' : ''}${uTag ? 'u' : ''}`);
        return regEx.test(targetVal);
      }
    }
    // 没有获取到输入值的 pick 项，将直接剔除
    return false;
  });
});

console.log('---- results: ----');
console.log(fileResults);
