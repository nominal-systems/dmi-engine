import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { Provider } from '../../../common/interfaces/provider-integration'
import { ZoetisProviderService } from '../zoetis.service'

@Processor(`${Provider.Zoetis}.results`)
export class ZoetisResultsProcessor {
  constructor (private readonly providerService: ZoetisProviderService) {}

  private readonly logger = new Logger(ZoetisResultsProcessor.name)

  @Process()
  handleFetchResults (job: Job) {
    this.logger.debug(`Results job data :${JSON.stringify(job.data)}`)
  }
}
