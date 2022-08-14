import { FileInfo } from '@/components/upload/src/type'

// 证据列表查询参数
export interface IEvidenceParams {
  page: number // 传则分页不传不分页
  size: number // 传则分页不传不分页
  // relationType: string // 关联类型
  proceduresId: number // 程序ID
  causeId: string // 案由ID
  // baseEvidenceId: string // 证据清单ID   base库的base_evidence表ID
  baseEvidenceTypeId: string // 证据类型id   base库的base_evidence_type表ID
  name: string // 证据名称模糊筛选
}

export interface IEvidenceNameMatter {
  name: string // 证据名称模糊筛选
  proveMatter: string // 证明事项
  baseEvidenceId: string // base库的base_evidence表ID  证据清单ID
}

// 证据详情参数
export interface IEvidenceInfo {
  id: string // 证据关联表ID
  evidenceId: string // 证据ID
  proceduresId: number // 程序ID  必传
  causeId: number // 案由ID causeRuleId 传了则案由ID也  必传
  causeRuleId: string // cause_evidence 证据规则 主键 / cause_discretion_detail_list 裁量规则主键 认定证据/裁量 ID
  relationType: string // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
  name: string
  proveMatter: string // 证明事项
  baseEvidenceId: string // 证据清单ID  base库的base_evidence表ID
  baseEvidenceTypeId: string // 证据类型
  baseEvidenceTypeName: string // 证据类型中文名
  partnerIds: string[] // 执法员信息 -> 物证 输入
  partnerInfoOutputs: IEvidencePartnerInfo[] // 执法员信息 输出
  pictureNumber: string // 照片编号 -> 物证
  shootingTime: string // 拍摄时间 -> 物证,视听资料
  shootingLocation: string // 拍摄地点 -> 物证,视听资料
  shootingName: string // 拍摄人 -> 物证
  recordContent: string // 记录内容 -> 视听资料
  timeNode: string // 时间节点 -> 视听资料 时间段&拼接
  fileInfoInputs: [] // 证据文件输入
  fileInfoOutputs: IEvidenceFileInfo[] // 证据文件输出
  timeLineId: string // 时间轴id
}

// 证据执法员信息
export interface IEvidencePartnerInfo {
  id: string
  realName: string // 真实姓名
  enforceCode: number // 执法证号
}

// 证据文件
export interface IEvidenceFileInfo {
  id: string // 证据关联文件表I等于evidenceFileRelationId
  fileId: string
  evidenceFileType: number // 文件类型 1.当事人签字照片 2.证据本身图片 3.最终文件（图片，pdf,音频）
  evidenceId: string // 证据ID
  fileInfoOutput: FileInfo // 文件输出
}

// 绑定证据文件
export interface IBindEvidenceFile {
  proceduresId: string // 程序ID
  timeLineId: string
  causeId: string // 案由ID
  causeRuleId: string // 裁量规则ID
  causeDiscretionId: string // 裁量类型ID
  evidenceFileRelationIds: string[] // 文件-证据关系表ID
  relationType: string // 关联类型 1.和程序关联 2.和裁量规则关联 3.和裁量类型关联
}
