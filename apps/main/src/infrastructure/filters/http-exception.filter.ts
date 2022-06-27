import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { KnownException } from 'src/infrastructure/exceptions';
import { RequestMetadata } from 'src/infrastructure/metadata/request.metadata';
import { getLogger } from 'src/utils/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const statusCode = this.statusCode(exception);
    const responseBody = this.buildResponseBody(statusCode, ctx, exception);
    if (!(exception instanceof KnownException)) {
      getLogger().log(this.buildLogEntry(statusCode, ctx, exception));
    }
    ctx.getResponse().status(statusCode).json(responseBody);
  }

  private statusCode(exception: Error): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : exception instanceof KnownException
      ? exception.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private buildResponseBody(
    statusCode: number,
    ctx: HttpArgumentsHost,
    exception: Error,
  ) {
    if (process.env.ENV === 'prod') {
      return {
        statusCode,
        message: exception?.message ?? 'Internal Server Error',
      };
    } else {
      return this.buildLogEntry(statusCode, ctx, exception);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private buildLogEntry(
    statusCode: number,
    ctx: HttpArgumentsHost,
    exception: Error,
  ) {
    const request = ctx.getRequest();
    return {
      level: 'error',
      message: exception?.message,
      meta: {
        statusCode,
        exceptionName: exception?.name,
        stacktrace: exception?.stack,
        request: new RequestMetadata(request),
      },
    };
  }
}
