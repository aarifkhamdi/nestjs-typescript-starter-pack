import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import helmet from 'helmet';
import { dotenvLoader, TypedConfigModule } from 'nest-typed-config';
import { AppController } from './app.controller';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { AsyncStorageMiddleware } from './infrastructure/middlwares/async-storage.middleware';
import { SetRequestLoggerMiddleware } from './infrastructure/middlwares/set-request-logger.middleware';
import { Config } from './utils/config';

export const ConfigModule = TypedConfigModule.forRoot({
  isGlobal: true,
  schema: Config,
  load: dotenvLoader({ envFilePath: './secrets/.env' }),
  normalize(config) {
    config.IS_MIGRATION = config.IS_MIGRATION === 'true';
    config.USE_SLACK_FOR_OTP = config.USE_SLACK_FOR_OTP === 'true';
    config.GOOGLE_AD_ENABLED = config.GOOGLE_AD_ENABLED === 'true';
    config.PUSH_NOTIFICATION_SEND_ENABLED =
      config.PUSH_NOTIFICATION_SEND_ENABLED === 'true';
    config.REDIS_PORT = parseInt(config.REDIS_PORT);
    return config;
  },
});

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: (config: Config) => ({
        uri: config.MONGODB_URL,
      }),
      inject: [Config],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: (): ValidationPipe =>
        new ValidationPipe({
          transform: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly config: Config) {}

  configure(consumer: MiddlewareConsumer): void {
    if (['prod', 'dev'].includes(this.config.ENV)) {
      consumer
        .apply(
          helmet({
            contentSecurityPolicy: {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
              },
            },
          }),
        )
        .forRoutes('*');
    }
    consumer
      .apply(AsyncStorageMiddleware)
      .forRoutes('*')
      .apply(SetRequestLoggerMiddleware)
      .forRoutes('*');
  }
}
