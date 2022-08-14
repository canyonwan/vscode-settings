// 更换执法人参数
export interface IReplaceEnforcer {
  userIdList: number[] // 用户id集合
  // ICaseConnectInfo
}

// 案件关联的id
export interface ICaseConnectInfo {
  procedureId: string // 程序id
  toolId: string // 工具id
  toolGroup: string // 工具组id
  timeLineId: string // 时间轴id
  relationType: string // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
  causeId: string // 违法行为ID causeRuleId 传了则违法行为ID也必传 relationType不是1时，违法行为id--裁量选择证据，绑定证据
  causeRuleId: string // 认定证据/裁量 ID
  typeId: string // 数据类型（例如：type = 8是证据类型，typeId就是证据里，书证，物证等等类型的id)
  typeIdName: string // 数据类型名称
  handingPeopleEntity: IEnforcerInfo[] // 执法人员
  toolType: string // 工具类型
  toolTypeName: string
  targetType: string
  targetId: string
  dataId: string
  dataType: string
}

// 案件中执法人员信息
export interface IEnforcerInfo {
  id: string // 办案人id，人员选择用
  userId: string // 办案人id
  realName: string // 办案人真实名称
  orgId: string // 办案人机关id
  orgName: string // 办案人机关名称
  deptId: string // 办案人机构id
  deptName: string // 办案人机构名称
  userType: number // 人员类型 枚举
}

// 时间轴初始化参数
export interface IInitTimeLineParam {
  parentId: string // 时间轴父级id
  procedureId: string // 程序表id
  toolId: string // 工具id
  toolGroup: string // 工具组id
}

// 时间轴初始化后返回的参数
export interface IInitTimeLineInfo {
  proceduresId: string // 程序id
  timeLineId: string // 时间轴id
}

// 在时间轴中保存文件参数
export interface ITimeLineFileParam {
  parentId: string // 父级时间轴id
  procedureId: string // 程序表id
  toolId: string // 工具id
  toolGroup: string // 工具组id
  fileId: string // 文件id 多个文件,号分割
  id: string | null // 当前时间轴的id 没有可以不填
}

// 在时间轴中保存文件 返回参数
export interface ITimeLineFileInfo {
  id: string // 时间轴的id
  parentId: string // 父级时间轴id
  programId: string // 程序表id
  toolId: string // 工具id
  toolGroup: string // 工具组id
  toolType: string // 工具类型
  dataId: string // 数据id
  stage: string // 节点类型
  description: string // 内容
  title: string // title
  nodeStatus: string // 节点状态 (0未开始1进行中2已完成)
  sort: string // 排序字段
}

// 时间轴操作结果保存或修改
export interface ITimeLineActionSave {
  dataId: string // 结果 结果(1是0否)
}

// 文字类时间轴新增或修改
export interface ITimeLineTextSave {
  description: string // 输入的文字内容
}

// 备案主体时间轴新增或修改(选人)
export interface ITimeLineUserSave {
  userIds: Array<string> // 用户id
}
