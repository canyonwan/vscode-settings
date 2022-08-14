import type { FunctionalComponent, defineComponent } from 'vue'
import type { ComponentType } from '../../types/component-type'
import { componentMap } from '@/components/table/src/component-map'

export interface ComponentProps {
  component: ComponentType
  rule: boolean
  popoverVisible: boolean
  ruleMessage: string
}

export const CellComponent: FunctionalComponent = ({ component = 'NInput', rule = true, ruleMessage, popoverVisible }: ComponentProps, { attrs }) => {
  const Comp = componentMap.get(component) as typeof defineComponent

  const DefaultComp = h(Comp, attrs)
  if (!rule) {
    return DefaultComp
  }
  return h(
    NPopover,
    { 'display-directive': 'show', show: !!popoverVisible, manual: 'manual' },
    {
      trigger: () => DefaultComp,
      default: () =>
        h(
          'span',
          {
            style: {
              color: 'red',
              width: '90px',
              display: 'inline-block'
            }
          },
          {
            default: () => ruleMessage
          }
        )
    }
  )
}
