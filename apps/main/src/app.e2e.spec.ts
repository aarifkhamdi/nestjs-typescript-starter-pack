import { INestApplication } from '@nestjs/common';
import { closeApp, getAgent, initApp } from 'test/util/init';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent: ReturnType<typeof getAgent>;

  beforeAll(async () => {
    app = await initApp();
    agent = getAgent(app);
  });

  afterAll(async () => {
    await closeApp(app);
  });

  test('/ (GET)', async () => {
    await agent.get('').expect(200).expect('Hello');
  });

  test('/error (GET)', async () => {
    const response = await agent.get('/error').expect(500);
    expect(response.body).toMatchObject({
      level: 'error',
      message: 'Test error',
      meta: {
        exceptionName: 'InternalServerErrorException',
        request: {
          body: {},
          headers: {
            'accept-encoding': 'gzip, deflate',
            connection: 'close',
            host: expect.any(String),
          },
          jwtPayload: null,
          method: 'GET',
          params: {},
          path: '/error',
        },
        stacktrace: expect.any(String),
        statusCode: 500,
      },
    });
  });

  test.skip('/asyncError (GET)', async () => {
    await agent.get('/asyncError').expect(200);
    // https://github.com/facebook/jest/issues/5620
  });
});
