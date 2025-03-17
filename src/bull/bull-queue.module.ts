import { DynamicModule, Logger, Module, OnModuleInit } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { RedisConnectionService } from './redis-connection.service'
import { BullModuleOptionsFactory } from './bull-module-options.factory'

@Module({
  imports: [],
  providers: [RedisConnectionService],
  exports: [RedisConnectionService]
})
export class BullQueueModule implements OnModuleInit {
  private readonly logger = new Logger(BullQueueModule.name)

  constructor(
    private readonly redisConnectionService: RedisConnectionService,
    private readonly moduleRef: ModuleRef
  ) {}

  /**
   * Registers the BullModule with all required queues after Redis is available
   */
  static registerAsync(queueNames: string[]): DynamicModule {
    return {
      module: BullQueueModule,
      imports: [
        BullModule.forRootAsync({
          inject: [ConfigService],
          useFactory: BullModuleOptionsFactory
        })
      ],
      providers: [
        RedisConnectionService,
        {
          provide: 'QUEUE_NAMES',
          useValue: queueNames
        }
      ],
      exports: [BullModule, RedisConnectionService]
    }
  }

  async onModuleInit() {
    this.logger.debug('BullQueueModule initializing, waiting for Redis connection...')

    // Wait for Redis to be available before registering queues
    const isConnected = await this.redisConnectionService.waitForRedisConnection()

    if (!isConnected) {
      this.logger.warn('Redis connection not established, queues may not function properly')
      return
    }

    // Get list of queue names from the module
    const queueNames = this.moduleRef.get('QUEUE_NAMES', { strict: false })
    if (queueNames === undefined || !Array.isArray(queueNames) || queueNames.length === 0) {
      this.logger.debug('No queues to register')
      return
    }

    this.logger.debug(`Redis connection established, registering ${queueNames.length} queues: ${queueNames.join(', ')}`)

    // Queues are already registered by BullModule.registerQueue() in QueueManagerModule,
    // but we're ensuring Redis is connected before they're used
  }
}
