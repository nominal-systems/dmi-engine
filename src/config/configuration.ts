import { type AppConfig } from './configuration.interface'

const parseStatsigOverrides = (value?: string): Record<string, boolean> => {
  if (value === undefined || value.trim() === '') {
    return {}
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .reduce<Record<string, boolean>>((acc, entry) => {
      const [flag, rawValue] = entry.split('=')
      const trimmedFlag = flag?.trim()
      if (trimmedFlag === undefined || trimmedFlag === '') {
        return acc
      }

      acc[trimmedFlag] = rawValue?.trim() === 'true'
      return acc
    }, {})
}

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
    isCluster: process.env.REDIS_CLUSTER_ENABLED === 'true',
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD ?? ''
  },
  queues: {
    clean: {
      failed: {
        grace: 1000 * 60 * 60 * 24
      }
    }
  },
  statsig: {
    enabled: process.env.STATSIG_ENABLED === 'true',
    serverSecretKey: process.env.STATSIG_SERVER_SECRET_KEY ?? '',
    environment: process.env.STATSIG_ENVIRONMENT ?? process.env.NODE_ENV ?? 'local',
    overrides: parseStatsigOverrides(process.env.STATSIG_OVERRIDES),
    heartbeatIntervalMs: Number(process.env.STATSIG_HEARTBEAT_INTERVAL_MS ?? 0),
    heartbeatGate: process.env.STATSIG_HEARTBEAT_GATE ?? 'antech_v6_statsig_test_log',
    heartbeatEventName: process.env.STATSIG_HEARTBEAT_EVENT_NAME ?? 'statsig_heartbeat'
  },
  jobs: {
    repeat: {
      every: 1000 * 30
    }
  }
})
