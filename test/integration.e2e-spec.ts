import * as request from 'supertest';
import { IntegrationModule } from '../src/integration/integration.module';
import { IntegrationService } from '../src/integration/integration.service';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

describe('Integration', () => {
  let app: INestApplication;
  let integrationService = {
    handleAsync: () => ['handleAsync'],
    handleSync: () => ['handleSync'],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IntegrationModule],
    })
      .overrideProvider(IntegrationService)
      .useValue(integrationService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('HTTP Endpoint', () => {
    it('should return 201 for a valid payload', (done) => {
      request(app.getHttpServer())
        .post('/integration')
        .send({
          id: 'uuid',
          version: '1.0.0',
          type: 'some.type',
          data: {},
        })
        .set('Content-Type', 'application/json')
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });

      request(app.getHttpServer())
        .post('/integration')
        .send({
          id: 'uuid',
          version: '1.0.0',
          type: 'some.type',
          data: {
            providerConfiguration: {},
            integrationOptions: {},
            payload: {},
          },
        })
        .set('Content-Type', 'application/json')
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it('should return 400 for missing fields', (done) => {
      // missing id
      request(app.getHttpServer())
        .post('/integration')
        .send({
          version: '1.0.0',
          type: 'some.type',
          data: {},
        })
        .set('Content-Type', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });

      // missing version
      request(app.getHttpServer())
        .post('/integration')
        .send({
          id: 'uuid',
          type: 'some.type',
          data: {},
        })
        .set('Content-Type', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });

      // missing type
      request(app.getHttpServer())
        .post('/integration')
        .send({
          id: 'uuid',
          version: '1.0.0',
          data: {},
        })
        .set('Content-Type', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });

      // missing data
      request(app.getHttpServer())
        .post('/integration')
        .send({
          id: 'uuid',
          version: '1.0.0',
          type: 'some.type',
        })
        .set('Content-Type', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });
  });
});
