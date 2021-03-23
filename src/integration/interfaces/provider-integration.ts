import { ApiEvent } from '../events/api-event';
import { MqttContext } from '@nestjs/microservices';
import { Breed, Gender, Order, Result, Service, Species } from '../services/interfaces/provider-service';

export enum Provider {
  Zoetis = 'zoetis-v1'
}

export enum Resource {
  Orders = 'orders',
  Breeds = 'breeds',
  Genders = 'genders',
  Services = 'services',
  Species = 'species'
}

export enum Operation {
  Get = 'get',
  Create = 'create',
  Cancel = 'cancel',
  TestsCancel = 'tests.cancel',
  Results = 'results',
  ResultsBatch = 'results.batch',
  List = 'list',
  Batch = 'batch'
}

export interface ProviderIntegration {
  createOrder(msg: ApiEvent, context?: MqttContext): Promise<Order>;

  getBatchOrders(msg: ApiEvent, context?: MqttContext): Promise<Order[]>;

  getBatchResults(msg: ApiEvent, context?: MqttContext): Promise<Result[]>;

  getOrder(msg: ApiEvent, context?: MqttContext): Promise<Order>;

  getOrderResult(msg: ApiEvent, context?: MqttContext): Promise<Result>;

  cancelOrder(msg: ApiEvent, context?: MqttContext): Promise<void>;

  cancelOrderTest(msg: ApiEvent, context?: MqttContext): Promise<void>;

  getServices(msg: ApiEvent, context?: MqttContext): Promise<Service[]>;

  getGenders(msg: ApiEvent, context?: MqttContext): Promise<Gender[]>;

  getSpecies(msg: ApiEvent, context?: MqttContext): Promise<Species[]>;

  getBreeds(msg: ApiEvent, context?: MqttContext): Promise<Breed[]>;

  fetchResults(jobData: any);

  fetchOrders(jobData: any);
}
