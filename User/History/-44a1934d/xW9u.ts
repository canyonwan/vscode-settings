export interface IGoodsItem {
  id: string
  name: string
}

interface RootObject {
  id: string
  parentId?: any
  childrenList: ChildrenList[]
  name: string
}

interface ChildrenList {
  createTime: number
  name: string
  updateTime: number
  id: number
  childrenList: string[]
  parentId: number
  status: number
}
