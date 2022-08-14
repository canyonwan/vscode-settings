export const tableColumns = [
  {
    title: '隐藏值',
    key: 'hiddenValue',
    width: 100
  },
  {
    title: '创建日期',
    key: 'createTime',
    width: 240,
    render: (row: IDictionaryType) => {
      return format(Number(row.createTime), 'yyyy-MM-dd hh:mm:ss')
    }
  }
]
