import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { Provider } from '../../../common/interfaces/provider-integration'
import { ZoetisProviderService } from '../zoetis.service'

@Processor(`${Provider.Zoetis}.orders`)
export class ZoetisOrdersProcessor {
  constructor (private readonly providerService: ZoetisProviderService) {}

  private readonly logger = new Logger(ZoetisOrdersProcessor.name)

  @Process()
  handleFetchOrders (job: Job) {
    this.logger.debug(`Orders job data :${JSON.stringify(job.data)}`)
  }
}
