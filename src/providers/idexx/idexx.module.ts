import { HttpModule, Module } from '@nestjs/common'
import { IdexxController } from './idexx.controller'
import { IdexxService } from './idexx.service'

@Module({
  imports: [HttpModule],
  controllers: [IdexxController],
  providers: [IdexxService]
})
export class IdexxModule {}
