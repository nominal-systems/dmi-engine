import { IData, ProviderConfiguration } from '../common/interfaces/provider-service'

export interface Demo extends IData {
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
