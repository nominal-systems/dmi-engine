import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { EngineController } from './engine/engine.controller'
import { WisdomPanelModule } from '@nominal-systems/dmi-engine-wisdom-panel-integration'
import { AntechV6Module } from '@nominal-systems/dmi-engine-antech-v6-integration'
import { QueueManagerModule } from './queue/queue-manager.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
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
