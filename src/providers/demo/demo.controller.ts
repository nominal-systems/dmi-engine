import { InjectQueue } from '@nestjs/bull'
import {
  Controller,
  Logger,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { Queue } from 'bull'
import { ApiEvent } from '../../common/events/api-event'
import {
  Operation,
  Provider,
  ProviderIntegration,
  Resource
} from '../../common/interfaces/provider-integration'
import {
  Breed,
  Gender,

  Order,
  Result,
  Service,
  Species
} from '../../common/interfaces/provider-service'
import { DemoProviderService } from './demo.service'
import { DemoMetadata } from './interfaces/demo'

@Controller(`integration/${Provider.Demo}`)
export class DemoController implements ProviderIntegration {
  constructor (
    private readonly configService: ConfigService,
    private readonly providerService: DemoProviderService,
    @InjectQueue('results') private readonly resultsQueue: Queue,
    @InjectQueue('orders') private readonly ordersQueue: Queue
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Orders}.${Operation.Create}`)
  async createOrder (@Payload() msg: ApiEvent): Promise<Order> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending createOrder() request to '${Provider.Demo}'`)
    return await this.providerService.createOrder(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Orders}.${Operation.Cancel}`)
  async cancelOrder (@Payload() msg: ApiEvent): Promise<void> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending cancelOrder() request to '${Provider.Demo}'`)
    return await this.providerService.cancelOrder(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(
    `${Provider.Demo}.${Resource.Orders}.${Operation.TestsCancel}`
  )
  async cancelOrderTest (@Payload() msg: ApiEvent): Promise<void> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending cancelOrderTest() request to '${Provider.Demo}'`)
    return await this.providerService.cancelOrderTest(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Orders}.${Operation.Batch}`)
  async getBatchOrders (@Payload() msg: ApiEvent): Promise<Order[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getBatchOrders() request to '${Provider.Demo}'`)
    return await this.providerService.getBatchOrders(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(
    `${Provider.Demo}.${Resource.Orders}.${Operation.ResultsBatch}`
  )
  async getBatchResults (@Payload() msg: ApiEvent): Promise<Result[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getBatchResults() request to '${Provider.Demo}'`)
    return await this.providerService.getBatchResults(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Breeds}.${Operation.List}`)
  async getBreeds (@Payload() msg: ApiEvent): Promise<Breed[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getBreeds() request to '${Provider.Demo}'`)
    return await this.providerService.getBreeds(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Genders}.${Operation.List}`)
  async getGenders (@Payload() msg: ApiEvent): Promise<Gender[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getGenders() request to '${Provider.Demo}'`)
    return await this.providerService.getGenders(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Orders}.${Operation.Get}`)
  async getOrder (@Payload() msg: ApiEvent): Promise<Order> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getOrder() request to '${Provider.Demo}'`)
    return await this.providerService.getOrder(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Orders}.${Operation.Results}`)
  async getOrderResult (@Payload() msg: ApiEvent): Promise<Result> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getOrderResult() request to '${Provider.Demo}'`)
    return await this.providerService.getOrderResult(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Services}.${Operation.List}`)
  async getServices (@Payload() msg: ApiEvent): Promise<Service[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getServices() request to '${Provider.Demo}'`)
    return await this.providerService.getServices(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern(`${Provider.Demo}.${Resource.Species}.${Operation.List}`)
  async getSpecies (@Payload() msg: ApiEvent): Promise<Species[]> {
    const { payload, providerConfiguration, integrationOptions } = msg.data
    const metadata: DemoMetadata = { providerConfiguration, integrationOptions }
    Logger.log(`Sending getSpecies() request to '${Provider.Demo}'`)
    return await this.providerService.getSpecies(payload, metadata)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @EventPattern(`${Provider.Demo}.${Resource.Integration}.${Operation.Create}`)
  async fetchResults (jobData: ApiEvent) {
    await this.resultsQueue.add(
      Provider.Demo,
      jobData,
      this.configService.get('jobs.results')
    )
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @EventPattern(`${Provider.Demo}.${Resource.Integration}.${Operation.Create}`)
  async fetchOrders (jobData: ApiEvent) {
    await this.ordersQueue.add(
      Provider.Demo,
      jobData,
      this.configService.get('jobs.orders')
    )
  }
}
