import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { EngineController } from './engine/engine.controller'
import { BullModule } from '@nestjs/bull'
import { WisdomPanelModule } from '@nominal-systems/dmi-engine-wisdom-panel-integration'
import { AntechV6Module } from '@nominal-systems/dmi-engine-antech-v6-integration'
import { QueueManagerModule } from './queue/queue-manager.module'
import Redis, { type ClusterOptions, type RedisOptions } from 'ioredis'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('Redis')
        const redis =
          configService.getOrThrow<RedisOptions & { isCluster: boolean, username?: string, password?: string }>('redis')

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
            : 5000
        const connectTimeoutMs =
          process.env.REDIS_CONNECT_TIMEOUT_MS !== undefined ? Number(process.env.REDIS_CONNECT_TIMEOUT_MS) : undefined

        const baseRedisOptions: RedisOptions = {
          host: redis.host,
          port: redis.port,
          ...auth,
          ...(tls !== undefined ? { tls } : {}),
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
          ...(connectTimeoutMs !== undefined && !Number.isNaN(connectTimeoutMs) ? { connectTimeout: connectTimeoutMs } : {})
        }

        console.log('[redis] config', {
          host: redis.host,
          port: redis.port,
          isCluster: redis.isCluster,
          username: username !== '' ? username : undefined,
          password: password !== '' ? '***' : undefined,
          tls: tls !== undefined
        })

        console.log('[redis] base options', {
          ...baseRedisOptions,
          password:
            baseRedisOptions.password !== undefined && baseRedisOptions.password !== '' ? '***' : undefined,
          username: baseRedisOptions.username ?? undefined,
          tls: tls !== undefined
        })

        const clusterOptions: ClusterOptions = {
          redisOptions: baseRedisOptions,
          slotsRefreshTimeout: Number.isNaN(slotsRefreshTimeoutMs) ? 5000 : slotsRefreshTimeoutMs,
          clusterRetryStrategy: (attempts: number) => Math.min(1000 * (attempts + 1), 10000)
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

            client.on('error', (error) => {
              console.error('[redis] client error', error)
            })
            client.once('ready', () => {
              logger.debug(
                `[redis] connected host=${logContext.host} port=${logContext.port} cluster=${logContext.isCluster} tls=${logContext.tls} type=${logContext.type}`
              )
            })

            return client
          },
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true
          }
        }
      },
      inject: [ConfigService]
    }),
    // TODO(gb): inject the ConfigService into the QueueManagerModule
    QueueManagerModule.register({
      'antech-v6': {
        queues: [{ name: 'antech-v6.results' }, { name: 'antech-v6.orders' }],
        providerModule: AntechV6Module.register(),
        disabled: process.env.ANTECH_V6_DISABLED === 'true' || false
      },
      'wisdom-panel': {
        queues: [{ name: 'wisdom-panel.results' }, { name: 'wisdom-panel.orders' }],
        providerModule: WisdomPanelModule.register(),
        disabled: process.env.WISDOM_PANEL_DISABLED === 'true' || false,
        options: {
          repeat: {
            every: 1000 * 60 * 10
          }
        }
      }
    })
  ],
  providers: [],
  controllers: [EngineController]
})
export class AppModule {}
