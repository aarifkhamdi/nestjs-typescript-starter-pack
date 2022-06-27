import { config } from 'dotenv';
// import { connect, connection, disconnect } from 'mongoose';

config({ path: 'secrets/.env' });

// npm run migrate:create -- name                         создание миграции с именем `name`
// npm run migrate:up --dst=migration_name                апгрейд db, если указано migration_name - до нее включительно
// npm run migrate:down --dst=migration_name              даунгрейд db, если указано migration_name - до нее включительно

// eslint-disable-next-line import/no-unused-modules
export const up = async (): Promise<void> => {
  // await connect((process.env as any).MONGODB_URL);
  // const col = connection.collection('');
  // /*
  //     Code your update script here!
  //  */
  // await disconnect();
};

// eslint-disable-next-line import/no-unused-modules
export const down = async (): Promise<void> => {
  // await connect((process.env as any).MONGODB_URL);
  // const col = connection.collection('');
  // /*
  //     Code you downgrade script here!
  //  */
  // await disconnect();
};
