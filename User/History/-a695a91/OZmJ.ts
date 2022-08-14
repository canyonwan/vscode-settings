import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import type { IDictionaryType } from '@/api/setting/types'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'

const serverName = RequestServerEnum.BASE

/**
 * 字典数据查询(下拉框用)
 *@param {*参数} params
 * remarks: 描述
 * List<String> typeList: 类型集合 ['type','status']
 */
export function queryDictionaries(params): Promise<Recordable<IDictionaryType[]>> {
  return http.request({
    url: `${serverName}dictionaries/queryDictionaries`,
    method: RequestEnum.GET,
    params: params
    // headers: { ignoreCancelToken: true }
  })
}

/**
 * 字典数据查询(分页用)
 *@param {*参数} params
 * remarks: 描述
 * List<Integer> statusList: 状态集合 [1,2,3]
 * List<String> typeList: 类型集合 ['type','status']
 */
export function queryDictionariesForList(params: any): Promise<IResultPage<IDictionaryType[]>> {
  return http.request({
    url: `${serverName}dictionaries/queryDictionariesForPage`,
    method: RequestEnum.POST,
    data: params
  })
}
/**
 * 字典数据查询(下拉框用)
 /**
 * 字典数据保存
 *@param {*参数} params
 * String hiddenValue;// 隐藏值
 * String displayValue;// 显示值
 * String type;// 类型
 * String remarks;// 备注
 */
export function saveDictionaries(params: IDictionaryType): Promise<void> {
  return http.request(
    {
      url: `${serverName}dictionaries/saveDictionaries`,
      method: params.id ? RequestEnum.PUT : RequestEnum.POST,
      data: params
    },
    {
      successMessageText: '数据操作成功🎉 '
    }
  )
}

/**
 * 字典数据状态修改
 *@param {*参数} params
 * String id;
 * String status;
 */
export function changeDictionaryStatus(params: any): Promise<void> {
  return http.request(
    {
      url: `${serverName}dictionaries/changeStatus`,
      method: RequestEnum.GET,
      params: params
    },
    {
      successMessageText: '状态修改成功🎉 '
    }
  )
}
