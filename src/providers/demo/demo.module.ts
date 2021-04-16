import { BullModule } from '@nestjs/bull'
import { HttpModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { DemoOrdersProcessor } from './demo-orders.processor'
import { DemoResultsProcessor } from './demo-results.processor'
import { DemoController } from './demo.controller'
import { DemoProviderService } from './demo.service'

@Module({
  imports: [
    ConfigService,
    HttpModule,
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
    BullModule.registerQueue(
      {
        name: 'results'
      },
      {
        name: 'orders'
      }
    )
  ],
  controllers: [
    DemoController
  ],
  providers: [
    DemoProviderService,
    DemoOrdersProcessor,
    DemoResultsProcessor
  ]
})
export class DemoModule {}
