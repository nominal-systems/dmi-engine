export interface IdexxRefDataResponse<Item = IdexxBaseRefDataItem> {
  list: Item[]
  version: string
}

export interface IdexxBaseRefDataItem {
  code: string
  name: string
}

export interface IdexxBreed extends IdexxBaseRefDataItem {
  speciesCode: string
}

export interface IdexxTest {
  code: string
  name: string
  listPrice?: string
  currencyCode?: string
  turnaround?: string
  specimen?: string
  addOn: boolean
  allowsBatch: boolean
  allowsAddOns: boolean
  displayCode: string
  inHouse: boolean
}
