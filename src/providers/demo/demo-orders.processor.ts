import { Process, Processor } from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Job } from 'bull'
import { INewIntegrationJobMetadata, Provider } from '../../common/interfaces/provider-integration'
import { DemoProviderService } from './demo.service'
import { DemoMetadata } from './interfaces/demo'

@Processor('orders')
export class DemoOrdersProcessor {
  constructor (
    private readonly providerService: DemoProviderService,
    @Inject('API_SERVICE') private readonly client: ClientProxy
  ) {}

  private readonly logger = new Logger(DemoOrdersProcessor.name)

  @Process(Provider.Demo)
  async handleFetchOrders (job: Job<INewIntegrationJobMetadata<DemoMetadata>>) {
    const { data } = job.data
    this.logger.debug(`Orders job data :${JSON.stringify(data)}`)
    try {
      const orders = await this.providerService.getBatchOrders(null, data)
      this.client.emit('external_orders', {
        integrationId: data.payload.integrationId,
        orders
      })
    } catch (error) {
      this.logger.error(error)
    }
  }
}
