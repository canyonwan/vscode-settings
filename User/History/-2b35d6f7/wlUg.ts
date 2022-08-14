import { IFileItem } from '../program/types'
// 公告列表入参
export interface IAnnouncementSearch {
  page: number
  size: number
  queryType: number // 1.发件箱 2.收件箱 3.草稿箱
  keyWord?: string
  startDate?: number | null
  endDate?: number | null
  whetherRead?: number
}

// 发送公告入参
export interface IAnnouncementSend {
  title: string
  content: string
  receivingGroupType?: number
  receivingGroupTypeIds: string
  whetherPush: number
  whetherMessage: number
  contacts: string
  whetherDraft: number
  id?: number
  fileIds: string
  fileChildren?: IFileItem[]
  sendUserId?: number
}

export interface IAnnouncementDetail {
  id: string
  title: string
  content: string
  sendUserName: string
  receivingGroupType: number
  whetherPush: number
  whetherMessage: number
  receivingGroupTypeIds: string
  fileInfos: IFileItem[]
}

export interface IMessageSearch {
  page: number
  size: number
  whetherRead: number
}

export interface IMessageSend {
  content: string
  title: string
  relationType: number
  receivingGroupType: number
  relationTypeId: number
  fileIds: number[]
  whetherMessage: number
  receivingGroupTypeId: number
  whetherPush: number
  sendUserId: number
}

export interface IMessage {
  page: number
  size: number
  total: number
  contents: IMessageItem[]
}

export interface IMessageItem {
  content: string
  title: string
  sendUserName: string
  createTime: number
  relationTypeName: string
  whetherRead: number
  relationType: number
  id?: string
  newsId?: string
}

export interface IMessageDetail {
  content: string
  title: string
  whetherPush: number
  whetherMessage: number
  receivingGroupType: number
  relationTypeId: number
  fileInfos: IFileItem[]
  sendUserName: number
  relationType: number
  newsId: number
  receivingGroupTypeId: number
}
