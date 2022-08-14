import { IFileItem } from '../program/types'
import { ITipGroup } from '../tip/types'

// 模型 参数
export interface IModelParam {
  name: string
}
// 组 参数
export interface IGroupInfo {
  id: string | undefined
  name: string
}

// 组和模型绑定关系
export interface IGroupModelRelation {
  groupId: string | undefined // 组id
  modelOrderList: IModelOrderAndToolCodeInput[] // 绑定的模型顺序集合
  modelRelationData: IModelNodeInfo // 模型关系结构图数据
}
export interface IModelNodeInfo {
  nodes: Partial<IModelNodeRelation[]> // 关系节点
  connections: IModelNodeConnections[] // 关系连线
  svgHeight: number
  svgWidth: number
}
// 组和模型绑定 关系节点
export interface IModelNodeRelation {
  id: string // id
  whetherMain: number // 是否是主要模型
  name: string // 关系节点名称（模型名称或工具组名称）
  type: string // 关系节点类别
  x: number // 横坐标
  y: number // 纵坐标
  height?: number
  width?: number
  approvers?: IModelNodePosition[]
}
// 组和模型绑定 关系节点 -工具
export interface IModelNodeTool {
  id: string
  name: string // 工具名称
}
// 组和模型绑定 关系连线
export interface IModelNodeConnections {
  id: string // id
  name: string // 关系连线名称
  type: string // 关系连线类别
  source: IModelNodePosition
  destination: IModelNodePosition
}
// 组和模型绑定 图形节点
export interface IModelNodePosition {
  id: string
  position: string // 显示的图像，上下左右连接点的位置
}

export interface IModelOrderAndToolCodeInput {
  modelOrder: string | undefined // 模型关系 "3,4" 表示从三到四模型  一个modelOrder只能是两个模型id。 主模型都加一个，主模型和0， id,0，  toolId 0 的关系。
  toolId: string // 形成关系引用的工具id。 主模型都加一个，主模型和0， id,0，  toolId 0 的关系。
}

// 组和机关绑定关系
export interface IGroupOrgRelation {
  listInput: IGroupOrg[] // listInput 数组里有两种情况，解除的type: 'remove', 覆盖'cover'。解除的是和之前已绑定id集合少的id集合， 覆盖的是所有要绑定的id集合
}

// 组和机关绑定 解除和覆盖
export interface IGroupOrg {
  type: string // 'remove'解除 'cover'覆盖
  orgIds?: string[] // 机关id（数组）
  depIds?: string[] // 部门id（数组）
  listCover?: IGroupOrgCover[]
}

// 组和机关绑定 先绑定id集合
export interface IGroupOrgCover {
  orgIds?: string[] // 机关id（数组）
  depIds?: string[] // 部门id（数组）
  modelGroupId: string // 模型组id
}

// 模型类型详情
export interface IModelTypeInfo {
  id: string | null
  name: string
  whetherMain?: number | null
}
// 模型详情
export interface IModelInfo {
  id: string[]
  name: string
  data: any
  status: string
  typeId: string
}

// 查询已绑定的关系模型 参数
export interface IModelBinging {
  groupId: string
  typeId?: string
}

/**
 * 工具
 */

// 工具详情
export interface IToolInfo {
  id: string | number | null // 数据id
  name: string // 工具名
  code: string // 工具编码
  type: number | null // 工具类型  navigate、doc（多选一）
  typeName: string
  typeId: string | number | null // 工具类型下级类型
  typeIdName: string
  setDataExpressions: IAssignMethod[] | [] // 赋值表达式 工具有  必填
}
// 工具详情 模型维护那有表达式
export interface IToolInfoExpress {
  id: string | number | null // 数据id
  toolGroupId: string | null // 工具组id
  name: string // 工具名
  code: string // 工具编码
  type: number | null // 工具类型  1navigate、2doc 3提示信息
  typeName: string
  typeId: string | number | null // 工具类型下级类型
  typeIdName: string
  displayJudgeExpressionGroups: IDisplayExpressGroup[] | [] // 是否显示-判定表达式组  模型维护那有
  availableJudgeExpressionGroups: IAvailableExpressGroup[] | [] // 是否可用-判定表达式 模型维护那有
  setDataExpressions: IAssignMethod[] | [] // 赋值表达式 工具有  必填
  toolGroupToolPermissions: IPermissionsInfo[] // 权限信息
  tipGroup: ITipGroup // 提示信息组
  currentPermissionsIsRelease: boolean // 后端判断后返回权限信息的结果值，工具箱或者模型那渲染是否有权限显示
}
// 赋值表达式
export interface IAssignMethod {
  id?: string | number | null // 数据id
  toolId?: string | number | null // 工具id
  keyword: string
  operator: string | number | null // 运算符（assign：赋值、plus：加、minus：减）
  operand: string | number | null // 运算数
}

/**
 * 模型数据
 */

// 模型数据参数
export interface IModelDataInfo {
  id?: string | null // 模型id
  name?: string // 模型名称
  whetherMain?: number | null // 是否是主要模型
  typeId: string | null // 模型类型id 必填
  typeName?: string // 模型类型名称
  toolGroups: IModelToolGroup[] // 工具组 必填
}

// 模型下工具组
export interface IModelToolGroup {
  id?: string | number | null
  frontKey?: number // id可能为空，此为前端自己的标识
  disabled?: boolean // 父级是否显示禁用,此为前端自己的标识
  name: string | null // 工具组名称
  processModelId: string | number | null // 模型ID
  parentId?: string | number | null // 父级ID
  stageType: string | number | null // 程序阶段类型
  stageTypeName: string
  currentRenderType: string | number | null // 当前级工具集合的数据类型
  subsetRenderType: string | number | null // 子数据工具集合的数据类型
  iconFileId: string | null // 图标文件id
  iconFileInfoOutput: [] // 图标文件的实体
  prompt: string // 工具判定提示文本
  toolGroups: Partial<IModelToolGroup[]> | [] // 工具组  必填
  tools: Partial<IToolInfoExpress[]> | [] // 工具  必填
  displayJudgeExpressionGroups: IDisplayExpressGroup[] | [] // 是否显示-判定表达式组 必填
  availableJudgeExpressionGroups: IAvailableExpressGroup[] | [] // 是否可用-判定表达式 必填
  toolGroupToolPermissions: IPermissionsInfo[] // 权限信息
  currentPermissionsIsRelease: boolean // 后端判断后返回权限信息的结果值，工具箱或者模型那渲染是否有权限显示
}
// 模型下工具
export interface IModelTool {
  id: string | number | null
  name: string // 名称
  code: string | null // 工具代码
  toolGroupId?: string // 工具组id
  currentRenderType: string | number | null // 当前级工具集合的渲染类型 1.navigate跳转 2.doc文书
  subsetRenderType: string | number | null // 子数据工具集合的渲染类型 文书类型
  displayJudgeExpressionGroups: IDisplayExpressGroup[] | [] // 是否显示-判定表达式组  必填
  availableJudgeExpressionGroups: IAvailableExpressGroup[] | [] // 是否可用-判定表达式  必填
  setDataExpressions: IAssignMethod[] | [] // 赋值表达式 工具有  必填
}

// 模型是否显示判定表达式组
export interface IDisplayExpressGroup {
  id?: string | number | null
  parentId?: string | number | null // 父级ID
  toolGroupId: string | number | null // 工具组ID
  toolGroupToolRelationId: string | number | null // 工具ID
  type: string | number | null // 1.判断是否显示 2.判断是否可用
  beforeLinkLogic: string | number | null // 前方的连接方式(and/or) 当order大于0 需指明 if（a>0 && (b>1 && c>2)）{}
  // judgeLinkLogic: string | number | null // key值和判断值的 判断式(> < = 符号)
  sort: number | null // 排序
  displayJudgeExpressionGroups: IDisplayExpressGroup[] | [] // 是否显示-判定表达式组  必填
  judgeExpressions: IJudgeExpress[] | [] // 判定表达式  必填
}

// 模型是否可用判定表达式组
export interface IAvailableExpressGroup {
  id?: string | number | null
  parentId?: string | number | null // 父级ID
  toolGroupId: string | number | null // 工具组ID
  toolGroupToolRelationId: string | number | null // 工具ID
  type: string | number | null // 1.判断是否显示 2.判断是否可用
  beforeLinkLogic: string | number | null // 前方的连接方式(and/or) 当order大于0 需指明 if（a>0 && (b>1 && c>2)）{}
  // judgeLinkLogic: string | number | null // key值和判断值的 判断式(> < = 符号)
  sort: number | null // 排序
  availableJudgeExpressionGroups: IAvailableExpressGroup[] | [] // 是否可用-判定表达式  必填
  judgeExpressions: IJudgeExpress[] | [] // 判定表达式组  必填
}

// 判定表达式
export interface IJudgeExpress {
  id?: string | number | null
  toolGroupExpressionGroupId: undefined | number | null // 表达式组ID
  beforeLinkLogic: string | number | null // 前方的连接方式(and/or) 当order大于0 需指明 if（a>0 && (b>1 && c>2)）{}
  judgeLinkLogic: string | number | null // key值和判断值的 判断式(> < = 符号)
  keyword: string | null // 工具源变量keyword(工具中必须存在此keyword)
  operand: string | number | null // 判断值
  sort: number | null // 排序
  createTime?: string | null
  updateTime?: string | null
  status?: number | null
}

// 类型枚举
export interface IEnumsParam {
  columnNameList: string[] // string[]
}
// 类型枚举
export interface IEnums {
  serviceName: string
  enumClassName: string
  pojoEntityName: string
  enumCode: number
  enumDescription: string
  enumChineseDescription: string
}

// 权限信息
export interface IPermissionsInfo {
  id?: string | number | null
  toolGroupId: string | number | null // 工具组ID
  toolGroupToolRelationId: string | number | null // 工具-工具组关系ID
  frontEndPermissionsId: string // 前端权限ID
  isRelease?: boolean // 工具箱那查询模型会返，根据true和false判断工具箱和工具是否有权限显示
}

// 在工具箱上 添加违法行为的入参
export interface IUnlawfulActWithWorkFlow {
  causeSubId: string
  groupId: string
  caseTypeAndProgramTypeList: ICaseTypeWithWorkflow[]
  lawIds?: string[]
}

export interface ICaseTypeWithWorkflow {
  caseTypeId: string
  programTypeId: string
  programTypeName: string
}

// 任务列表
export interface ITaskItem {
  id: string
  timelineId: string
  title: string
  content?: any
  taskType: string
  taskTypeId: number
  timeByPhase: number
  publisherId: string
  workResultId: string
  asInitiator: boolean
  phase: number
}

// 任务详情的基本信息
export interface ITaskBaseInfo {
  phase: number
  title: string
  content: string
  taskTypeId: number
  deadline?: number
  startTime?: number
  fileList?: IFileItem[]
  operationId: string
  publisherId: string
  registrationTime: number
}

// 任务时间轴列表
export interface ITaskTimelineInfo {
  workResultOutputList: ITaskTimeline[]
}

export interface ITaskTimeline {
  id: string
  toolId: string
  dataId: string
  description?: string
  createTime: number
  timeLineId: string
  status: number
  title: string
  operationList: IOperationList[]
  fileList?: IFileItem[]
  childWorkResultList?: any
}

export interface IOperationList {
  operationId: string
  operatorId: string
  operationType: string
  operationTypeName: string
  operator: string
  org: string
  position?: string | string
}
