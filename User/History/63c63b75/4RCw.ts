import { IEvidenceMenuType } from '@/api/cause-manage/types'
import { NTag } from 'naive-ui'

export const tableColumns = [
  {
    type: 'selection',
    width: 0
  },
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '名称',
    key: 'name',
    width: 120
  },
  {
    title: '证据类型',
    key: 'evidenceTypeList',
    width: 120,
    render(row: IEvidenceMenuType) {
      return row.evidenceTypeList?.map((item) => {
        return h(
          NTag,
          {
            style: { marginRight: '4px' },
            type: 'primary'
          },
          {
            default: () => item.name
          }
        )
      })
    }
  },
  {
    title: '分组时必传数量',
    key: 'groupMiniRequire',
    width: 80,
    render(row: IEvidenceMenuType) {
      return row.groupMiniRequire === 1 ? '是' : '否'
    }
  },
  {
    title: '证明事项',
    key: 'provMatters',
    width: 90
  },
  {
    title: '组',
    key: 'whetherGroup',
    width: 50,
    render(row: any) {
      return row.whetherGroup === '1' ? '分组' : '不分组'
    }
  },
  {
    title: '提示语',
    key: 'tips',
    width: 100
  },
  {
    title: '是否必填',
    key: 'whetherRequire',
    width: 60,
    render(row: any) {
      return h(
        NTag,
        {
          type: row.whetherRequire === '1' ? 'error' : 'primary'
        },
        {
          default: () => (row.whetherRequire === '1' ? '是' : '否')
        }
      )
    }
  },
  {
    title: '备注',
    key: 'remarks',
    width: 100
  }
]
