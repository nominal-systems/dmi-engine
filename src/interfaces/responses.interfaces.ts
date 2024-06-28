import { JobCounts } from 'bull'

export interface QueuesInfo {
  total: number
  queues: Record<string, QueueInfo>
}

export interface QueueInfo {
  jobCounts: JobCounts
}

export type QueuesJobCount = Record<string, JobCounts>
