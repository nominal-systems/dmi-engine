import { BullModule } from '@nestjs/bull'
import { HttpModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { Provider } from '../../common/interfaces/provider-integration'
import { IdexxResultsProcessor } from './idexx-results.processor'
import { IdexxController } from './idexx.controller'
import { IdexxService } from './idexx.service'

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
      name: `${Provider.Idexx}.results`
    })
  ],
  controllers: [IdexxController],
  providers: [IdexxService, IdexxResultsProcessor]
})
export class IdexxModule {}
