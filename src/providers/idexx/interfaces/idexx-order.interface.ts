export interface IdexxOrder {
  diagnosticImagingLocationId?: string
  editable: boolean
  idexxOrderId: string
  notes?: string
  patients: IdexxPatient[]
  pdfURL?: string
  petOwnerBilling: boolean
  prevRefNum?: string
  specimenCollectionDate?: string
  status: IdexxOrderStatus
  technician?: string
  tests?: string[]
  uiURL?: string
  veterinarian?: string
}

export enum IdexxOrderStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  CANCELLED = 'CANCELLED'
}

export interface IdexxPatient {
  birthdate?: string
  breedCode?: string
  client: IdexxClient
  genderCode: string
  kennelClub?: IdexxKennelClub
  microchip?: string
  name: string
  patientAgeMonths?: number
  patientAgeYears?: number
  patientId: string
  speciesCode: string
  weight?: IdexxWeight
}

export interface IdexxClient {
  address?: IdexxAddress
  firstName?: string
  id?: string
  isDoctor?: boolean
  isStaff?: boolean
  lastName: string
}

export interface IdexxAddress {
  city?: string
  country?: string
  email?: string
  phone?: string
  postalCode?: string
  stateProvince?: string
  street1?: string
  street2?: string
}

export interface IdexxKennelClub {
  id?: string
  name?: string
}

export interface IdexxWeight {
  measurement?: number
  units?: IdexxWeightUnits
}

export enum IdexxWeightUnits {
  KG = 'KILOGRAMS',
  LB = 'POUNDS',
  OZ = 'OUNCES'
}
