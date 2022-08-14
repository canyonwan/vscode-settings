import type { IFileInfo } from '@/api/types'

export interface IBannerItem {
  name: string
  fileId: string
  fileInfo: IFileInfo
  platformType: number
  platformTypeName: string
  sort: number
  remarks: string
}
