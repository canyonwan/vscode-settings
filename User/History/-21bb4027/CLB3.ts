export const serveName = 'open/'

export interface IPage {
  pageIndex: number
  pageSize: number
  dataCount: number
  data: IPageData[]
}

export interface IPageData {
  id: string
  documentNumber: string
  cause: string
  relativeName: string
  punishOrganname: string
  punishOrgancode: number
  punishArriveddate: string
  punishDate: string
  punishType: string
  punishResult: string
  orgId: number
  //行政处罚多的
  punishAccording?: string
  representative?: string
  creditcode?: string
  illegalFact?: string
  illegalAccording?: string
  fileList?: string[]
}

export interface ISearch {
  page: number
  size: number
  startTime?: string
  endTime?: string
  documentNumber?: string
  relativeName?: string
  orgId?: string
}

// 事前-执法人员/执法监督人员 查询参数
export interface IPersonnelSearch {
  page: number
  size: number
  certtype?: string // 1查询执法人员 2查询执法监督人员
  departname?: string // 单位名称
  name?: string // 姓名
}

// 事前-执法主体 查询参数
export interface ISubjectlSearch {
  page: number
  size: number
  lawDepartment?: string // 执法部门
  lawMaint?: string // 执法主体
}

// 事前-执法事项 查询参数
export interface IMatterSearch {
  page: number
  size: number
  lawtypeCode?: string // 事项类别ID
  punishLicensenumber?: string // 罚没许可证号
  laworganName?: string // 实施单位/执法主体
  authorityName?: string // 事项名称
}

// 事前-执法事项-详情参数
export interface IMatterDetail {
  id: string
  authorityName: string // 事项名称
  mainName: string // 实施单位
  lawtypeCode: number // 事项类别Id
  laworganCode: number // 执法部门code
  laworganName: string // 实施单位/执法主体
  law: string // 法律
  punishLicensenumber: string // 罚没许可证号
  reviewStatute: string // 行政法规
  localStatute: string // 地方法规
  governmentRules: string // 部委规章
  provinceRules: string // 省政府规章
}

export interface ISelectOrgParams {
  orgId?: string
  organizationId?: string
  belongJusticeOrgId?: string
  isSameLevel: boolean
  isSubordinate: boolean
  isJustice?: boolean
}

export interface IListDataForType {
  type: number
  count: number
}
