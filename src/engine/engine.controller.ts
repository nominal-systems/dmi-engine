import { Controller, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  type IExistingIntegrationJobMetadata,
  type IMetadata,
  type INewIntegrationJobMetadata,
  Operation,
  type ProviderIntegrationAdmin,
  Resource
} from '@nominal-systems/dmi-engine-common'
import { Ctx, MessagePattern, type MqttContext, Payload } from '@nestjs/microservices'
import { QueueService } from '../services/queue.service'

@Controller('engine')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  })
)
export class EngineController implements ProviderIntegrationAdmin {
  constructor(private readonly queueService: QueueService) {}

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Create}`)
  async handleNewIntegration(
    @Payload() jobData: INewIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    await this.queueService.startPollingJobsForIntegration(providerId, jobData.data)
  }

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Remove}`)
  async handleIntegrationDelete(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    await this.queueService.stopPollingJobsForIntegration(providerId, jobData.data)
  }

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Update}`)
  async handleIntegrationUpdate(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    await this.queueService.updatePollingJobsForIntegration(providerId, jobData.data)
  }
}
