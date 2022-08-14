import type { Ref } from 'vue'

export default function useLoadingData<T>(fn: () => Promise<any>, searchParams: Ref<T>, tableRef: any) {
  const loadTableData = async (page: any) => {
    return await fn({ ...page, ...searchParams.value })
  }

  const reloadTable = () => {
    tableRef.value.reload()
  }

  onMounted(() => {
    //
  })
}
// (...arg: any[]) => Promise<any>
