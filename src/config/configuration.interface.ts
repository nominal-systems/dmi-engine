import { type EveryRepeatOptions } from 'bull'
import { type RedisOptions } from 'ioredis'

export interface AppConfig {
  port: number
  mqtt: MQTTConfig
  redis: RedisOptions & { isCluster: boolean }
  queues: {
    clean: Record<
      string,
      {
        grace: number
      }
    >
  }
  jobs: {
    repeat: EveryRepeatOptions
  }
}

export interface MQTTConfig {
  protocol: string
  hostname: string
  port: number
  username: string
  password: string
}
