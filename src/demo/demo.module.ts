import { BullModule } from '@nestjs/bull'
import { HttpModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DemoController } from './demo.controller'
import { DemoProviderService } from './demo.service'

@Module({
  imports: [
    ConfigService,
    HttpModule,
    BullModule.registerQueue(
      {
        name: 'results'
      },
      {
        name: 'orders'
      }
    ),
  ],
  controllers: [
    DemoController
  ],
  providers: [
    DemoProviderService
  ]
})
export class DemoModule {}
