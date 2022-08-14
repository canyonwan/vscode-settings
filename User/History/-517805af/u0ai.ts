export interface IBannerItem {
  name: string
  fileId: number
  fileInfo: FileInfo
  platformType: number
  platformTypeName: string
  sort: number
  remarks: string
}

export interface FileInfo {
  fileId: string
  fileName: string
  halfFileUrl: string
  fileUrl: string
  fileType: number
  fileTypeName: string
  fileSize: string
  createTime: number
  status: number
}
