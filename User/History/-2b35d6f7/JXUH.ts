import { IFileItem } from '../program/types'

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
  newsId: number
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
