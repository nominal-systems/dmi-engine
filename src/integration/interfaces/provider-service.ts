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

export interface ProviderService {
  supportsPdf: boolean;
  supportsEdits: boolean;
  supportsManifest: boolean;
  supportsSubmissionUrl: boolean;

  createOrder(order: any): Promise<Order>;
  getBatchOrders(): Promise<Order[]>;
  getBatchResults(): Promise<Result[]>;
  getOrder(id: string): Promise<Order>;
  getOrderResult(id: string): Promise<Result>;
  getOrderResultPdf(id: string): Promise<Result>;
  getOrderManifest(id: string): Promise<Result>;
  getOrderSubmissionUrl(id: string): Promise<Result>;
  cancelOrder(id: string): Promise<void>;
  cancelOrderTest(id: string, tests: Test[]): Promise<void>;
  addOrderTest(id: string, tests: Test[]): Promise<void>;
  getServices(): Promise<Service[]>;
  getGenders(): Promise<Gender[]>;
  getSpecies(): Promise<Species[]>;
  getBreeds(): Promise<Breed[]>;
}
