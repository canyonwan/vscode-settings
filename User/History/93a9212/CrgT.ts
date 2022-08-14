import { ICauseAttrItemType, IGroupItemType, IHandlingWayType, IPrimaryCauseItemType } from '@/api/cause-manage/types'
import { ExtractPropTypes } from 'vue'

export const handlingWayCommonPropsType = {
  id: {
    type: String,
    default: ''
  },
  // 分组的child // 要编辑的
  groupChild: {
    type: Object as PropType<IGroupItemType>,
    default: () => {}
  },
  // 处置方式的违法行为id, 新增时用
  handlingWayItem: {
    type: Object as PropType<IHandlingWayType>,
    default: () => {}
  },
  targetItem: {
    type: Object as PropType<IHandlingWayType>,
    default: () => {}
  },
  causeDetail: {
    type: Object as PropType<IPrimaryCauseItemType>,
    default: () => {}
  },
  baseAttrItem: {
    type: Object as PropType<ICauseAttrItemType>,
    default: () => {}
  }
} as const

export type HandlingWayCommonPropsType = ExtractPropTypes<typeof handlingWayCommonPropsType>
