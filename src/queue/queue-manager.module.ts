import { BullModule, type BullModuleOptions } from '@nestjs/bull'
import { type DynamicModule, Logger, Module, type Provider } from '@nestjs/common'
import { QueueManager } from './queue-manager.service'
import { QueueManagerController } from './queue-manager.controller'
import { JobOptions } from 'bull'
import { QueueManagerJobOptions } from './queue-manager.interface'
import { BullQueueModule } from '../bull/bull-queue.module'

@Module({})
export class QueueManagerModule {
  static register(
    providerIntegrations: Record<
      string,
      {
        queues: BullModuleOptions[]
        providerModule: DynamicModule
        disabled?: boolean
        options?: QueueManagerJobOptions
      }
    >
  ): DynamicModule {
    const logger = new Logger('QueueManagerModule')

    const enabledProviderIntegrations = Object.values(providerIntegrations).filter((pi) => pi.disabled !== true)
    const providerModules = enabledProviderIntegrations.map((pi) => pi.providerModule)

    const queues: BullModuleOptions[] = enabledProviderIntegrations.reduce<BullModuleOptions[]>((acc, pi) => {
      return acc.concat(pi.queues)
    }, [])

    // Extract all queue names for our BullQueueModule
    const queueNames: string[] = queues.map((q) => q.name).filter((name): name is string => typeof name === 'string')
    logger.debug(`Registering ${queueNames.length} queues: ${queueNames.join(', ')}`)

    const queueModules: any[] = queues.map((queue) => BullModule.registerQueue(queue))
    const queueProviders: Provider[] = queues.map((queue) => ({
      provide: `${queue.name}Queue`,
      useFactory: (queueService) => queueService.getQueue(queue.name),
      inject: [QueueManager]
    }))

    const providerJobOptions: Record<string, JobOptions | undefined> = {}
    for (const providerId in providerIntegrations) {
      if (
        providerIntegrations[providerId] !== undefined &&
        providerIntegrations[providerId].disabled !== true &&
        providerIntegrations[providerId].options !== undefined
      ) {
        providerJobOptions[providerId] = providerIntegrations[providerId].options
      }
    }

    return {
      module: QueueManagerModule,
      imports: [
        // Use the BullQueueModule that respects Redis connectivity
        BullQueueModule.registerAsync(queueNames),
        ...queueModules,
        ...providerModules
      ],
      providers: [
        QueueManager,
        ...queueProviders,
        {
          provide: 'QUEUE_NAMES',
          useValue: queues.map((queue) => queue.name)
        },
        {
          provide: 'JOB_OPTIONS',
          useValue: providerJobOptions
        }
      ],
      controllers: [QueueManagerController],
      exports: [QueueManager]
    }
  }
}
