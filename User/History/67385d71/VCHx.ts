import type { IAppPackageItem } from '@/api/setting/app-package-manage/types'
import { format } from 'date-fns'
import { appTypeObj, versionStatusObj } from './options'

export const tableColumns = [
  {
    title: '版本号',
    key: 'versionCode',
    width: 100
  },
  {
    title: '版本状态',
    key: 'versionStatus',
    width: 100,
    render: (row: IAppPackageItem) => {
      return versionStatusObj[row.versionStatus]
    }
  },
  {
    title: 'app类型',
    key: 'appType',
    width: 100,
    render: (row: IAppPackageItem) => {
      return appTypeObj[row.appType]
    }
  },
  {
    title: '文件大小',
    key: 'appSize',
    width: 100
  },

  {
    title: '发布者',
    key: 'uploadingUser',
    width: 100
  },
  {
    title: '发布日期',
    key: 'createTime',
    width: 140,
    render: (row: IAppPackageItem) => {
      return format(row.createTime, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  {
    title: '描述',
    key: 'description',
    width: 200
  }
]
