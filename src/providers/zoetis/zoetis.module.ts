import { BullModule } from '@nestjs/bull'
import { HttpModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Provider } from '../../common/interfaces/provider-integration'
import { XmlModule } from '../../xml/xml.module'
import { ZoetisOrdersProcessor } from './providers/zoetis-orders.processor'
import { ZoetisResultsProcessor } from './providers/zoetis-results.processor'
import { ZoetisController } from './providers/zoetis.controller'
import { ZoetisProviderService } from './zoetis.service'

@Module({
  imports: [
    ConfigService,
    BullModule.registerQueue(
      {
        name: `${Provider.Zoetis}.results`
      },
      {
        name: `${Provider.Zoetis}.orders`
      }
    ),
    HttpModule,
    XmlModule
  ],
  controllers: [ZoetisController],
  providers: [
    ZoetisProviderService,
    ZoetisResultsProcessor,
    ZoetisOrdersProcessor
  ]
})
export class ZoetisModule {}
