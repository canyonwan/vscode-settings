export const serveName = 'open/'

export interface IPage {
  pageIndex: number
  pageSize: number
  dataCount: number
  data: IPageData[]
}

export interface IPageData {
  id: number
  documentNumber: string
  cause: string
  relativeName: string
  punishOrganname: string
  punishOrgancode: number
  punishArriveddate: string
  punishDate: string
  punishType: string
  punishResult: string
  orgId: number
}

export interface ISearch {
  pageIndex: number
  pageSize: number
  startTime?: string
  endTime?: string
  documentNumber?: string
  relativeName?: string
}
