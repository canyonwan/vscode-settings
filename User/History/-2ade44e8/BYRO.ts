import { FileInfo } from '@/api/upload/types'

export interface IBannerItem {
  name: string
  fileId: number
  fileInfo: FileInfo
  platformType: number
  platformTypeName: string
  sort: number
  remarks: string
}
