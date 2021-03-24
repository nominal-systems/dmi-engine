import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppConfig, MQTTConfig } from './config/configuration.interface'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<AppConfig>>(ConfigService)
  const PORT = configService.get<number>('port', 3000)
  const {
    host: MQTT_HOST,
    port: MQTT_PORT
  } = configService.get<MQTTConfig>('mqtt', { host: '', port: 0 })

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${MQTT_HOST}:${MQTT_PORT}`
    }
  })

  await app.startAllMicroservicesAsync()
  await app.listen(PORT)
  Logger.log(`Application is running on: ${await app.getUrl()}`)
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap()
