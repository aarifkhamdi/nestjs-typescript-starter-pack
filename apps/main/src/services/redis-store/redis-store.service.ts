import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';

@Injectable()
export class RedisStoreService extends IORedis {
  public readonly defaultTimeout = 3600; // 1 hour
}
