import { BullModule } from '@nestjs/bull'
import { HttpModule, Module } from '@nestjs/common'
import { Provider } from '../../common/interfaces/provider-integration'
import { IdexxController } from './idexx.controller'
import { IdexxService } from './idexx.service'

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: `${Provider.Idexx}.results`
    })
  ],
  controllers: [IdexxController],
  providers: [IdexxService]
})
export class IdexxModule {}
