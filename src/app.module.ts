import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { DemoModule } from './demo/demo.module'
import { IdexxModule } from './idexx/idexx.module'
import { ZoetisModule } from './zoetis/zoetis.module'

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
        }
      }),
      inject: [ConfigService]
    }),
    DemoModule,
    ZoetisModule,
    IdexxModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
