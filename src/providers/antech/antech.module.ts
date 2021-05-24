import { BullModule } from '@nestjs/bull'
import { HttpModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { Provider } from '../../common/interfaces/provider-integration'
import { AntechController } from './antech.controller'
import { AntechService } from './antech.service'

@Module({
  imports: [
    HttpModule,
    ConfigService,
    ClientsModule.registerAsync([
      {
        name: 'API_SERVICE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            ...configService.get('mqtt')
          }
        })
      }
    ]),
    BullModule.registerQueue({
      name: `${Provider.Antech}.results`
    })
  ],
  controllers: [AntechController],
  providers: [AntechService]
})
export class AntechModule {}
