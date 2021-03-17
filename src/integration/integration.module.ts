import { Module } from '@nestjs/common';
import { ZoetisController } from './providers/zoetis.controller';
import { ProviderService } from './provider.service';

@Module({
  controllers: [ZoetisController],
  providers: [ProviderService],
})
export class IntegrationModule {}
