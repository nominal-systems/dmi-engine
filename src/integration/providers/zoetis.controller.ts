import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Operation,
  Provider,
  ProviderIntegration,
  Resource,
} from '../interfaces/provider-integration';
import { ApiEvent } from '../events/api-event';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ZoetisProviderService } from '../services/zoetis/zoetis.service';
import {
  Breed,
  Gender,
  Order,
  Result,
  Service,
  Species,
} from '../services/interfaces/provider-service';
import { Zoetis } from '../services/interfaces/zoetis';

@Controller(`integration/${Provider.Zoetis}`)
export class ZoetisController implements ProviderIntegration {
  constructor(private readonly providerService: ZoetisProviderService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Create}`)
  createOrder(@Payload() msg: ApiEvent): Promise<Order> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending createOrder() request to '${Provider.Zoetis}'`);
    return this.providerService.createOrder(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Cancel}`)
  cancelOrder(@Payload() msg: ApiEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(
    `${Provider.Zoetis}.${Resource.Orders}.${Operation.TestsCancel}`,
  )
  cancelOrderTest(@Payload() msg: ApiEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  // TODO(gb): add @MessagePattern
  getBatchOrders(@Payload() msg: ApiEvent): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  // TODO(gb): add @MessagePattern
  getBatchResults(@Payload() msg: ApiEvent): Promise<Result[]> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Breeds}.${Operation.List}`)
  getBreeds(@Payload() msg: ApiEvent): Promise<Breed[]> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Genders}.${Operation.List}`)
  getGenders(@Payload() msg: ApiEvent): Promise<Gender[]> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Get}`)
  getOrder(@Payload() msg: ApiEvent): Promise<Order> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Results}`)
  getOrderResult(@Payload() msg: ApiEvent): Promise<Result> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Services}.${Operation.List}`)
  getServices(@Payload() msg: ApiEvent): Promise<Service[]> {
    throw new Error('Method not implemented.');
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Species}.${Operation.List}`)
  getSpecies(@Payload() msg: ApiEvent): Promise<Species[]> {
    throw new Error('Method not implemented.');
  }
}
