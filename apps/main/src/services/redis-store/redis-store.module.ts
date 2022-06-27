import { Module, OnModuleDestroy } from '@nestjs/common';
import { RedisStoreService } from 'src/services/redis-store/redis-store.service';
import { Config } from 'src/utils/config';

@Module({
  providers: [
    {
      inject: [Config],
      provide: RedisStoreService,
      useFactory: (config: Config): RedisStoreService =>
        new RedisStoreService({
          host: config.REDIS_HOST,
          port: config.REDIS_PORT,
        }),
    },
  ],
  exports: [RedisStoreService],
})
export class RedisStoreModule implements OnModuleDestroy {
  constructor(private readonly redisStoreService: RedisStoreService) {}

  onModuleDestroy(): void {
    this.redisStoreService.disconnect();
  }
}
