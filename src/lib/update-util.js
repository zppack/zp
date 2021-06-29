import updateNotifier from 'update-notifier';
import pkg from '../../package.json';

const notifier = updateNotifier({ pkg });

const colorMap = {
  default: 'white',
  patch: 'gray',
  minor: 'cyan',
  major: 'red',
};

notifier.notify({
  isGlobal: true,
  defer: true,
  boxenOptions: {
    align: 'center',
    margin: 1,
    padding: { left: 3, right: 3, top: 0, bottom: 0 },
    borderColor: colorMap[notifier.update?.type ?? 'default'],
    borderStyle: 'double',
  },
});
