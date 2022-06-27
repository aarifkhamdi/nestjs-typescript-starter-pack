import { Injectable, NestMiddleware } from '@nestjs/common';
import { logger } from 'src/utils/logger';

@Injectable()
export class SetRequestLoggerMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: any): void {
    req.log = logger;
    next();
  }
}
