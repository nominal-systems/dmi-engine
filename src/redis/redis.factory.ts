import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { type ClusterOptions, type RedisOptions } from 'ioredis'

type RedisConfig = RedisOptions & { isCluster: boolean, username?: string, password?: string }

export const createBullRedisOptions = (configService: ConfigService, logger = new Logger('Redis')) => {
  const redis = configService.getOrThrow<RedisConfig>('redis')

  const username = redis.username ?? ''
  const password = redis.password ?? ''

  const auth =
    username !== '' || password !== ''
      ? {
          ...(username !== '' ? { username } : {}),
          ...(password !== '' ? { password } : {})
        }
      : {}
  const tlsEnabledEnv = process.env.REDIS_TLS_ENABLED
  const tls =
    tlsEnabledEnv === 'true'
      ? { servername: redis.host }
      : tlsEnabledEnv === 'false'
        ? undefined
        : redis.port === 6380
          ? { servername: redis.host }
          : undefined

  const slotsRefreshTimeoutMs =
    process.env.REDIS_SLOTS_REFRESH_TIMEOUT_MS !== undefined
      ? Number(process.env.REDIS_SLOTS_REFRESH_TIMEOUT_MS)
      : 15000
  const connectTimeoutMs =
    process.env.REDIS_CONNECT_TIMEOUT_MS !== undefined ? Number(process.env.REDIS_CONNECT_TIMEOUT_MS) : 15000
  const clusterRetryBaseMs =
    process.env.REDIS_CLUSTER_RETRY_BASE_MS !== undefined ? Number(process.env.REDIS_CLUSTER_RETRY_BASE_MS) : 1000
  const clusterRetryMaxMs =
    process.env.REDIS_CLUSTER_RETRY_MAX_MS !== undefined ? Number(process.env.REDIS_CLUSTER_RETRY_MAX_MS) : 20000

  const baseRedisOptions: RedisOptions = {
    host: redis.host,
    port: redis.port,
    ...auth,
    ...(tls !== undefined ? { tls } : {}),
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    ...(connectTimeoutMs !== undefined && !Number.isNaN(connectTimeoutMs) ? { connectTimeout: connectTimeoutMs } : {})
  }

  logger.debug(
    `[redis] config host=${redis.host} port=${redis.port} cluster=${redis.isCluster} tls=${tls !== undefined} username=${
      username !== '' ? 'set' : 'unset'
    } password=${password !== '' ? 'set' : 'unset'}`
  )

  const clusterOptions: ClusterOptions = {
    redisOptions: baseRedisOptions,
    slotsRefreshTimeout: Number.isNaN(slotsRefreshTimeoutMs) ? 15000 : slotsRefreshTimeoutMs,
    clusterRetryStrategy: (attempts: number) => {
      const base = Number.isNaN(clusterRetryBaseMs) ? 1000 : clusterRetryBaseMs
      const max = Number.isNaN(clusterRetryMaxMs) ? 20000 : clusterRetryMaxMs
      return Math.min(base * (attempts + 1), max)
    }
  }

  return {
    createClient: (type = 'client') => {
      const logContext = {
        host: redis.host,
        port: redis.port,
        isCluster: redis.isCluster,
        tls: tls !== undefined,
        type
      }

      const client = redis.isCluster
        ? new Redis.Cluster(
          [
            {
              host: redis.host,
              port: redis.port
            }
          ],
          clusterOptions
        )
        : new Redis(baseRedisOptions)

      client.on('error', (error: any) => {
        logger.error(
          `[redis] client error host=${logContext.host} port=${logContext.port} cluster=${logContext.isCluster} tls=${logContext.tls} type=${logContext.type}: ${error?.message ?? error}`,
          error?.stack
        )
      })
      client.once('ready', () => {
        logger.debug(
          `[redis] connected host=${logContext.host} port=${logContext.port} cluster=${logContext.isCluster} tls=${logContext.tls} type=${logContext.type}`
        )
      })

      return client
    }
  }
}
