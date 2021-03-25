import { AppConfig } from './configuration.interface'

export default (): AppConfig => ({
  port: Number(process.env.PORT ?? 3000),
  mqtt: {
    host: process.env.MQTT_HOST ?? 'localhost',
    port: Number(process.env.MQTT_PORT ?? 1883)
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379)
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
