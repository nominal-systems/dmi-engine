import { Module } from '@nestjs/common';
import { ZoetisController } from './providers/zoetis.controller';
import { ZoetisProviderService } from './services/zoetis.service';

@Module({
  controllers: [ZoetisController],
  providers: [ZoetisProviderService],
})
export class IntegrationModule {}
