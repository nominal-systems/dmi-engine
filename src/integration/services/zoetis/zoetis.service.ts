import { HttpService, Injectable } from '@nestjs/common'
import {
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload
} from '../interfaces/payloads'
import {
  Breed,
  Gender,
  Order,
  PdfResults,
  ProviderService,
  Result,
  Service,
  Species
} from '../interfaces/provider-service'
import { Zoetis } from '../interfaces/zoetis'
import { XmlService } from '../xml-service'
import { getOrder } from './helpers/zoetis-order.helper'

@Injectable()
export class ZoetisProviderService
implements ProviderService<Zoetis>, PdfResults<Zoetis> {
  constructor (
    private readonly httpService: HttpService,
    private readonly xmlService: XmlService
  ) {}

  async createOrder (
    payload: CreateOrderPayload,
    metadata: Zoetis
  ): Promise<Order> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/vetsync/v1/orders`
    const auth = {
      username: metadata.providerConfiguration.partnerId,
      password: metadata.providerConfiguration.partnerToken
    }
    const practiceRef = payload.id
    const clientId = metadata.integrationOptions.clientId
    const order = getOrder(practiceRef, clientId, payload)
    const xml = this.xmlService.convertObjectToXml(order)

    await this.httpService
      .post(url, xml, {
        auth,
        headers: {
          'Content-Type': 'application/xml'
        }
      })
      .toPromise()

    return {
      externalId: practiceRef,
      manifestUri: null,
      submissionUri: null,
      status: 'pending'
    }
  }

  async getBatchOrders (payload: null, metadata: Zoetis): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async getBatchResults (payload: null, metadata: Zoetis): Promise<Result[]> {
    throw new Error('Method not implemented.')
  }

  async getOrder (payload: IdPayload, metadata: Zoetis): Promise<Order> {
    throw new Error('Method not implemented.')
  }

  async getOrderResult (payload: IdPayload, metadata: Zoetis): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async cancelOrder (payload: IdPayload, metadata: Zoetis): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async cancelOrderTest (payload: OrderTestPayload, metadata: Zoetis): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getServices (payload: null, metadata: Zoetis): Promise<Service[]> {
    throw new Error('Method not implemented.')
  }

  async getGenders (payload: null, metadata: Zoetis): Promise<Gender[]> {
    throw new Error('Method not implemented.')
  }

  async getSpecies (payload: null, metadata: Zoetis): Promise<Species[]> {
    throw new Error('Method not implemented.')
  }

  async getBreeds (payload: null, metadata: Zoetis): Promise<Breed[]> {
    throw new Error('Method not implemented.')
  }

  async getOrderResultPdf (payload: IdPayload, metadata: Zoetis): Promise<Result> {
    throw new Error('Method not implemented.')
  }
}
