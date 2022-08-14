export const serveName = 'open/'
interface RootObject {
  pageIndex: number
  pageSize: number
  dataCount: number
  data: Datum[]
}

interface Datum {
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
