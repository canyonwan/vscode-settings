// 商品

export interface IGoodsItem {
  name: string
  unitPrice: number
  meteringType: number
  meteringValue: number
  transport: string
  beforePhone: string
  afterPhone: string
  summary: string
  fileInfos: IGoodsFileInfo[]
  goodsDetails: IGoodsDetail[]
  meteringNickname: string
  meteringOther: string
  fileIds: string[]
  id: string
  goodsTypeId: string
}

export interface IGoodsDetail {
  id: string
  mainId: string
  detailsTypeId: string
  detailsTypeName: string
  content: string
}

export interface IGoodsFileInfo {
  fileId: string
  fileName: string
  halfFileUrl: string
  fileUrl: string
  fileType: number
  fileTypeName: string
  fileSize: string
  fileTotalPlaybackTime: string
}
