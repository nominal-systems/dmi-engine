import { Process, Processor } from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Job } from 'bull'
import {
  INewIntegrationJobMetadata,
  Provider
} from '../../common/interfaces/provider-integration'
import { Order } from '../../common/interfaces/provider-service'
import { IdexxService } from './idexx.service'
import { IdexxMessageData } from './interfaces/idexx-message-data.interface'

@Processor(`${Provider.Idexx}.results`)
export class IdexxResultsProcessor {
  private readonly logger = new Logger(IdexxResultsProcessor.name)

  constructor (
    private readonly idexxService: IdexxService,
    @Inject('API_SERVICE') private readonly client: ClientProxy
  ) {}

  @Process()
  async handleFetchResults (
    job: Job<INewIntegrationJobMetadata<IdexxMessageData>>
  ) {
    const { data } = job.data
    this.logger.debug(
      `Results job for integration: ${JSON.stringify(
        data.payload.integrationId
      )}`
    )

    try {
      const { payload, ...metadata } = data

      const { results, batchId } = await this.idexxService.getBatchResults(
        payload,
        metadata
      )

      const orderIds = [...new Set(results.map(result => result.orderId))]

      if (orderIds.length === 0) return

      const orders: Order[] = []

      for (const orderId of orderIds) {
        const order = await this.idexxService.getOrder({ id: orderId }, data)

        orders.push(order)
      }

      this.client.emit('external_orders', {
        integrationId: data.payload.integrationId,
        orders: orders.map((order: any) => {
          const { id, ...rest } = order

          return {
            ...rest,
            externalId: id
          }
        })
      })

      await this.idexxService.resultsConfirm({ batchId }, metadata)

      return { orders: orders.length }
    } catch (error) {
      this.logger.error(error)
    }
  }
}
