import { MqttContext } from '@nestjs/microservices'
import { ApiEvent } from '../events/api-event'
import { NewIntegrationPayload } from './payloads'
import {
  Breed,
  Gender,
  IMetadata,
  IPayload,
  Order,
  Result,
  Service,
  Species
} from './provider-service'

export enum Provider {
  Demo = 'demo',
  Zoetis = 'zoetis-v1',
  Idexx = 'idexx'
}

export enum Resource {
  Orders = 'orders',
  Breeds = 'breeds',
  Genders = 'genders',
  Services = 'services',
  Species = 'species',
  Integration = 'integration'
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

export interface INewIntegrationJobMetadata<T extends IMetadata> {
  id: string
  type: string
  version: string
  data: IPayload<NewIntegrationPayload> & T
}

export interface ProviderIntegration {
  createOrder: (msg: ApiEvent, context?: MqttContext) => Promise<Order>
  getBatchOrders: (msg: ApiEvent, context?: MqttContext) => Promise<Order[]>
  getBatchResults: (msg: ApiEvent, context?: MqttContext) => Promise<Result[]>
  getOrder: (msg: ApiEvent, context?: MqttContext) => Promise<Order>
  getOrderResult: (msg: ApiEvent, context?: MqttContext) => Promise<Result>
  cancelOrder: (msg: ApiEvent, context?: MqttContext) => Promise<void>
  cancelOrderTest: (msg: ApiEvent, context?: MqttContext) => Promise<void>
  getServices: (msg: ApiEvent, context?: MqttContext) => Promise<Service[]>
  getGenders: (msg: ApiEvent, context?: MqttContext) => Promise<Gender[]>
  getSpecies: (msg: ApiEvent, context?: MqttContext) => Promise<Species[]>
  getBreeds: (msg: ApiEvent, context?: MqttContext) => Promise<Breed[]>
  fetchResults: (jobData: INewIntegrationJobMetadata<IMetadata>) => any
  fetchOrders: (jobData: INewIntegrationJobMetadata<IMetadata>) => any
}
