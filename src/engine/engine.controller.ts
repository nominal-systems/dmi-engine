import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  type IExistingIntegrationJobMetadata,
  type IMetadata,
  type INewIntegrationJobMetadata,
  Operation,
  type ProviderIntegrationAdmin,
  Resource
} from '@nominal-systems/dmi-engine-common'
import { Ctx, MessagePattern, type MqttContext, Payload, RpcException } from '@nestjs/microservices'
import { QueueManager } from '../queue/queue-manager.service'

@Controller('engine')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  })
)
export class EngineController implements ProviderIntegrationAdmin {
  private readonly logger = new Logger(EngineController.name)

  constructor(private readonly queueManager: QueueManager) {}

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Create}`)
  async handleNewIntegration(
    @Payload() jobData: INewIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    try {
      await this.queueManager.startPollingJobsForIntegration(providerId, jobData.data.payload.integrationId, jobData.data)
    } catch (err: any) {
      const message: string = err instanceof Error ? err.message : String(err)
      this.logger.error(`[engine] failed to start polling jobs for integration ${jobData.data.payload.integrationId} (${providerId}): ${message}`)
      throw new RpcException(message)
    }
  }

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Remove}`)
  async handleIntegrationDelete(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    try {
      await this.queueManager.stopPollingJobsForIntegration(providerId, jobData.data.payload.integrationId)
    } catch (err: any) {
      const message: string = err instanceof Error ? err.message : String(err)
      this.logger.error(`[engine] failed to stop polling jobs for integration ${jobData.data.payload.integrationId} (${providerId}): ${message}`)
      throw new RpcException(message)
    }
  }

  // TODO(gb): use a wildcard to match all providers
  @MessagePattern(`wisdom-panel/${Resource.Integration}/${Operation.Update}`)
  async handleIntegrationUpdate(
    @Payload() jobData: IExistingIntegrationJobMetadata<IMetadata>,
    @Ctx() context: MqttContext
  ): Promise<void> {
    const providerId = context.getTopic().split('/')[0]
    try {
      await this.queueManager.updatePollingJobsForIntegration(
        providerId,
        jobData.data.payload.integrationId,
        jobData.data
      )
    } catch (err: any) {
      const message: string = err instanceof Error ? err.message : String(err)
      this.logger.error(`[engine] failed to update polling jobs for integration ${jobData.data.payload.integrationId} (${providerId}): ${message}`)
      throw new RpcException(message)
    }
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
