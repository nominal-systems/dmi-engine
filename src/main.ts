import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  const MQTT_HOST = configService.get('MQTT_HOST');
  const MQTT_PORT = configService.get('MQTT_PORT');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${MQTT_HOST}:${MQTT_PORT}`,
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(PORT);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
