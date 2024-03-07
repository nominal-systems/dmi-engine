import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { APP_FILTER } from '@nestjs/core'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
import { AntechV6Module } from '@nominal-systems/dmi-engine-antech-v6-integration'
import { EngineController } from './engine/engine.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    AntechV6Module
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomRpcExceptionFilter
    }
  ],
  controllers: [EngineController]
})
export class AppModule {}
