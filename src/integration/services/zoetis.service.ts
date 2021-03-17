import { Injectable } from '@nestjs/common';
import {
  Breed,
  Gender,
  Order,
  ProviderService,
  Result,
  Service,
  Species,
  Test,
} from '../interfaces/provider-service';

@Injectable()
export class ZoetisProviderService implements ProviderService {
  supportsPdf = true;
  supportsEdits = false;
  supportsManifest = false;
  supportsSubmissionUrl = false;

  createOrder(order: any): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getBatchOrders(): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getBatchResults(): Promise<Result[]> {
    throw new Error('Method not implemented.');
  }
  getOrder(id: string): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getOrderResult(id: string): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  getOrderResultPdf(id: string): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  getOrderManifest(id: string): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  getOrderSubmissionUrl(id: string): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  cancelOrder(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cancelOrderTest(id: string, tests: Test[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  addOrderTest(id: string, tests: Test[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getServices(): Promise<Service[]> {
    throw new Error('Method not implemented.');
  }
  getGenders(): Promise<Gender[]> {
    throw new Error('Method not implemented.');
  }
  getSpecies(): Promise<Species[]> {
    throw new Error('Method not implemented.');
  }
  getBreeds(): Promise<Breed[]> {
    throw new Error('Method not implemented.');
  }
}
