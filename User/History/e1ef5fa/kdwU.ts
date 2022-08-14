import { FileType, HttpResponse } from '@/@types'
import VAxios from '../axios'
import { deleteNoParam } from '@/utils'
import { TimeRangeValueType } from '../subject/law-test'

// 通知和请示事项的数量
export interface SearchDataType {
  isInform: boolean // 是否为通知，false则为请示
  isLaunchMySelf: boolean // 是否为我发起的，false则为交给我的
  beginTime?: string // 发起时间开始阈值 格式： yyyy-MM-dd HH:mm:ss
  endTime?: string // 发起时间结束阈值
  pageIndex?: number
  pageSize?: number
  name?: string // 事项名称
  sendOrgName?: string // 发起单位名称
  isFinished?: boolean // 是否完成
}
/**
 *  获取我的通知或请示的数量
 *  @param params
 */
export function findMyAskForAndInformCount(params: SearchDataType): Promise<HttpResponse> {
  return VAxios.fetchGet('workTodo/workTodo/findMyAskForAndInformCount', { ...deleteNoParam(params, false) })
}

/**
 *  获取我的通知或请示的列表
 *  @param params
 */
export function findMyAskForAndInformList(params: SearchDataType): Promise<HttpResponse> {
  return VAxios.fetchGet('workTodo/workTodo/findMyAskForAndInformList', { ...deleteNoParam(params, false) })
}
export interface ReadTimeParam {
  receivedTaskId: string
  isInform: boolean
}
/**
 * 被通知或被请示的事项，增加已读时间
 * @param params
 */
export function getReadTime(params: ReadTimeParam): Promise<HttpResponse> {
  return VAxios.fetchPost('workTodo/workTodo/markAsRead', { ...params, noQS: 1 })
}

// 办结
export interface ToConcludeParam {
  id: string // 信息id
  isInform: boolean //是否是通知
  doneUser: string // 承办人姓名
  donePhone: string // 承办人手机号
  doneFilesJson?: FileType[] // 附件集合
  doneNote?: string // 备注，可不填
  isAccepted: boolean //同意, 退回
}
/**
 * 修改通知我的办理情况为完成
 * @param params
 */
export function changeInformFinished2Me(params: ToConcludeParam): Promise<HttpResponse> {
  return VAxios.fetchPost('workTodo/workTodo/changeInformAndAskForFinished2Me', { ...params, noQS: 1 })
}
/**
 * 修改我通知的办理情况为完成
 * @param id
 * @returns
 */
export function changeIInformFinished(id: string): Promise<HttpResponse> {
  return VAxios.fetchPost('workTodo/workTodo/changeIInformFinished', { id: id })
}
/**
 * 修改通知办理情况中某被通知主体的评价
 */
export interface RateParam {
  id: string
  evaluationScoreTime: number // 时间评价
  evaluationScoreQuality: number // 质量评价
}
/**
 * 修改通知办理情况中某被通知主体的评价
 * @param params
 */
export function rateFinished(params: RateParam): Promise<HttpResponse> {
  return VAxios.fetchPost('workTodo/workTodo/changeInformHandleResultEvaluationForSingleUnitOrg', params)
}

export interface receiverInfoListsItemType {
  unitOrgName: string
  sendType: string
  unitOrgId: string
}

export interface AddMatterType {
  name: string // 事项名称
  handleDateList: TimeRangeValueType // 办理期限
  beginDate: string // 办理期限开始时间
  endDate: string // 办理期限结束时间
  sendContacts: string // 联系人
  sendPhone: string // 联系人电话
  remindDate: string // 催办时间
  receiverInfoLists: Array<receiverInfoListsItemType> // 办理单位
  unitIds?: Array<string>
  sendFilesJson: Array<FileType> // 附件
  sendNote: string // 备注
}

// 1: 请示 2:通知
export const matterAddTypes = ['workTodo/workTodo/addAskForInfo', 'workTodo/workTodo/addInformInfo']

/**
 *  新增通知事项
 *  @param matterType 事项类型 1: 请示 2:通知
 *  @param params
 */
export function addMatter(matterType: string, params: AddMatterType): Promise<HttpResponse> {
  return VAxios.fetchPost(matterType, { ...params, noQS: 1 })
}

// 详情Type
export interface matterDetailType {
  id: string
  name: string
  isInform: boolean
  isLaunchMySelf: boolean
  sendOrgId: string
  sendOrgName: string
  sendTime: string
  beginDate: string
  endDate: string
  samplesGoodJson: Array<praiseImgType>
  samplesBadJson: Array<praiseImgType>
  sendContacts: string
  sendPhone: string
  finishedTime: string
  sendNote: string
  sendFilesJson: Array<FileType>
  status: number
}
// 评价图
export interface praiseImgType {
  unitOrgName: string
  imageList: Array<string>
}
/**
 *  办理情况: 通知或请示详情
 *  @param params
 *  id: string
 *  isInform: boolean, // 是否为通知
 */
export function getMatterHandleSituationDetail(params: any): Promise<HttpResponse> {
  return VAxios.fetchGet('workTodo/workTodo/findMyAskForAndInformDetail', params)
}
/**
 *  办理情况: 办理列表
 *  @param params
 */
export function getMatterHandleSituationList(params: any): Promise<HttpResponse> {
  return VAxios.fetchGet('workTodo/workTodo/findMyAskForAndInformHandleList', params)
}

// 查询我的通知或请示事项办理详情
export interface HandleDetail {
  id?: string // 办理id, 传了办理id,事项和单位id传不传不影响查询结果
  isInform: boolean // 是否为通知
  eventId?: string // 事项id
  unitOrgId?: string // 单位id
}
/**
 * 查询我的通知或请示事项办理详情
 * @param params
 */
export function findHandleDetail(params: HandleDetail): Promise<HttpResponse> {
  return VAxios.fetchGet('workTodo/workTodo/findMyAskForAndInformHandleDetail', { ...deleteNoParam(params, false) })
}
/**
 * 好评差评图 实体
 */
export interface SamplesImg {
  informId: string // 事项的id
  unitOrgName: string // 单位名称
  isGoodImage: boolean // 是否为好评
  imageList: any[]
  fileList: FileType[]
}

/**
 * 上传保存事项的好评差评图
 * @param params
 */
export function saveSamplesImg(params: SamplesImg): Promise<HttpResponse> {
  return VAxios.fetchPost('workTodo/workTodo/uploadGoodOrBandImageForInform', { ...params, noQS: 1 })
}
export interface deletePraiseImagesType {
  id: string // 图片所属事项id
  unitOrgName: string // 图片所属单位
  imageUrl: string // 图片url
  isGoodSamples: boolean // 是否为好评图，false则为差评图
}
/**
 * 删除事项的好评差评图
 * @param params
 */
export function deletePraiseImages(params: deletePraiseImagesType): Promise<HttpResponse> {
  return VAxios.fetchPost('workTodo/workTodo/removeGoodOrBandImageForInform', { ...params, noQS: 1 })
}

/**
 * 发起方 办结操作
 * @param id
 */
export function concludeMatterForInitiator(id: string): Promise<HttpResponse> {
  return VAxios.fetchPost('workTodo/workTodo/changeIInformAndAskFinished', { id, noQS: 1 })
}
