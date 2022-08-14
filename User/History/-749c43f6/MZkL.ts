import { EventBusKey } from '@vueuse/core'

// src/views/law-enforcement-account/discretion/index.vue step 上一步/下一步key
export const handleNextStepKey = Symbol()

// 裁量选项数据
export const discretionOptionDataKey = Symbol()
export const discretionGroupSwitchEventKey: EventBusKey<[string, string]> = Symbol()
