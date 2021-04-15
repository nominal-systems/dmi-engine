import { CreateOrderPayload } from '../../common/interfaces/payloads'
import { DemoOrderPayload, OrderResponse } from './interfaces/order'
import { v4 as uuidv4 } from 'uuid'

// TODO: Make this a pipe
export class DemoOrderPayloadTransformer {
  transformCreateOrderPayload (payload: CreateOrderPayload): DemoOrderPayload {
    const { integrationId, ...order } = payload
    order.id = uuidv4()
    return order
  }

  transformCreateOrderResponse (data: OrderResponse, baseUrl: string) {
    const manifestUri = data.manifestUrl !== null ? `${baseUrl}/demo${data.manifestUrl}` : null
    const submissionUri = data.submissionUrl !== null ? `${baseUrl}/demo${data.submissionUrl}` : null

    return {
      externalId: data.id,
      manifestUri,
      submissionUri,
      status: data.status
    }
  }

  transformGetOrderPayload (payload: CreateOrderPayload): DemoOrderPayload {
    throw new Error('Not implemented')
  }
}
