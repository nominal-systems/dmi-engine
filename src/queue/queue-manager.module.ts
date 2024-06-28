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
    }>
  ): DynamicModule {
    const queues: BullModuleOptions[] = providerIntegrations.reduce<BullModuleOptions[]>((acc, providerIntegration) => {
      return acc.concat(providerIntegration.queues)
    }, [])
    const externalModule = providerIntegrations.map((providerIntegration) => providerIntegration.providerModule)

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
