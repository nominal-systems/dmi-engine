export interface CreateOrderPayload {
  id: string
  patient: Patient
  client: Client
  notes: string
  tests: Test[]
  veterinarian: Client
  technician: string
  editable: boolean
}

export interface Client {
  id: string
  lastName: string
  firstName?: string
}

export interface Veterinarian {
  id: string
  lastName: string
  firstName?: string
}

export interface Patient {
  id: string
  lastName: string
  firstName?: string
  species: string
  gender: string
  birthdate: string
  breed: string
  weight: number
  weightUnits: string
}

export interface Test {
  code: string
}

export interface IdPayload {
  id: string
}

export interface OrderTestPayload {
  id: string
  tests: Test[]
}

export type NullPayloadPayload = null
