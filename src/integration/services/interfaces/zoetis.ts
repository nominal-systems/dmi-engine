import { IData, ProviderConfiguration } from './provider-service'

export interface Zoetis extends IData {
  providerConfiguration: ZoetisProviderConfiguration
  integrationOptions: ZoetisIntegrationOptions
}

export interface ZoetisProviderConfiguration extends ProviderConfiguration {
  url: string
  partnerId: string
  partnerToken: string
}

export interface ZoetisIntegrationOptions extends ProviderConfiguration {
  clientId: string
}
