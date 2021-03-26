import { HttpService, Injectable, Logger } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { CreateOrderPayload, IdPayload } from '../../common/interfaces/payloads'
import {
  Breed,
  Gender,
  Order,
  Service,
  Species
} from '../../common/interfaces/provider-service'
import { ReferenceDataResponse } from '../../common/interfaces/reference-data-response'
import { getFullName } from '../../common/utils/get-full-name.util'
import {
  PIMS_ID_HEADER_NAME,
  PIMS_VERSION_HEADER_NAME
} from './constants/idexx-api-headers.constant'
import { IdexxMessageData } from './interfaces/idexx-message-data.interface'
import {
  IdexxOrder,
  IdexxWeightUnits
} from './interfaces/idexx-order.interface'
import {
  IdexxBreed,
  IdexxRefDataResponse,
  IdexxTest
} from './interfaces/idexx-reference-data.interface'

@Injectable()
export class IdexxService {
  private readonly logger = new Logger(IdexxService.name)

  constructor (private readonly httpService: HttpService) {}

  async createOrder (
    payload: CreateOrderPayload,
    metadata: IdexxMessageData
  ): Promise<Order> {
    const {
      providerConfiguration: { username, password, orderingBaseUrl },
      integrationOptions
    } = metadata

    const url = `${orderingBaseUrl}/api/v1/order`

    const {
      editable,
      notes,
      patient,
      client,
      tests,
      veterinarian,
      technician
    } = payload

    const data: IdexxOrder = {
      editable,
      notes,
      tests: tests.map(test => test.code),
      technician,
      veterinarian: getFullName(veterinarian.firstName, veterinarian.lastName),
      petOwnerBilling: false,
      patients: [
        {
          name: getFullName(patient.firstName, patient.lastName),
          genderCode: patient.gender,
          patientId: patient.id,
          speciesCode: patient.species,
          birthdate: patient.birthdate,
          weight: {
            measurement: patient.weight,
            units: IdexxWeightUnits[patient.weightUnits]
          },
          client
        }
      ]
    }

    const response = await this.makePostRequest<NonNullable<IdexxOrder>>(
      {
        url,
        username,
        password,
        integrationOptions
      },
      data
    )

    this.logger.debug(JSON.stringify(response, null, 2))

    if (response.idexxOrderId == null || response.status == null) {
      throw new RpcException('An error occurred while processing the order')
    }

    return {
      externalId: response.idexxOrderId,
      status: response.status,
      submissionUri: response.uiURL
    }
  }

  async cancelOrder (
    payload: IdPayload,
    metadata: IdexxMessageData
  ): Promise<void> {
    const {
      providerConfiguration: { username, password, orderingBaseUrl },
      integrationOptions
    } = metadata

    const url = `${orderingBaseUrl}/api/v1/order/${payload.id}`

    const response = await this.makeDeleteRequest<Order>({
      url,
      username,
      password,
      integrationOptions
    })

    this.logger.debug(response)
  }

  async getBreeds (
    payload: any,
    metadata: IdexxMessageData
  ): Promise<ReferenceDataResponse<Breed>> {
    const {
      providerConfiguration: { username, password, orderingBaseUrl },
      integrationOptions
    } = metadata

    const url = `${orderingBaseUrl}/api/v1/ref/breeds`

    const response = await this.makeGetRequest<
      IdexxRefDataResponse<IdexxBreed>
    >({
      url,
      username,
      password,
      integrationOptions
    })

    const { list, version } = response

    return {
      items: list.map(item => ({
        id: item.code,
        name: item.name,
        speciesId: item.speciesCode
      })),
      hash: version
    }
  }

  async getGenders (
    payload: any,
    metadata: IdexxMessageData
  ): Promise<ReferenceDataResponse<Gender>> {
    const {
      providerConfiguration: { username, password, orderingBaseUrl },
      integrationOptions
    } = metadata

    const url = `${orderingBaseUrl}/api/v1/ref/genders`

    const response = await this.makeGetRequest<IdexxRefDataResponse>({
      url,
      username,
      password,
      integrationOptions
    })

    const { list, version } = response

    return {
      items: list.map(item => ({
        id: item.code,
        name: item.name
      })),
      hash: version
    }
  }

  async getSpecies (
    payload: any,
    metadata: IdexxMessageData
  ): Promise<ReferenceDataResponse<Species>> {
    const {
      providerConfiguration: { username, password, orderingBaseUrl },
      integrationOptions
    } = metadata

    const url = `${orderingBaseUrl}/api/v1/ref/species`

    const response = await this.makeGetRequest<IdexxRefDataResponse>({
      url,
      username,
      password,
      integrationOptions
    })

    const { list, version } = response

    const mapped = {
      items: list.map(item => ({
        id: item.code,
        name: item.name
      })),
      hash: version
    }

    return mapped
  }

  async getServices (
    payload: any,
    metadata: IdexxMessageData
  ): Promise<ReferenceDataResponse<Service>> {
    const {
      providerConfiguration: { username, password, orderingBaseUrl },
      integrationOptions
    } = metadata

    const url = `${orderingBaseUrl}/api/v1/ref/tests`

    const response = await this.makeGetRequest<IdexxRefDataResponse<IdexxTest>>(
      {
        url,
        username,
        password,
        integrationOptions
      }
    )

    const { list, version } = response

    return {
      items: list.map(item => ({
        code: item.code,
        name: item.name,
        currency: item.currencyCode,
        price: item.listPrice != null ? Number(item.listPrice) : undefined,
        type: item.inHouse ? 'IN_HOUSE' : 'PAID'
      })),
      hash: version
    }
  }

  private async makeGetRequest<T = any> ({
    url,
    username,
    password,
    integrationOptions
  }) {
    const { data } = await this.httpService
      .get<T>(url, {
        auth: {
          username,
          password
        },
        headers: {
          [PIMS_ID_HEADER_NAME]: integrationOptions[PIMS_ID_HEADER_NAME],
          [PIMS_VERSION_HEADER_NAME]:
            integrationOptions[PIMS_VERSION_HEADER_NAME]
        }
      })
      .toPromise()

    return data
  }

  private async makePostRequest<T = any> (
    { url, username, password, integrationOptions },
    data: any
  ) {
    this.logger.debug(JSON.stringify(data, null, 2))

    try {
      const { data: responseData } = await this.httpService
        .post<T>(url, data, {
          auth: {
            username,
            password
          },
          headers: {
            [PIMS_ID_HEADER_NAME]: integrationOptions[PIMS_ID_HEADER_NAME],
            [PIMS_VERSION_HEADER_NAME]:
              integrationOptions[PIMS_VERSION_HEADER_NAME]
          }
        })
        .toPromise()

      return responseData
    } catch (error) {
      throw new RpcException({
        statusCode: error.response.status,
        type: RpcException.name,
        ...error.response.data
      })
    }
  }

  private async makeDeleteRequest<T = any> ({
    url,
    username,
    password,
    integrationOptions
  }) {
    try {
      const { data } = await this.httpService
        .delete<T>(url, {
          auth: {
            username,
            password
          },
          headers: {
            [PIMS_ID_HEADER_NAME]: integrationOptions[PIMS_ID_HEADER_NAME],
            [PIMS_VERSION_HEADER_NAME]:
              integrationOptions[PIMS_VERSION_HEADER_NAME]
          }
        })
        .toPromise()

      return data
    } catch (error) {
      throw new RpcException({
        statusCode: error.response.status,
        type: RpcException.name,
        ...error.response.data
      })
    }
  }
}
