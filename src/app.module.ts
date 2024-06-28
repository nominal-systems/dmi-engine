import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { EngineController } from './engine/engine.controller'
import { BullModule } from '@nestjs/bull'
import { WisdomPanelModule } from '@nominal-systems/dmi-engine-wisdom-panel-integration'
import { AntechV6Module } from '@nominal-systems/dmi-engine-antech-v6-integration'
import { QueueModule } from './queue/queue.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: configService.get('redis'),
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true
        }
      }),
      inject: [ConfigService]
    }),
    QueueModule.register([
      {
        provider: 'antech-v6',
        queues: [{ name: 'antech-v6.results' }, { name: 'antech-v6.orders' }],
        providerModule: AntechV6Module.register()
      },
      {
        provider: 'wisdom-panel',
        queues: [{ name: 'wisdom-panel.results' }, { name: 'wisdom-panel.orders' }],
        providerModule: WisdomPanelModule.register()
      }
    ])
  ],
  providers: [],
  controllers: [EngineController]
})
export class AppModule {}
