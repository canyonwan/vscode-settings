import { HttpResponse } from '@/@types/index'
import VAxios from '@/api/axios'
import { MemberInfoOutputItemType } from '@/api/subject/certificate'
import type { Dayjs } from 'dayjs'

export interface InitiateTrainingFormType {
  trainName: string
  registrationTime: []
  trainAndExamTime: []
  joinUnitList: []
  file?: string
  remarks?: string
}
export interface FileItem {
  fileId: number
  fileName?: string
  fileUrl?: string
}

export interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}

// 时间范围
export type TimeRangeValueType = [Dayjs, Dayjs]

// 发起培训Type
export interface InitiateTrainingType {
  registrationTimeList: TimeRangeValueType // 报名时间
  trainAndExamTimeList: TimeRangeValueType // 培训及考试时间
  trainName: string //培训名称
  signUpStartTime?: number //报名开始时间
  signUpEndTime?: number //报名结束时间
  trainStartTime?: number //培训开始时间
  trainEndTime?: number //培训结束时间
  fileList?: FileItem[] //文件路径
  orgIds: string[] //机关IDs
  remarks?: string //备注
}

/**
 *  发起培训
 *@param {*参数} params
 */
export function fetchInitiateTraining(params: InitiateTrainingType): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/launch', { ...params, noQS: 1 })
}
export interface TrainingInfoType {
  createOrgId: string
  createTime: number
  fileList: []
  remarks: string
  signUpEndTime: number
  signUpStartTime: number
  trainEndTime: number
  trainId: string
  trainName: string
  trainStartTime: number
}

export interface memberInfoListItem {
  memberName: string
  memberId: string
}

// 查看当前单位可以报名的培训
export interface CanSignUpTrainType {
  trainId: string
  createOrgId: string
  signUpEndTime: number
  memberInfoList: Array<memberInfoListItem>
  createTime: number
  trainName: string
  trainEndTime: number
  fileList: Array<FileItem>
  signUpStartTime: number
  trainYear: any
  trainStartTime: number
  remarks: string
  sendTime: any
}
/**
 *  查看当前单位可以报名的培训
 */
export function queryCanEnterTrainingForCurrentUnit(): Promise<HttpResponse> {
  return VAxios.fetchGet('business/train/queryNowTrain', {})
}

/**
 *  参加报名
 *  @param {*参数} params
 */
export function fetchEnterForTraining(params: any): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/signUp', { ...params, noQS: 1 })
}

// 人员成功类型
export interface PersonnelScoreItemType {
  memberInfoOutput: MemberInfoOutputItemType
  primaryStudyDuration: any
  nowStudyDuration: any
  primaryStudyTime: any
  primaryAchievement: any
  nowStudyTime: any
  id: number
  nowAchievement: any
}

export interface SearchPersonnelScoreType {
  pageIndex: number // 页码
  pageSize: number // 页数
  certificatesLawCode: string // 执法证号
  memberName: string // 人员名称
  orgId?: string // 机关ID
  trainId?: string // 培训id
  agencyId?: string // 机构ID
  isTotal?: boolean // 是否合计
  idCard: string // 身份证号
  isAdopt: number // 是否通过 0 1是 2否
}
export interface TrainingYearSelectType {
  label: string
  value: string
  flag: string
}

/**
 *  人员成绩 分页查询
 *  @param {*参数} params
 */
export function fetchPersonnelScoreList(params: SearchPersonnelScoreType): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/queryListForPageToScore', { ...params, noQS: 1 })
}
/**
 *  培训记录 分页查询
 *  @param {*参数} params
 */
export function fetchTrainingRecords(params: any): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/queryListForPageToTrain', { ...params, noQS: 1 })
}

/**
 *  下拉框数据
 */
export function queryTrainingList(): Promise<HttpResponse> {
  return VAxios.fetchGet('business/train/queryTrainData', {})
}
// 报名记录查询item
export interface SignUpRecordItemType {
  orgName: string
  signUpTime: number
  signUpTotal: number
}

/**
 *  报名记录查询
 *   *  @param {*参数} params
 */
export function querySignUpRecord(params: any): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/queryListToSignUp', { ...params, noQS: 1 })
}

/**
 *  提交报名表
 *   @param {*参数} trainId
 */
export function submitSignUpForm(trainId: string): Promise<HttpResponse> {
  return VAxios.fetchGet('business/train/submitApplicationForm', { trainId })
}
/**
 *  编辑考试成绩
 *   @param {*参数} param
 */
export function editExamScore(param: any): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/editScoreInfo', { ...param, noQS: 1 })
}
// {
//   name: '市生态环境局',
//     value: 30,
//   aValue: 200
// }
// 统计数据 type
export interface StatisticRootType {
  joinExamRate: number
  joinTrainTotal: number
  joinTrainRate: number
  signUpTotal: number
  adoptRate: number
}
export interface orgStatisticsListItem {
  orgName: string
  signUpTime: any
  signUpTotal: number
}
/**
 *  统计 总计数
 *   @param {*参数} param
 */
export function fetchStatisticsTotal(param: any): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/queryStatisticsForTitle', { ...param, noQS: 1 })
}
/**
 *  统计柱状图
 *   @param {*参数} trainId
 */
export function fetchStatisticsData(trainId: any): Promise<HttpResponse> {
  return VAxios.fetchGet('business/train/queryStatisticsForChart', { trainId })
}
/**
 *  人员成绩导出
 *   @param {*参数} params
 */
export function fetchExportForm(params: SearchPersonnelScoreType): Promise<HttpResponse> {
  return VAxios.fetchPost('business/train/export', { ...params, noQS: 1 }, { responseType: 'blob' })
}
