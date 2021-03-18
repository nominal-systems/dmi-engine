import {
  Client,
  CreateOrderPayload,
  Patient,
  Veterinarian,
} from '../../interfaces/payloads';
import {
  Identification,
  AnimalDetails,
  LabRequests,
  LabReportRequestWrapper,
} from '../zoetis.interface';

export function getOrder(
  id: string,
  clientId: string,
  payload: CreateOrderPayload,
): LabReportRequestWrapper {
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
      PracticeRef: id,
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
      LabRequest: payload.tests.map((test) => {
        return {
          TestCode: test.code,
        };
      }),
    };
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

  return {
    LabReport: {
      Identification: getIdentification(payload),
      AnimalDetails: getAnimalDetails(payload),
      LabRequests: getLabRequests(payload),
    },
  };
}
