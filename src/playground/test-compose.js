import log from '@zppack/log';

const middlewares = [];

const use = (fn) => {
  middlewares.push(fn);
}

const compose = (middlewares) => {
  return (ctx, next) => {
    const dispatch = (i) => {
      let fn = middlewares[i];
      log.i('--- i = ', i);
      if (i === middlewares.length) {
        fn = next;
      }
      log.i('--- fn = ', fn);
      if (!fn) {
        return Promise.resolve('xxx');
      }
      const rNext = () => {
        log.i('--- next ');
        return dispatch(i + 1);
      }

      const r = fn(ctx, rNext);
      return Promise.resolve(r);
    };

    return dispatch(0);
  };
}

use(async (ctx, next) => {
  ctx.stack.push('1-1');
  console.log('1-1')
  const r = await next();
  log.i(r);
  ctx.stack.push('1-2');
  console.log('1-2')
  return 1;
});

use(async (ctx, next) => {
  ctx.stack.push('2-1');
  console.log('2-1')
  // return '2 exit';
  const r = await next();
  log.i(r);
  ctx.stack.push('2-2');
  console.log('2-2')
  return 2;
});

use(async (ctx, next) => {
  ctx.stack.push('3-1');
  console.log('3-1')
  // return '3 exit';
  const r = await next();
  log.i(r);
  ctx.stack.push('3-2');
  console.log('3-2')
  return 3;
});

const cfn = compose(middlewares);

log.i('cfn', cfn);

const ctx = { stack: [] };

const r = cfn(ctx, () => {
  console.log('finally');
  return 'yyy';
});
log.i('cfn r = ', r);
r.then((arg) => {
  log.i('cfn r then = ', arg);
  log.i(ctx.stack);
})
