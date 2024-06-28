import { JobCounts } from 'bull'

export interface QueuesInfo {
  total: number
  queues: {
    [queueName: string]: QueueInfo
  }
}

export interface QueueInfo {
  jobCounts: JobCounts
}

export interface QueuesJobCount {
  [queueName: string]: JobCounts
}
