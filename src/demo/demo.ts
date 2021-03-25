import { IMetadata, ProviderConfiguration } from '../common/interfaces/provider-service'

export interface DemoMetadata extends IMetadata {
  providerConfiguration: DemoProviderConfiguration
  integrationOptions: DemoIntegrationOptions
}

export interface DemoProviderConfiguration extends ProviderConfiguration {
  apiKey: string
}

export interface DemoIntegrationOptions extends ProviderConfiguration {
  practiceId: string
  resultTimeout: number
}
