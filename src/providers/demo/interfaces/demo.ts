import { IMetadata, ProviderConfiguration } from '../../../common/interfaces/provider-service'

export interface DemoMetadata extends IMetadata {
  providerConfiguration: DemoProviderConfiguration
  integrationOptions: DemoIntegrationOptions
}

export interface DemoProviderConfiguration extends ProviderConfiguration {
  url: string
}

export interface DemoIntegrationOptions extends ProviderConfiguration {
  apiKey: string
}
