import { Injectable } from '@nestjs/common';
import { Demo } from '../interfaces/demo';
import {
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload,
} from '../interfaces/payloads';
import {
  Breed,
  Gender,
  Manifest,
  NewTests,
  Order,
  OrderEdits,
  PdfResults,
  ProviderService,
  Result,
  Service,
  Species,
  SubmissionUrl,
} from '../interfaces/provider-service';

@Injectable()
export class ZoetisProviderService
  implements
    ProviderService<Demo>,
    PdfResults<Demo>,
    OrderEdits<Demo>,
    Manifest<Demo>,
    SubmissionUrl<Demo>,
    NewTests<Demo> {
  createOrder(payload: CreateOrderPayload, metadata: Demo): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getBatchOrders(payload: null, metadata: Demo): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getBatchResults(payload: null, metadata: Demo): Promise<Result[]> {
    throw new Error('Method not implemented.');
  }
  getOrder(payload: IdPayload, metadata: Demo): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getOrderResult(payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  cancelOrder(payload: IdPayload, metadata: Demo): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cancelOrderTest(payload: OrderTestPayload, metadata: Demo): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getServices(payload: null, metadata: Demo): Promise<Service[]> {
    throw new Error('Method not implemented.');
  }
  getGenders(payload: null, metadata: Demo): Promise<Gender[]> {
    throw new Error('Method not implemented.');
  }
  getSpecies(payload: null, metadata: Demo): Promise<Species[]> {
    throw new Error('Method not implemented.');
  }
  getBreeds(payload: null, metadata: Demo): Promise<Breed[]> {
    throw new Error('Method not implemented.');
  }
  getOrderResultPdf(payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  editOrder(payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  getOrderManifest(payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  getOrderSubmissionUrl(payload: IdPayload, metadata: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  addOrderTest(payload: OrderTestPayload, metadata: Demo): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
