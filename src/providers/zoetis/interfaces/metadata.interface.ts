import { IMetadata, ProviderConfiguration } from '../../../common/interfaces/provider-service'

export interface ZoetisMetadata extends IMetadata {
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
