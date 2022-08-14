// 类型详情
export interface ITypeInfo {
  id: string
  name: string
}

// 文书类型信息
export interface IDocumentTypeInfo {
  id: string
  parentId: string
  name: string
  childrenList: ITypeInfo[]
}

// 文书模板查询条件配置 信息
export interface IQuerySourceInfo {
  id: string
  searchType: number | null // 查询类型
  searchName: string // 查询名称
  searchDatabase: string // 要查询的库
  searchTable: string // 要查询的表
  searchColumns: string // 要查询的字段，多个使用英文的逗号分隔
  reflexSearchClass: string // 要使用哪个类
  reflexSearchFunction: string // 要使用的方法
  runSearchSql: string //直接使用的sql
  conditions: string // userId,orgId这样的，通过这的字段去入参中反射取值放到要反射执行的方法中去
}

// 文书模板字段配置 信息
export interface IParamConfigInfo {
  id: string
  chineseName: string // 中文名称
  englishName: string // 字段英文名称
  wordModelKey: string // 模板key
  documentModelDataTypeId: string // 文书数据类型 外键
  documentModelDataTypeName: string
  documentModelSearchConfigId: string // 文书查询配制表ID
  documentModelSearchConfigName: string
}

// 文书模板已绑定字段配置 信息
export interface IBindParamConfig {
  documentCoreBindingColumnConfigId: string // 文书字段绑定ID
  sort: number // 排序
  keyAttributeValues: Array<string> // 字段属性ID集合
}

// 文书模板绑定的表格 信息
export interface IBindModelForm {
  displayChinese: string // 中文名
  displayEnglish: string // 英文名
  whetherRequired: number // 是否必填字段 0 非必填 1 必填
  sort: number // 排序
}

// 文书主数据维护 信息
export interface IModelConfigInfo {
  id: string
  documentModelName: string // 文书模板名称
  documentModelUseWordId: string // 文书使用字ID
  documentModelTypeName: string
  documentModelTypeId: string // 文书类型ID，绑定关系，表示当前文书是哪种类型的文书
  documentModelUseWordName: string
  documentModelUrl: string // 模版使用的文书服务地址
  content: string // 替换文本 这基本上只有普通文书才使用，审批肯定不用；文本根据查询到的数据替换文本中的占位符
  remarks: string // 备注
  isAutoSetType: string // 0不,1是，是否自动排版不可为空
  configInput: IDocumentBinding // 审批绑定配置
  documentCodeNum: number | null // 模板编号
  coreFormOutputs: IBindModelForm[] // 表格配置输入
  modelCoreFormInputs: IBindModelForm[] // 表格配置输出
  approvalConfigOutput: IApprovalConfigOutput // 审批配置输出
}

// 文书绑定审批配置输出参数
export interface IApprovalConfigOutput {
  approvalType: number | null // 是否做审批过程
  configOutput: Partial<IDocumentApprovalConfig>
  copyLineNum: number | null // 要复制的文书模版中的行数
  documentApprovalConfigId: number | null // 文书审批配制表ID
  documentModelCoreId: number | null // 审批层级内容表ID
}

// 文书绑定审批参数
export interface IDocumentBinding {
  targetId: string //审批配置ID
  targetName?: string
  approvalType: string | null // 0,1是否做审批过程
  copyLineNum: string | null // 要复制的文书模版中的行数
  attributeList: [] // 文书审批其他属性
}

// 文书绑定
export interface IDocumentBindIds {
  sourceId: string
  targetList: string[]
}

// 文书绑定字段删除 参数
export interface IDocumentParam {
  coreId: string
  columnConfigId: string
}

/**
 * 文书审批初始化
 */
export interface IDocumentApproveInit {
  proceduresId: string // 程序ID
  documentModelTypeId: string // 文书模板类型ID
  timeLineId: string // 时间轴ID
  toolId: string // 工具id
  toolGroupId: string // 工具组id
  toolGroup?: string // 工具组id
  documentId: string // 文书id
  documentRedoId?: string // 文书重做id
}

/**
 * 文书保存实体
 */
export interface IDocumentData {
  proceduresId: string // 程序ID
  id: string // 文书id
  documentStatus: number // 文书状态
  documentFileUrl?: string // 文书地址
  documentCodeNum: number // 文书编号 确定文书渲染模板
  configOutputList: IDocumentKeyConfig[] // 文书配置的key 数据集合
  approvalKeyData?: Recordable<IDocumentKeyConfig> // 审批对应的数据 key的对象
  currentApprovalLevel: number // 当前审批层级
  documentModelApproval: IDocumentApproval // 文书审批的数据
  coreForm: ITableConfig[] // 表单配置数据
  coreFormData: any[] // 表单的数据值， 随着配置形成 配置key 对象的集合
  isEdit: boolean // 是否可编辑
  toolGroup?: string // 工具组id
  toolId?: string // 工具id
  timeLineId?: string // 时间轴id
  documentModelTypeId?: string // 文书类型id
}

/**
 * 文书表格配置数据
 */
export interface ITableConfig {
  displayChinese: string // 名称
  displayEnglish: string // 字段值
  id: string // 字段id
  sort: number // 排序
}

/**
 * 文书配置字段
 */
export interface IDocumentKeyConfig {
  id: string // key 配置的id
  documentModelDataTypeId: string // 文书key 的数据类型
  columnValue: any[]
  wordModelKey: string // 文书模板的key
  englishName: string // 字段key
  chineseName: string // 字段名称
  defaultValue: string // 文书模板key 的值
  otherId?: number[] // 数据源ID
  baseCauseAttId?: string // 属性id
  description?: string // 提示信息词
  keyAttributeValues?: number[] //  1 换行 2下划线 3表格标题 4换行结束 5非固定字段 字段属性集合 keyAttribute
  groupWordModelKey?: string[] // 分组占位类型的 占位key集合
  whetherUse: number // 是否使用，删除 1 使用 0 不可用
  sort: number // 排序
  causeId?: string // 违法行为id
  causeOrder?: number // 违法行为排序
}
/**
 * 审批信息
 */
interface IDocumentApproval {
  baseDocumentApprovalConfigOutput: IDocumentApprovalConfig
  approvalType?: number
  attributeList?: number[]
}

/**
 * 审批配置
 */
interface IDocumentApprovalConfig {
  id: string // 审批配置id
  name: string // 审批配置的名称
  approvalLevelTotal: number // 审批的层级
  approvalConfigDataOutputs: IDocumentApprovalData[]
}
/**
 * 审批的数据
 */
export interface IDocumentApprovalData {
  id: string // 审批数据的id
  approvalName: string // 审批名称
  approvalValue: string // 审批内容
  sponsorId: string // 发起人id
  receiverId: string // 接收人id
  approvalSignId?: string // 签名图片id
  approvalSignList?: IDocumentSign[] // 签字集合
  approvalStatus: number // 审批状态
  sort: number // 当前审批层级
  sponsorTime?: number // 发起时间
  receiverTime?: number // 接收时间
}
/**
 * 签字实体
 */
interface IDocumentSign {
  userId: string // 签字人id
  userName?: string // 签字人姓名
  enforceCode?: string // 执法证号
  signFileId: string // 签字id
  signFileUrl?: string // 签字文件全地址
}

export interface IDocumentFile {
  userId?: string // 签字人id
  userName?: string // 签字人姓名
  enforceCode?: string // 执法证号
  fileId: string // 签字id
  fileUrl: string // 签字文件全地址
  fileType: number
}
