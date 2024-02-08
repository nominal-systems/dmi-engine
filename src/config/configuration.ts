import { type AppConfig } from './configuration.interface'

export default (): AppConfig => ({
  port: Number(process.env.PORT ?? 3000),
  mqtt: {
    protocol: process.env.MQTT_PROTOCOL ?? 'mqtt',
    hostname: process.env.MQTT_HOST ?? 'localhost',
    port: Number(process.env.MQTT_PORT ?? 1883),
    username: process.env.MQTT_USERNAME ?? '',
    password: process.env.MQTT_PASSWORD ?? ''
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379)
  },
  queues: {
    clean: {
      failed: {
        grace: 1000 * 60 * 60 * 24
      }
    }
  },
  jobs: {
    results: {
      repeat: {
        every: 10000
      }
    },
    orders: {
      repeat: {
        every: 10000
      }
    }
  }
})
