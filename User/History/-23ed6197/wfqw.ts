import type { IPrimaryCauseItemType } from '../cause-manage/types'
import type { ICauseItemForProgram } from '../program/types'
import type { IResultPage } from '@/utils/axios/types'
import type { ITaskBaseInfo, ITaskItem, ITaskTimelineInfo } from './types'
import { HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'

const ServerName = RequestServerEnum.Workflow

/**
 * @Title 违法行为维护
 * @desc  保存违法行为(新增编辑)
 * @param params
 */
export function saveCauseInWorkflow(params: IPrimaryCauseItemType): Promise<void> {
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
 * @Title 时间轴
 * @desc  转出强制,处罚,移送时违法行为选择接口
 * @param params
 */
export function chooseCauseWhenTransferoutProgram(params: { toolId: string; proceduresId: string }): Promise<ICauseItemForProgram[]> {
  return http.request({
    url: `${ServerName}cause/transferInProcedure`,
    method: RequestEnum.POST,
    data: params
  })
}

export interface IConfirmTransferoutParams {
  toolId: string
  toolGroup: string
  proceduresId: string
  causeList: IConfirmTransferoutCauseListParams[]
}

export interface IConfirmTransferoutCauseListParams {
  id: string
  caseType: string
}
/*
 * @Title 时间轴
 * @desc  接上面, 确定转出
 * @param params
 */
export function confirmTransferoutProgram(params: IConfirmTransferoutParams): Promise<string> {
  return http.request(
    {
      url: `${ServerName}procedures/confirmTransferIn`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

export interface IRelateProgramOrTask {
  dataId: string
  dataType: string
  targetType: string
  targetId: string
  timeLineId: string
  toolId: string
  toolGroup: string
}
/*
 * @Title 时间轴
 * @desc  行政处罚关联行政检查
 * @param params
 */
export function relateProgramOrTask(params: IRelateProgramOrTask): Promise<void> {
  return http.request(
    {
      url: `${ServerName}relevance/linkProcedureOrTask`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/*
 * @Title 时间轴
 * @desc  获取任务列表
 * @param params
 */
export function queryTaskList(params: { page: number; phaseTypeCode: number; asInitiator: boolean; associatedTask: boolean }): Promise<IResultPage<ITaskItem[]>> {
  return http.request({
    url: `${ServerName}timeline/task/taskInfoList`,
    method: RequestEnum.POST,
    data: params
  })
}

/*
 * @Title 时间轴
 * @desc  获取任务详情基本信息
 * @param params
 */
export function queryTaskBaseInfo(taskId: string): Promise<ITaskBaseInfo> {
  return http.request({
    url: `${ServerName}timeline/task/taskInfo/`,
    method: RequestEnum.POST
    // params: { taskId }
  })
}

/*
 * @Title 时间轴
 * @desc  获取任务时间轴
 * @param params
 */
export function queryTaskTimeline(dataId: string): Promise<ITaskTimelineInfo> {
  return http.request({
    url: `${ServerName}timeline/workResult/selectWorkResult`,
    method: RequestEnum.POST,
    data: { dataId }
  })
}
