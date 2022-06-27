import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request } from 'express';
import { asyncStorage } from 'src/utils/asyncStorage';

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  use(req: Request, _res: any, next: any): void {
    // req.log устанавливается в middleware до вызова этой middleware
    asyncStorage.run({ logger: (req as any).log, request: req }, next);
  }
}
