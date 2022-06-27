import { HttpStatus, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import basicAuth from 'express-basic-auth';
import { selectConfig } from 'nest-typed-config/index';
import { getAsyncStorage } from 'src/utils/asyncStorage';
import { Config } from 'src/utils/config';
import { getLogger, MyLogger } from 'src/utils/logger';
import { AppModule, ConfigModule } from './app.module';
import { KnownException } from './infrastructure/exceptions';
import { RequestMetadata } from './infrastructure/metadata/request.metadata';

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new MyLogger(),
  });

  appSetup(app);

  await app.listen(3000, '0.0.0.0');
}

export function appSetup(app: INestApplication): void {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableVersioning();

  setupSwaggerAndAdmin(app);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  process.on('unhandledRejection', (reason: unknown) => {
    const storage = getAsyncStorage();
    reason =
      reason instanceof Error
        ? { name: reason?.name, message: reason?.message, stack: reason?.stack }
        : reason;
    getLogger().error({
      message: 'Unhandled rejection',
      reason,
      ...(storage !== undefined &&
        storage?.request && { request: new RequestMetadata(storage.request) }),
    });
  });
}

function setupSwaggerAndAdmin(app: INestApplication): void {
  const config = selectConfig(ConfigModule, Config);

  const username = config.SWAGGER_USER;
  const password = config.SWAGGER_PASSWORD;

  if (!(username && password)) {
    throw new KnownException(
      'No value for Swagger/Admin login/password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  app.use(
    ['/doc', '/doc-json', '/admin'],
    basicAuth({
      challenge: true,
      users: { [username]: password },
    }),
  );

  const docConfig = new DocumentBuilder()
    .setTitle('Server')
    .setDescription('API')
    .setVersion(process.env.npm_package_version ?? '0.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('doc', app, document);
}
