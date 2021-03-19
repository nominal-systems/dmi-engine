import { HttpModule, Module } from '@nestjs/common';
import { ZoetisController } from './providers/zoetis.controller';
import { XmlService } from './services/xml-service';
import { ZoetisProviderService } from './services/zoetis/zoetis.service';

@Module({
  imports: [HttpModule],
  controllers: [ZoetisController],
  providers: [XmlService, ZoetisProviderService]
})
export class IntegrationModule {}
