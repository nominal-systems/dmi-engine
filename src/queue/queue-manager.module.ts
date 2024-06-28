import { BullModule, type BullModuleOptions } from '@nestjs/bull'
import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { QueueManager } from './queue-manager.service'
import { QueueManagerController } from './queue-manager.controller'

@Module({})
export class QueueManagerModule {
  static register(
    providerIntegrations: Array<{
      provider: string
      queues: BullModuleOptions[]
      providerModule: DynamicModule
      disabled?: boolean
    }>
  ): DynamicModule {
    const enabledProviderIntegrations = providerIntegrations.filter((pi) => pi.disabled !== true)
    const queues: BullModuleOptions[] = enabledProviderIntegrations.reduce<BullModuleOptions[]>((acc, pi) => {
      return acc.concat(pi.queues)
    }, [])
    const externalModule = enabledProviderIntegrations.map((pi) => pi.providerModule)

    const queueModules: any[] = queues.map((queue) => BullModule.registerQueue(queue))
    const queueProviders: Provider[] = queues.map((queue) => ({
      provide: `${queue.name}Queue`,
      useFactory: (queueService) => queueService.getQueue(queue.name),
      inject: [QueueManager]
    }))

    return {
      module: QueueManagerModule,
      imports: [...queueModules, ...externalModule],
      providers: [
        QueueManager,
        ...queueProviders,
        {
          provide: 'QUEUE_NAMES',
          useValue: queues.map((queue) => queue.name)
        }
      ],
      controllers: [QueueManagerController],
      exports: [QueueManager]
    }
  }
}
