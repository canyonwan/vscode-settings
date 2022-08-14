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

interface CaseTypeList {
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

interface List {
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

interface ICauseBaseAttr {
  attrId: string
  attrName: string
  attrData: AttrDatum[]
  caseTypeId?: any
}

interface AttrDatum {
  id: string
  groupDifferentiation: number
  sortId: number
  causeBasicAttrId: string
  lawId?: any
  dataGroup: number
  caseSubLawBindingId: string
  content: string
}

interface LawList {
  id: string
  lawName: string
}
