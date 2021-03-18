import { Injectable, Logger, HttpService } from '@nestjs/common';
import {
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload,
} from '../interfaces/payloads';
import {
  Breed,
  Gender,
  Order,
  PdfResults,
  ProviderService,
  Result,
  Service,
  Species,
} from '../interfaces/provider-service';
import { Zoetis } from '../interfaces/zoetis';

@Injectable()
export class ZoetisProviderService
  implements ProviderService<Zoetis>, PdfResults<Zoetis> {
  constructor(private httpService: HttpService) {}

  async createOrder(
    payload: CreateOrderPayload,
    metadata: Zoetis,
  ): Promise<Order> {
    Logger.debug(payload);
    Logger.debug(metadata);
    const baseUrl = metadata.providerConfiguration.url;
    const url = `${baseUrl}/vetsync/v1/orders`;
    const auth = {
      username: metadata.providerConfiguration.partnerId,
      password: metadata.providerConfiguration.partnerToken,
    };
    const practiceRef = payload.id;
    const clientId = metadata.integrationOptions.clientId;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <LabReport>
        <Identification>
          <ReportType>Request</ReportType>
          <PracticeID>Practice1</PracticeID>
          <ClientId>${clientId}</ClientId>
          <PracticeRef>${practiceRef}</PracticeRef>
          <LaboratoryRef>46</LaboratoryRef>
          <OwnerName>FUSE, Ezyvet</OwnerName>
          <OwnerID>4</OwnerID>
          <VetName>Corleone, Michael</VetName>
          <VetID>provider-1</VetID>
        </Identification>
        <AnimalDetails>
          <AnimalID>100004</AnimalID>
          <AnimalName>Rover</AnimalName>
          <Species>DOG</Species>
          <Breed>Labrador</Breed>
          <Gender>Male</Gender>
          <DateOfBirth>2013-08-03</DateOfBirth>
        </AnimalDetails>
        <LabRequests>
          <LabRequest>
            <TestCode>HEM</TestCode>
          </LabRequest>
        </LabRequests>
    </LabReport>`;
    const response = await this.httpService
      .post(url, xml, {
        auth,
        headers: {
          'Content-Type': 'application/xml',
        },
      })
      .toPromise();

    console.log(response.status);
    console.log(response.data);

    const order: Order = {
      externalId: practiceRef,
      manifestUri: null,
      submissionUri: null,
      status: 'pending',
    };

    return order;
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
