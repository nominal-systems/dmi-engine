import { AntechModule } from '@line-studio/dmi-engine-antech-integration'
import { DemoModule } from '@line-studio/dmi-engine-demo-provider'
import { IdexxModule } from '@line-studio/dmi-engine-idexx-integration'
import { ZoetisModule } from '@line-studio/dmi-engine-zoetis-integration'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'

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
