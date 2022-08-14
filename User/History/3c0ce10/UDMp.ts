import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import http from '@/utils/axios/index'
import type { IResultPage } from '@/utils/axios/types'
import type { IMessageItem, IMessageSearch, IMessageSend, IMessageDetail, IAnnouncementSend, IAnnouncementDetail } from './types'

const serverName = RequestServerEnum.NEWS

/**
 * 发送公告
 */
export function sendAnnouncement(params: IAnnouncementSend): Promise<void> {
  return http.request({
    url: `${serverName}notice/send`,
    method: RequestEnum.POST,
    data: params
  })
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
export function queryAnnouncementDetail(id: number): Promise<IAnnouncementDetail> {
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
export function queryMessageDetail(id: number): Promise<IMessageDetail> {
  return http.request({
    url: `${serverName}news/detail/${id}`,
    method: RequestEnum.GET
  })
}
