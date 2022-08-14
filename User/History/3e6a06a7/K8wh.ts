export default function useLoadingData(fn: () => Promise<any>, searchParams: any) {
  onMounted(() => {
    const loadTableData = async (page: any) => {
      return await queryProgramList({ ...page, ...searchParams.value })
    }
  })
}
// (...arg: any[]) => Promise<any>
