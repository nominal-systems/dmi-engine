import { Injectable, Logger, HttpService } from '@nestjs/common';
import {
  Client,
  CreateOrderPayload,
  IdPayload,
  OrderTestPayload,
  Patient,
  Veterinarian,
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
import { XmlService } from '../xml-service';
import {
  AnimalDetails,
  Identification,
  LabReportRequestWrapper,
  LabRequests,
} from './zoetis.interface';

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
    // @TODO Remove trace
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

    const getName = (client: Client | Patient | Veterinarian): string => {
      const { lastName, firstName } = client;
      let name = lastName;
      if (firstName) name += ', ' + firstName;
      return name;
    };

    function getIdentification(payload: CreateOrderPayload): Identification {
      return {
        ReportType: 'Request',
        PracticeID: 'Practice1',
        ClientId: clientId,
        PracticeRef: practiceRef,
        LaboratoryRef: '1',
        OwnerName: getName(payload.client),
        OwnerID: payload.client.id,
        VetName: getName(payload.veterinarian),
        VetID: payload.veterinarian.id,
      };
    }

    function getAnimalDetails(payload: CreateOrderPayload): AnimalDetails {
      const patient = payload.patient;
      return {
        AnimalID: patient.id,
        AnimalName: getName(patient),
        Species: getSpeciesMapping(patient.species),
        Breed: getBreedMapping(patient.breed),
        Gender: getGenderMapping(patient.gender),
        DateOfBirth: patient.birthdate,
      };
    }

    function getLabRequests(payload: CreateOrderPayload): LabRequests {
      return {
        LabRequest: [
          {
            TestCode: 'HEM',
          },
        ],
      };
      // return {
      //   LabRequest: payload.tests.map((test) => {
      //     return {
      //       TestCode: test.code,
      //     };
      //   }),
      // };
    }

    function getSpeciesMapping(species: string) {
      return species;
    }

    function getBreedMapping(breed: string) {
      return breed;
    }

    function getGenderMapping(gender: string) {
      return gender;
    }

    const obj: LabReportRequestWrapper = {
      LabReport: {
        Identification: getIdentification(payload),
        AnimalDetails: getAnimalDetails(payload),
        LabRequests: getLabRequests(payload),
      },
    };

    const xml = this.xmlService.convertObjectToXml(obj);
    console.log(xml);

    const response = await this.httpService
      .post(url, xml, {
        auth,
        headers: {
          'Content-Type': 'application/xml',
        },
      })
      .toPromise();

    const responseObj = this.xmlService.convertXmlToObject(response.data);
    console.log(responseObj);

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
