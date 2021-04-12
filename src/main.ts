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
    protocol: MQTT_PROTOCOL,
    host: MQTT_HOST,
    port: MQTT_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
  } = configService.get<MQTTConfig>('mqtt', { protocol: '', host: '', port: 0, username: '', password: '' })

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `${MQTT_PROTOCOL}://${MQTT_HOST}:${MQTT_PORT}`,
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD
    }
  })

  await app.startAllMicroservicesAsync()
  await app.listen(PORT)
  Logger.log(`Application is running on: ${await app.getUrl()}`)
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap()
