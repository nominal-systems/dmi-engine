export interface AntechTest {
  CodeID: number
  LabID: number
  CodeType: AntechTestCodeType
  Mnemonic: string
  Description: string
  Price: number
  Category: AntechCategory
}

export enum AntechCategory {
  AvianExotic = 'Avian & Exotic',
  Chemistry = 'Chemistry',
  CytoHisto = 'Cyto/Histo',
  EarlyDetection = 'Early Detection',
  Empty = '',
  Endocrinology = 'Endocrinology',
  Equine = 'Equine',
  FastPanel = 'FastPanel',
  Fecal = 'Fecal',
  Hematology = 'Hematology',
  Immunology = 'Immunology',
  Microbiology = 'Microbiology',
  PreOpScreen = 'Pre-Op Screen',
  Serology = 'Serology',
  Superchem = 'Superchem',
  Tdm = 'TDM',
  Toxicology = 'Toxicology',
  Urine = 'Urine',
  VetScreen = 'Vet Screen'
}

export enum AntechTestCodeType {
  P = 'P',
  U = 'U'
}

export interface AntechBreed {
  ID: number
  Name: string
  SpeciesId: number
}

export interface AntechSpecie {
  ID: number
  Name: string
  Breed: AntechBreed
}
