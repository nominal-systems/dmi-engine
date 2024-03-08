import { type CronRepeatOptions, type EveryRepeatOptions } from 'bull'

export interface AppConfig {
  port: number
  mqtt: MQTTConfig
  redis: RedisConfig
  queues: {
    clean: Record<
      string,
      {
        grace: number
      }
    >
  }
  jobs: {
    repeat: CronRepeatOptions | EveryRepeatOptions
  }
}

export interface MQTTConfig {
  protocol: string
  hostname: string
  port: number
  username: string
  password: string
}

export interface RedisConfig {
  host: string
  port: number
  password: string
}
