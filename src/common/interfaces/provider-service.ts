import {
  CreateOrderPayload,
  IdPayload,
  NewIntegrationPayload,
  NullPayloadPayload,
  OrderTestPayload
} from './payloads'

export enum ResultModality {
  InHouse = 'in-house',
  LabReference = 'lab-reference'
}

export interface Order {
  externalId: string
  status: string
  manifestUri?: string | null
  submissionUri?: string | null
}

export interface Service {
  code: string
  name: string
  category?: string
  type?: string
  price?: number
  currency?: string
}

export interface Species {
  id: string
  name: string
}

export interface Gender {
  id: string
  name: string
}

export interface Breed {
  id: string
  name: string
  speciesId: string
}

export interface Test {
  code: string
}

export interface Result {
  id: string
  orderId: string
  status: string
  modality: string
  updatedAt?: string
  createdAt?: string
  results: ResultItem[]
}

export interface ResultItem {
  code: string
  name: string
  notes: string
  runDate: string
  sampleType: string
  items: AnalyteResult[]
}

export interface AnalyteResult {
  code: string
  analyte: string
  name: string
  status: string
  indicator: string
  result: {
    type: string
    valueText: string
    valueNumber: string
  }
  low: number
  high: number
  criticalLow: number
  criticalHigh: number
  units: string
  notes: string
}

export interface ProviderConfiguration {
  [key: string]: any
}

export interface IntegrationOptions {
  [key: string]: any
}

export type Payload =
  | CreateOrderPayload
  | NewIntegrationPayload
  | IdPayload
  | OrderTestPayload
  | NullPayloadPayload

export interface IMetadata {
  providerConfiguration: ProviderConfiguration
  integrationOptions: IntegrationOptions
}

export interface IPayload<T extends Payload> {
  payload: T
}

export interface ProviderService<T extends IMetadata> {
  createOrder: (payload: CreateOrderPayload, metadata: T) => Promise<Order>
  getBatchOrders: (payload: NullPayloadPayload, metadata: T) => Promise<Order[]>
  getBatchResults: (payload: NullPayloadPayload, metadata: T) => Promise<Result[]>
  getOrder: (payload: IdPayload, metadata: T) => Promise<Order>
  getOrderResult: (payload: IdPayload, metadata: T) => Promise<Result>
  cancelOrder: (payload: IdPayload, metadata: T) => Promise<void>
  cancelOrderTest: (payload: OrderTestPayload, metadata: T) => Promise<void>
  getServices: (payload: NullPayloadPayload, metadata: T) => Promise<Service[]>
  getGenders: (payload: NullPayloadPayload, metadata: T) => Promise<Gender[]>
  getSpecies: (payload: NullPayloadPayload, metadata: T) => Promise<Species[]>
  getBreeds: (payload: NullPayloadPayload, metadata: T) => Promise<Breed[]>
}

export interface PdfResults<T extends IMetadata> {
  getOrderResultPdf: (payload: IdPayload, metadata: T) => Promise<Result>
}

export interface OrderEdits<T extends IMetadata> {
  editOrder: (payload: IdPayload, metadata: T) => Promise<Result>
}

export interface Manifest<T extends IMetadata> {
  getOrderManifest: (payload: IdPayload, metadata: T) => Promise<Result>
}

export interface SubmissionUrl<T extends IMetadata> {
  getOrderSubmissionUrl: (payload: IdPayload, metadata: T) => Promise<Result>
}

export interface NewTests<T extends IMetadata> {
  addOrderTest: (payload: OrderTestPayload, metadata: T) => Promise<void>
}
