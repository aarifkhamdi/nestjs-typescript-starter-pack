import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Get('error')
  getError(): string {
    throw new InternalServerErrorException('Test error');
  }

  @Get('asyncError')
  getAsyncError(): void {
    // eslint-disable-next-line require-await
    void (async (): Promise<never> => {
      throw new InternalServerErrorException('Test error');
    })();
  }
}
