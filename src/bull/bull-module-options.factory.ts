import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BullModuleOptions } from '@nestjs/bull'

/**
 * Interface for Redis cluster node configuration
 */
interface RedisNodeOptions {
  host: string
  port: number
}

/**
 * Factory function to create the BullModule options with Redis connection logging
 * Supports both standalone Redis and Redis Cluster configurations
 */
export const BullModuleOptionsFactory = async (configService: ConfigService): Promise<BullModuleOptions> => {
  const logger = new Logger(BullModuleOptionsFactory.name)
  const redisConfig = configService.get('redis')

  // Check if we're using Redis Cluster
  const isCluster = isRedisClusterConfig(redisConfig)

  if (isCluster) {
    const { cluster, nodes } = redisConfig

    // Get cluster nodes configuration
    let clusterNodes: RedisNodeOptions[] = []
    if (Array.isArray(cluster)) {
      clusterNodes = cluster as RedisNodeOptions[]
    } else if (Array.isArray(nodes)) {
      clusterNodes = nodes as RedisNodeOptions[]
    }

    logger.debug(`Redis Cluster configuration with ${clusterNodes.length} nodes`)
    clusterNodes.forEach((node, index) => {
      logger.debug(`  Cluster Node ${index + 1}: ${node.host}:${node.port}`)
    })
  } else {
    // Log Redis standalone configuration for debugging
    const redisHost = typeof redisConfig.host === 'string' ? redisConfig.host : 'localhost'
    const redisPort = typeof redisConfig.port === 'number' ? redisConfig.port : 6379
    const redisDB = typeof redisConfig.db === 'number' ? redisConfig.db : 0

    const hasPassword = Boolean(typeof redisConfig.password === 'string' && redisConfig.password.length > 0)
    logger.debug(
      `Redis standalone configuration: host=${redisHost}, port=${redisPort}, database=${redisDB}, password=${hasPassword ? 'provided' : 'none'}`
    )
  }

  // Note: The redis configuration is passed directly to Bull,
  // which will create the appropriate Redis client (standalone or cluster)
  // based on the configuration structure
  return {
    redis: redisConfig,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true
    },
    prefix:
      typeof configService.get('redis.prefix') === 'string' && configService.get('redis.prefix') !== ''
        ? configService.get('redis.prefix') ?? 'bull'
        : 'bull'
  }
}

/**
 * Determines if the Redis configuration is for a cluster
 */
function isRedisClusterConfig(redisConfig: any): boolean {
  // Check for explicit cluster configuration
  if (
    typeof redisConfig === 'object' &&
    redisConfig !== null &&
    typeof redisConfig.cluster !== 'undefined' &&
    (Array.isArray(redisConfig.cluster) || typeof redisConfig.cluster === 'object')
  ) {
    return true
  }

  // Check for nodes array
  if (
    typeof redisConfig === 'object' &&
    redisConfig !== null &&
    typeof redisConfig.nodes !== 'undefined' &&
    Array.isArray(redisConfig.nodes) &&
    redisConfig.nodes.length > 0
  ) {
    return true
  }

  return false
}
