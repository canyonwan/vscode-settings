export default function useLoadingData(fn: () => Promise<any>, searchParams: any) {
  const loadTableData = async (page: any) => {
    return await queryProgramList({ ...page, ...searchParams.value })
  }

  onMounted(() => {
    fn()
  })
}
// (...arg: any[]) => Promise<any>
