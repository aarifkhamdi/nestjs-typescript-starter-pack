import path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';

// eslint-disable-next-line import/no-unused-modules
export default async (): Promise<void> => {
  const composeFilePath = path.resolve(__dirname, '..', '..', 'docker');
  const compose: StartedDockerComposeEnvironment =
    await new DockerComposeEnvironment(composeFilePath, [
      'docker-compose.yml',
      'docker-compose.test.yml',
    ]).up();
  process.on('SIGTERM', async () => {
    await compose.down();
  });
};
