import { ApiEvent } from '../events/api-event';
import { MqttContext } from '@nestjs/microservices';

export enum Provider {
  Zoetis = 'zoetis-v1',
}

export enum Resource {
  Order = 'order',
}

export enum Operation {
  Create = 'create',
}

export interface ProviderIntegration {
  createOrder(msg: ApiEvent, context?: MqttContext): Promise<any>;
}
