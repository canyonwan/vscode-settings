import { ExtractPropTypes } from 'vue'

export const UseButtonProps = {
  type: {
    type: String as PropType<'orange' | 'blue'>,
    default: 'orange'
  }
} as const

export type UseButtonPropsType = ExtractPropTypes<typeof UseButtonProps>

export const UseButton = defineComponent({
  name: 'UseButton',
  props: UseButtonProps,
  setup(props, { slots }) {
    return () => {
      if (slots.default) return h('div', { class: [`bg-e-button-${props.type}-bg`, 'leading-10 px-4 w-24 text-center align-middle text-white cursor-pointer  bg-no-repeat bg-full'] }, slots.default())
      // if (slots.default) return h('div', { class: ['bg-e-button-orange-bg leading-10 px-4 w-24 text-center align-middle text-white cursor-pointer  bg-no-repeat bg-full'] }, slots.default())
    }
  }
})
