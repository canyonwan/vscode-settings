export interface IGoodsItem {
  id: string
  name: string
}

// 商品分类root
export interface IGoodsCates {
  id: string
  parentId?: any
  childrenList: IGoodsCateItem[]
  name: string
}

// 商品分类item
export interface IGoodsCateItem {
  createTime: number
  name: string
  updateTime: number
  id: string
  childrenList: string[]
  parentId: number
  status: number
}

//

export interface IGoodsPage {
  page: number
  size: number
  total: number
  contents: IGoodsContent[]
}

export interface IGoodsContent {
  id: number
  name: string
  unitPrice: number
  meteringType: number
  meteringValue: number
  transport: string
  beforePhone: string
  afterPhone: string
  summary: string
  fileInfos: IGoodsFileItem[]
  goodsDetails: IGoodsDetail[]
  meteringNickname: string
  meteringOther: string
}

export interface IGoodsDetail {
  id: string
  mainId: string
  detailsTypeId: string
  detailsTypeName: string
  content: string
}

export interface IGoodsFileItem {
  fileId: string
  fileName: string
  halfFileUrl: string
  fileUrl: string
  fileType: number
  fileTypeName: string
  fileSize: string
  createTime: number
  status: number
  fileTotalPlaybackTime: string
}
