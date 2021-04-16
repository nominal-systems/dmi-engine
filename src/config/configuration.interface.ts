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
  protocol: string
  hostname: string
  port: number
  username: string
  password: string
}

export interface RedisConfig {
  host: string
  port: number
}
