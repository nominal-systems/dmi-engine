import { IsNotEmpty } from 'class-validator'

export class ApiEvent {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  version: string

  @IsNotEmpty()
  type: string

  @IsNotEmpty()
  data: ApiEventData
}

export interface ApiEventData {
  providerConfiguration?: any
  integrationOptions?: any
  payload?: any
}
