import {
  HttpService,
  Injectable,
  Logger,
  NotImplementedException
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import {
  Breed,
  Gender,
  Service,
  Species
} from '../../common/interfaces/provider-service'
import { ReferenceDataResponse } from '../../common/interfaces/reference-data-response'
import {
  AntechBreed,
  AntechTest,
  AntechSpecie
} from './interfaces/antech-ref-data.interface'
import {
  AntechIntegrationOptions,
  AntechMessageData,
  AntechProviderConfiguration
} from './interfaces/antech-message-data.interface'

interface AntechRequestParams {
  url?: string
  data?: any
  providerConfiguration: AntechProviderConfiguration
  integrationOptions: AntechIntegrationOptions
}

@Injectable()
export class AntechService {
  private readonly logger = new Logger(AntechService.name)

  constructor (private readonly httpService: HttpService) {}

  async getServices (
    payload: any,
    metadata: AntechMessageData
  ): Promise<ReferenceDataResponse<Service>> {
    const { providerConfiguration, integrationOptions } = metadata

    const url = `${providerConfiguration.baseUrl}/api/v1.1/External/ServiceList`

    const response = await this.makeGetRequest<AntechTest[]>({
      integrationOptions,
      providerConfiguration,
      url
    })

    return {
      items: response.map(test => {
        return {
          code: test.Mnemonic,
          name: test.Description,
          category: test.Category,
          price: test.Price,
          type: test.CodeType
        }
      })
    }
  }

  async getBreeds (
    payload: any,
    metadata: AntechMessageData
  ): Promise<ReferenceDataResponse<Breed>> {
    const { providerConfiguration, integrationOptions } = metadata

    const url = `${providerConfiguration.baseUrl}/api/v1.1/Pets/Breeds`

    const response = await this.makeGetRequest<AntechBreed[]>({
      url,
      integrationOptions,
      providerConfiguration
    })

    return {
      items: response.map(item => ({
        id: item.ID.toString(),
        name: item.Name,
        speciesId: item.SpeciesId.toString()
      }))
    }
  }

  async getGenders (
    payload: any,
    metadata: AntechMessageData
  ): Promise<ReferenceDataResponse<Gender>> {
    throw new RpcException(new NotImplementedException())
  }

  async getSpecies (
    payload: any,
    metadata: AntechMessageData
  ): Promise<ReferenceDataResponse<Species>> {
    const { providerConfiguration, integrationOptions } = metadata

    const url = `${providerConfiguration.baseUrl}/api/v1.1/Pets/Species`

    const response = await this.makeGetRequest<AntechSpecie[]>({
      url,
      integrationOptions,
      providerConfiguration
    })

    const filteredSpecies = response.filter(
      (species, index, self) =>
        index === self.findIndex(s => s.ID === species.ID)
    )

    return {
      items: filteredSpecies.map(item => ({
        id: item.ID.toString(),
        name: item.Name
      }))
    }
  }

  private async login ({
    providerConfiguration,
    integrationOptions
  }: AntechRequestParams): Promise<string> {
    const { baseUrl, ...rest } = providerConfiguration
    const url = `${baseUrl}/api/v1.1/Users/login`

    const { data } = await this.httpService
      .post(url, {
        ...rest,
        ...integrationOptions
      })
      .toPromise()

    return data.Token
  }

  private async makeGetRequest<T = any> ({
    url,
    providerConfiguration,
    integrationOptions
  }: AntechRequestParams) {
    if (url == null) {
      throw new RpcException(
        'An error occurred while making the request. No URL specified.'
      )
    }

    const accessToken = await this.login({
      providerConfiguration,
      integrationOptions
    })

    const { data } = await this.httpService
      .get<T>(url + `?accessToken=${accessToken}`)
      .toPromise()

    return data
  }

  private async makePostRequest<T = any> ({
    url,
    data,
    providerConfiguration,
    integrationOptions
  }: AntechRequestParams) {
    if (url == null) {
      throw new RpcException(
        'An error occurred while making the request. No URL specified.'
      )
    }

    const accessToken = await this.login({
      providerConfiguration,
      integrationOptions
    })

    try {
      const response = await this.httpService
        .post<T>(url + `?accessToken=${accessToken}`, data)
        .toPromise()

      return response.data
    } catch (error) {
      throw new RpcException({
        statusCode: error.response.status,
        type: RpcException.name,
        ...error.response.data
      })
    }
  }
}
