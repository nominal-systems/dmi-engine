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
import { QueueModuleService } from '../queue/queue-module.service'

@Controller('engine')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  })
)
export class EngineController implements ProviderIntegrationAdmin {
  constructor(private readonly queueService: QueueModuleService) {}

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Create}`)
  async handleNewIntegration(
    @Payload() jobData: INewIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    await this.queueService.startPollingJobsForIntegration(providerId, jobData.data.payload.integrationId, jobData.data)
  }

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Remove}`)
  async handleIntegrationDelete(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    await this.queueService.stopPollingJobsForIntegration(providerId, jobData.data.payload.integrationId)
  }

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Update}`)
  async handleIntegrationUpdate(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    await this.queueService.updatePollingJobsForIntegration(
      providerId,
      jobData.data.payload.integrationId,
      jobData.data
    )
  }

  // TODO(gb): remove this method once the wildcard is implemented
  @MessagePattern(`antech-v6/${Resource.Integration}/${Operation.Create}`)
  async handleNewIntegrationAntechV6(
    @Payload() jobData: INewIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    await this.handleNewIntegration(jobData, context)
  }

  // TODO(gb): remove this method once the wildcard is implemented
  @MessagePattern(`antech-v6/${Resource.Integration}/${Operation.Remove}`)
  async handleIntegrationDeleteAntechV6(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    await this.handleIntegrationDelete(jobData, context)
  }

  @MessagePattern(`antech-v6/${Resource.Integration}/${Operation.Update}`)
  async handleIntegrationUpdateAntechV6(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    await this.handleIntegrationUpdate(jobData, context)
  }
}
