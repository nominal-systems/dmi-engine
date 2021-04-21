import { InjectQueue } from '@nestjs/bull'
import {
  Body,
  Controller,
  Logger,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { Queue } from 'bull'
import { ApiEvent } from '../../../common/events/api-event'
import {
  INewIntegrationJobMetadata,
  Operation,
  Provider,
  ProviderIntegration,
  Resource
} from '../../../common/interfaces/provider-integration'
import {
  Breed,
  Gender,
  IMetadata,
  Order,
  Result,
  Service,
  Species
} from '../../../common/interfaces/provider-service'
import { ZoetisMetadata } from '../interfaces/metadata.interface'
import { ZoetisProviderService } from '../zoetis.service'

@Controller(`integration/${Provider.Zoetis}`)
export class ZoetisController implements ProviderIntegration {
  constructor (
    private readonly configService: ConfigService,
    private readonly providerService: ZoetisProviderService,
    @InjectQueue(`${Provider.Zoetis}.results`) private readonly resultsQueue: Queue,
    @InjectQueue(`${Provider.Zoetis}.orders`) private readonly ordersQueue: Queue
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Create}`)
  async createOrder (@Payload() msg: ApiEvent): Promise<Order> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending createOrder() request to '${Provider.Zoetis}'`)
    return await this.providerService.createOrder(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Cancel}`)
  async cancelOrder (@Payload() msg: ApiEvent): Promise<void> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending cancelOrder() request to '${Provider.Zoetis}'`)
    return await this.providerService.cancelOrder(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(
    `${Provider.Zoetis}.${Resource.Orders}.${Operation.TestsCancel}`
  )
  async cancelOrderTest (@Payload() msg: ApiEvent): Promise<void> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending cancelOrderTest() request to '${Provider.Zoetis}'`)
    return await this.providerService.cancelOrderTest(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Batch}`)
  async getBatchOrders (@Payload() msg: ApiEvent): Promise<Order[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getBatchOrders() request to '${Provider.Zoetis}'`)
    return await this.providerService.getBatchOrders(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(
    `${Provider.Zoetis}.${Resource.Orders}.${Operation.ResultsBatch}`
  )
  async getBatchResults (@Payload() msg: ApiEvent): Promise<Result[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getBatchResults() request to '${Provider.Zoetis}'`)
    return await this.providerService.getBatchResults(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Breeds}.${Operation.List}`)
  async getBreeds (@Payload() msg: ApiEvent): Promise<Breed[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getBreeds() request to '${Provider.Zoetis}'`)
    return await this.providerService.getBreeds(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Genders}.${Operation.List}`)
  async getGenders (@Payload() msg: ApiEvent): Promise<Gender[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getGenders() request to '${Provider.Zoetis}'`)
    return await this.providerService.getGenders(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Get}`)
  async getOrder (@Payload() msg: ApiEvent): Promise<Order> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getOrder() request to '${Provider.Zoetis}'`)
    return await this.providerService.getOrder(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Orders}.${Operation.Results}`)
  async getOrderResult (@Payload() msg: ApiEvent): Promise<Result> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getOrderResult() request to '${Provider.Zoetis}'`)
    return await this.providerService.getOrderResult(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Services}.${Operation.List}`)
  async getServices (@Payload() msg: ApiEvent): Promise<Service[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getServices() request to '${Provider.Zoetis}'`)
    return await this.providerService.getServices(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Zoetis}.${Resource.Species}.${Operation.List}`)
  async getSpecies (@Payload() msg: ApiEvent): Promise<Species[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: ZoetisMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getSpecies() request to '${Provider.Zoetis}'`)
    return await this.providerService.getSpecies(payload, metadata)
  }

  async fetchResults (@Body() jobData: any) {
    throw new Error('Not implemented')
  }

  async fetchOrders (@Body() jobData: any) {
    throw new Error('Not implemented')
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @EventPattern(`${Provider.Zoetis}.${Resource.Integration}.${Operation.Create}`)
  async handleNewIntegration (jobData: INewIntegrationJobMetadata<IMetadata>) {
    await this.ordersQueue.add(
      jobData,
      this.configService.get('jobs.orders')
    )

    await this.resultsQueue.add(
      jobData,
      this.configService.get('jobs.results')
    )
  }
}
