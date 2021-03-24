import { HttpModule, Module } from '@nestjs/common';
import { ZoetisController } from './providers/zoetis.controller';
import { XmlService } from './services/xml-service';
import { ZoetisProviderService } from './services/zoetis/zoetis.service';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ZoetisResultsProcessor } from './providers/zoetis-results.processor';
import { ZoetisOrdersProcessor } from './providers/zoetis-orders.processor';

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
  controllers: [ZoetisController],
  providers: [
    XmlService,
    ZoetisProviderService,
    ZoetisResultsProcessor,
    ZoetisOrdersProcessor
  ]
})
export class IntegrationModule {}
