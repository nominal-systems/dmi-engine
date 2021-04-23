import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { Provider } from '../../common/interfaces/provider-integration'
import { DemoProviderService } from './demo.service'

@Processor(`${Provider.Demo}.results`)
export class DemoResultsProcessor {
  constructor (private readonly providerService: DemoProviderService) {}

  private readonly logger = new Logger(DemoResultsProcessor.name)

  @Process()
  handleFetchResults (job: Job) {
    const { data } = job.data
    this.logger.debug(`Results job for integration: ${JSON.stringify(data.payload.integrationId)}`)
  }
}
