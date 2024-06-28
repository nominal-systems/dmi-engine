import { getQueueToken } from '@nestjs/bull'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { ExistingIntegrationPayload, IPayload, NewIntegrationPayload } from '@nominal-systems/dmi-engine-common'
import { EveryRepeatOptions, JobCounts, JobId, JobOptions, Queue } from 'bull'

@Injectable()
export class QueueManager implements OnModuleInit {
  private readonly logger = new Logger(QueueManager.name)
  private readonly jobsConfig = this.configService.get('jobs')
  private readonly queues = new Map<string, Queue>()

  constructor(
    private readonly configService: ConfigService,
    @Inject('QUEUE_NAMES') private readonly queueNames: string[],
    private readonly moduleRef: ModuleRef
  ) {}

  async onModuleInit() {
    this.queueNames.forEach((queueName) => {
      const queue = this.moduleRef.get<Queue>(getQueueToken(queueName), { strict: false })
      this.queues.set(queueName, queue)
      this.logger.log(`Queue Manager initialized for queue ${queueName}`)
    })
  }

  getQueue(queueName: string): Queue | undefined {
    return this.queues.get(queueName)
  }

  getQueues(prefix?: string): Queue[] {
    const result: Queue[] = []
    for (const [key, queue] of this.queues.entries()) {
      if (prefix !== undefined) {
        if (key.startsWith(prefix)) {
          result.push(queue)
        }
      } else {
        result.push(queue)
      }
    }
    return result
  }

  getQueueNames(): string[] {
    return Array.from(this.queues.keys())
  }

  async startPollingJobsForIntegration(
    provider: string,
    jobId: string,
    data: IPayload<NewIntegrationPayload>
  ): Promise<void> {
    const providerQueues = this.getQueues(provider)
    const jobOptions: JobOptions = { ...this.jobsConfig, jobId }
    for (const queue of providerQueues) {
      await queue.add(data, jobOptions)
      this.logger.debug(`Added job '${jobId}' to queue ${queue.name}`)
    }
  }

  async stopPollingJobsForIntegration(provider: string, jobId: string): Promise<void> {
    const providerQueues = this.getQueues(provider)
    const repeat: EveryRepeatOptions & { jobId?: JobId } = { ...this.jobsConfig.repeat, jobId }
    for (const queue of providerQueues) {
      await queue.removeRepeatable(repeat)
      this.logger.debug(`Removed repeatable job '${jobId}' from queue ${queue.name}`)
    }
  }

  async updatePollingJobsForIntegration(
    providerId: string,
    jobId: string,
    data: IPayload<ExistingIntegrationPayload>
  ): Promise<void> {
    await this.stopPollingJobsForIntegration(providerId, jobId)
    await this.startPollingJobsForIntegration(providerId, jobId, data)
  }

  async getJobCounts(queueName: string): Promise<JobCounts> {
    const queue = this.getQueue(queueName)
    if (queue !== undefined) {
      return await queue.getJobCounts()
    } else {
      throw new Error(`Queue ${queueName} not found`)
    }
  }
}
