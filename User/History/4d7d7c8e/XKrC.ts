export const columns = [
  {
    type: 'selection',
    multiple: false
  },
  {
    title: 'ID',
    key: 'id',
    width: 100
  },
  {
    title: '标题',
    key: 'title',
    width: 150
  },
  {
    title: '内容',
    key: 'content',
    width: 120
  },
  {
    title: '我发起的',
    key: 'asInitiator',
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
