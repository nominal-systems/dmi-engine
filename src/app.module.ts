import { DemoModule } from '@nominal-systems/dmi-engine-demo-provider'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { APP_FILTER } from '@nestjs/core'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT')
        },
        defaultJobOptions: { removeOnComplete: true }
      }),
      inject: [ConfigService]
    }),
    DemoModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: CustomRpcExceptionFilter }
  ]
})
export class AppModule {}
