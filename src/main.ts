import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { type EngineRole, roleServesMqtt } from '@nominal-systems/dmi-engine-common'
import { type AppConfig } from './config/configuration.interface'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<AppConfig>>(ConfigService)
  const PORT = configService.get<number>('port', 3000)
  const role = configService.get<EngineRole>('role', 'all')

  // Worker pods only process queue jobs: they never attach MQTT message
  // handlers, so request/reply traffic is served exclusively by api pods.
  if (roleServesMqtt(role)) {
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
  }

  new Logger('Bootstrap').log(`Engine starting with role '${role}'`)
  await app.listen(PORT)
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap()
