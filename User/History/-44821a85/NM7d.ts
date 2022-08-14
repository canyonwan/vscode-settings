/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IPageData } from '@/api/publicity-platform/types'
import { parseTime } from '@/utils'
export interface IAction {
  text: string
  type?: number
  value?: number
  icon: any
  api?: string
  column?: any[]
}

// 处罚
const fineColumns = [
  {
    title: '决定书（通知书）文号',
    dataIndex: 'documentNumber',
    width: 200,
    ellipsis: true
  },
  {
    title: '相对人名称',
    dataIndex: 'relativeName',
    ellipsis: true
  },
  {
    title: '案由（事由）',
    dataIndex: 'cause',
    ellipsis: true
  },
  {
    title: '处罚类型',
    dataIndex: 'punishType',
    ellipsis: true
  },

  {
    title: '决定（通知）日期',
    dataIndex: 'punishDate',
    width: 140,
    customCell: (r: IPageData) => {
      return {
        innerHTML: parseTime(r.punishDate, '{y}年{m}月{d}日')
      }
    }
  },
  {
    title: '实施机关',
    dataIndex: 'punishOrganname',
    ellipsis: true
  },
  {
    title: '全文公示',
    dataIndex: 'fileList',
    width: 135,
    fixed: 'right'
  }
]

// 许可
const licensingColumns = [
  {
    title: '决定书（通知书）文号',
    dataIndex: 'documentNumber',
    width: 200,
    ellipsis: true
  },
  {
    title: '相对人名称',
    dataIndex: 'relativeName',
    ellipsis: true
  },
  {
    title: '案由（事由）',
    dataIndex: 'cause',
    ellipsis: true
  },
  {
    title: '许可类型',
    dataIndex: 'punishType',
    ellipsis: true
  },
  {
    title: '许可结果',
    dataIndex: 'punishResult',
    ellipsis: true
  },
  {
    title: '决定（通知）日期',
    dataIndex: 'punishDate',
    width: 140,
    customCell: (r: IPageData) => {
      return {
        innerHTML: parseTime(r.punishDate, '{y}年{m}月{d}日')
      }
    }
  },
  {
    title: '实施机关',
    dataIndex: 'punishOrganname',
    ellipsis: true
  }
]

// 行政强制
const forceColumns = [
  {
    title: '决定书（通知书）文号',
    dataIndex: 'documentNumber',
    width: 200,
    ellipsis: true
  },
  {
    title: '相对人名称',
    dataIndex: 'relativeName',
    ellipsis: true
  },
  {
    title: '案由（事由）',
    dataIndex: 'cause',
    ellipsis: true
  },
  {
    title: '强制类型',
    dataIndex: 'punishType',
    ellipsis: true
  },
  {
    title: '强制结果',
    dataIndex: 'punishResult',
    ellipsis: true
  },
  {
    title: '决定（通知）日期',
    dataIndex: 'punishDate',
    width: 140,
    customCell: (r: IPageData) => {
      return {
        innerHTML: parseTime(r.punishDate, '{y}年{m}月{d}日')
      }
    }
  },
  {
    title: '实施机关',
    dataIndex: 'punishOrganname',
    ellipsis: true
  }
]

// 征收征用
const expropriatedColumns = [
  {
    title: '决定书（通知书）文号',
    dataIndex: 'documentNumber',
    width: 200,
    ellipsis: true
  },
  {
    title: '相对人名称',
    dataIndex: 'relativeName',
    ellipsis: true
  },
  {
    title: '案由（事由）',
    dataIndex: 'cause',
    ellipsis: true
  },
  {
    title: '征收类型',
    dataIndex: 'punishType',
    ellipsis: true
  },
  {
    title: '征收结果',
    dataIndex: 'punishResult',
    ellipsis: true
  },
  {
    title: '决定（通知）日期',
    dataIndex: 'punishDate',
    width: 140,
    customCell: (r: IPageData) => {
      return {
        innerHTML: parseTime(r.punishDate, '{y}年{m}月{d}日')
      }
    }
  },
  {
    title: '实施机关',
    dataIndex: 'punishOrganname',
    ellipsis: true
  }
]

// 行政检查
const inspectColumns = [
  {
    title: '决定书（通知书）文号',
    dataIndex: 'documentNumber',
    width: 200,
    ellipsis: true
  },
  {
    title: '相对人名称',
    dataIndex: 'relativeName',
    ellipsis: true
  },
  {
    title: '案由（事由）',
    dataIndex: 'cause',
    width: 120,
    ellipsis: true
  },
  {
    title: '检查类型',
    dataIndex: 'punishType',
    ellipsis: true
  },
  {
    title: '检查结果',
    dataIndex: 'punishResult',
    ellipsis: true
  },
  {
    title: '决定（通知）日期',
    dataIndex: 'punishDate',
    width: 140,
    customCell: (r: IPageData) => {
      return {
        innerHTML: parseTime(r.punishDate, '{y}年{m}月{d}日')
      }
    }
  },
  {
    title: '实施机关',
    dataIndex: 'punishOrganname',
    ellipsis: true
  }
]

export const actions: IAction[] = [
  {
    text: '行政处罚',
    icon: require('@/assets/publicity-platform/after/xingxhengchufa.svg'),
    type: 1,
    api: 'afterPunish',
    column: fineColumns
  },
  {
    text: '行政许可',
    icon: require('@/assets/publicity-platform/after/xingzhengxuke.svg'),
    type: 2,
    api: 'afterPermit',
    column: licensingColumns
  },
  {
    text: '行政强制',
    icon: require('@/assets/publicity-platform/after/xingzhengqiangzhi.svg'),
    type: 3,
    api: 'afterMandatory',
    column: forceColumns
  },
  {
    text: '征收征用',
    icon: require('@/assets/publicity-platform/after/zhengshouzhengyong.svg'),
    type: 4,
    api: 'afterExpropriation',
    column: expropriatedColumns
  },
  {
    text: '行政检查',
    icon: require('@/assets/publicity-platform/after/xingzhengjiancha.svg'),
    type: 5,
    api: 'afterCheck',
    column: inspectColumns
  }
]
export { fineColumns }
