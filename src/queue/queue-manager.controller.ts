import { Controller, Get } from '@nestjs/common'
import { QueueManager } from './queue-manager.service'
import { QueuesInfo } from '../interfaces/responses.interfaces'

@Controller('queues')
export class QueueManagerController {
  constructor(private readonly queueManager: QueueManager) {}

  @Get()
  async getJobCounts(): Promise<QueuesInfo> {
    const queuesInfo: QueuesInfo = {
      total: 0,
      queues: {}
    }
    const queueNames = this.queueManager.getQueueNames()
    queuesInfo.total = queueNames.length
    for (const queueName of queueNames) {
      queuesInfo.queues[queueName] = {
        jobCounts: await this.queueManager.getJobCounts(queueName)
      }
    }

    return queuesInfo
  }
}
