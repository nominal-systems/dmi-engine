import {
  CreateOrderPayload,
  IdPayload,
  NullPayloadPayload,
  OrderTestPayload,
} from './payloads';

export enum ResultModality {
  InHouse = 'in-house',
  LabReference = 'lab-reference',
}

export interface Order {
  externalId: string;
  status: string;
  manifestUri: string;
  submissionUri: string;
}

export interface Service {
  code: string;
  name: string;
  category: string;
  type: string;
  price: number;
  currency: string;
}

export interface Species {
  id: string;
  name: string;
}

export interface Gender {
  id: string;
  name: string;
}

export interface Breed {
  id: string;
  name: string;
  speciesId: string;
}

export interface Test {
  code: string;
}

export interface Result {
  id: string;
  orderId: string;
  status: string;
  modality: string;
  updatedAt: string;
  createdAt: string;
  results: ResultItem[];
}

export interface ResultItem {
  code: string;
  name: string;
  notes: string;
  runDate: string;
  sampleType: string;
  items: AnalyteResult[];
}

export interface AnalyteResult {
  code: string;
  analyte: string;
  name: string;
  status: string;
  indicator: string;
  result: {
    type: string;
    valueText: string;
    valueNumber: string;
  };
  low: number;
  high: number;
  criticalLow: number;
  criticalHigh: number;
  units: string;
  notes: string;
}

export type ProviderConfiguration = {
  [key: string]: any;
};

export type IntegrationOptions = {
  [key: string]: any;
};

export type Payload =
  | CreateOrderPayload
  | IdPayload
  | OrderTestPayload
  | NullPayloadPayload;

export interface IData {
  providerConfiguration: ProviderConfiguration;
  integrationOptions: IntegrationOptions;
}

export interface IPayload<T extends Payload> {
  payload: T;
}

export interface ProviderService<T extends IData> {
  createOrder(payload: CreateOrderPayload, metadata: T): Promise<Order>;
  getBatchOrders(payload: NullPayloadPayload, metadata: T): Promise<Order[]>;
  getBatchResults(payload: NullPayloadPayload, metadata: T): Promise<Result[]>;
  getOrder(payload: IdPayload, metadata: T): Promise<Order>;
  getOrderResult(payload: IdPayload, metadata: T): Promise<Result>;
  cancelOrder(payload: IdPayload, metadata: T): Promise<void>;
  cancelOrderTest(payload: OrderTestPayload, metadata: T): Promise<void>;
  getServices(payload: NullPayloadPayload, metadata: T): Promise<Service[]>;
  getGenders(payload: NullPayloadPayload, metadata: T): Promise<Gender[]>;
  getSpecies(payload: NullPayloadPayload, metadata: T): Promise<Species[]>;
  getBreeds(payload: NullPayloadPayload, metadata: T): Promise<Breed[]>;
}

export interface PdfResults<T extends IData> {
  getOrderResultPdf(payload: IdPayload, metadata: T): Promise<Result>;
}

export interface OrderEdits<T extends IData> {
  editOrder(payload: IdPayload, metadata: T): Promise<Result>;
}

export interface Manifest<T extends IData> {
  getOrderManifest(payload: IdPayload, metadata: T): Promise<Result>;
}

export interface SubmissionUrl<T extends IData> {
  getOrderSubmissionUrl(payload: IdPayload, metadata: T): Promise<Result>;
}

export interface NewTests<T extends IData> {
  addOrderTest(payload: OrderTestPayload, metadata: T): Promise<void>;
}
