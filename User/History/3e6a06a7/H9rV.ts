export default function useLoadingData(fn: () => Promise<any>, searchParams: any) {
  onMounted(() => {
    fn()
  })
}
// (...arg: any[]) => Promise<any>
