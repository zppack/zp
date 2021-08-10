import { execSync } from 'child_process';

export default (sh, options, errCode, errMsg) => {
  if (typeof options === 'number') {
    errMsg = errCode;
    errCode = options;
    options = {};
  }
  try {
    const result = execSync(sh, options);
    return result.toString();
  } catch(ex) {
    process.exitCode = errCode;
    throw Error(errMsg);
  }
};
