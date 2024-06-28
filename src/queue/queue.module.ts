import { BullModule, type BullModuleOptions } from '@nestjs/bull'
import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { QueueModuleService } from './queue-module.service'
import { QueueController } from './queue.controller'

@Module({})
export class QueueModule {
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
      inject: [QueueModuleService]
    }))

    return {
      module: QueueModule,
      imports: [...queueModules, ...externalModule],
      providers: [
        QueueModuleService,
        ...queueProviders,
        {
          provide: 'QUEUE_NAMES',
          useValue: queues.map((queue) => queue.name)
        }
      ],
      controllers: [QueueController],
      exports: [QueueModuleService]
    }
  }
}
