import updateNotifier from 'update-notifier';
import pkg from '../../package.json';

console.log(pkg.name, pkg.version);

const notifier = updateNotifier({
  pkg: {
    ...pkg,
    // version: '0.0.10',
  },
  updateCheckInterval: 10000,
});

const colorMap =  {
  default: 'white',
  patch: 'gray',
  minor: 'cyan',
  major: 'red',
};

notifier.notify({
  isGlobal: true,
  boxenOptions: {
    align: 'center',
    margin: 1,
    padding: { left: 3, right: 3, top: 0, bottom: 0 },
    borderColor: colorMap[notifier.update?.type ?? 'default'],
    borderStyle: 'double',
  },
});
