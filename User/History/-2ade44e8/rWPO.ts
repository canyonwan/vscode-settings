import type { IFileInfo } from '@/api/types'

export interface IBannerItem {
  name: string
  fileId: number
  fileInfo: IFileInfo
  platformType: number
  platformTypeName: string
  sort: number
  remarks: string
}
