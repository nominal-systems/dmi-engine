import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { IntegrationService } from './integration.service';
import { ApiEvent } from './events/api-event';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async apiCommand(@Body() event: ApiEvent) {
    console.log('handleSyncEvent()');
    return this.integrationService.handleSync(event);
  }

  // TODO(gb): use ExceptionFilter
  @UsePipes(new ValidationPipe({ transform: true }))
  @EventPattern('events')
  async apiEvent(@Payload() msg: ApiEvent, @Ctx() context: MqttContext) {
    console.log('handleAsyncEvent()');
    await this.integrationService.handleAsync(msg);
  }
}
