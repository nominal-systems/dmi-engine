import { HttpService, Injectable } from '@nestjs/common';
import {
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload
} from '../interfaces/payloads';
import {
  Breed,
  Gender,
  Order,
  PdfResults,
  ProviderService,
  Result,
  Service,
  Species
} from '../interfaces/provider-service';
import { Zoetis } from '../interfaces/zoetis';
import { XmlService } from '../xml-service';
import { getOrder } from './helpers/zoetis-order.helper';

@Injectable()
export class ZoetisProviderService
  implements ProviderService<Zoetis>, PdfResults<Zoetis> {
  constructor(
    private httpService: HttpService,
    private xmlService: XmlService,
  ) {}

  async createOrder(
    payload: CreateOrderPayload,
    metadata: Zoetis,
  ): Promise<Order> {
    const baseUrl = metadata.providerConfiguration.url;
    const url = `${baseUrl}/vetsync/v1/orders`;
    const auth = {
      username: metadata.providerConfiguration.partnerId,
      password: metadata.providerConfiguration.partnerToken,
    };
    const practiceRef = payload.id;
    const clientId = metadata.integrationOptions.clientId;
    const order = getOrder(practiceRef, clientId, payload);
    const xml = this.xmlService.convertObjectToXml(order);

    await this.httpService
      .post(url, xml, {
        auth,
        headers: {
          'Content-Type': 'application/xml',
        },
      })
      .toPromise()

    return {
      externalId: practiceRef,
      manifestUri: null,
      submissionUri: null,
      status: 'pending',
    };
  }
  getBatchOrders(payload: null, metadata: Zoetis): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getBatchResults(payload: null, metadata: Zoetis): Promise<Result[]> {
    throw new Error('Method not implemented.');
  }
  getOrder(payload: IdPayload, metadata: Zoetis): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getOrderResult(payload: IdPayload, metadata: Zoetis): Promise<Result> {
    throw new Error('Method not implemented.');
  }
  cancelOrder(payload: IdPayload, metadata: Zoetis): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cancelOrderTest(payload: OrderTestPayload, metadata: Zoetis): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getServices(payload: null, metadata: Zoetis): Promise<Service[]> {
    throw new Error('Method not implemented.');
  }
  getGenders(payload: null, metadata: Zoetis): Promise<Gender[]> {
    throw new Error('Method not implemented.');
  }
  getSpecies(payload: null, metadata: Zoetis): Promise<Species[]> {
    throw new Error('Method not implemented.');
  }
  getBreeds(payload: null, metadata: Zoetis): Promise<Breed[]> {
    throw new Error('Method not implemented.');
  }
  getOrderResultPdf(payload: IdPayload, metadata: Zoetis): Promise<Result> {
    throw new Error('Method not implemented.');
  }
}
