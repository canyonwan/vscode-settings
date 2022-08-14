import type { IDiscretionMenuItem } from '@/api/program/types'

// 递归从数组中找到和目标id相同的数据
export function useTheSameData(sources: IDiscretionMenuItem[], targetId: string): IDiscretionMenuItem {
  // const data = ref<IDiscretionMenuItem[]>()
  // for (const item of sources) {
  //   if (item.id === targetId) {
  //     data.value?.push(item)

  //   } else {
  //     data.value?.push(useTheSameData(item.options, targetId))
  //   }
  // }
  // return data.value![0]

  const res: IDiscretionMenuItem[] = []

  for (const item of sources) {
    if (item.id === targetId) {
      data.push(item)
    } else {
      data.push(useTheSameData(item.options, targetId))
    }
  }
  return data
}
