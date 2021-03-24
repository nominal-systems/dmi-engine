import { HttpModule, Module } from '@nestjs/common'
import { XmlService } from '../xml/xml.service'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigService,
    BullModule.registerQueue(
      {
        name: 'results'
      },
      {
        name: 'orders'
      }
    ),
    HttpModule
  ],
  controllers: [],
  providers: [
    XmlService
  ]
})
export class IntegrationModule {}
