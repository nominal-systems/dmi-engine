import { BullModule, type BullModuleOptions } from '@nestjs/bull'
import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { QueueManager } from './queue-manager.service'
import { QueueManagerController } from './queue-manager.controller'
import { JobOptions } from 'bull'
import { QueueManagerJobOptions } from './queue-manager.interface'

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
    const enabledProviderIntegrations = Object.values(providerIntegrations).filter((pi) => pi.disabled !== true)
    const providerModules = enabledProviderIntegrations.map((pi) => pi.providerModule)

    const queues: BullModuleOptions[] = enabledProviderIntegrations.reduce<BullModuleOptions[]>((acc, pi) => {
      return acc.concat(pi.queues)
    }, [])
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
      imports: [...queueModules, ...providerModules],
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
