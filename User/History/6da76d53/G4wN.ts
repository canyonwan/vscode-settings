export interface IFileInfo {
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
}
