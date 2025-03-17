import { type EveryRepeatOptions } from 'bull'
import { type ClusterNode, type ClusterOptions, type RedisOptions } from 'ioredis'

/**
 * Combined type for Redis configuration that can be either standalone or cluster
 */
export type RedisConfig = RedisStandaloneConfig | RedisClusterConfig

/**
 * Standalone Redis configuration
 */
export interface RedisStandaloneConfig extends RedisOptions {
  cluster?: undefined
  nodes?: undefined
}

/**
 * Redis Cluster configuration
 */
export interface RedisClusterConfig {
  cluster?: ClusterNode[]
  nodes?: ClusterNode[]
  clusterOptions?: ClusterOptions
  password?: string
  redisOptions?: RedisOptions
}

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
