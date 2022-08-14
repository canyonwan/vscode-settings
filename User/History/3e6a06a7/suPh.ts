export default function useLoadingData(fn: () => Promise<any>, searchParams: any) {
  const loadTableData = async (page: any) => {
    return await fn({ ...page, ...searchParams.value })
  }

  onMounted(() => {
    //
  })
}
// (...arg: any[]) => Promise<any>
