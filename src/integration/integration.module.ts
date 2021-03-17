import { Module } from '@nestjs/common';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { ZoetisController } from './zoetis.controller';

@Module({
  controllers: [IntegrationController, ZoetisController],
  providers: [IntegrationService],
})
export class IntegrationModule {}
