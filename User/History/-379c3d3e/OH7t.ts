import type { IDiscretionMenuItem } from '@/api/program/types'

// 递归从数组中找到和目标id相同的数据
export function useTheSameData(sources: IDiscretionMenuItem[], targetId: string) {
  for (const item of sources) {
    if (item['id'] === targetId) {
      //
    }
  }
  return
}
