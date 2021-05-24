import {
  IMetadata,
  ProviderConfiguration
} from '../../../common/interfaces/provider-service'

export interface AntechMessageData<Payload = any> extends IMetadata {
  providerConfiguration: AntechProviderConfiguration
  integrationOptions: AntechIntegrationOptions
  payload?: Payload
}

export interface AntechProviderConfiguration extends ProviderConfiguration {
  UserName: string
  Password: string
  baseUrl: string
}

export interface AntechIntegrationOptions extends ProviderConfiguration {
  ClinicID: string
}
