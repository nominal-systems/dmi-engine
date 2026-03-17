import { Controller, Get, Logger } from '@nestjs/common'
import { QueueManager } from './queue-manager.service'
import { QueuesInfo } from '../interfaces/responses.interfaces'

@Controller('queues')
export class QueueManagerController {
  private readonly logger = new Logger(QueueManagerController.name)

  constructor(private readonly queueManager: QueueManager) {}

  @Get()
  async getJobCounts(): Promise<QueuesInfo> {
    const queueNames = this.queueManager.getQueueNames()
    const queuesInfo: QueuesInfo = {
      total: queueNames.length,
      cacheErrors: this.queueManager.cacheErrorCount,
      queues: {}
    }
    for (const queueName of queueNames) {
      queuesInfo.queues[queueName] = {
        jobCounts: await this.queueManager.getJobCounts(queueName)
      }
    }

    return queuesInfo
  }
}
