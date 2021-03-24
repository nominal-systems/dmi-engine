import { Injectable } from '@nestjs/common'
import { Demo } from '../interfaces/demo'
import {
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload
} from '../interfaces/payloads'
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
} from '../interfaces/provider-service'

@Injectable()
export class ZoetisProviderService
implements
    ProviderService<Demo>,
    PdfResults<Demo>,
    OrderEdits<Demo>,
    Manifest<Demo>,
    SubmissionUrl<Demo>,
    NewTests<Demo> {
  async createOrder (payload: CreateOrderPayload, metadata: Demo): Promise<Order> {
    throw new Error('Method not implemented.')
  }

  async getBatchOrders (payload: null, metadata: Demo): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async getBatchResults (payload: null, metadata: Demo): Promise<Result[]> {
    throw new Error('Method not implemented.')
  }

  async getOrder (payload: IdPayload, metadata: Demo): Promise<Order> {
    throw new Error('Method not implemented.')
  }

  async getOrderResult (payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async cancelOrder (payload: IdPayload, metadata: Demo): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async cancelOrderTest (payload: OrderTestPayload, metadata: Demo): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getServices (payload: null, metadata: Demo): Promise<Service[]> {
    throw new Error('Method not implemented.')
  }

  async getGenders (payload: null, metadata: Demo): Promise<Gender[]> {
    throw new Error('Method not implemented.')
  }

  async getSpecies (payload: null, metadata: Demo): Promise<Species[]> {
    throw new Error('Method not implemented.')
  }

  async getBreeds (payload: null, metadata: Demo): Promise<Breed[]> {
    throw new Error('Method not implemented.')
  }

  async getOrderResultPdf (payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async editOrder (payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async getOrderManifest (payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async getOrderSubmissionUrl (payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async addOrderTest (payload: OrderTestPayload, metadata: Demo): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
