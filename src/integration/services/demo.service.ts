import { Injectable } from '@nestjs/common';
import { Demo } from './interfaces/demo';
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
  Test,
} from './interfaces/provider-service';

@Injectable()
export class ZoetisProviderService
  implements
    ProviderService<Demo>,
    PdfResults<Demo>,
    OrderEdits<Demo>,
    Manifest<Demo>,
    SubmissionUrl<Demo>,
    NewTests<Demo> {
  createOrder(data: Demo): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getBatchOrders(data: Demo): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getBatchResults(data: Demo): Promise<Result[]> {
    throw new Error('Method not implemented.');
  }
  getOrder(data: Demo): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getOrderResult(data: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  cancelOrder(data: Demo): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cancelOrderTest(data: Demo): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getServices(data: Demo): Promise<Service[]> {
    throw new Error('Method not implemented.');
  }
  getGenders(data: Demo): Promise<Gender[]> {
    throw new Error('Method not implemented.');
  }
  getSpecies(data: Demo): Promise<Species[]> {
    throw new Error('Method not implemented.');
  }
  getBreeds(data: Demo): Promise<Breed[]> {
    throw new Error('Method not implemented.');
  }
  getOrderResultPdf(data: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  editOrder(data: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  getOrderManifest(data: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  getOrderSubmissionUrl(data: Demo): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  addOrderTest(data: Demo): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
