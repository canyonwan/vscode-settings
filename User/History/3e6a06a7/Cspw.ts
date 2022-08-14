export default function useLoadingData(fn: () => Promise<any>, searchParams: any, ref: any) {
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
