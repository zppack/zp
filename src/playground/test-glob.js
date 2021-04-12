import zpGlob from '@zppack/glob';

const files = zpGlob.union(['**/*', '!*.toml', '!node_modules/**', '!dist/**', '!.git/**'], { dot: true });

console.log(files.length, '\n', files);

const files2 = zpGlob.difference(['**/*', '*.toml', 'node_modules/**', 'dist/**', '.git/**'], { dot: true });

console.log(files2.length, '\n', files2);

const files3 = zpGlob.intersection(['**/*', '*.toml'], { dot: true });

console.log(files3.length, '\n', files3);

