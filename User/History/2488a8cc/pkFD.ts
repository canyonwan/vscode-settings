// 法基本信息(案由法)
export interface ILawType {
  total: number
  size: number
  contents: Array<ILawItemType>
  page: number
}
export interface ILawItemType {
  releaseTime: any
  regionBinding: string
  lawName: string
  becomesEffectiveTime: any
  releaseDepartment: string
  id?: string
  lawTypeId: string
  lawTypeName: string
  executeTime: any
  noPunishmentTips: any
  lawTagList?: Array<string>
}

// 法标签类型
export interface ILawTagType {
  id?: string
  parentId: string
  name: string
  code: string
  remarks: string
  list?: Array<ILawTagType>
}
