import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { APP_FILTER } from '@nestjs/core'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
import { AntechV6Module } from '@nominal-systems/dmi-engine-antech-v6-integration'
import { EngineController } from './engine/engine.controller'
import { QueueService } from './services/queue.service'
import { BullModule } from '@nestjs/bull'

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
    BullModule.registerQueue({ name: 'antech-v6.results' }, { name: 'antech-v6.orders' }),
    AntechV6Module
  ],
  providers: [
    QueueService,
    {
      provide: APP_FILTER,
      useClass: CustomRpcExceptionFilter
    }
  ],
  controllers: [EngineController]
})
export class AppModule {}
