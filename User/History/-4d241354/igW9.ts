// 商品
export interface IGoodsItem {
  id: number
  name: string
  unitPrice: number
  meteringType: number
  meteringValue: number
  transport: string
  beforePhone: string
  afterPhone: string
  summary: string
  fileInfos: any
  goodsDetails: any
}

interface RootObject {
  name: string
  unitPrice: number
  meteringType: number
  meteringValue: number
  transport: string
  beforePhone: string
  afterPhone: string
  summary: string
  fileInfos: FileInfo[]
  goodsDetails: GoodsDetail[]
  meteringNickname: string
  meteringOther: string
  fileIds: string[]
  id: string
  goodsTypeId: string
}

interface GoodsDetail {
  id: string
  mainId: string
  detailsTypeId: string
  detailsTypeName: string
  content: string
}

interface FileInfo {
  fileId: string
  fileName: string
  halfFileUrl: string
  fileUrl: string
  fileType: number
  fileTypeName: string
  fileSize: string
  fileTotalPlaybackTime: string
}
