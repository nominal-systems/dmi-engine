export interface DemoOrderPayload {
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

export interface OrderResponse {
  editable: boolean
  id: string
  manifestUrl: string
  notes: string
  status: string
  technician?: string
  submissionUrl: string
}

export interface ResultResponse {
  id: string
  modality: string
  order: OrderResponse
  results: any[]
  status: string
}
