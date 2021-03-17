import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Operation,
  Provider,
  ProviderIntegration,
  Resource,
} from '../interfaces/provider-integration';
import { ApiEvent } from '../events/api-event';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { ProviderService } from '../provider.service';

@Controller(`integration/${Provider.Zoetis}`)
export class ZoetisController implements ProviderIntegration {
  constructor(private readonly providerService: ProviderService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Order}.${Operation.Create}`)
  createOrder(@Payload() msg: ApiEvent, @Ctx() context: MqttContext): Promise<any> {
    // TODO(gb): implement ProviderService call
    return undefined;
  }
}
