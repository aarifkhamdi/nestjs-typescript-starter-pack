// eslint-disable-next-line @typescript-eslint/no-var-requires
const { config } = require('dotenv');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connect, connection, disconnect } = require('mongoose');

config({ path: 'secrets/.env' });

module.exports = MongoDbStore;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function MongoDbStore() {}

/**
 * Load the migration data and call `fn(err, obj)`.
 *
 * @param {Function} fn
 * @return {Type}
 * @api public
 */

MongoDbStore.prototype.load = async function (fn) {
  let data = null;
  try {
    await connect(process.env.MONGODB_URL);
    const col = connection.collection('db_migrations');
    data = await col.find().toArray();
    if (data.length !== 1) {
      console.log(
        'Cannot read migrations from database. If this is the first time you run migrations, then this is normal.',
      );
      return fn(null, {});
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await disconnect();
  }
  return fn(null, data[0]);
};

MongoDbStore.prototype.save = async function (set, fn) {
  let result = null;
  try {
    await connect(process.env.MONGODB_URL);
    const col = connection.collection('db_migrations');
    result = await col.updateMany(
      {},
      {
        $set: {
          lastRun: set.lastRun,
          migrations: set.migrations,
        },
      },
      { upsert: true },
    );
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await disconnect();
  }

  return fn(null, result);
};
