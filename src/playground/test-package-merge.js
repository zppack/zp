import path from  'path';
import fse from 'fs-extra';
import merge from 'merge-packages';

const filepath1 = path.resolve('../../zp-test/test-pkg/package.piece.1.json');
const filepath2 = path.resolve('../../zp-test/test-pkg/package.piece.2.json');

const pkg1 = fse.readFileSync(filepath1, 'utf8');
const pkg2 = fse.readFileSync(filepath2, 'utf8');

const pkgm = merge(pkg1, pkg2);
fse.writeFileSync(path.resolve('../../zp-test/test-pkg/package.merge.json'), pkgm);
