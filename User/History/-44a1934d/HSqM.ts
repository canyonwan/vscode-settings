export interface IGoodsItem {
  id: string
  name: string
}

// 商品分类root
interface IGoodsCates {
  id: string
  parentId?: any
  childrenList: IGoodsCateItem[]
  name: string
}

// 商品分类item
interface IGoodsCateItem {
  createTime: number
  name: string
  updateTime: number
  id: number
  childrenList: string[]
  parentId: number
  status: number
}
