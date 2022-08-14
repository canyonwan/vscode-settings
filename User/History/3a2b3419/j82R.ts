export function useTreeRadio(rows) {
  //
  const parentArr = rows.filter((item) => item?.parentId === 0)
  const childArr = rows.filter((item) => item?.parentId !== 0)
  const res = childArr.reduce((pre, cur) => {
    if (pre[cur?.parentId]) {
      pre[cur?.parentId].push(cur)
    } else {
      pre[cur?.parentId] = [cur]
    }
    return pre
  }, {})
  const children: ILawTagType[] = []
  for (const obj in res) {
    if (res[obj].length > 1) {
      children.push(res[obj][res[obj].length - 1])
    } else {
      children.push(...res[obj])
    }
  }
  state.checkedAllKeys = [...parentArr.map((item) => item.id!), ...children.map((item) => item.id!)]
  state.checkedRaw = [...parentArr, ...children]
}
