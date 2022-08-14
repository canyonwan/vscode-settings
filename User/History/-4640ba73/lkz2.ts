import type { IResultPage } from '@/utils/axios/types'
import http from '@/utils/axios/index'
import { RequestEnum, RequestServerEnum } from '@/enums/http-enum'
import type { ICauseManageSearchType, ICauseSubListItemType } from '@/api/cause-manage/types'

// 案由维护
const ServerName = RequestServerEnum.CauseManage
