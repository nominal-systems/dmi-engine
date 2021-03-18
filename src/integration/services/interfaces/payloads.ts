export type CreateOrderPayload = {
  id: string;
  patient: Patient;
  client: Client;
  notes: string;
  tests: Test[];
  veterinarian: Client;
  technician: string;
  editable: boolean;
};

export type Client = {
  id: string;
  lastName: string;
  firstName?: string;
};

export type Veterinarian = {
  id: string;
  lastName: string;
  firstName?: string;
};

export type Patient = {
  id: string;
  lastName: string;
  firstName?: string;
  species: string;
  gender: string;
  birthdate: string;
  breed: string;
  weight: number;
  weightUnits: string;
};

export type Test = {
  code: string;
};

export type IdPayload = {
  id: string;
};

export type OrderTestPayload = {
  id: string;
  tests: Test[];
};

export type NullPayloadPayload = null;
