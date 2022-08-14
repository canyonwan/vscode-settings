export interface IAppPackageItem {
  /**
   * 文件大小
   */
  appSize: string
  /**
   * app类型
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
  /**
   * 上传者
   */
  uploadingUser: string
  /**
   * 版本号
   */
  versionCode: string
  /**
   * 版本状态 1.最新版本 2.选择更新 3.必须更新
   */
  versionStatus: string
}
