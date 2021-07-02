import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from './config/configuration.interface'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<AppConfig>>(ConfigService)
  const PORT = configService.get<number>('port', 3000)

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.MQTT,
      options: {
        ...configService.get('mqtt')
      }
    },
    { inheritAppConfig: true }
  )

  await app.startAllMicroservicesAsync()
  await app.listen(PORT)
  Logger.log(`Application is running on: ${await app.getUrl()}`)
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap()
