import { getQueueToken } from '@nestjs/bull'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { ExistingIntegrationPayload, IPayload, NewIntegrationPayload } from '@nominal-systems/dmi-engine-common'
import { EveryRepeatOptions, Job, JobCounts, Queue } from 'bull'
import { QueueManagerJobOptions } from './queue-manager.interface'

@Injectable()
export class QueueManager implements OnModuleInit {
  private readonly logger = new Logger(QueueManager.name)
  private readonly defaultJobOptions: QueueManagerJobOptions = this.configService.getOrThrow('jobs')
  private readonly queues = new Map<string, Queue>()

  constructor(
    private readonly configService: ConfigService,
    @Inject('QUEUE_NAMES') private readonly queueNames: string[],
    @Inject('JOB_OPTIONS') private readonly jobOptions: Record<string, QueueManagerJobOptions>,
    private readonly moduleRef: ModuleRef
  ) {}

  async onModuleInit() {
    for (const queueName of this.queueNames) {
      const providerId = queueName.split('.')[0]
      const providerJobOptions = this.getJobOptions(providerId)
      const queue = this.moduleRef.get<Queue>(getQueueToken(queueName), { strict: false })
      this.queues.set(queueName, queue)
      const jobs = await queue.getJobs(['active', 'waiting', 'delayed', 'completed', 'failed'])

      // Repeatable jobs
      const repeatableJobsInfo = await queue.getRepeatableJobs()
      for (const jobInfo of repeatableJobsInfo) {
        const jobRepeat = {
          repeat: {
            every: jobInfo.every
          }
        }
        this.logger.log(
          `Initializing jobs for integration '${jobInfo.id}' (${providerId.toUpperCase()}) in queue '${queueName}`
        )

        if (jobInfo.id !== undefined && providerJobOptions.repeat.every !== jobRepeat.repeat.every) {
          this.logger.warn(
            `Job for integration '${jobInfo.id}' (${providerId.toUpperCase()}) in queue '${queueName}' has different repeat interval than configured: current ${jobRepeat.repeat.every / 1000}s, target: ${providerJobOptions.repeat.every / 1000}s`
          )
          const job = jobs.find((j) => j.opts?.repeat?.key === jobInfo.key)
          if (job !== undefined && job !== null) {
            await this.updateJobRepeatOptions(queue, job, jobInfo.id, providerJobOptions.repeat)
          }
        }
      }
    }
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
    this.logger.log(`Starting polling jobs for integration '${jobId}' (${provider.toUpperCase()})`)
    const providerQueues = this.getQueues(provider)
    const providerJobOptions = this.getJobOptions(provider)
    for (const queue of providerQueues) {
      await this.startRepeatingJob(queue, jobId, providerJobOptions.repeat, data)
    }
  }

  async stopPollingJobsForIntegration(provider: string, jobId: string): Promise<void> {
    this.logger.log(`Stopping polling jobs for integration '${jobId}' (${provider.toUpperCase()})`)
    const providerQueues = this.getQueues(provider)
    for (const queue of providerQueues) {
      const jobOptions = this.getJobOptions(provider).repeat
      await this.removeRepeatableJob(queue, jobId, jobOptions)
      this.logger.debug(`Stopped repeating job '${jobId}' in queue ${queue.name}`)
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

  async updateJobRepeatOptions(
    queue: Queue,
    job: Job,
    jobId: string,
    newRepeatOptions: EveryRepeatOptions
  ): Promise<void> {
    await this.stopRepeatingJob(queue, job, jobId)
    await this.startRepeatingJob(queue, jobId, newRepeatOptions, job.data)
  }

  async getJobCounts(queueName: string): Promise<JobCounts> {
    const queue = this.getQueue(queueName)
    if (queue !== undefined) {
      return await queue.getJobCounts()
    } else {
      throw new Error(`Queue ${queueName} not found`)
    }
  }

  private getJobOptions(providerId: string): QueueManagerJobOptions {
    if (this.jobOptions[providerId] !== undefined) {
      return this.jobOptions[providerId]
    } else {
      return this.defaultJobOptions
    }
  }

  private async removeRepeatableJob(
    queue: Queue,
    jobId: string,
    everyRepeatOptions: EveryRepeatOptions
  ): Promise<void> {
    await queue.removeRepeatable({ ...everyRepeatOptions, jobId })
  }

  private async stopRepeatingJob(queue: Queue, job: Job, jobId: string): Promise<void> {
    const currentRepeatOptions = job.opts?.repeat
    const repeatEvery = (currentRepeatOptions as EveryRepeatOptions).every
    if (currentRepeatOptions !== undefined && repeatEvery !== undefined) {
      await this.removeRepeatableJob(queue, jobId, { every: repeatEvery })
      this.logger.debug(`Stopped repeating job '${jobId}' in queue ${queue.name}`)
    }
  }

  private async startRepeatingJob(
    queue: Queue,
    jobId: string,
    repeatOptions: EveryRepeatOptions,
    jobData: any
  ): Promise<void> {
    this.logger.debug(
      `Started repeating job '${jobId}' in queue ${queue.name}: repeat every ${repeatOptions.every / 1000}s`
    )
    await queue.add(jobData, { repeat: repeatOptions, jobId })
  }
}
