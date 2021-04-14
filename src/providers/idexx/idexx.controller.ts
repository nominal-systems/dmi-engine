import {
  Controller,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ApiEvent } from '../../common/events/api-event'
import { ExceptionFilter } from '../../common/filters/exception-filter'
import {
  Operation,
  Provider,
  Resource
} from '../../common/interfaces/provider-integration'
import {
  Breed,
  Gender,
  Order,
  Service,
  Species
} from '../../common/interfaces/provider-service'
import { ReferenceDataResponse } from '../../common/interfaces/reference-data-response'
import { IdexxService } from './idexx.service'
import { IdexxMessageData } from './interfaces/idexx-message-data.interface'

@Controller('idexx')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  })
)
@UseFilters(ExceptionFilter)
export class IdexxController {
  private readonly logger = new Logger(IdexxController.name)

  constructor (private readonly idexxService: IdexxService) {}

  @MessagePattern(`${Provider.Idexx}.${Resource.Orders}.${Operation.Get}`)
  async getOrder (msg: ApiEvent<IdexxMessageData>): Promise<Order> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getOrder() request to '${Provider.Idexx}'`)

    return await this.idexxService.getOrder(payload, metadata)
  }

  @MessagePattern(`${Provider.Idexx}.${Resource.Orders}.${Operation.Create}`)
  async createOrder (msg: ApiEvent<IdexxMessageData>): Promise<Order> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending createOrder() request to '${Provider.Idexx}'`)

    return await this.idexxService.createOrder(payload, metadata)
  }

  @MessagePattern(`${Provider.Idexx}.${Resource.Orders}.${Operation.Cancel}`)
  async cancelOrder (msg: ApiEvent<IdexxMessageData>): Promise<void> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending cancelOrder() request to '${Provider.Idexx}'`)

    return await this.idexxService.cancelOrder(payload, metadata)
  }

  @MessagePattern(`${Provider.Idexx}.${Resource.Services}.${Operation.List}`)
  async getServices (
    msg: ApiEvent<IdexxMessageData>
  ): Promise<ReferenceDataResponse<Service>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getServices() request to '${Provider.Idexx}'`)

    return await this.idexxService.getServices(payload, metadata)
  }

  @MessagePattern(`${Provider.Idexx}.${Resource.Breeds}.${Operation.List}`)
  async getBreeds (
    msg: ApiEvent<IdexxMessageData>
  ): Promise<ReferenceDataResponse<Breed>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getBreeds() request to '${Provider.Idexx}'`)

    return await this.idexxService.getBreeds(payload, metadata)
  }

  @MessagePattern(`${Provider.Idexx}.${Resource.Genders}.${Operation.List}`)
  async getGenders (
    msg: ApiEvent<IdexxMessageData>
  ): Promise<ReferenceDataResponse<Gender>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getGenders() request to '${Provider.Idexx}'`)

    return await this.idexxService.getGenders(payload, metadata)
  }

  @MessagePattern(`${Provider.Idexx}.${Resource.Species}.${Operation.List}`)
  async getSpecies (
    msg: ApiEvent<IdexxMessageData>
  ): Promise<ReferenceDataResponse<Species>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getSpecies() request to '${Provider.Idexx}'`)

    return await this.idexxService.getSpecies(payload, metadata)
  }
}
