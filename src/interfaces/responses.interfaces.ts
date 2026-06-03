import { JobCounts } from 'bull'

export interface QueuesInfo {
  total: number
  cacheErrors: number
  queues: Record<string, QueueInfo>
}

export interface QueueInfo {
  jobCounts: JobCounts | null
}

export type QueuesJobCount = Record<string, JobCounts>
