export const columns = [
  {
    type: 'selection'
  },
  {
    title: 'ID',
    key: 'id',
    width: 100
  },
  {
    title: '审批文书配置名称',
    key: 'name',
    width: 150
  },
  {
    title: '审批类型',
    key: 'baseApprovalTypeOutput.name',
    width: 120
  },
  {
    title: '审批层级数',
    key: 'approvalLevelTotal',
    width: 120
  }
]

export const options = [
  {
    label: '已发布',
    value: 1
  },
  {
    label: '已接收',
    value: 2
  },
  {
    label: '办理中',
    value: 3
  },
  {
    label: '已反馈',
    value: 4
  }
]
