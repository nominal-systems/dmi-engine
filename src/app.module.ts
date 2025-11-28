import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { EngineController } from './engine/engine.controller'
import { BullModule } from '@nestjs/bull'
import { WisdomPanelModule } from '@nominal-systems/dmi-engine-wisdom-panel-integration'
import { AntechV6Module } from '@nominal-systems/dmi-engine-antech-v6-integration'
import { QueueManagerModule } from './queue/queue-manager.module'
import Redis, { type RedisOptions } from 'ioredis'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
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

        const baseRedisOptions: RedisOptions = {
          host: redis.host,
          port: redis.port,
          ...auth,
          ...(tls !== undefined ? { tls } : {}),
          enableReadyCheck: false,
          maxRetriesPerRequest: null
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

        return {
          createClient: () =>
            redis.isCluster
              ? new Redis.Cluster(
                [
                  {
                    host: redis.host,
                    port: redis.port
                  }
                ],
                {
                  redisOptions: baseRedisOptions
                }
              )
              : new Redis(baseRedisOptions),
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
