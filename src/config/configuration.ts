import { type AppConfig, type RedisConfig } from './configuration.interface'

/**
 * Detect if Redis cluster configuration is provided in environment variables
 */
function getRedisConfig(): RedisConfig {
  // Check if Redis cluster is enabled via environment variable
  const isClusterMode = process.env.REDIS_CLUSTER_ENABLED === 'true'

  if (isClusterMode) {
    // Parse Redis cluster nodes from environment variable
    // Format: REDIS_CLUSTER_NODES=host1:port1,host2:port2,host3:port3
    const clusterNodesStr = process.env.REDIS_CLUSTER_NODES ?? ''
    const nodes = clusterNodesStr
      .split(',')
      .filter((node) => node.trim().length > 0)
      .map((node) => {
        const [host, portStr] = node.split(':')
        return {
          host: host.trim(),
          port: parseInt(portStr?.trim() ?? '6379', 10)
        }
      })

    // If we don't have any nodes defined, fallback to standalone mode
    if (nodes.length <= 0) {
      console.warn(
        'REDIS_CLUSTER_ENABLED is true but no valid REDIS_CLUSTER_NODES defined. Falling back to standalone Redis.'
      )
      return {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        password: process.env.REDIS_PASSWORD ?? ''
      }
    }

    // Return cluster configuration
    return {
      nodes,
      password: process.env.REDIS_PASSWORD ?? '',
      clusterOptions: {
        enableReadyCheck: true,
        slotsRefreshTimeout: 10000,
        redisOptions: {
          tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined
        }
      },
      redisOptions: {
        tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined
      }
    }
  } else {
    // Standalone Redis configuration
    return {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD ?? '',
      tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined
    }
  }
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
  redis: getRedisConfig(),
  queues: {
    clean: {
      failed: {
        grace: 1000 * 60 * 60 * 24
      }
    }
  },
  jobs: {
    repeat: {
      every: 1000 * 30
    }
  }
})
