import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import { getAsyncStorage } from 'src/utils/asyncStorage';

export const logger = createLogger();

const consoleTransport = new transports.Console({
  format: format.combine(
    format.printf(
      info =>
        `${
          info.timestamp ?? new Date().toISOString()
        } [${info.level.toUpperCase()}]  ${JSON.stringify(info, null, 4)}`,
    ),
    format.errors({ stack: true }),
    format.colorize({ all: true }),
  ),
});

logger.add(consoleTransport);

export const getLogger = (): Logger => getAsyncStorage()?.logger ?? logger;

export class MyLogger implements LoggerService {
  debug(message: any, ...optionalParams: any[]): any {
    logger.debug(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): any {
    logger.error(message, optionalParams);
  }

  log(message: any, ...optionalParams: any[]): any {
    logger.log('info', message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    logger.verbose(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    logger.warn(message, optionalParams);
  }
}
