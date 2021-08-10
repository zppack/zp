import log from '@zppack/log';

export default async (...rest) => {
  log.i('==========================');
  const params = rest.slice(0, rest.length - 1); // remove last commander
  console.log(params);
  log.i(...params);
};

