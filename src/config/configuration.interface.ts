import { type EveryRepeatOptions } from 'bull'
import { type RedisOptions } from 'ioredis'

export interface AppConfig {
  port: number
  mqtt: MQTTConfig
  redis: RedisOptions & { isCluster: boolean }
  statsig: StatsigConfig
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

export interface StatsigConfig {
  enabled: boolean
  serverSecretKey: string
  environment: string
  overrides: Record<string, boolean>
  heartbeatIntervalMs: number
  heartbeatGate: string
  heartbeatEventName: string
}
