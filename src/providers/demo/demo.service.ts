import { HttpService, Injectable, Logger } from '@nestjs/common'
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
import { OrderResponse, ResultResponse } from './interfaces/order'
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
  private readonly logger = new Logger(DemoProviderService.name)

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

    return await this.getOrdersInBatch(baseUrl, data, metadata)
  }

  async getOrdersInBatch (baseUrl: string, orders: OrderResponse[], metadata: DemoMetadata) {
    const requests = orders.map(async order => {
      return await this.httpService
        .get(`${baseUrl}/demo/orders/${order.id}`, {
          headers: {
            ...this.getApiKeyHeaderFromMetadata(metadata)
          }
        }).toPromise()
    })

    const responses = await Promise.all(requests)
    return responses.map((response) => response.data)
  }

  async getBatchResults (payload: null, metadata: DemoMetadata): Promise<Result[]> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/orders/batch/results`

    const { data: results } = await this.httpService
      .get<ResultResponse[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return results.map(result => ({ ...result, orderId: result.order.id }))
  }

  async getOrder (payload: IdPayload, metadata: DemoMetadata): Promise<Order> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/orders/${payload.id}`

    const { data: order } = await this.httpService
      .get<Order>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return order
  }

  async getOrderResult (payload: IdPayload, metadata: DemoMetadata): Promise<Result> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/orders/${payload.id}/results`

    const { data: result } = await this.httpService
      .get<Result>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return result
  }

  async cancelOrder (payload: IdPayload, metadata: DemoMetadata): Promise<void> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/orders/${payload.id}`

    await this.httpService.delete<Result>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()
  }

  async cancelOrderTest (payload: OrderTestPayload, metadata: DemoMetadata): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getServices (_payload: null, metadata: DemoMetadata): Promise<Service[]> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/refs/services`

    const { data } = await this.httpService.get<Service[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return data
  }

  async getGenders (_payload: null, metadata: DemoMetadata): Promise<Gender[]> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/refs/genders`

    const { data } = await this.httpService.get<Gender[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return data
  }

  async getSpecies (_payload: null, metadata: DemoMetadata): Promise<Species[]> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/refs/species`

    const { data } = await this.httpService.get<Species[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return data
  }

  async getBreeds (_payload: null, metadata: DemoMetadata): Promise<Breed[]> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/demo/refs/breeds`

    const { data } = await this.httpService.get<Breed[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return data
  }

  async getOrderResultPdf (payload: IdPayload, metadata: DemoMetadata): Promise<any> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/orders/${payload.id}/results/pdf`

    const { data } = await this.httpService.get<Breed[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return data
  }

  async editOrder (payload: IdPayload, metadata: DemoMetadata): Promise<Result> {
    throw new Error('Method not implemented.')
  }

  async getOrderManifest (payload: IdPayload, metadata: DemoMetadata): Promise<any> {
    const baseUrl = metadata.providerConfiguration.url
    const url = `${baseUrl}/orders/${payload.id}/manifest`

    const { data } = await this.httpService.get<Breed[]>(url, {
      headers: {
        ...this.getApiKeyHeaderFromMetadata(metadata)
      }
    }).toPromise()

    return data
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
