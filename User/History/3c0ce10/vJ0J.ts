import { ContentTypeEnum, HttpMessageEnum, RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import type { IMessageItem, IMessageSearch, IMessageSend, IMessageDetail, IAnnouncementSend, IAnnouncementDetail } from './types'

const serverName = RequestServerEnum.NEWS

/**
 * 发送公告
 */
export function sendAnnouncement(params: IAnnouncementSend): Promise<void> {
  return http.request(
    {
      url: `${serverName}notice/send`,
      method: RequestEnum.POST,
      data: params
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 查询公告列表
 *@param {*参数} params
 */
export function queryAnnouncements(params: IMessageSearch): Promise<IResultPage<IMessageItem[]>> {
  return http.request({
    url: `${serverName}notice/page`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 查询公告详情
 *@param {*参数} params
 */
export function queryAnnouncementDetail(id: string): Promise<IAnnouncementDetail> {
  return http.request({
    url: `${serverName}notice/detail/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 查询个人公告未读数
 */
export function queryAnnouncementUnreadCount(): Promise<number> {
  return http.request({
    url: `${serverName}news/getPersonalNoticeNoReadingTotal`,
    method: RequestEnum.GET
  })
}

/**
 * 批量设置已读公告
 */
export function setRead(ids: string): Promise<number> {
  return http.request(
    {
      url: `${serverName}notice/setRead`,
      method: RequestEnum.POST,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      params: { ids }
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 批量删除公告
 */
export function deleteAnnouncement(ids: string): Promise<number> {
  return http.request(
    {
      url: `${serverName}notice/deletePersonalNews`,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      params: { ids }
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 查询个人消息列表
 *@param {*参数} params
 */
export function queryMessages(params: IMessageSearch): Promise<IResultPage<IMessageItem[]>> {
  return http.request({
    url: `${serverName}news/getPersonalNewsPage`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 查询个人消息未读数
 */
export function queryMessageUnreadCount(): Promise<number> {
  return http.request({
    url: `${serverName}news/getPersonalNewsNoReadingTotal`,
    method: RequestEnum.GET
  })
}

/**
 * 发送消息
 */
export function sendMessage(params: IMessageSend): Promise<void> {
  return http.request({
    url: `${serverName}news/send`,
    method: RequestEnum.POST,
    data: params
  })
}

/**
 * 查询消息详情
 */
export function queryMessageDetail(id: string): Promise<IMessageDetail> {
  return http.request({
    url: `${serverName}news/detail/${id}`,
    method: RequestEnum.GET
  })
}

/**
 * 批量设置已读消息
 */
export function setReadForMessage(ids: string): Promise<number> {
  return http.request(
    {
      url: `${serverName}news/setReadForJson`,
      method: RequestEnum.POST,
      data: { ids }
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}

/**
 * 批量删除已读消息
 */
export function deleteMessage(ids: string[]): Promise<number> {
  return http.request(
    {
      url: `${serverName}news/deletePersonalNewsForJson`,
      method: RequestEnum.POST,
      data: { ids }
    },
    {
      successMessageText: HttpMessageEnum.SUCCESS
    }
  )
}
