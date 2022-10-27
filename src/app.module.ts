import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { APP_FILTER } from '@nestjs/core'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
import { WinstonModule } from 'nest-winston'
import { consoleTransport, fileTransport } from './config/winstonconfig'
import { DemoModule } from '@nominal-systems/dmi-engine-demo-provider-integration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    WinstonModule.forRoot({
      transports: [consoleTransport, fileTransport]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD')
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true
        }
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
