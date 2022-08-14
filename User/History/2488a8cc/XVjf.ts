import type { IFileItem } from '../program/types'

// 法基本信息(违法行为法)
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
  code?: string
  remarks: string
  fileIdList?: string[] // 文件id集合
  fileList?: IFileItem[]
  list?: Array<ILawTagType>
}
// 违法行为类型
export interface ICauseType {
  id: string
  name: string
}
