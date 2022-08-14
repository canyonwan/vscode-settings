export interface IProgramItem {
  id: string
  targetId: string
  targetType: number
  targetName: string
  caseNumber: string
  procedureType: number
  programTypeName: string
  userName: string
  address: string
  caseType: string
  timeLineId: string
  type: number
  createTime: number
  handingPeopleEntity: IHandingPeopleEntity[]
  unlawfulActList: string[]
  relevanceList: Array<IProgramItem>
}

export interface IHandingPeopleEntity {
  userId: string
  realName: string
  orgId: number | string
  orgName: string
  deptId: number | string
  deptName: string
  enforceCode: string
  userType?: number // 人员类型
}

// 时间轴
export interface ITimeLineRoot {
  timeLineTree: ITimeLineTreeLeaf
  dataSet: string
}

// 时间轴项
export interface ITimeLineTreeLeaf {
  id: string // 时间轴id
  parentId: string
  procedureId: string
  toolId: string
  toolGroup: any
  toolType: number
  dataId: string
  stage: number
  description: string
  title: string
  nodeStatus: number
  updateTime: number
  sort: string
  operateUserId: string
  operateUserName: string
  childrenList: Array<ITimeLineTreeLeaf>
  fileList: Array<IFileItem>
  userList: Array<IUserItem>
}

// 操作用户
export interface IUserItem {
  operatorId: string
  operator: string
  org: any
  position: string
  positionValue: any
  userType: number
}
// 文件
interface IFileItem {
  fileId: string
  fileName: string
  halfFileUrl: string
  fileUrl: string
  thumbnailFileUrl: string | null
  fileType: number
  fileTypeName: string
  fileSize: string
  fileTotalPlaybackTime: string
  createTime: number
  status: number
}
export interface IItemNodeProps {
  id: string
  width: number
  leftDividerWidth?: number
}

// 添加时间同级/子级节点的入参类型
export interface ISaveTimelineNodeParams {
  timeLineId: string // 被操作节点的id
  nodeType: string // 添加同级为1 添加子级为0
  nodeName?: string // 节点名称
  childNodeName?: string // 子节点名称
  procedureId: string // 程序主表id
  fileId?: string // 上传的文件信息
  description?: string // 子节点描述
}

// 删除时间节点的入参类型
export interface IDeletetimelineNodeParams {
  deleteType: number
  timeLineIdList: { timeLineId: string }[]
}

// 裁量START
export interface IDiscretionOptions {
  discretionDetailList: Array<IDiscretionMenuItem> // 裁量清单输出
  discretionCustomList: Array<IDiscretionMenuItem> // 自定义裁量清单输出
  discretionList: Array<IDiscretionTypeItem> // 裁量基础输出
}

// 裁量清单
export interface IDiscretionMenuItem {
  id: string
  discretionDetailListId: string
  causeId: string
  parentId: string
  name: string
  selectType: any
  tips: any
  maxValue: number
  minValue: number
  unit: number // 1元 2百分比 3分
  isChecked: number
  valueType: number
  operatorValue: number
  operatorType: number // 运算方式 1加 2减 3乘 4除
  hashChildren: number
  discretionGroupId: string
  discretionGroupName: string
  whetherGroupType: number // 组区分 1是 0否
  whetherSelect: number // 是否必填 1是 0否
  options: Array<IDiscretionMenuItem>
  evidenceDetailedList: Array<IEvidenceItem> // 材料详情列表
}

// 裁量基础(类型)
export interface IDiscretionTypeItem {
  id: string
  discretionId: string
  causeId: string
  discretionTypeId: string
  discretionCalculationId: string
  baseValue: number
  baseKey: string
  minValue: number
  maxValue: number
  isChecked: number
  tips: string
  relaEvidenceType: any
  limitMin: number
  limitMax: number
  remarks: number
  evidenceList: IEvidenceItem[]
  discretionEvidenceList: Array<IDiscretionBaseBoundEvidenceItem> // 裁量基础绑定证据清单
  discretionResult: ICalcDiscretionResult
}

// 裁量计算结果
export interface IDiscretionCalcSum {
  discretionMoney: number
}

// 裁量基础绑定证据清单
export interface IDiscretionBaseBoundEvidenceItem {
  id: string
  discretionId: string
  name: string
  provMatters: string
  whetherRequire: number
  tips: string
  remarks: string
  evidenceDetailedList: Array<IEvidenceItem>
}

// 证据信息
export interface IEvidenceItem {
  id: string
  baseEvidenceId: string
  baseEvidenceName: any
  baseEvidenceTypeId: string
  baseEvidenceTypeName: any
  name: string
  proveMatter: string
  partnerStringIds: any
  partnerIds: any
  partnerInfoOutputs: Array<IEnforceMember>
  pictureNumber: string
  shootingTime: string
  shootingLocation: string
  shootingName: string
  recordContent: string
  timeNode: string
  fileInfoOutputs: Array<IEvidenceFileItem>
}

// 证据文件
export interface IEvidenceFileItem {
  id: string
  fileId: string
  evidenceId: string
  evidenceFileType: number
  evidenceFocusRelationId: string
  causeRuleId: string
  relationType: number
  fileInfoOutput: IFileItem
}

// 执法人员
export interface IEnforceMember {
  id: string
  realName: string
  enforceCode: string
}

// 计算裁量金额入参类型
export interface ICalcDiscretionSumFormalParameter {
  proceduresCauseId: string // 程序案由ID
  proceduresId?: string // 程序ID
  timeLineId?: string // 程序ID
  toolId?: string // 工具ID
  toolGroupId?: string // 工具组ID
  causeDiscretionId?: string // 选中裁量基础ID
  baseValue: number // 计算基准值
  days?: number // 违法天数 该字段只能在裁量类型为 违法天数才可以使用次字段
  baseKey?: string // 基准名称
  checkedDiscretionDetail: ICheckedDiscretionDetail[] // 裁量选中模型输入
}
// 计算裁量金额结果
export interface ICalcDiscretionResult {
  discretionMoney: number
  customMathProcess: string
  customMathResult: number
  systemMathProcess: string
  systemMathResult: number
  mathFormula: string
  formulaType: number
}

// 自定义裁量入参类型
export interface ICustomDiscretionFormalParameter {
  proceduresCauseId: string
  name: string
  remarks?: string
  operatorType: number // 运算方式 1加 2减 3乘4除
  operatorValue: number // 自定义的值
  unit: number
}

// 裁量END

// 程序下的违法行为列表类型
export interface ICauseItemForProgram {
  caseType: number
  caseTypeName: string
  causeList: ICauseList[]
}

export interface ICauseList {
  id: string
  name: string
  caseType: string
  caseTypeName: string
  buttonList: IButtonList[]
}

export interface IButtonList {
  code: number
  name: string
}

// 计算裁量金额的入参
export interface ICalcDiscretionMoney {
  proceduresCauseId: string
  causeDiscretionId: string
  timeLineId: string
  toolId: string
  toolGroupId: string
  proceduresId: string
  baseValue: number
  baseKey?: string
  days?: number
  checkedDiscretionDetail: ICheckedDiscretionDetail[]
}

// 裁量选中模型输入
export interface ICheckedDiscretionDetail {
  id: string
  operatorValue?: number
}

// 回收站 START
// 节点垃圾
export interface IDeletedNodeItem {
  nodeId: string
  nodeParentId: number
  nodeName: string
  deleteTime: number
  operationName: string
  nodeFile: IFileItem[]
  childNodeInfo: ChildNodeInfo[]
}

export interface ChildNodeInfo {
  nodeId: string
  nodeParentId: number
  nodeName: string
  deleteTime: number
  operationName: string
  nodeFile: IFileItem[]
  childNodeInfo: any[]
}
// 违法行为垃圾
export interface IDeletedIllegalAct {
  punishId: string
  causeId: string
  causeName: string
  punishCont: string
  deleteTime: number
  operationName: string
}
// 证据垃圾
export interface IDeletedEvidence {
  evidenceId: string
  evidenceName: string
  provMatters: string
  userEnforceInfos: any[]
  evidenceFiles: IFileItem[]
  operationName: string
  deleteTime: number
}
// 回收站END

// 初始化程序
export interface IInitProceduresParam {
  procedureType: string // 程序类型
}

// 程序已初始化返回值
export interface IInitProceduresInfo {
  procedureId: string // 程序id
  timeLineId: string // 时间轴id
}
