import { Controller, Get } from '@nestjs/common'
import { QueueModuleService } from './queue-module.service'
import { QueuesInfo } from '../interfaces/responses.interfaces'

@Controller('queues')
export class QueueController {
  constructor(private readonly queueModuleService: QueueModuleService) {}

  @Get()
  async getJobCounts(): Promise<QueuesInfo> {
    const queuesInfo: QueuesInfo = {
      total: 0,
      queues: {}
    }
    const queueNames = this.queueModuleService.getQueueNames()
    queuesInfo.total = queueNames.length
    for (const queueName of queueNames) {
      queuesInfo.queues[queueName] = {
        jobCounts: await this.queueModuleService.getJobCounts(queueName)
      }
    }

    return queuesInfo
  }
}
