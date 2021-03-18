import { HttpModule, Module } from '@nestjs/common';
import { ZoetisController } from './providers/zoetis.controller';
import { ZoetisProviderService } from './services/zoetis/zoetis.service';

@Module({
  imports: [HttpModule],
  controllers: [ZoetisController],
  providers: [ZoetisProviderService],
})
export class IntegrationModule {}
