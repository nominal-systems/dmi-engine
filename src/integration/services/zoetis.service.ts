import { Injectable } from '@nestjs/common';
import {
  Breed,
  Gender,
  Order,
  PdfResults,
  ProviderService,
  Result,
  Service,
  Species,
  Test,
} from './interfaces/provider-service';
import { Zoetis } from './interfaces/zoetis';

@Injectable()
export class ZoetisProviderService
  implements ProviderService<Zoetis>, PdfResults<Zoetis> {
  createOrder(data: Zoetis): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getBatchOrders(data: Zoetis): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getBatchResults(data: Zoetis): Promise<Result[]> {
    throw new Error('Method not implemented.');
  }
  getOrder(data: Zoetis): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getOrderResult(data: Zoetis): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  cancelOrder(data: Zoetis): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cancelOrderTest(data: Zoetis, tests: Test[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getServices(data: Zoetis): Promise<Service[]> {
    throw new Error('Method not implemented.');
  }
  getGenders(data: Zoetis): Promise<Gender[]> {
    throw new Error('Method not implemented.');
  }
  getSpecies(data: Zoetis): Promise<Species[]> {
    throw new Error('Method not implemented.');
  }
  getBreeds(data: Zoetis): Promise<Breed[]> {
    throw new Error('Method not implemented.');
  }
  getOrderResultPdf(data: Zoetis): Promise<Result> {
    throw new Error('Method not implemented.');
  }
}
