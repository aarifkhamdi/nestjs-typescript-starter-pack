import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { appSetup } from 'src/app';
import { AppModule } from 'src/app.module';

export async function initApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  appSetup(app);
  return await app.init();
}

export async function closeApp(app: INestApplication): Promise<void> {
  await app.close();
}

export function getAgent(app: INestApplication): ReturnType<typeof supertest> {
  return supertest(app.getHttpServer());
}
