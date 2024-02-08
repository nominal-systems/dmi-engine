import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { type AppConfig } from './config/configuration.interface'

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

  await app.startAllMicroservices()
  await app.listen(PORT)
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap()
