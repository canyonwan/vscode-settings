import { useDialog } from 'naive-ui'

//
export function useDeleteDialog(fn: Promise<void>) {
  //
  const dialog = useDialog()
  dialog.warning({
    title: '警告',
    content: '你确定？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      await fn()
      // message.success('确定')
    }
  })
}
