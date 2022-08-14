import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import type {
  ICalcDiscretionSumFormalParameter,
  ICauseItemForProgram,
  ICustomDiscretionFormalParameter,
  IDeletedNodeItem,
  IDeletetimelineNodeParams,
  IDiscretionMenuItem,
  IDiscretionOptions,
  IInitProceduresInfo,
  IInitProceduresParam,
  IProgramItem,
  ISaveTimelineNodeParams,
  ITimeLineRoot,
  IIllegalAct
} from './types'

const serverName = RequestServerEnum.Workflow

/**
 * 获取程序(执法台帐)分页
 * @param params
 * @returns
 */
export function queryProgramList(params: any): Promise<IResultPage<IProgramItem[]>> {
  return http.request({
    url: `${serverName}procedures/list`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 获取时间轴
 * @param timeLineId
 * @returns
 */
export function queryTimeLine(timeLineId: string): Promise<ITimeLineRoot> {
  return http.request({
    url: `${serverName}timeLine/tree/${timeLineId}`,
    method: RequestEnum.GET
  })
}

/**
 * 获取程序信息
 * @param programId
 * @returns
 */
export function queryProgramDetail(programId: string): Promise<IProgramItem> {
  return http.request({
    url: `${serverName}procedures/info/${programId}`,
    method: RequestEnum.GET
  })
}

/**
 * 添加同级/子级节点
 * @param params
 * @returns
 */
export function saveTimelineNode(params: ISaveTimelineNodeParams): Promise<void> {
  return http.request(
    {
      url: `${serverName}timeLine/insertNode`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 删除单个/多个节点
 * @param params
 * @returns
 */
export function deleteTimelineNode(params: IDeletetimelineNodeParams): Promise<void> {
  return http.request(
    {
      url: `${serverName}timeLine/deleteAllNode`,
      method: RequestEnum.DELETE,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 获取裁量选项数据
 * @param proceduresCauseId
 * @returns
 */
export function queryDiscretionOptionData(proceduresCauseId: string): Promise<IDiscretionOptions> {
  return http.request({
    url: `${serverName}discretion/getDetailedList/${proceduresCauseId}`,
    method: RequestEnum.GET
  })
}

/**
 * 计算裁量金额接口
 * @param params
 * @returns
 */
export function calcDiscretionSum(params: ICalcDiscretionSumFormalParameter): Promise<{ discretionMoney: number }> {
  return http.request({
    url: `${serverName}/discretion/compute`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 保存裁量计算裁量金额
 * @param params
 * @returns
 */
export function saveCalcDiscretionSum(params: ICalcDiscretionSumFormalParameter): Promise<void> {
  return http.request(
    {
      url: `${serverName}/discretion/saveCompute`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 删除用户自定义的裁量
 * @param discretionDetailId
 * @returns
 */
export function deleteCustomDiscretion(discretionDetailId: string): Promise<void> {
  return http.request(
    {
      url: `${serverName}discretion/delCustomDetailed/${discretionDetailId}`,
      method: RequestEnum.DELETE
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 添加用户自定义的裁量选项
 * @param params
 * @returns
 */
export function saveCustomDiscretion(params: ICustomDiscretionFormalParameter): Promise<IDiscretionMenuItem> {
  return http.request(
    {
      url: `${serverName}/discretion/saveCustomDetail`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 查询程序下的违法行为(案由)列表
 * @param params proceduresId
 * @param params caseTypeIdList: 固定罚款id
 * @returns
 */
export function queryCauseListForProgram(params: { proceduresId: string; caseTypeIdList: Array<string> }): Promise<ICauseItemForProgram[]> {
  return http.request({
    url: `${serverName}cause/procedures`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 查询程序下的已经删除的节点列表
 * type: 1节点  2文书 3违法行为  4证据
 * @param  proceduresId
 * @returns
 */
export function queryDeletedNode(proceduresId: string, type: number): Promise<Array<IDeletedNodeItem & IIllegalAct>> {
  return http.request({
    url: `${serverName}recycle/findRecycle`,
    method: RequestEnum.GET,
    params: { proceduresId, type }
  })
}

/**
 * 回收站恢复
 */
export function restoreWaste(dataId: number[], type: number): Promise<void[]> {
  return http.request(
    {
      url: `${serverName}recycle/recoverRecycle`,
      method: RequestEnum.PUT,
      params: { dataId, type }
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 永久删除节点
 * @param  timelineIds
 * @returns
 */
export function permanentlyDelete(dataId: number[], type: number): Promise<void> {
  return http.request(
    {
      url: `${serverName}recycle/deleteEver`,
      method: RequestEnum.DELETE,
      data: { dataId, type }
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 查询程序信息列表
 *@param {*参数} params
 */
export function queryProcedures() {
  return http.request({
    url: `${serverName}procedures/list`,
    method: RequestEnum.POST
  })
}

/**
 * 程序信息
 *@param {*参数} params
 */
export function queryProceduresDetail(id) {
  return http.request({
    url: `${serverName}procedures/info/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 初始化程序和时间轴 根据用户id和程序类型判断如果存在就不初始化 不存在初始化程序
 *@param {*参数} params
 */
export function initProcedures(params: IInitProceduresParam): Promise<IInitProceduresInfo> {
  return http.request({
    url: `${serverName}procedures/init`,
    method: RequestEnum.POST,
    params: params
  })
}
