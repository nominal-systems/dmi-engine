import { IdexxModule } from '@line-studio/dmi-engine-idexx-integration'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { AntechModule } from './providers/antech/antech.module'
import { DemoModule } from './providers/demo/demo.module'
import { ZoetisModule } from './providers/zoetis/zoetis.module'

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
    DemoModule,
    ZoetisModule,
    IdexxModule,
    AntechModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
