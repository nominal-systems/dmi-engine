export interface IdexxResult {
  accessionId?: string
  categories: IdexxResultCategory[]
  delayStatus: IdexxResultDelayStatus
  diagnosticSetId?: string
  modality: string
  notes: IdexxResultNote
  orderId: number
  orderReceivedDate: string
  patient: IdexxResultPatient
  requisitionId: string
  resultId: string
  runSummaries: IdexxResultRunSummary[]
  specimenCollectionDate: string
  status: string
  statusDetail: string
  updatedAuditDate: string
  updatedDate: string
  veterinarian: string
}

export interface IdexxSearchResultResponse {
  count: number
  hasMoreResults: boolean
  results: IdexxResult[]
  start: number
}

export interface IdexxLatestResults {
  batchId: string
  count: number
  hasMoreResults: boolean
  results: IdexxResult[]
  timestamp: string
}

export interface IdexxResultCategory {
  categoryId: number
  code: string
  name: string
  notes: IdexxResultNote[]
  tests: IdexxResultCategoryTest[]
}

export interface IdexxResultNote {
  content: string
  title: string
}

export interface IdexxResultCategoryTest {
  analyte: string
  code: string
  criticalHigh: number
  criticalLow: number
  high: number
  low: number
  name: string
  notes: string[]
  outOfRange: boolean
  outOfRangeCode: string
  qualifier: string
  referenceRange: string
  result: string
  runSummaryId: string
  status: string
  units: string
}

export interface IdexxResultDelayStatus {
  delayed: boolean
  notificationPdfUrl: string
}

export interface IdexxResultPatient {
  age: number
  breedName: string
  clientFirstName: string
  clientId: string
  clientLastName: string
  genderName: string
  name: string
  patientId: string
  speciesCode: string
  speciesName: string
  yearOfBirth: string
}

export interface IdexxResultRunSummary {
  code: string
  id: string
  ivlsSerialNumber: string
  name: string
  runDate: string
  sampleType: string
}
