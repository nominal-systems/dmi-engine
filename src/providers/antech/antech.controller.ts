import { InjectQueue } from '@nestjs/bull'
import {
  Controller,
  Logger,
  NotImplementedException,
  UseFilters,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MessagePattern } from '@nestjs/microservices'
import { Queue } from 'bull'
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
  Service,
  Species
} from '../../common/interfaces/provider-service'
import { ReferenceDataResponse } from '../../common/interfaces/reference-data-response'
import { AntechService } from './antech.service'
import { AntechMessageData } from './interfaces/antech-message-data.interface'

const PROVIDER_NAME = Provider.Antech

@Controller('idexx')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  })
)
@UseFilters(ExceptionFilter)
export class AntechController /* implements ProviderIntegration */ {
  private readonly logger = new Logger(AntechController.name)

  constructor (
    private readonly configService: ConfigService,
    private readonly antechService: AntechService,
    @InjectQueue(`${PROVIDER_NAME}.results`)
    private readonly resultsQueue: Queue
  ) {}

  @MessagePattern(`${PROVIDER_NAME}.${Resource.Services}.${Operation.List}`)
  async getServices (
    msg: ApiEvent<AntechMessageData>
  ): Promise<ReferenceDataResponse<Service>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getServices() request to '${PROVIDER_NAME}'`)

    return await this.antechService.getServices(payload, metadata)
  }

  @MessagePattern(`${PROVIDER_NAME}.${Resource.Breeds}.${Operation.List}`)
  async getBreeds (
    msg: ApiEvent<AntechMessageData>
  ): Promise<ReferenceDataResponse<Breed>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getBreeds() request to '${PROVIDER_NAME}'`)

    return await this.antechService.getBreeds(payload, metadata)
  }

  @MessagePattern(`${PROVIDER_NAME}.${Resource.Genders}.${Operation.List}`)
  async getGenders (
    msg: ApiEvent<AntechMessageData>
  ): Promise<ReferenceDataResponse<Gender>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getGenders() request to '${PROVIDER_NAME}'`)

    return await this.antechService.getGenders(payload, metadata)
  }

  @MessagePattern(`${PROVIDER_NAME}.${Resource.Species}.${Operation.List}`)
  async getSpecies (
    msg: ApiEvent<AntechMessageData>
  ): Promise<ReferenceDataResponse<Species>> {
    const { payload, ...metadata } = msg.data

    this.logger.log(`Sending getSpecies() request to '${PROVIDER_NAME}'`)

    return await this.antechService.getSpecies(payload, metadata)
  }
}
