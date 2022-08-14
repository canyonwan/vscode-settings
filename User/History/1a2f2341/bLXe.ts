import { RequestEnum, RequestServerEnum } from '@/enums/http-enum';
import http from '@/utils/axios/index';
import type { IResultPage } from '@/utils/axios/types';
import type { IProgramItem, ITimeLineRoot } from './types';
const serverName = RequestServerEnum.Workflow;

/**
 * 获取程序(执法台帐)分页
 * @param params
 * @returns
 */
export function queryProgramList(params: any): Promise<IResultPage<IProgramItem[]>> {
  return http.request({
    url: `${serverName}procedures/list`,
    method: RequestEnum.POST,
    data: params,
  });
}
