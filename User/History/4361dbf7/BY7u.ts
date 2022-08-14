// 1:立案 2:调查取证 3:事先告知 4:审核决定 5:送达执行 6:结案归档 7:行政检查 8:行政强制 9:移交移送 转成map
const stageObj = {
  1: '立案',
  2: '调查取证',
  3: '事先告知',
  4: '审核决定',
  5: '送达执行',
  6: '结案归档',
  7: '行政检查',
  8: '行政强制',
  9: '移交移送'
}
const stageArray = [
  {
    label: '立案',
    value: 1
  },
  {
    label: '调查取证',
    value: 2
  },
  {
    label: '事先告知',
    value: 3
  },
  {
    label: '审核决定',
    value: 4
  },
  {
    label: '送达执行',
    value: 5
  },
  {
    label: '结案归档',
    value: 6
  }
  // {
  //   label: '行政检查',
  //   value: 7
  // }
  // {
  //   label: '行政强制',
  //   value: 8
  // },
  // {
  //   label: '移交移送',
  //   value: 9
  // }
]
// const programTypeMap = new Map().set(1, '行政检查').set(2, '行政处罚').set(3, '行政强制').set(4, '移交移送')
const programTypeMap = {
  1: '行政检查',
  2: '行政处罚',
  3: '行政强制',
  4: '移交移送'
}

// 01 不予受理
// 02 告知
// 03 转办
// 04 维持
// 05 撤销
// 06 变更
// 07 责令限期履行职责
// 08 确认违法
// 09 驳回
// 10 中止
// 11 调解
// 12 未审结
// 13 其他
// 0未开始 1进行中 2已完成
const nodeStatus = new Map().set(0, '未开始').set(1, '进行中').set(2, '已完成')

// 0跳转，1文书
const toolType = new Map().set(0, '跳转').set(1, '文书')

// 1接收人2发布人3抄送人4审核人
const userType = new Map().set(1, '接收人').set(2, '发布人').set(3, '抄送人').set(4, '审核人')

// 1 图片  2 PDF 3 文档 4 音频  5 视频 6 Excel   7 文本文档   8 压缩包   9 其他
const fileType = new Map().set(1, '图片').set(2, 'PDF').set(3, '文档').set(4, '音频').set(5, '视频').set(6, 'Excel').set(7, '文本文档').set(8, '压缩包').set(9, '其他')

const programRecordType = {
  1: '线上制作',
  2: '线下上传'
}

export { stageArray, stageObj, nodeStatus, toolType, userType, fileType, programTypeMap, programRecordType }
