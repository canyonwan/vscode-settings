import { IFileItem } from '@/api/program/types'

export interface IAppPackageItem {
  id: string
  /**
   * 文件大小
   */
  appSize: string
  /**
   * app类型 默认全都传1 （综合执法类型）
   */
  appType: string
  /**
   * app描述
   */
  description: string
  /**
   * 文件id
   */
  fileId: string
  files?: IFileItem[]
  /**
   * 上传者
   */
  uploadingUser?: string
  /**
   * 不知道啥意思
   */
  versionCode: number
  /**
   * 版本号
   */
  versionName: string
  /**
   * 版本状态 1.最新版本 2.选择更新 3.必须更新
   */
  versionStatus: string
  createTime: number
}
