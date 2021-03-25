import { AnimalDetails } from './animal-details.interface'
import { Identification } from './identification.interface'

export interface LabReportWrapper {
  LabReport: LabReportRequests | LabReportResults
}

export interface LabReportRequestWrapper {
  LabReport: LabReportRequests
}

export interface LabReportResultWrapper {
  LabReport: LabReportResults
}

export interface LabReport {
  Identification: Identification
  AnimalDetails: AnimalDetails
}

export interface LabReportRequests extends LabReport {
  LabRequests: LabRequests
}

export interface LabReportResults extends LabReport {
  LabResults: LabResults
}

// Wrapper
export interface LabRequests {
  LabRequest: LabRequest[]
}

export interface LabRequest {
  TestCode: string
  DeviceID?: string
  RequestNotes?: string
}

// Wrapper
export interface LabResults {
  LabResult: LabResult[]
}

export interface LabResult {
  LabResultHeader: LabResultHeader
  LabResultItems: LabResultItems
}

export interface LabResultHeader {
  TestCode: string
  TestName: string
  TestType: string
  ResultDate: string
  ResultStatus: string
  ResultNotes?: string
  DeviceID?: string
}

// Wrapper
export interface LabResultItems {
  LabResultItem: LabResultItem[]
}

export interface LabResultItem {
  AnalyteCode: string
  AnalyteName: string
  Result: string
  Units?: string
  LowRange?: string
  HighRange?: string
  ResultText?: string
}
