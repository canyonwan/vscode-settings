import { useDialog } from 'naive-ui'

const dialog = useDialog()
export function useDeleteDialog() {
  dialog.warning({
    title: '警告',
    content: '你确定删除？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      alert('confirm')
      // await fn
    }
  })
}
