import { EventBusKey } from '@vueuse/core'

// dispatch event bus when restore waste
export const wasteDispatchEventKey: EventBusKey<string> = Symbol()
export const stageBarEventKey: EventBusKey<number> = Symbol()
