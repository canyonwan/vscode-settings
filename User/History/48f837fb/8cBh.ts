// 证据关联
export interface IEvidenceConnect {
  toolType: string // 工具类型
  procedureId: number // 程序id
  relationType: string // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
  timeLineId: string // 时间轴id
  typeId: string // 数据类型（例如：type = 8是证据类型，typeId就是证据里，书证，物证等等类型的id)
  typeIdName: string // 数据类型名称
  causeId: string // 案由ID causeRuleId 传了则案由ID也必传 relationType不是1时，案由id--裁量选择证据，绑定证据
  causeRuleId: string // 裁量规则ID
  causeDiscretionId: string // 裁量类型ID
}
