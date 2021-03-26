import {
  IData,
  ProviderConfiguration
} from '../../../common/interfaces/provider-service'
import {
  PIMS_ID_HEADER_NAME,
  PIMS_VERSION_HEADER_NAME
} from '../constants/idexx-api-headers.constant'

export interface IdexxMessageData<Payload = any> extends IData {
  providerConfiguration: IdexxProviderConfiguration
  integrationOptions: IdexxIntegrationOptions
  payload?: Payload
}

export interface IdexxProviderConfiguration extends ProviderConfiguration {
  orderingBaseUrl: string
  resultBaseUrl: string
  username: string
  password: string
}

export interface IdexxIntegrationOptions extends ProviderConfiguration {
  [PIMS_ID_HEADER_NAME]: string
  [PIMS_VERSION_HEADER_NAME]: string
}
