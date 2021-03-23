import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiEvent } from '../events/api-event';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ZoetisProviderService } from '../services/zoetis/zoetis.service';
import {
  Breed,
  Gender,
  Order,
  Result,
  Service,
  Species
} from '../services/interfaces/provider-service';
import { Zoetis } from '../services/interfaces/zoetis';
import {
  Operation,
  Provider,
  ProviderIntegration,
  Resource
} from '../interfaces/provider-integration';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';

@Controller(`integration/${Provider.Zoetis}`)
export class ZoetisController implements ProviderIntegration {
  constructor(
    private configService: ConfigService,
    private readonly providerService: ZoetisProviderService,
    @InjectQueue('results') private readonly resultsQueue: Queue,
    @InjectQueue('orders') private readonly ordersQueue: Queue
  ) {}

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
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending cancelOrder() request to '${Provider.Zoetis}'`);
    return this.providerService.cancelOrder(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(
    `${Provider.Zoetis}.${Resource.Orders}.${Operation.TestsCancel}`
  )
  cancelOrderTest(@Payload() msg: ApiEvent): Promise<void> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending cancelOrderTest() request to '${Provider.Zoetis}'`);
    return this.providerService.cancelOrderTest(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Batch}`)
  getBatchOrders(@Payload() msg: ApiEvent): Promise<Order[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getBatchOrders() request to '${Provider.Zoetis}'`);
    return this.providerService.getBatchOrders(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(
    `${Provider.Zoetis}.${Resource.Orders}.${Operation.ResultsBatch}`
  )
  getBatchResults(@Payload() msg: ApiEvent): Promise<Result[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getBatchResults() request to '${Provider.Zoetis}'`);
    return this.providerService.getBatchResults(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Breeds}.${Operation.List}`)
  getBreeds(@Payload() msg: ApiEvent): Promise<Breed[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getBreeds() request to '${Provider.Zoetis}'`);
    return this.providerService.getBreeds(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Genders}.${Operation.List}`)
  getGenders(@Payload() msg: ApiEvent): Promise<Gender[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getGenders() request to '${Provider.Zoetis}'`);
    return this.providerService.getGenders(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Get}`)
  getOrder(@Payload() msg: ApiEvent): Promise<Order> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getOrder() request to '${Provider.Zoetis}'`);
    return this.providerService.getOrder(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Results}`)
  getOrderResult(@Payload() msg: ApiEvent): Promise<Result> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getOrderResult() request to '${Provider.Zoetis}'`);
    return this.providerService.getOrderResult(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Services}.${Operation.List}`)
  getServices(@Payload() msg: ApiEvent): Promise<Service[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getServices() request to '${Provider.Zoetis}'`);
    return this.providerService.getServices(payload, metadata);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Species}.${Operation.List}`)
  getSpecies(@Payload() msg: ApiEvent): Promise<Species[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data;
    const metadata: Zoetis = { providerConfiguration, integrationOptions };
    Logger.log(`Sending getSpecies() request to '${Provider.Zoetis}'`);
    return this.providerService.getSpecies(payload, metadata);
  }

  @Post('results')
  async fetchResults(@Body() jobData: any) {
    await this.resultsQueue.add(
      Provider.Zoetis,
      jobData,
      this.configService.get('jobs.results')
    );
  }

  @Post('orders')
  async fetchOrders(@Body() jobData: any) {
    await this.ordersQueue.add(
      Provider.Zoetis,
      jobData,
      this.configService.get('jobs.orders')
    );
  }
}
