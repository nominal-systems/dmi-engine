import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from './config/configuration.interface'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

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
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap()
