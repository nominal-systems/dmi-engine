import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { type JobCounts, Queue } from 'bull'
import { ConfigService } from '@nestjs/config'
import {
  type ExistingIntegrationPayload,
  type IPayload,
  type NewIntegrationPayload
} from '@nominal-systems/dmi-engine-common'
import { type ProviderQueues } from '../interfaces/provider-queues.type'

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name)
  private readonly jobsConfig
  queues: ProviderQueues = {
    'antech-v6': [],
    'wisdom-panel': []
  }

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('wisdom-panel.orders') private readonly wisdomPanelOrdersQueue: Queue,
    @InjectQueue('wisdom-panel.results') private readonly wisdomPanelResultsQueue: Queue,
    @InjectQueue('antech-v6.orders') private readonly antechV6OrdersQueue: Queue,
    @InjectQueue('antech-v6.results') private readonly antechV6ResultsQueue: Queue
  ) {
    this.queues['wisdom-panel'].push(this.wisdomPanelOrdersQueue)
    this.queues['wisdom-panel'].push(this.wisdomPanelResultsQueue)
    this.queues['antech-v6'].push(this.antechV6OrdersQueue)
    this.queues['antech-v6'].push(this.antechV6ResultsQueue)
    this.jobsConfig = this.configService.get('jobs')
  }

  async onModuleInit() {
    await this.logJobCounts()
  }

  async startPollingJobsForIntegration(providerId: string, data: IPayload<NewIntegrationPayload>): Promise<void> {
    const providerQueues = this.queues[providerId]
    const jobId = data.payload.integrationId
    for (const queue of providerQueues) {
      await queue.add(data, { ...this.jobsConfig, jobId })
      this.logger.debug(`Added job '${jobId}' to queue ${queue.name}`)
    }
    await this.logJobCounts()
  }

  async stopPollingJobsForIntegration(providerId: string, data: IPayload<ExistingIntegrationPayload>): Promise<void> {
    const providerQueues = this.queues[providerId]
    const jobId = data.payload.integrationId
    for (const queue of providerQueues) {
      await queue.removeRepeatable({ ...this.jobsConfig.repeat, jobId })
      this.logger.debug(`Removed repeatable job '${jobId}' from queue ${queue.name}`)
    }
    await this.logJobCounts()
  }

  async updatePollingJobsForIntegration(providerId: string, data: IPayload<ExistingIntegrationPayload>): Promise<void> {
    await this.stopPollingJobsForIntegration(providerId, data)
    await this.startPollingJobsForIntegration(providerId, data)
  }

  private async logJobCounts() {
    for (const provider of Object.keys(this.queues)) {
      for (const queue of this.queues[provider]) {
        const jobCounts: JobCounts = await queue.getJobCounts()
        const totalJobs = Object.values(jobCounts).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        this.logger.log(
          `Queue '${queue.name}' has ${totalJobs} jobs: ${jobCounts.active} active, ${jobCounts.delayed} delayed, ${jobCounts.waiting} waiting, ${jobCounts.completed} completed`
        )
      }
    }
  }
}
