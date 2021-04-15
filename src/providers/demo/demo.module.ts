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
    ClientsModule.register([
      {
        name: 'API_SERVICE',
        transport: Transport.MQTT
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
