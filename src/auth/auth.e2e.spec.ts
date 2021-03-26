import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Connection } from 'typeorm';

describe('Auth', () => {
  let app: INestApplication;
  let agent;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('SOCIAL LOGIN/SIGNUP', () => {
    const naverId = '12428472';
    it('create new User and return it when not existing', async () => {
      const { body } = await request(agent)
        .post('/auth/naver')
        .send({ id: naverId })
        .expect(HttpStatus.OK);
      expect(body.naverId).toBe(naverId);
    });
    it('return User object when exinting', async () => {
      const { body } = await request(agent)
        .post('/auth/naver')
        .send({ id: naverId })
        .expect(HttpStatus.OK);
      expect(body.naverId).toBe(naverId);
    });
  });
});