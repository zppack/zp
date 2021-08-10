import program from 'commander';

console.log('执行了');
program
  .arguments('[test]')
  .action((test, options, command) => {
    // log.d('options: ', options, command.opts());
    console.log(test, options);
  });

program.parse(process.argv);

const opts = program.opts();

console.log('opts:');
console.log(opts);
