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
  id: number
  childrenList: string[]
  parentId: number
  status: number
}
