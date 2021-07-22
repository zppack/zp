import { HookMap, SyncHook, AsyncSeriesHook } from 'tapable';

const hookList = ['beginning', 'middle', 'before-init', 'ending'];

console.log('-- begin');
const hookMap = new HookMap(key => new SyncHook(['ctx']));

console.log('-- to intercept');
hookList.forEach((hookName) => {
  hookMap.for(hookName).intercept({
    register: (tapInfo) => {
      console.log('[Intercept] Registering hook <', hookName, '> with: ', tapInfo.name);
    },
    tap: (tapInfo) => {
      console.log('[Intercept] Going to call hook: ', tapInfo.name);
    },
    call: (ctx) => {
      console.log('[Intercept] Before call hook: ', ctx);
    },
  });
});

console.log('-- to tap');
hookMap.for('beginning').tap('BeginningPlugin', (ctx) => {
  console.log('tap begining 1:', ctx);
});
hookMap.for('beginning').tap('BeginningPlugin2', (ctx) => {
  console.log('tap begining 2:', ctx);
});

hookMap.for('middle').tap('MiddlePlugin', (ctx) => {
  console.log('tap middle: ', ctx);
});

hookMap.for('ending').tap('EndPlugin', (ctx) => {
  console.log('tap ending: ', ctx);
});

hookList.forEach((hookName) => {
  const hook = hookMap.get(hookName);
  console.log(hookName, ' taps = ', hook.taps.length, hook.taps);
  if (hook !== undefined && hook.taps.length > 0) {
    console.log('-- to call: ', hookName);
    hook.call({ a: 1, v: 2, k: hookName, l: hook.taps.length }, console.log);
  }
});

console.log('-- end');
const fn1 = async () => {};
const fn2 = function* () {};
console.log('fn1: ', fn1[Symbol.toStringTag], fn1().then);
console.log('fn2: ', fn2[Symbol.toStringTag], fn2().next());

const asyncHook = new AsyncSeriesHook(['ctx']);
asyncHook.tapAsync('TestAsyncHookPlugin', (ctx, cb) => {
  console.log('tap async hook 1. ', ctx, cb);
  cb();
});
asyncHook.tap('TestAsyncHookTapPlugin', (ctx, cb) => {
  console.log('tap async hook in sync way. ', ctx, cb);
});
asyncHook.tapAsync('TestAsyncHookPlugin2', (ctx, cb) => {
  console.log('tap async hook 2. ', ctx, cb);
  cb();
});
asyncHook.callAsync({ g: 1, h: 2 }, () => {
  console.log('call async ');
});
asyncHook.callAsync({ t: 1, y: 2 }, () => {
  console.log('call async 2');
});
