import { EveryRepeatOptions } from 'bull'

export interface QueueManagerJobOptions {
  repeat: EveryRepeatOptions
}
