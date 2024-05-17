import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { EngineController } from './engine/engine.controller'
import { QueueService } from './services/queue.service'
import { BullModule } from '@nestjs/bull'
import { WisdomPanelModule } from '@nominal-systems/dmi-engine-wisdom-panel-integration'
import { AntechV6Module } from '@nominal-systems/dmi-engine-antech-v6-integration'

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
    BullModule.registerQueue({ name: 'wisdom-panel.results' }, { name: 'wisdom-panel.orders' }),
    WisdomPanelModule,
    BullModule.registerQueue({ name: 'antech-v6.results' }, { name: 'antech-v6.orders' }),
    AntechV6Module
  ],
  providers: [QueueService],
  controllers: [EngineController]
})
export class AppModule {}
