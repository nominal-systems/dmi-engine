import { Injectable } from '@nestjs/common'
import { DemoMetadata } from './demo'
import {
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload
} from '../../common/interfaces/payloads'
import {
  Breed,
  Gender,
  Manifest,
  NewTests,
  Order,
  OrderEdits,
  PdfResults,
  ProviderService,
  Result,
  Service,
  Species,
  SubmissionUrl
} from '../../common/interfaces/provider-service'

@Injectable()
export class DemoProviderService
implements
    ProviderService<DemoMetadata>,
    PdfResults<DemoMetadata>,
    OrderEdits<DemoMetadata>,
    Manifest<DemoMetadata>,
    SubmissionUrl<DemoMetadata>,
    NewTests<DemoMetadata> {
  async createOrder (payload: CreateOrderPayload, metadata: DemoMetadata): Promise<Order> {
    console.log(metadata, payload)
    throw new Error('Method not implemented.')
  }

  async getBatchOrders (payload: null, metadata: DemoMetadata): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async getBatchResults (payload: null, metadata: DemoMetadata): Promise<Result[]> {
    throw new Error('Method not implemented.')
  }

  async getOrder (payload: IdPayload, metadata: DemoMetadata): Promise<Order> {
    throw new Error('Method not implemented.')
  }

  async getOrderResult (payload: IdPayload, metadata: DemoMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async cancelOrder (payload: IdPayload, metadata: DemoMetadata): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async cancelOrderTest (payload: OrderTestPayload, metadata: DemoMetadata): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getServices (payload: null, metadata: DemoMetadata): Promise<Service[]> {
    throw new Error('Method not implemented.')
  }

  async getGenders (payload: null, metadata: DemoMetadata): Promise<Gender[]> {
    throw new Error('Method not implemented.')
  }

  async getSpecies (payload: null, metadata: DemoMetadata): Promise<Species[]> {
    throw new Error('Method not implemented.')
  }

  async getBreeds (payload: null, metadata: DemoMetadata): Promise<Breed[]> {
    throw new Error('Method not implemented.')
  }

  async getOrderResultPdf (payload: IdPayload, metadata: DemoMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async editOrder (payload: IdPayload, metadata: DemoMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async getOrderManifest (payload: IdPayload, metadata: DemoMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async getOrderSubmissionUrl (payload: IdPayload, metadata: DemoMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async addOrderTest (payload: OrderTestPayload, metadata: DemoMetadata): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
