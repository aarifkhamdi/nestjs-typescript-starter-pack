import { Allow, IsIn } from 'class-validator';

export class Config {
  @Allow() @IsIn(['local', 'dev', 'prod']) readonly ENV!:
    | 'local'
    | 'dev'
    | 'prod';

  @Allow() readonly SWAGGER_USER!: string;
  @Allow() readonly SWAGGER_PASSWORD!: string;

  @Allow() readonly MONGODB_URL!: string;
}
