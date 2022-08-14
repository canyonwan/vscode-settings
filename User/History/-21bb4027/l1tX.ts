export const serveName = 'open/'

export interface IPage {
  pageIndex: number
  pageSize: number
  dataCount: number
  data: ILicenseItem[]
}

export interface ILicenseItem {
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
