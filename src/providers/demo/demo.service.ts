import { HttpService, Injectable } from '@nestjs/common'
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
import { DemoMetadata } from './interfaces/demo'
import { OrderResponse } from './interfaces/order'
import { DemoOrderPayloadTransformer } from './provider-transformer'

@Injectable()
export class DemoProviderService
implements
    ProviderService<DemoMetadata>,
    PdfResults<DemoMetadata>,
    OrderEdits<DemoMetadata>,
    Manifest<DemoMetadata>,
    SubmissionUrl<DemoMetadata>,
    NewTests<DemoMetadata> {
  constructor (
    private readonly httpService: HttpService
  ) {}

  async createOrder (payload: CreateOrderPayload, metadata: DemoMetadata): Promise<Order> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/orders`
    const transformer = new DemoOrderPayloadTransformer()
    const orderPayload = transformer.transformCreateOrderPayload(payload)

    const { data } = await this.httpService
      .post<OrderResponse>(url, orderPayload, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return transformer.transformCreateOrderResponse(data, baseUrl)
  }

  async getBatchOrders (_payload: null, metadata: DemoMetadata): Promise<Order[]> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/orders/batch`

    const { data } = await this.httpService
      .get<OrderResponse[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return await this.getOrdersInBatch(baseUrl, data)
  }

  async getOrdersInBatch (baseUrl: string, orders: OrderResponse[]) {
    const requests = orders.map(async order => {
      return await this.httpService.get(`${baseUrl}/demo/orders/${order.id}`).toPromise()
    })

    const responses = await Promise.all(requests)
    return responses.map((response) => response.data)
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

  getApiKeyHeaderFromMetadata (metadata: DemoMetadata) {
    return {
      'X-Api-Key': metadata.integrationOptions.apiKey
    }
  }
}
