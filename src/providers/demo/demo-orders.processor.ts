import { Process, Processor } from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Job } from 'bull'
import {
  INewIntegrationJobMetadata,
  Provider
} from '../../common/interfaces/provider-integration'
import { DemoProviderService } from './demo.service'
import { DemoMetadata } from './interfaces/demo'

@Processor(`${Provider.Demo}.orders`)
export class DemoOrdersProcessor {
  constructor (
    private readonly providerService: DemoProviderService,
    @Inject('API_SERVICE') private readonly client: ClientProxy
  ) {}

  private readonly logger = new Logger(DemoOrdersProcessor.name)

  @Process()
  async handleFetchOrders (job: Job<INewIntegrationJobMetadata<DemoMetadata>>) {
    const { data } = job.data
    this.logger.debug(
      `Orders job for integration: ${JSON.stringify(
        data.payload.integrationId
      )}`
    )
    try {
      const orders = await this.providerService.getBatchOrders(null, data)
      if (orders.length > 0) {
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
      }
      return { orders: orders.length }
    } catch (error) {
      this.logger.error(error)
    }
  }
}
