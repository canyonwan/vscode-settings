// 证据关联
export interface IEvidenceConnect {
  toolType: string // 工具类型
  proceduresId: number // 程序id
  relationType: string // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
  timeLineId: string // 时间轴id
  typeId: string // 数据类型（例如：type = 8是证据类型，typeId就是证据里，书证，物证等等类型的id)
  typeIdName: string // 数据类型名称
  causeId: string // 违法行为ID causeRuleId 传了则违法行为ID也必传 relationType不是1时，违法行为id--裁量选择证据，绑定证据
  causeRuleId: string // 裁量规则ID
  causeDiscretionId: string // 裁量类型ID
}

export interface EvidenceFile {
  createTime: string
  fileId: string // 文件id
  fileName: string
  fileSize: string
  fileType: number // 文件类型
  fileTypeName: string
  fileUrl: string
  halfFileUrl: string // 文件短地址
  status: number
  fileTotalPlaybackTime: string // 文件时长
  evidenceFileType: number // 文件类型 1签名 3文件
}
