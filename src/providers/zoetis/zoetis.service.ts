import { HttpService, Injectable } from '@nestjs/common'
import {
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload
} from '../../common/interfaces/payloads'
import {
  Breed,
  Gender,
  Order,
  PdfResults,
  ProviderService,
  Result,
  Service,
  Species
} from '../../common/interfaces/provider-service'
import { ZoetisMetadata } from './interfaces/metadata.interface'
import { getOrder } from './helpers/zoetis-order.helper'
import { XmlService } from '../../xml/xml.service'

@Injectable()
export class ZoetisProviderService
implements ProviderService<ZoetisMetadata>, PdfResults<ZoetisMetadata> {
  constructor (
    private readonly httpService: HttpService,
    private readonly xmlService: XmlService
  ) {}

  async createOrder (
    payload: CreateOrderPayload,
    metadata: ZoetisMetadata
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

  async getBatchOrders (payload: null, metadata: ZoetisMetadata): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async getBatchResults (payload: null, metadata: ZoetisMetadata): Promise<Result[]> {
    throw new Error('Method not implemented.')
  }

  async getOrder (payload: IdPayload, metadata: ZoetisMetadata): Promise<Order> {
    throw new Error('Method not implemented.')
  }

  async getOrderResult (payload: IdPayload, metadata: ZoetisMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async cancelOrder (payload: IdPayload, metadata: ZoetisMetadata): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async cancelOrderTest (payload: OrderTestPayload, metadata: ZoetisMetadata): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getServices (payload: null, metadata: ZoetisMetadata): Promise<Service[]> {
    throw new Error('Method not implemented.')
  }

  async getGenders (payload: null, metadata: ZoetisMetadata): Promise<Gender[]> {
    throw new Error('Method not implemented.')
  }

  async getSpecies (payload: null, metadata: ZoetisMetadata): Promise<Species[]> {
    throw new Error('Method not implemented.')
  }

  async getBreeds (payload: null, metadata: ZoetisMetadata): Promise<Breed[]> {
    throw new Error('Method not implemented.')
  }

  async getOrderResultPdf (payload: IdPayload, metadata: ZoetisMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }
}
