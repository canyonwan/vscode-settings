import { ExtractPropTypes } from 'vue'

const useButtonProps = {
  type: {
    type: String as PropType<'orange' | 'blue'>,
    default: 'orange'
  }
} as const

export type UseButtonPropsType = ExtractPropTypes<typeof useButtonProps>

export const UseButton = defineComponent({
  name: 'UseButton',
  props: useButtonProps,
  setup(props, { slots }) {
    return () => {
      if (slots.default) return h('div', { class: [`bg-e-button-${props.type}-bg`, 'leading-10 px-4  text-center align-middle text-white cursor-pointer  bg-no-repeat bg-full'] }, slots.default())
    }
  }
})
