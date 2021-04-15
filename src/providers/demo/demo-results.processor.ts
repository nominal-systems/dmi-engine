import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { Provider } from '../../common/interfaces/provider-integration'
import { DemoProviderService } from './demo.service'

@Processor('results')
export class DemoResultsProcessor {
  constructor (private readonly providerService: DemoProviderService) {}

  private readonly logger = new Logger(DemoResultsProcessor.name)

  @Process(Provider.Demo)
  handleFetchResults (job: Job) {
    this.logger.debug(`Results job data :${JSON.stringify(job.data)}`)
  }
}
