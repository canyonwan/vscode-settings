import type { IDiscretionMenuItem } from '@/api/program/types'

// 递归从数组中找到和目标id相同的数据
export function useTheSameData(sources: IDiscretionMenuItem[], targetId: string) {
  const data = ref<IDiscretionMenuItem[]>()
  for (const item of sources) {
    if (item.id === targetId) {
      data.value?.push(item)
    } else {
      data.value?.push(...useTheSameData(item.options, targetId))
    }
  }
  return data
}
