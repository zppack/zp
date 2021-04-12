import { execSync } from 'child_process';

export default (sh, options, errCode, errMsg) => {
  if (typeof options === 'number') {
    errMsg = errCode;
    errCode = options;
    options = {};
  }
  try {
    execSync(sh, options);
  } catch(ex) {
    process.exitCode = errCode;
    throw Error(errMsg);
  }
};
