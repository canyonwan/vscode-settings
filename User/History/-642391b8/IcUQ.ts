import http from '@/utils/axios/index'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { IUnlawfulActTagLeaf, ISearchUnlawfulActTree } from './types'

const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 案由浏览
 * @desc 案由tree 违法行为选择标签列表--新接口
 * @desc 接口ID：26802150
 *
 */
export function queryUnlawfulActTagTree(params: ISearchUnlawfulActTree): Promise<IUnlawfulActTagLeaf[]> {
  return http.request({
    url: `${ServerName}causeTag/list/filterCauseTag`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * @Title 案由浏览
 * @desc 案由tree 违法行为查询
 * @desc 接口ID：27010153
 *
 */
export function queryUnlawfulActList(params: ISearchUnlawfulActTree): Promise<IUnlawfulActTagLeaf[]> {
  return http.request({
    url: `${ServerName}causeSub/list/cause/byCauseTag`,
    method: RequestEnum.POST,
    data: params
  })
}
export interface IUnlawfulActItem {
  groupName: string
  id: string
  name: string
  lawList: LawList[]
  identifier: string
  attrAndDataList: ICauseBaseAttr[]
  caseTypeList: CaseTypeList[]
  groupId?: any
}

export interface CaseTypeList {
  id: string
  parentId: string
  programTypeId?: string
  programTypeName?: any
  dataType?: any
  whetherParentUseType: number
  name: string
  causeSubLawGroupId?: any
  remarks: string
  list: List[]
}

export interface List {
  id: string
  parentId: string
  programTypeId: string
  programTypeName: string
  dataType?: any
  whetherParentUseType: number
  name: string
  causeSubLawGroupId?: any
  remarks: string
  list: any[]
}

// 案由的属性和内容集合
export interface ICauseBaseAttr {
  attrId: string
  attrName: string
  attrData: IAttrDataItem[]
  caseTypeId?: any
}

export interface IAttrDataItem {
  id: string
  groupDifferentiation: number
  sortId: number
  causeBasicAttrId: string
  lawId?: string
  dataGroup: number
  caseSubLawBindingId: string
  content: string
}

export interface LawList {
  id: string
  lawName: string
}
