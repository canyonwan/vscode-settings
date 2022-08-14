// 1:立案 2:调查取证 3:事先告知 4:审核决定 5:送达执行 6:结案归档 7:行政检查 8:行政强制 9:移交移送 转成map
const stage = new Map().set(1, '立案').set(2, '调查取证').set(3, '事先告知').set(4, '审核决定').set(5, '送达执行').set(6, '结案归档').set(7, '行政检查').set(8, '行政强制').set(9, '移交移送')

// 0未开始 1进行中 2已完成
const nodeStatus = new Map().set(0, '未开始').set(1, '进行中').set(2, '已完成')

// 0跳转，1文书
const toolType = new Map().set(0, '跳转').set(1, '文书')

// 1接收人2发布人3抄送人4审核人
const userType = new Map().set(1, '接收人').set(2, '发布人').set(3, '抄送人').set(4, '审核人')

// 1 图片  2 PDF 3 文档 4 音频  5 视频 6 Excel   7 文本文档   8 压缩包   9 其他
const fileType = new Map().set(1, '图片').set(2, 'PDF').set(3, '文档').set(4, '音频').set(5, '视频').set(6, 'Excel').set(7, '文本文档').set(8, '压缩包').set(9, '其他')
interface IItemNodeProps {
  id: string
  width: number
}
export { stage, nodeStatus, toolType, userType, fileType }
