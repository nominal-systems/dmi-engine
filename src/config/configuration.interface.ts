export interface AppConfig {
  port: number
  mqtt: MQTTConfig
  redis: RedisConfig
  jobs: {
    [key: string]: {
      repeat: {
        every: number
      }
    }
  }
}

export interface MQTTConfig {
  host: string
  port: number
}

export interface RedisConfig {
  host: string
  port: number
}
