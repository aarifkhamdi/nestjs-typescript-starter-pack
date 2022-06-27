// eslint-disable-next-line @typescript-eslint/no-var-requires
const { program } = require('commander');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const migrate = require('migrate');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const log = require('migrate/lib/log');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const runMigrations = require('migrate/lib/migrate');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoDbStore = require('./mongoStorage');

program
  .usage('[options] <name>')
  .option('-d, --direction <string>', 'Direction of migrate', 'up')
  .option('--clean', 'Tears down the migration state before running up')
  .option('-F, --force', 'Force through the command, ignoring warnings')
  .parse(process.argv);

const options = program.opts();

(function () {
  migrate.load(
    {
      stateStore: new MongoDbStore(),
      migrationsDirectory: 'dist/migrations',
      filterFunction: filename => /\.js+$/.test(filename),
      ignoreMissing: program.force,
    },
    function (err, set) {
      if (err) {
        log.error('error', err);
        process.exit(1);
      }

      set.on('warning', function (msg) {
        log('warning', msg);
      });

      set.on('migration', function (migration, direction) {
        log(direction, migration.title);
      });
      if (options.direction === 'up') {
        (options.clean ? cleanUp : up)(set, function (err) {
          if (err) {
            log.error('error', err);
            process.exit(1);
          }
          log('migration', 'complete');
          process.exit(0);
        });
      } else if (options.direction === 'down') {
        runMigrations(set, 'down', program.args[0], function (err) {
          if (err) {
            log.error('error', err);
            process.exit(1);
          }

          log('migration', 'complete');
          process.exit(0);
        });
      }
    },
  );
})();

function cleanUp(set, fn) {
  runMigrations(set, 'down', null, function (err) {
    if (err) {
      return fn(err);
    }
    up(set, fn);
  });
}

function up(set, fn) {
  runMigrations(set, 'up', program.args[0], function (err) {
    if (err) {
      return fn(err);
    }
    fn();
  });
}
