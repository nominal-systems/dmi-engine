import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Operation,
  Provider,
  ProviderIntegration,
  Resource,
} from './interfaces/provider-integration.interface';
import { ApiEvent } from './events/api-event';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { IntegrationService } from './integration.service';

@Controller(`integration/${Provider.Zoetis}`)
export class ZoetisController implements ProviderIntegration {
  constructor(private readonly integrationService: IntegrationService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Order}.${Operation.Create}`)
  createOrder(@Payload() msg: ApiEvent, @Ctx() context: MqttContext): Promise<any> {
    console.log(msg); // TODO(gb): Remove trace!!!
    return this.integrationService.handleAsync(msg);
  }
}
