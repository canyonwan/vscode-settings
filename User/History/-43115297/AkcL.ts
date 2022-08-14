import type { IResultPage } from '@/utils/axios/types'
import http from '@/utils/axios/index'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICauseAttrItemType, ICauseManageSearchType, ICauseSubListItemType, IPrimaryCauseItemType, ISaveCause, ISubCauseBaseAttrType } from '@/api/cause-manage/types'
import type { ILawItemType, ILawTagType } from '@/api/law/types'

// 违法行为维护
const ServerName = RequestServerEnum.CauseManage

/**
 * @Title 违法行为维护
 * @desc 7.分页查询违法行为维护列表(维护使用)
 * @param params
 */
// export function queryCauseManageList(params: any): Promise<IResultPage<IPrimaryCauseItemType[]>> {
//   return http.request({
//     url: `${ServerName}cause/manage/info/law`,
//     method: RequestEnum.POST,
//     data: params
//   })
// }

export function queryCauseManageList(params: ICauseManageSearchType): Promise<IResultPage<ICauseSubListItemType[]>> {
  return http.request({
    url: `${ServerName}causeSub/list`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * @Title 违法行为维护 -> 主案由详情
 * @desc 查询该主案由下的所有案由标签
 */
export function queryCauseTagsFromPrimaryCause(causeId: string): Promise<ILawTagType[]> {
  return http.request({
    url: `${ServerName}causeTagBinding/case/list/${causeId}`,
    method: RequestEnum.GET
  })
}
/**
 * @Title 违法行为维护 -> 子案由详情
 * @desc  查询子案由已经绑定全部案由法
 */
export function queryCauseLawsFromSubCause(causeId: string): Promise<ILawItemType[]> {
  return http.request({
    url: `${ServerName}causeSubBindingCaseType/causeSubLaw/list/${causeId}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护 -> 主案由详情
 * @desc 查询该主案由下的所有绑定的部门类型
 */
export function queryDepartmentTypesFromPrimaryCause(causeId: string): Promise<ILawTagType[]> {
  return http.request({
    url: `${ServerName}causeDepartmentBinding/case/list/${causeId}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护 -> 编辑案由
 * @desc 为当前主案由绑定案由标签
 */
export function bindCauseTagsForPrimaryCause(params: any): Promise<void> {
  return http.request(
    {
      url: `${ServerName}/causeTagBinding/info`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/**
 * @Title 违法行为维护 -> 编辑案由
 * @desc 为当前主案由绑定部门类型
 */
export function bindDepartmentTypeForPrimaryCause(params: any): Promise<void> {
  return http.request(
    {
      url: `${ServerName}/causeDepartmentBinding/info`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc  删除主案由
 */
export function deletePrimaryCause(causeId: string): Promise<void> {
  return http.request(
    {
      url: `${ServerName}/cause/info/${causeId}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc  保存案由标签
 * @param params
 */
export function saveCauseTags(params: ILawTagType): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeTag/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
/**
 * @Title 违法行为维护
 * @desc  保存案由(新增编辑)
 * @param params
 */
export function saveCause(params: IPrimaryCauseItemType): Promise<void> {
  return http.request(
    {
      url: `${ServerName}cause/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 获取所有案由标签
 */
export function queryAllCauseTags(): Promise<ILawTagType[]> {
  return http.request({
    url: `${ServerName}causeTag/list`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 删除案由标签
 */
export function deleteCauseTag(id: number): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeTag/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 查询指定案由标签内容
 */
export function queryAssignCauseTag(causeTagId: string): Promise<ILawTagType> {
  return http.request({
    url: `${ServerName}causeTag/info/${causeTagId}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 查询指定ids案由标签内容
 */
export function queryCauseTagsWithIds(ids: string[]): Promise<ILawTagType[]> {
  return http.request({
    url: `${ServerName}causeTag/info/idList`,
    method: RequestEnum.POST,
    data: ids
  })
}

/**
 * @Title 违法行为维护
 * @desc 删除子案由
 */
export function deleteSubCause(subCauseId: string): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeSub/info/${subCauseId}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 获取案由详情
 */
export function queryCauseDetail(id: string): Promise<ICauseSubListItemType> {
  return http.request({
    url: `${ServerName}causeSub/info/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 保存子案由
 */
export function saveSubCause(params: ISaveCause): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeSub/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 子案由下对应的基本属性内容
 */
export function querySubCauseBaseAttr(id: string): Promise<ISubCauseBaseAttrType[]> {
  return http.request({
    url: `${ServerName}causeAttrData/info/getBasicAttrContent/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * @Title 违法行为维护
 * @desc 修改子案由下对应的基本属性内容
 */
export function saveSubCauseBaseAttr(params: ICauseAttrItemType): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeAttrData/info`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 删除子案由下对应的基本属性内容
 */
export function deleteSubCauseBaseAttr(id: string): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeAttrData/info/${id}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * @Title 违法行为维护
 * @desc 删除子案由下对应的基本属性内容
 */
export function sortBaseAttr(params: any): Promise<void> {
  return http.request(
    {
      url: `${ServerName}causeAttrData/sort`,
      method: RequestEnum.PUT,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
