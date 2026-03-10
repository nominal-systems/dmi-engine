import { Controller, Get, Logger } from '@nestjs/common'
import { QueueManager } from './queue-manager.service'
import { QueuesInfo } from '../interfaces/responses.interfaces'

@Controller('queues')
export class QueueManagerController {
  private readonly logger = new Logger(QueueManagerController.name)

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
      try {
        queuesInfo.queues[queueName] = {
          jobCounts: await this.queueManager.getJobCounts(queueName)
        }
      } catch (err) {
        const message: string = err instanceof Error ? err.message : String(err)
        this.logger.warn(`Failed to get job counts for queue '${queueName}': ${message}`)
        queuesInfo.queues[queueName] = { jobCounts: null }
      }
    }

    return queuesInfo
  }
}
